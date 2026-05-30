// ────────────────────────────────────────────────────────────────────────────
//  src/routes/family.routes.ts
//  Family members + insurance policies + dependents.
//
//  An employee can read/manage their own family. HR can manage anyone's
//  insurance because policies are company-provided.
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";
import { ForbiddenError, NotFoundError } from "../utils/errors.js";

const familyRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // ── FAMILY MEMBERS ─────────────────────────────────────────────────────
  app.get("/members/:empId", async (req) => {
    const session = await req.requireAuth();
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const isSelf = session.sub === empId;
    const isPriv = session.roles.some((r) => r === "ADMIN" || r === "HR");
    if (!isSelf && !isPriv) throw new ForbiddenError();
    const members = await app.prisma.familyMember.findMany({
      where: { empId, deletedAt: null },
      orderBy: { createdAt: "asc" },
    });
    return { empId, members };
  });

  app.post("/members/:empId", async (req) => {
    const session = await req.requireAuth();
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const isSelf = session.sub === empId;
    const isPriv = session.roles.some((r) => r === "ADMIN" || r === "HR");
    if (!isSelf && !isPriv) throw new ForbiddenError();

    const body = z.object({
      relation: z.string(),  // SPOUSE, CHILD, PARENT, SIBLING
      fullName: z.string(),
      dateOfBirth: z.coerce.date().optional(),
      gender: z.enum(["MALE", "FEMALE", "UNDISCLOSED"]).optional(),
      nationality: z.string().optional(),
      passportNumber: z.string().optional(),
      passportExpiry: z.coerce.date().optional(),
      visaNumber: z.string().optional(),
      visaExpiry: z.coerce.date().optional(),
      isInsured: z.boolean().default(false),
      isVisaDependent: z.boolean().default(false),
    }).parse(req.body);

    const member = await app.prisma.familyMember.create({ data: { empId, ...body } });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "family.add", target: empId, targetType: "Employee",
      category: "hr", metadata: { relation: body.relation, fullName: body.fullName },
    });
    return member;
  });

  app.patch("/members/:id", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const m = await app.prisma.familyMember.findUnique({ where: { id } });
    if (!m) throw new NotFoundError("Family member");
    const isSelf = session.sub === m.empId;
    const isPriv = session.roles.some((r) => r === "ADMIN" || r === "HR");
    if (!isSelf && !isPriv) throw new ForbiddenError();
    const body = z.object({
      fullName: z.string().optional(),
      dateOfBirth: z.coerce.date().optional(),
      passportNumber: z.string().optional(),
      passportExpiry: z.coerce.date().optional(),
      visaNumber: z.string().optional(),
      visaExpiry: z.coerce.date().optional(),
      isInsured: z.boolean().optional(),
      notes: z.string().optional(),
    }).parse(req.body);
    const updated = await app.prisma.familyMember.update({ where: { id }, data: body });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "family.update", target: id, targetType: "FamilyMember",
    });
    return updated;
  });

  app.delete("/members/:id", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const m = await app.prisma.familyMember.findUnique({ where: { id } });
    if (!m) throw new NotFoundError("Family member");
    const isSelf = session.sub === m.empId;
    const isPriv = session.roles.some((r) => r === "ADMIN" || r === "HR");
    if (!isSelf && !isPriv) throw new ForbiddenError();
    await app.prisma.familyMember.update({
      where: { id }, data: { deletedAt: new Date() },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "family.delete", target: id, targetType: "FamilyMember",
    });
    return { ok: true };
  });

  // ── INSURANCE POLICIES (HR managed) ────────────────────────────────────
  app.get("/insurance/:empId", async (req) => {
    const session = await req.requireAuth();
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const isSelf = session.sub === empId;
    const isPriv = session.roles.some((r) => r === "ADMIN" || r === "HR");
    if (!isSelf && !isPriv) throw new ForbiddenError();
    const policies = await app.prisma.insurancePolicy.findMany({
      where: { empId, active: true },
      include: { dependents: { include: { familyMember: true } } },
      orderBy: { validFrom: "desc" },
    });
    return { empId, policies };
  });

  app.post("/insurance/:empId", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const body = z.object({
      provider: z.string(),
      policyNumber: z.string(),
      tier: z.string(),
      coverageSummary: z.string().optional(),
      validFrom: z.coerce.date(),
      validUntil: z.coerce.date(),
      annualPremium: z.number().optional(),
      currency: z.string().default("AED"),
      cardUrl: z.string().url().optional(),
      dependents: z.array(z.object({
        familyMemberId: z.string(),
        tier: z.string().optional(),
        policyMemberNo: z.string().optional(),
      })).default([]),
    }).parse(req.body);

    const policy = await app.prisma.insurancePolicy.create({
      data: {
        empId,
        provider: body.provider,
        policyNumber: body.policyNumber,
        tier: body.tier,
        coverageSummary: body.coverageSummary,
        validFrom: body.validFrom,
        validUntil: body.validUntil,
        annualPremium: body.annualPremium,
        currency: body.currency,
        cardUrl: body.cardUrl,
        dependents: {
          create: body.dependents.map((d) => ({
            familyMemberId: d.familyMemberId,
            tier: d.tier,
            policyMemberNo: d.policyMemberNo,
          })),
        },
      },
      include: { dependents: true },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "insurance.add", target: empId, targetType: "Employee",
      category: "hr", metadata: { provider: body.provider, tier: body.tier },
    });
    return policy;
  });
};

export default familyRoutes;
