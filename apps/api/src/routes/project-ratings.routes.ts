// ────────────────────────────────────────────────────────────────────────────
//  src/routes/project-ratings.routes.ts
//  PM rates → TL endorses → HR finalises. Each step is a separate endpoint.
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";
import { notify } from "../services/notification.service.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";

const projectRatingRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get("/", async (req) => {
    const session = await req.requireAuth();
    const qs = z
      .object({ state: z.string().optional(), empId: z.string().optional() })
      .parse(req.query);
    const where: Record<string, unknown> = {};
    if (qs.state) where.state = qs.state;
    if (qs.empId) where.empId = qs.empId;
    if (!session.roles.some((r) => ["ADMIN", "HR", "PM", "TL"].includes(r))) {
      where.empId = session.sub;
    }
    return app.prisma.projectRating.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  });

  // PM creates an initial rating
  app.post("/", async (req) => {
    const session = await req.requireRole("ADMIN", "HR", "PM");
    const body = z
      .object({
        empId: z.string(),
        projectName: z.string().optional(),
        projectId: z.string().optional(),
        pmRating: z.number().min(1).max(5),
        pmNote: z.string().optional(),
      })
      .parse(req.body);
    const created = await app.prisma.projectRating.create({
      data: {
        ...body,
        pmEmpId: session.sub,
        pmSubmittedAt: new Date(),
        state: "PENDING_TL",
      },
    });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "rating.pm_submit",
      target: created.id,
    });
    return created;
  });

  // TL endorses
  app.post("/:id/endorse", async (req) => {
    const session = await req.requireRole("ADMIN", "HR", "TL");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z
      .object({
        tlRating: z.number().min(1).max(5),
        tlNote: z.string().optional(),
      })
      .parse(req.body);
    const existing = await app.prisma.projectRating.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Rating");
    if (existing.state !== "PENDING_TL") {
      throw new BadRequestError(`Cannot endorse — state is ${existing.state}`);
    }
    const updated = await app.prisma.projectRating.update({
      where: { id },
      data: {
        ...body,
        tlEndorsedAt: new Date(),
        state: "PENDING_HR",
      },
    });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "rating.tl_endorse",
      target: id,
    });
    return updated;
  });

  // HR finalises
  app.post("/:id/finalize", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({ hrFinalRating: z.number().min(1).max(5) }).parse(req.body);
    const updated = await app.prisma.projectRating.update({
      where: { id },
      data: { ...body, hrFinalisedAt: new Date(), state: "FINALISED" },
    });
    await notify(app.prisma, {
      empId: updated.empId,
          category: "KPI",
      title: "Project rating finalised",
      body: `Your final rating: ${body.hrFinalRating.toFixed(1)}/5`,
      icon: "star",
      color: "info",
    });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "rating.hr_finalize",
      target: id,
    });
    return updated;
  });
};

export default projectRatingRoutes;
