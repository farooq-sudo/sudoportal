// ────────────────────────────────────────────────────────────────────────────
//  src/routes/notifications.routes.ts
//  In-portal notifications. Each user reads their own. Mark-read endpoints.
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { NotFoundError, ForbiddenError } from "../utils/errors.js";

const notificationRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // List my notifications (most recent first)
  app.get("/", async (req) => {
    const session = await req.requireAuth();
    const qs = z
      .object({
        unread: z.coerce.boolean().optional(),
        limit: z.coerce.number().int().min(1).max(200).default(50),
        offset: z.coerce.number().int().min(0).default(0),
      })
      .parse(req.query);

    // Each user sees notifications addressed to them OR broadcasts (empId null).
    const where: Record<string, unknown> = {
      OR: [{ empId: session.sub }, { empId: null }],
    };
    if (qs.unread !== undefined) {
      (where as Record<string, unknown>).unread = qs.unread;
    }

    const [rows, total, unreadCount] = await Promise.all([
      app.prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: qs.limit,
        skip: qs.offset,
      }),
      app.prisma.notification.count({ where }),
      app.prisma.notification.count({
        where: {
          OR: [{ empId: session.sub }, { empId: null }],
          unread: true,
        },
      }),
    ]);
    return { rows, total, unreadCount, limit: qs.limit, offset: qs.offset };
  });

  // Mark a single notification read
  app.patch("/:id/read", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const n = await app.prisma.notification.findUnique({ where: { id } });
    if (!n) throw new NotFoundError("Notification");
    // Only the addressee can mark it read (broadcasts are read per-user
    // semantically but we keep them shared in this prototype)
    if (n.empId && n.empId !== session.sub) {
      throw new ForbiddenError("Not your notification");
    }
    return app.prisma.notification.update({
      where: { id },
      data: { unread: false },
    });
  });

  // Mark everything read
  app.patch("/read-all", async (req) => {
    const session = await req.requireAuth();
    const result = await app.prisma.notification.updateMany({
      where: {
        OR: [{ empId: session.sub }, { empId: null }],
        unread: true,
      },
      data: { unread: false },
    });
    return { updated: result.count };
  });
};

export default notificationRoutes;
