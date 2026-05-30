// ────────────────────────────────────────────────────────────────────────────
//  src/routes/sessions.routes.ts
//  User session management. Admins see all sessions and can force-revoke.
//  Users see and revoke their own.
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";
import { ForbiddenError, NotFoundError } from "../utils/errors.js";

const sessionRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // My sessions
  app.get("/me", async (req) => {
    const session = await req.requireAuth();
    const items = await app.prisma.userSession.findMany({
      where: { empId: session.sub, revokedAt: null },
      orderBy: { lastActivityAt: "desc" },
    });
    return { items };
  });

  // Admin: list all active sessions
  app.get("/", async (req) => {
    await req.requireRole("ADMIN");
    const qs = z.object({
      empId: z.string().optional(),
      activeOnly: z.coerce.boolean().default(true),
      limit: z.coerce.number().int().min(1).max(500).default(100),
      offset: z.coerce.number().int().min(0).default(0),
    }).parse(req.query);

    const where: Record<string, unknown> = {};
    if (qs.empId) where.empId = qs.empId;
    if (qs.activeOnly) where.revokedAt = null;

    const [items, total] = await Promise.all([
      app.prisma.userSession.findMany({
        where, take: qs.limit, skip: qs.offset,
        orderBy: { lastActivityAt: "desc" },
        include: { employee: { select: { id: true, name: true, email: true } } },
      }),
      app.prisma.userSession.count({ where }),
    ]);
    return { items, total };
  });

  // Revoke a single session
  app.post("/:id/revoke", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const target = await app.prisma.userSession.findUnique({ where: { id } });
    if (!target) throw new NotFoundError("Session");

    const isOwn = target.empId === session.sub;
    const isAdmin = session.roles.includes("ADMIN");
    if (!isOwn && !isAdmin) throw new ForbiddenError();

    await app.prisma.userSession.update({
      where: { id },
      data: {
        revokedAt: new Date(),
        revokedReason: isOwn ? "self_revoke" : `admin_revoke:${session.sub}`,
      },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "session.revoke", target: id, targetType: "UserSession",
      category: "security", severity: isOwn ? "info" : "security",
      metadata: { sessionEmpId: target.empId, ip: target.ipAddress },
    });
    return { ok: true };
  });

  // Revoke ALL of an employee's sessions
  app.post("/employee/:empId/revoke-all", async (req) => {
    const session = await req.requireRole("ADMIN");
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const { count } = await app.prisma.userSession.updateMany({
      where: { empId, revokedAt: null },
      data: {
        revokedAt: new Date(),
        revokedReason: `admin_revoke_all:${session.sub}`,
      },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "session.revoke_all", target: empId, targetType: "Employee",
      category: "security", severity: "security",
      metadata: { count },
    });
    return { revoked: count };
  });

  // ── Login attempts (Admin) ─────────────────────────────────────────────
  app.get("/login-attempts", async (req) => {
    await req.requireRole("ADMIN", "AUDITOR");
    const qs = z.object({
      email: z.string().optional(),
      empId: z.string().optional(),
      outcome: z.string().optional(),
      from: z.coerce.date().optional(),
      to: z.coerce.date().optional(),
      limit: z.coerce.number().int().min(1).max(500).default(100),
      offset: z.coerce.number().int().min(0).default(0),
    }).parse(req.query);

    const where: Record<string, unknown> = {};
    if (qs.email) where.email = qs.email;
    if (qs.empId) where.empId = qs.empId;
    if (qs.outcome) where.outcome = qs.outcome;
    if (qs.from || qs.to) where.createdAt = { gte: qs.from, lte: qs.to };

    const [items, total] = await Promise.all([
      app.prisma.loginAttempt.findMany({
        where, take: qs.limit, skip: qs.offset,
        orderBy: { createdAt: "desc" },
      }),
      app.prisma.loginAttempt.count({ where }),
    ]);
    return { items, total };
  });
};

export default sessionRoutes;
