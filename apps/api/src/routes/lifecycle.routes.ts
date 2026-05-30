// ────────────────────────────────────────────────────────────────────────────
//  src/routes/lifecycle.routes.ts
//  Air ticket allowances + usage, offboarding cases, background checks.
//  All HR-driven employee lifecycle events.
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";
import { ForbiddenError, NotFoundError } from "../utils/errors.js";

const lcRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // ══════════════════════════════════════════════════════════════════════
  //  AIR TICKETS
  // ══════════════════════════════════════════════════════════════════════
  app.get("/air-tickets/:empId", async (req) => {
    const session = await req.requireAuth();
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const isSelf = session.sub === empId;
    const isPriv = session.roles.some((r) => r === "ADMIN" || r === "HR");
    if (!isSelf && !isPriv) throw new ForbiddenError();
    const allowance = await app.prisma.airTicketAllowance.findUnique({ where: { empId } });
    const year = new Date().getFullYear();
    const usages = await app.prisma.airTicketUsage.findMany({
      where: { empId, year }, orderBy: { travelFrom: "desc" },
    });
    const used = usages.length;
    return { empId, allowance, year, used, usages };
  });

  app.put("/air-tickets/:empId/allowance", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const body = z.object({
      cyclePerYear: z.number().int().min(0).default(1),
      ticketsPerCycle: z.number().int().min(0).default(1),
      cabinClass: z.string().default("ECONOMY"),
      homeRoute: z.string().optional(),
      coversFamily: z.boolean().default(false),
      amountCap: z.number().optional(),
      currency: z.string().default("AED"),
      policyNote: z.string().optional(),
    }).parse(req.body);
    const allowance = await app.prisma.airTicketAllowance.upsert({
      where: { empId }, create: { empId, ...body }, update: body,
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "airtickets.set_allowance", target: empId, targetType: "Employee",
    });
    return allowance;
  });

  app.post("/air-tickets/:empId/usage", async (req) => {
    const session = await req.requireAuth();
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const isSelf = session.sub === empId;
    const isPriv = session.roles.some((r) => r === "ADMIN" || r === "HR");
    if (!isSelf && !isPriv) throw new ForbiddenError();
    const body = z.object({
      year: z.number().int().default(new Date().getFullYear()),
      travelFrom: z.coerce.date(),
      travelTo: z.coerce.date(),
      route: z.string(),
      amount: z.number().optional(),
      currency: z.string().default("AED"),
      notes: z.string().optional(),
    }).parse(req.body);
    const u = await app.prisma.airTicketUsage.create({ data: { empId, ...body } });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "airtickets.usage", target: empId, targetType: "Employee",
      metadata: { route: body.route, year: body.year },
    });
    return u;
  });

  // ══════════════════════════════════════════════════════════════════════
  //  OFFBOARDING
  // ══════════════════════════════════════════════════════════════════════
  app.get("/offboarding/:empId", async (req) => {
    await req.requireRole("ADMIN", "HR");
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const c = await app.prisma.offboardingCase.findUnique({ where: { empId } });
    if (!c) throw new NotFoundError("Offboarding case");
    return c;
  });

  app.post("/offboarding", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const body = z.object({
      empId: z.string(),
      reason: z.enum(["RESIGNATION", "TERMINATION", "END_OF_CONTRACT", "RETIREMENT", "REDUNDANCY", "DEATH", "OTHER"]),
      reasonNote: z.string().optional(),
      noticeServedAt: z.coerce.date().optional(),
      lastWorkingDay: z.coerce.date().optional(),
    }).parse(req.body);
    const c = await app.prisma.offboardingCase.upsert({
      where: { empId: body.empId },
      create: { ...body, initiatedBy: session.sub },
      update: body,
    });
    // Mark employee as OFFBOARDING
    await app.prisma.employee.update({
      where: { id: body.empId },
      data: { status: "OFFBOARDING" },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "offboarding.initiate", target: body.empId, targetType: "Employee",
      category: "hr", severity: "security",
      metadata: { reason: body.reason },
    });
    return c;
  });

  app.patch("/offboarding/:empId", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const body = z.object({
      lastWorkingDay: z.coerce.date().optional(),
      exitInterviewAt: z.coerce.date().optional(),
      exitInterviewBy: z.string().optional(),
      exitInterviewNote: z.string().optional(),
      clearanceJson: z.record(z.unknown()).optional(),
      finalSettlementAmount: z.number().optional(),
      finalSettlementCurrency: z.string().optional(),
      finalSettlementPaidAt: z.coerce.date().optional(),
      rehireEligible: z.boolean().optional(),
      rehireNote: z.string().optional(),
    }).parse(req.body);
    const c = await app.prisma.offboardingCase.update({
      where: { empId },
      data: { ...body, clearanceJson: body.clearanceJson as object | undefined },
    });

    // If final settlement paid → mark TERMINATED
    if (body.finalSettlementPaidAt) {
      await app.prisma.employee.update({
        where: { id: empId },
        data: { status: "TERMINATED", active: false },
      });
    }
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "offboarding.update", target: empId, targetType: "Employee",
      category: "hr",
    });
    return c;
  });

  // ══════════════════════════════════════════════════════════════════════
  //  BACKGROUND CHECKS
  // ══════════════════════════════════════════════════════════════════════
  app.get("/bg-checks/:empId", async (req) => {
    await req.requireRole("ADMIN", "HR", "RECRUITER");
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const items = await app.prisma.backgroundCheck.findMany({
      where: { empId }, orderBy: { requestedAt: "desc" },
    });
    return { empId, items };
  });

  app.post("/bg-checks", async (req) => {
    const session = await req.requireRole("ADMIN", "HR", "RECRUITER");
    const body = z.object({
      empId: z.string(),
      type: z.enum(["IDENTITY", "CRIMINAL", "EMPLOYMENT_VERIFICATION", "EDUCATION_VERIFICATION", "CREDIT", "REFERENCE", "DRUG_SCREEN"]),
      vendor: z.string().optional(),
      vendorRefId: z.string().optional(),
      cost: z.number().optional(),
      currency: z.string().default("AED"),
      notes: z.string().optional(),
    }).parse(req.body);
    const c = await app.prisma.backgroundCheck.create({
      data: { ...body, status: "REQUESTED" },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "bgcheck.request", target: body.empId, targetType: "Employee",
      category: "hr",
      metadata: { type: body.type, vendor: body.vendor },
    });
    return c;
  });

  app.patch("/bg-checks/:id", async (req) => {
    const session = await req.requireRole("ADMIN", "HR", "RECRUITER");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      status: z.enum(["REQUESTED", "IN_PROGRESS", "CLEAR", "REVIEW_NEEDED", "FAILED", "CANCELLED"]).optional(),
      result: z.string().optional(),
      resultUrl: z.string().url().optional(),
      completedAt: z.coerce.date().optional(),
      notes: z.string().optional(),
    }).parse(req.body);
    const c = await app.prisma.backgroundCheck.update({ where: { id }, data: body });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "bgcheck.update", target: id, targetType: "BackgroundCheck",
    });
    return c;
  });
};

export default lcRoutes;
