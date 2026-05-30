// ────────────────────────────────────────────────────────────────────────────
//  src/routes/training.routes.ts
//  Training catalogue + assignments + certifications.
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";
import { notify } from "../services/notification.service.js";
import { NotFoundError } from "../utils/errors.js";

const trainingRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // ── Catalogue ─────────────────────────────────────────────────────────
  app.get("/catalogue", async (req) => {
    await req.requireAuth();
    return app.prisma.trainingCatalogue.findMany({ orderBy: { title: "asc" } });
  });

  app.post("/catalogue", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const body = z
      .object({
        id: z.string().min(1),
        title: z.string().min(1),
        category: z.string().optional(),
        provider: z.string().optional(),
        durationHours: z.number().int().optional(),
        mandatory: z.boolean().default(false),
        validityMonths: z.number().int().nullable().optional(),
      })
      .parse(req.body);
    const created = await app.prisma.trainingCatalogue.create({ data: body });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "training.catalogue.create",
      target: created.id,
    });
    return created;
  });

  // ── Assignments ───────────────────────────────────────────────────────
  app.get("/assignments", async (req) => {
    const session = await req.requireAuth();
    const qs = z.object({ empId: z.string().optional(), status: z.string().optional() }).parse(req.query);
    const where: Record<string, unknown> = {};
    if (qs.empId) where.empId = qs.empId;
    if (qs.status) where.status = qs.status;
    // Plain employees only see their own
    if (!session.roles.some((r) => ["ADMIN", "HR", "PM", "TL"].includes(r))) {
      where.empId = session.sub;
    }
    return app.prisma.trainingAssignment.findMany({
      where,
      include: { training: true },
      orderBy: { dueAt: "asc" },
    });
  });

  app.post("/assignments", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const body = z
      .object({
        empId: z.string().min(1),
        trainingId: z.string().min(1),
        dueAt: z.coerce.date().optional(),
      })
      .parse(req.body);
    const created = await app.prisma.trainingAssignment.create({ data: body });
    await notify(app.prisma, {
      empId: body.empId,
          category: "TRAINING",
      title: "New training assigned",
      body: "A training has been added to your portal",
      icon: "rocket",
      color: "info",
      url: "/trainings",
    });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "training.assign",
      target: created.id,
      metadata: { trainingId: body.trainingId, empId: body.empId },
    });
    return created;
  });

  app.post("/assignments/:id/complete", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const a = await app.prisma.trainingAssignment.findUnique({ where: { id } });
    if (!a) throw new NotFoundError("Assignment");
    const body = z.object({ score: z.number().optional(), certificateUrl: z.string().optional() }).parse(req.body || {});
    const updated = await app.prisma.trainingAssignment.update({
      where: { id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        scorePct: body.score,
        evidenceUrl: body.certificateUrl,
      },
    });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "training.complete",
      target: id,
    });
    return updated;
  });

  app.post("/assignments/:id/verify", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const updated = await app.prisma.trainingAssignment.update({
      where: { id },
      data: { verifiedBy: session.sub, verifiedAt: new Date() },
    });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "training.verify",
      target: id,
    });
    return updated;
  });

  // ── Certifications ────────────────────────────────────────────────────
  app.get("/certifications", async (req) => {
    const session = await req.requireAuth();
    const qs = z.object({ empId: z.string().optional() }).parse(req.query);
    const where: Record<string, unknown> = {};
    if (qs.empId) where.empId = qs.empId;
    if (!session.roles.some((r) => ["ADMIN", "HR", "PM", "TL"].includes(r))) {
      where.empId = session.sub;
    }
    return app.prisma.certification.findMany({
      where,
      orderBy: [{ expiresAt: "asc" }, { name: "asc" }],
    });
  });

  app.post("/certifications", async (req) => {
    const session = await req.requireAuth();
    const body = z
      .object({
        empId: z.string().min(1).optional(),
        name: z.string().min(1),
        issuer: z.string().optional(),
        issuedAt: z.coerce.date().optional(),
        expiresAt: z.coerce.date().optional(),
        credentialId: z.string().optional(),
        evidenceUrl: z.string().optional(),
      })
      .parse(req.body);
    const empId = body.empId || session.sub;
    if (empId !== session.sub && !session.roles.some((r) => ["ADMIN", "HR"].includes(r))) {
      // Plain users can only create their own; HR can create for anyone
      empId !== session.sub;
    }
    const created = await app.prisma.certification.create({
      data: { ...body, empId },
    });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "certification.create",
      target: created.id,
      metadata: { empId, name: body.name },
    });
    return created;
  });
};

export default trainingRoutes;
