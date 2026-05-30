// ────────────────────────────────────────────────────────────────────────────
//  src/routes/compensation.routes.ts
//
//  Salary history, allowances, payroll adjustments, bank accounts.
//  Highly sensitive — HR / Finance / Admin only. Self can view own bank
//  account but not salary (mirrors typical HRIS).
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";
import { ForbiddenError, NotFoundError } from "../utils/errors.js";

const compRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // ── SALARY ────────────────────────────────────────────────────────────
  // List salary history for one employee
  app.get("/salary/:empId", async (req) => {
    const session = await req.requireRole("ADMIN", "HR", "FINANCE");
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const records = await app.prisma.salaryRecord.findMany({
      where: { empId },
      orderBy: { effectiveDate: "desc" },
      include: { allowanceItems: true },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "salary.view", target: empId, targetType: "Employee",
      category: "compensation", severity: "security",
    });
    return { empId, records };
  });

  // Add a new salary record (always inserts; never updates)
  app.post("/salary/:empId", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const body = z.object({
      effectiveDate: z.coerce.date(),
      basic: z.number().min(0),
      housing: z.number().min(0).default(0),
      transport: z.number().min(0).default(0),
      otherAllowance: z.number().min(0).default(0),
      currency: z.string().default("AED"),
      payCycle: z.string().default("MONTHLY"),
      reasonCode: z.string(),
      reasonNote: z.string().optional(),
      nextReviewAt: z.coerce.date().optional(),
      allowanceItems: z.array(z.object({
        name: z.string(),
        amount: z.number().min(0),
        taxable: z.boolean().default(true),
        recurring: z.boolean().default(true),
      })).default([]),
    }).parse(req.body);

    const gross = body.basic + body.housing + body.transport + body.otherAllowance;

    // Close out the previous open record
    await app.prisma.salaryRecord.updateMany({
      where: { empId, endDate: null },
      data: { endDate: body.effectiveDate },
    });

    const record = await app.prisma.salaryRecord.create({
      data: {
        empId,
        effectiveDate: body.effectiveDate,
        basic: body.basic,
        housing: body.housing,
        transport: body.transport,
        otherAllowance: body.otherAllowance,
        gross,
        currency: body.currency,
        payCycle: body.payCycle,
        reasonCode: body.reasonCode,
        reasonNote: body.reasonNote,
        nextReviewAt: body.nextReviewAt,
        approvedBy: session.sub,
        approvedAt: new Date(),
        createdBy: session.sub,
        allowanceItems: { create: body.allowanceItems },
      },
      include: { allowanceItems: true },
    });

    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "salary.create", target: empId, targetType: "Employee",
      category: "compensation", severity: "security",
      metadata: { gross, currency: body.currency, reasonCode: body.reasonCode },
    });
    return record;
  });

  // ── PAYROLL ADJUSTMENTS ──────────────────────────────────────────────
  app.get("/adjustments/:empId", async (req) => {
    await req.requireRole("ADMIN", "HR", "FINANCE");
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const qs = z.object({ payPeriod: z.string().optional() }).parse(req.query);
    const where: Record<string, unknown> = { empId };
    if (qs.payPeriod) where.payPeriod = qs.payPeriod;
    const items = await app.prisma.payrollAdjustment.findMany({
      where, orderBy: { createdAt: "desc" },
    });
    return { items };
  });

  app.post("/adjustments", async (req) => {
    const session = await req.requireRole("ADMIN", "HR", "FINANCE");
    const body = z.object({
      empId: z.string(),
      payPeriod: z.string(),     // "2026-05"
      type: z.enum(["BONUS", "DEDUCTION", "ARREARS", "ADVANCE"]),
      amount: z.number(),
      currency: z.string().default("AED"),
      reason: z.string().optional(),
    }).parse(req.body);

    const adj = await app.prisma.payrollAdjustment.create({
      data: {
        ...body,
        approvedBy: session.sub,
        approvedAt: new Date(),
      },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "payroll.adjustment", target: body.empId, targetType: "Employee",
      category: "compensation", severity: "security",
      metadata: { type: body.type, amount: body.amount, payPeriod: body.payPeriod },
    });
    return adj;
  });

  // ── BANK ACCOUNTS ────────────────────────────────────────────────────
  app.get("/bank/:empId", async (req) => {
    const session = await req.requireAuth();
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const isSelf = session.sub === empId;
    const isPriv = session.roles.some((r) => r === "ADMIN" || r === "HR" || r === "FINANCE");
    if (!isSelf && !isPriv) throw new ForbiddenError();
    const accounts = await app.prisma.bankAccount.findMany({
      where: { empId, active: true },
      orderBy: { isPrimary: "desc" },
    });
    return { empId, accounts };
  });

  app.post("/bank/:empId", async (req) => {
    const session = await req.requireAuth();
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const isSelf = session.sub === empId;
    const isPriv = session.roles.some((r) => r === "ADMIN" || r === "HR");
    if (!isSelf && !isPriv) throw new ForbiddenError();
    const body = z.object({
      bankName: z.string(),
      branchName: z.string().optional(),
      accountHolder: z.string(),
      accountNumber: z.string().optional(),
      iban: z.string().optional(),
      swiftBic: z.string().optional(),
      currency: z.string().default("AED"),
      isPrimary: z.boolean().default(false),
    }).parse(req.body);

    // If marking primary, unset others
    if (body.isPrimary) {
      await app.prisma.bankAccount.updateMany({
        where: { empId, isPrimary: true },
        data: { isPrimary: false },
      });
    }
    const acc = await app.prisma.bankAccount.create({
      data: { empId, ...body, verified: false },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "bank.add", target: empId, targetType: "Employee",
      category: "compensation",
      metadata: { bankName: body.bankName, isPrimary: body.isPrimary },
    });
    return acc;
  });

  app.post("/bank/:id/verify", async (req) => {
    const session = await req.requireRole("ADMIN", "HR", "FINANCE");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const acc = await app.prisma.bankAccount.update({
      where: { id },
      data: { verified: true, verifiedBy: session.sub, verifiedAt: new Date() },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "bank.verify", target: id, targetType: "BankAccount",
      category: "compensation",
    });
    return acc;
  });
};

export default compRoutes;
