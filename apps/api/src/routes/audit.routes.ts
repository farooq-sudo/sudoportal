// ────────────────────────────────────────────────────────────────────────────
//  src/routes/audit.routes.ts
//  Read-only audit log. Admin-gated. Paginated, filterable.
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";

const auditRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get("/", async (req) => {
    await req.requireRole("ADMIN");
    const qs = z
      .object({
        actorId: z.string().optional(),
        action: z.string().optional(),
        target: z.string().optional(),
        since: z.coerce.date().optional(),
        until: z.coerce.date().optional(),
        limit: z.coerce.number().int().min(1).max(500).default(100),
        offset: z.coerce.number().int().min(0).default(0),
      })
      .parse(req.query);

    const where: Record<string, unknown> = {};
    if (qs.actorId) where.actorId = qs.actorId;
    if (qs.action) where.action = { contains: qs.action };
    if (qs.target) where.target = qs.target;
    if (qs.since || qs.until) {
      where.createdAt = {
        ...(qs.since ? { gte: qs.since } : {}),
        ...(qs.until ? { lte: qs.until } : {}),
      };
    }

    const [rows, total] = await Promise.all([
      app.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: qs.limit,
        skip: qs.offset,
      }),
      app.prisma.auditLog.count({ where }),
    ]);
    return { rows, total, limit: qs.limit, offset: qs.offset };
  });
};

export default auditRoutes;
