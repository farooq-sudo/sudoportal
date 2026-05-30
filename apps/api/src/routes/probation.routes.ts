// ────────────────────────────────────────────────────────────────────────────
//  src/routes/probation.routes.ts
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";
import { notify } from "../services/notification.service.js";
import { dispatchWebhook } from "../services/webhook.service.js";

const probationRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get("/", async (req) => {
    await req.requireRole("ADMIN", "HR", "PM", "TL");
    return app.prisma.probationCase.findMany({ orderBy: { endDate: "asc" } });
  });

  app.get("/:empId", async (req) => {
    await req.requireAuth();
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    return app.prisma.probationCase.findUnique({ where: { empId } });
  });

  app.post("/", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const body = z
      .object({
        empId: z.string(),
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        risk: z.enum(["LOW", "MEDIUM", "HIGH"]).default("LOW"),
      })
      .parse(req.body);
    const created = await app.prisma.probationCase.create({ data: body });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "probation.open",
      target: created.id,
    });
    return created;
  });

  app.post("/:empId/endorse", async (req) => {
    const session = await req.requireRole("ADMIN", "HR", "PM", "TL");
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const isPm = session.roles.includes("PM");
    const isTl = session.roles.includes("TL");
    const updated = await app.prisma.probationCase.update({
      where: { empId },
      data: isPm
        ? { pmEndorsedBy: session.sub, pmEndorsedAt: new Date() }
        : isTl
        ? { tlEndorsedBy: session.sub, tlEndorsedAt: new Date() }
        : {},
    });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "probation.endorse",
      target: empId,
      note: isPm ? "PM endorsement" : isTl ? "TL endorsement" : "HR review",
    });
    return updated;
  });

  app.post("/:empId/decide", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const body = z
      .object({
        outcome: z.enum(["PASS", "EXTEND", "FAIL"]),
        notes: z.string().optional(),
      })
      .parse(req.body);
    const updated = await app.prisma.probationCase.update({
      where: { empId },
      data: {
        outcome: body.outcome,
        decidedAt: new Date(),
        decidedBy: session.sub,
        status: "DECIDED",
        notes: body.notes,
      },
    });
    await notify(app.prisma, {
      empId,
      category: "PROBATION",
      title: `Probation outcome: ${body.outcome}`,
      body: body.notes || "Your probation review has been finalised.",
      icon: "shield",
      color: body.outcome === "PASS" ? "ok" : body.outcome === "EXTEND" ? "warn" : "danger",
    });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "probation.decide",
      target: empId,
      note: body.outcome,
    });
    await dispatchWebhook(app.prisma, {
      type: "probation.decision",
      payload: { empId, outcome: body.outcome },
    });
    return updated;
  });
};

export default probationRoutes;
