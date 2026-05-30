// ────────────────────────────────────────────────────────────────────────────
//  src/routes/announcements.routes.ts
//  Company-wide news, policy updates, alerts.
//  Authoring restricted to HR/Admin; viewing scoped by audience.
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";
import { notify } from "../services/notification.service.js";
import { ForbiddenError, NotFoundError } from "../utils/errors.js";

const CategoryEnum = z.enum([
  "COMPANY_NEWS", "POLICY_UPDATE", "ORG_CHANGE",
  "CELEBRATION", "REMINDER", "EVENT", "ALERT",
]);

const annRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // Feed: what announcements should the current user see?
  app.get("/", async (req) => {
    const session = await req.requireAuth();
    const qs = z.object({
      pinnedOnly: z.coerce.boolean().optional(),
      category: CategoryEnum.optional(),
      limit: z.coerce.number().int().min(1).max(100).default(30),
      offset: z.coerce.number().int().min(0).default(0),
    }).parse(req.query);

    // Resolve user's audience tags
    const emp = await app.prisma.employee.findUnique({
      where: { id: session.sub },
    });

    const now = new Date();
    const where: Record<string, unknown> = {
      active: true,
      publishedAt: { lte: now },
      OR: [
        { expiresAt: null },
        { expiresAt: { gte: now } },
      ],
      AND: [
        {
          OR: [
            { audience: "ALL" },
            { audienceTeamId: emp?.teamId ?? "__no_match__" },
            { audienceDepartmentId: emp?.departmentId ?? "__no_match__" },
            { audienceEmpIds: { has: session.sub } },
            { audienceRoles: { hasSome: session.roles } },
          ],
        },
      ],
    };
    if (qs.pinnedOnly) where.pinned = true;
    if (qs.category) where.category = qs.category;

    const items = await app.prisma.announcement.findMany({
      where, take: qs.limit, skip: qs.offset,
      orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
      include: {
        acknowledgements: {
          where: { empId: session.sub },
          take: 1,
        },
      },
    });
    return { items };
  });

  app.get("/:id", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const a = await app.prisma.announcement.findUnique({
      where: { id },
      include: {
        acknowledgements: { where: { empId: session.sub }, take: 1 },
        _count: { select: { acknowledgements: true } },
      },
    });
    if (!a) throw new NotFoundError("Announcement");
    // Increment view count fire-and-forget
    app.prisma.announcement.update({
      where: { id }, data: { viewCount: { increment: 1 } },
    }).catch(() => undefined);
    return a;
  });

  app.post("/", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const body = z.object({
      title: z.string().min(1).max(200),
      body: z.string().min(1),
      category: CategoryEnum,
      audience: z.enum(["ALL", "TEAM", "DEPARTMENT", "ROLE", "CUSTOM"]).default("ALL"),
      audienceDepartmentId: z.string().optional(),
      audienceTeamId: z.string().optional(),
      audienceRoles: z.array(z.enum(["ADMIN", "HR", "PM", "TL", "EMPLOYEE", "FINANCE", "RECRUITER", "AUDITOR"])).default([]),
      audienceEmpIds: z.array(z.string()).default([]),
      pinned: z.boolean().default(false),
      requireAcknowledgement: z.boolean().default(false),
      attachmentUrls: z.array(z.string().url()).default([]),
      bannerImageUrl: z.string().url().optional(),
      color: z.string().optional(),
      publishedAt: z.coerce.date().optional(),
      expiresAt: z.coerce.date().optional(),
    }).parse(req.body);

    const a = await app.prisma.announcement.create({
      data: {
        ...body,
        authorEmpId: session.sub,
        publishedAt: body.publishedAt ?? new Date(),
      },
    });

    // Fan-out notifications to the audience
    let recipients: { id: string }[] = [];
    if (body.audience === "ALL") {
      recipients = await app.prisma.employee.findMany({
        where: { active: true, status: { not: "TERMINATED" } },
        select: { id: true },
      });
    } else if (body.audience === "TEAM" && body.audienceTeamId) {
      recipients = await app.prisma.employee.findMany({
        where: { teamId: body.audienceTeamId, active: true },
        select: { id: true },
      });
    } else if (body.audience === "DEPARTMENT" && body.audienceDepartmentId) {
      recipients = await app.prisma.employee.findMany({
        where: { departmentId: body.audienceDepartmentId, active: true },
        select: { id: true },
      });
    } else if (body.audience === "ROLE" && body.audienceRoles.length) {
      recipients = await app.prisma.employee.findMany({
        where: { roles: { hasSome: body.audienceRoles }, active: true },
        select: { id: true },
      });
    } else if (body.audience === "CUSTOM" && body.audienceEmpIds.length) {
      recipients = body.audienceEmpIds.map((id) => ({ id }));
    }

    for (const r of recipients) {
      await notify(app.prisma, {
        empId: r.id,
        category: "ANNOUNCEMENT",
        title: body.title,
        body: body.body.slice(0, 200),
        icon: body.category === "ALERT" ? "alert" : "megaphone",
        color: body.category === "ALERT" ? "warn" : "info",
        url: `/announcements/${a.id}`,
      });
    }

    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "announcement.publish", target: a.id, targetType: "Announcement",
      category: "comms",
      metadata: { category: body.category, audience: body.audience, recipients: recipients.length },
    });
    return a;
  });

  app.patch("/:id", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      title: z.string().optional(),
      body: z.string().optional(),
      pinned: z.boolean().optional(),
      expiresAt: z.coerce.date().optional(),
      active: z.boolean().optional(),
    }).parse(req.body);
    const a = await app.prisma.announcement.update({ where: { id }, data: body });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "announcement.update", target: id, targetType: "Announcement",
    });
    return a;
  });

  app.delete("/:id", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    await app.prisma.announcement.update({
      where: { id }, data: { active: false },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "announcement.archive", target: id, targetType: "Announcement",
    });
    return { ok: true };
  });

  // Acknowledge
  app.post("/:id/acknowledge", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const ack = await app.prisma.announcementAcknowledgement.upsert({
      where: { announcementId_empId: { announcementId: id, empId: session.sub } },
      create: { announcementId: id, empId: session.sub, ipAddress: req.ip },
      update: {},
    });
    return ack;
  });

  // Acknowledgement stats (Admin/HR)
  app.get("/:id/acknowledgements", async (req) => {
    await req.requireRole("ADMIN", "HR");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const acks = await app.prisma.announcementAcknowledgement.findMany({
      where: { announcementId: id },
      orderBy: { acknowledgedAt: "desc" },
    });
    return { count: acks.length, items: acks };
  });
};

export default annRoutes;
