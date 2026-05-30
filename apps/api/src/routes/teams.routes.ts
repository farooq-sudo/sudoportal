// ────────────────────────────────────────────────────────────────────────────
//  src/routes/teams.routes.ts
//  Teams CRUD. All reads are open to authenticated users (org structure is
//  not sensitive). Writes are Admin / HR only.
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { NotFoundError } from "../utils/errors.js";
import { audit } from "../services/audit.service.js";

const teamRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get("/", async (req) => {
    await req.requireAuth();
    return app.prisma.team.findMany({
      orderBy: { name: "asc" },
    });
  });

  app.get("/:id", async (req) => {
    await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const team = await app.prisma.team.findUnique({
      where: { id },
      include: {
        employees: {
          select: { id: true, name: true, title: true, status: true, teamRole: true },
          orderBy: [{ teamRole: "asc" }, { name: "asc" }],
        },
      },
    });
    if (!team) throw new NotFoundError("Team");
    return team;
  });

  app.post("/", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const body = z
      .object({
        id: z.string().min(1),
        name: z.string().min(1),
        short: z.string().min(1),
        color: z.string().optional(),
        description: z.string().optional(),
        leadEmpId: z.string().optional(),
        managerEmpId: z.string().optional(),
      })
      .parse(req.body);
    const created = await app.prisma.team.create({ data: body });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "team.create",
      target: created.id,
      metadata: body as Record<string, unknown>,
    });
    return created;
  });

  app.patch("/:id", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z
      .object({
        name: z.string().optional(),
        short: z.string().optional(),
        color: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
        leadEmpId: z.string().nullable().optional(),
        managerEmpId: z.string().nullable().optional(),
      })
      .parse(req.body);
    const updated = await app.prisma.team.update({ where: { id }, data: body });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "team.update",
      target: id,
      metadata: body as Record<string, unknown>,
    });
    return updated;
  });
};

export default teamRoutes;
