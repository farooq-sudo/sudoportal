// ────────────────────────────────────────────────────────────────────────────
//  src/routes/admin.routes.ts
//  System config, integration registry, manual Entra sync trigger,
//  role-override management. Admin-only.
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";
import { NotFoundError } from "../utils/errors.js";

const adminRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // ── System config K/V store ──────────────────────────────────────────
  app.get("/config", async (req) => {
    await req.requireRole("ADMIN");
    return app.prisma.systemConfig.findMany();
  });

  app.put("/config/:key", async (req) => {
    const session = await req.requireRole("ADMIN");
    const { key } = z.object({ key: z.string().min(1) }).parse(req.params);
    const body = z.object({ value: z.unknown() }).parse(req.body);
    const updated = await app.prisma.systemConfig.upsert({
      where: { key },
      create: { key, value: body.value as object, updatedBy: session.sub },
      update: { value: body.value as object, updatedBy: session.sub },
    });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "config.update",
      target: key,
      metadata: { value: body.value },
    });
    return updated;
  });

  // ── Integration registry ─────────────────────────────────────────────
  app.get("/integrations", async (req) => {
    await req.requireRole("ADMIN");
    return app.prisma.integration.findMany({ orderBy: { name: "asc" } });
  });

  app.patch("/integrations/:id", async (req) => {
    const session = await req.requireRole("ADMIN");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z
      .object({
        status: z.string().optional(),
        enabled: z.boolean().optional(),
        config: z.record(z.unknown()).optional(),
      })
      .parse(req.body);
    const updated = await app.prisma.integration.update({
      where: { id },
      data: {
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.enabled !== undefined ? { enabled: body.enabled } : {}),
        ...(body.config !== undefined ? { configJson: body.config as object } : {}),
      },
    });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "integration.update",
      target: id,
      metadata: body as Record<string, unknown>,
    });
    return updated;
  });

  // ── User roles (assign / revoke) ─────────────────────────────────────
  // Higher-fidelity than the basic employees PATCH — this writes an audit
  // line tagged specifically for security review.
  app.post("/users/:id/roles", async (req) => {
    const session = await req.requireRole("ADMIN");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z
      .object({
        roles: z.array(z.enum(["ADMIN", "HR", "PM", "TL", "EMPLOYEE"])),
      })
      .parse(req.body);
    const target = await app.prisma.employee.findUnique({ where: { id } });
    if (!target) throw new NotFoundError("Employee");
    const updated = await app.prisma.employee.update({
      where: { id },
      data: { roles: body.roles },
    });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "user.role_change",
      target: id,
      metadata: { from: target.roles, to: body.roles },
      note: `${target.name}: ${target.roles.join(",")} → ${body.roles.join(",")}`,
    });
    return updated;
  });

  // ── Manual Entra sync trigger ────────────────────────────────────────
  // Queues a ScheduledJob. A worker (not yet wired) picks it up and runs
  // the directory pull. For now this just records the request — useful to
  // verify the admin-only gate works.
  app.post("/sync/entra", async (req) => {
    const session = await req.requireRole("ADMIN");
    const job = await app.prisma.scheduledJob.create({
      data: {
        kind: "entra.sync.users",
        runAt: new Date(),
        status: "pending",
        payload: { requestedBy: session.sub },
      },
    });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "admin.entra_sync.queue",
      target: job.id,
    });
    return { jobId: job.id, status: "queued" };
  });

  // ── Background jobs list (for the Admin observability page) ──────────
  app.get("/jobs", async (req) => {
    await req.requireRole("ADMIN");
    return app.prisma.scheduledJob.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  });
};

export default adminRoutes;
