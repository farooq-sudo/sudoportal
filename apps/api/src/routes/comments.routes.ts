// ────────────────────────────────────────────────────────────────────────────
//  src/routes/comments.routes.ts
//  Polymorphic comments attachable to KPI assignments, requests, documents,
//  feedback sessions — anything with a stable string id.
//
//  Endpoints use entityType + entityId in the URL so they're cacheable by
//  reverse-proxy. Visibility:
//    - public comments: anyone with read access to the parent entity
//    - private comments (HR-only or author-only): respected at fetch time
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";
import { notify } from "../services/notification.service.js";
import { ForbiddenError, NotFoundError } from "../utils/errors.js";

const ALLOWED_ENTITY_TYPES = [
  "KpiAssignment", "Request", "Document", "FeedbackSession",
  "LeaveRequest", "ProjectRating", "ProbationCase", "Announcement",
] as const;

const commentRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // List comments for an entity
  app.get("/:entityType/:entityId", async (req) => {
    const session = await req.requireAuth();
    const { entityType, entityId } = z.object({
      entityType: z.enum(ALLOWED_ENTITY_TYPES),
      entityId: z.string(),
    }).parse(req.params);

    const isHR = session.roles.some((r) => r === "ADMIN" || r === "HR");
    const where: Record<string, unknown> = {
      entityType,
      entityId,
      deletedAt: null,
      OR: [
        { isPrivate: false },
        { authorEmpId: session.sub },
        ...(isHR ? [{ isPrivate: true }] : []),
      ],
    };

    const items = await app.prisma.comment.findMany({
      where,
      orderBy: [{ pinned: "desc" }, { createdAt: "asc" }],
      include: {
        replies: {
          where: { deletedAt: null },
          orderBy: { createdAt: "asc" },
        },
      },
    });
    return { entityType, entityId, items };
  });

  // Create a comment
  app.post("/:entityType/:entityId", async (req) => {
    const session = await req.requireAuth();
    const { entityType, entityId } = z.object({
      entityType: z.enum(ALLOWED_ENTITY_TYPES),
      entityId: z.string(),
    }).parse(req.params);
    const body = z.object({
      body: z.string().min(1).max(5000),
      parentCommentId: z.string().optional(),
      mentionedEmpIds: z.array(z.string()).default([]),
      isPrivate: z.boolean().default(false),
      attachmentUrls: z.array(z.string().url()).default([]),
    }).parse(req.body);

    const c = await app.prisma.comment.create({
      data: {
        entityType, entityId,
        authorEmpId: session.sub,
        body: body.body,
        parentCommentId: body.parentCommentId,
        mentionedEmpIds: body.mentionedEmpIds,
        isPrivate: body.isPrivate,
        attachmentUrls: body.attachmentUrls,
      },
    });

    // Notify mentioned people
    for (const mentionedId of body.mentionedEmpIds) {
      if (mentionedId !== session.sub) {
        await notify(app.prisma, {
          empId: mentionedId,
          category: "FEEDBACK",
          title: `${session.name} mentioned you`,
          body: body.body.slice(0, 180),
          url: `/${entityType.toLowerCase()}/${entityId}#comment-${c.id}`,
        });
      }
    }

    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "comment.create", target: entityId, targetType: entityType,
      metadata: { commentId: c.id, mentioned: body.mentionedEmpIds.length },
    });
    return c;
  });

  // Edit (author only, within edit window)
  app.patch("/:id", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const c = await app.prisma.comment.findUnique({ where: { id } });
    if (!c) throw new NotFoundError("Comment");
    if (c.authorEmpId !== session.sub && !session.roles.includes("ADMIN")) {
      throw new ForbiddenError("You can only edit your own comments");
    }
    const body = z.object({
      body: z.string().min(1).max(5000),
    }).parse(req.body);
    const updated = await app.prisma.comment.update({
      where: { id },
      data: { body: body.body, editedAt: new Date() },
    });
    return updated;
  });

  // Pin / unpin (author or HR)
  app.post("/:id/pin", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const c = await app.prisma.comment.findUnique({ where: { id } });
    if (!c) throw new NotFoundError("Comment");
    const isPriv = session.roles.some((r) => r === "ADMIN" || r === "HR");
    if (c.authorEmpId !== session.sub && !isPriv) throw new ForbiddenError();
    const updated = await app.prisma.comment.update({
      where: { id }, data: { pinned: !c.pinned },
    });
    return updated;
  });

  // Soft-delete
  app.delete("/:id", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const c = await app.prisma.comment.findUnique({ where: { id } });
    if (!c) throw new NotFoundError("Comment");
    const isPriv = session.roles.some((r) => r === "ADMIN" || r === "HR");
    if (c.authorEmpId !== session.sub && !isPriv) throw new ForbiddenError();
    await app.prisma.comment.update({
      where: { id }, data: { deletedAt: new Date() },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "comment.delete", target: id, targetType: "Comment",
    });
    return { ok: true };
  });
};

export default commentRoutes;
