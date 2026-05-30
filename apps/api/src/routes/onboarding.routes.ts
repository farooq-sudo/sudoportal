// ────────────────────────────────────────────────────────────────────────────
//  src/routes/onboarding.routes.ts
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";
import { NotFoundError } from "../utils/errors.js";

const onboardingRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get("/steps", async (req) => {
    const session = await req.requireAuth();
    const qs = z.object({ empId: z.string().optional() }).parse(req.query);
    const where: Record<string, unknown> = {};
    if (qs.empId) where.empId = qs.empId;
    if (!session.roles.some((r) => ["ADMIN", "HR", "PM", "TL"].includes(r))) {
      where.empId = session.sub;
    }
    return app.prisma.onboardingStep.findMany({
      where,
      orderBy: [{ empId: "asc" }, { stepNum: "asc" }],
    });
  });

  app.post("/steps", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const body = z
      .object({
        empId: z.string(),
        stepNum: z.number().int().positive(),
        category: z.string().min(1),
        title: z.string().min(1),
        description: z.string().optional(),
        assignedTo: z.string().optional(),
        dueAt: z.coerce.date().optional(),
        notes: z.string().optional(),
      })
      .parse(req.body);
    const created = await app.prisma.onboardingStep.create({
      data: {
        empId: body.empId,
        stepNum: body.stepNum,
        category: body.category,
        title: body.title,
        description: body.description,
        assignedTo: body.assignedTo,
        dueAt: body.dueAt,
        notes: body.notes,
        status: "NOT_STARTED",
      },
    });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "onboarding.step.create",
      target: created.id,
    });
    return created;
  });

  app.patch("/steps/:id", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z
      .object({
        status: z.enum(["NOT_STARTED", "IN_PROGRESS", "AWAITING_HR_REVIEW", "COMPLETED", "SKIPPED", "BLOCKED"]).optional(),
        startedAt: z.coerce.date().optional(),
        completedAt: z.coerce.date().optional(),
        notes: z.string().optional(),
      })
      .parse(req.body);
    const step = await app.prisma.onboardingStep.findUnique({ where: { id } });
    if (!step) throw new NotFoundError("OnboardingStep");
    // Employee can update their own; HR/Admin can update anyone's
    if (step.empId !== session.sub && !session.roles.some((r) => ["ADMIN", "HR"].includes(r))) {
      throw new NotFoundError("OnboardingStep"); // hide existence
    }
    const updated = await app.prisma.onboardingStep.update({ where: { id }, data: body });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "onboarding.step.update",
      target: id,
      metadata: body as Record<string, unknown>,
    });
    return updated;
  });
};

export default onboardingRoutes;
