// ────────────────────────────────────────────────────────────────────────────
//  src/routes/org.routes.ts
//  Departments, positions/job catalog, employment-record history.
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";
import { ForbiddenError, NotFoundError } from "../utils/errors.js";

const orgRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // ── DEPARTMENTS ───────────────────────────────────────────────────────
  app.get("/departments", async () => {
    const items = await app.prisma.department.findMany({
      where: { active: true }, orderBy: { name: "asc" },
      include: { _count: { select: { teams: true, employees: true } } },
    });
    return { items };
  });

  app.post("/departments", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const body = z.object({
      id: z.string(),
      name: z.string(),
      code: z.string(),
      description: z.string().optional(),
      parentId: z.string().optional(),
      headEmpId: z.string().optional(),
      costCenter: z.string().optional(),
    }).parse(req.body);
    const d = await app.prisma.department.upsert({
      where: { id: body.id }, create: body, update: body,
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "department.upsert", target: body.id, targetType: "Department",
    });
    return d;
  });

  // ── POSITIONS / JOB CATALOG ────────────────────────────────────────────
  app.get("/positions", async () => {
    const items = await app.prisma.position.findMany({
      where: { active: true }, orderBy: { title: "asc" },
    });
    return { items };
  });

  app.post("/positions", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const body = z.object({
      id: z.string(),
      title: z.string(),
      titleAr: z.string().optional(),
      jobFamily: z.string().optional(),
      level: z.number().int().min(1).max(10).optional(),
      grade: z.string().optional(),
      minSalary: z.number().optional(),
      maxSalary: z.number().optional(),
      currency: z.string().default("AED"),
    }).parse(req.body);
    const p = await app.prisma.position.upsert({
      where: { id: body.id }, create: body, update: body,
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "position.upsert", target: body.id, targetType: "Position",
      severity: "info",
    });
    return p;
  });

  // ── EMPLOYMENT HISTORY ─────────────────────────────────────────────────
  app.get("/employment-history/:empId", async (req) => {
    const session = await req.requireAuth();
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const isSelf = session.sub === empId;
    const isPriv = session.roles.some((r) => r === "ADMIN" || r === "HR");
    if (!isSelf && !isPriv) throw new ForbiddenError();
    const records = await app.prisma.employmentRecord.findMany({
      where: { empId }, orderBy: { effectiveDate: "desc" },
    });
    return { empId, records };
  });

  // Adding a new employment record = promotion / transfer / change
  app.post("/employment-history/:empId", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const body = z.object({
      effectiveDate: z.coerce.date(),
      reasonCode: z.string(),
      reasonNote: z.string().optional(),
      positionId: z.string().optional(),
      title: z.string().optional(),
      departmentId: z.string().optional(),
      teamId: z.string().optional(),
      teamRole: z.enum(["LEAD", "MANAGER", "MEMBER", "HR_BUSINESS_PARTNER"]).optional(),
      employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN", "CONSULTANT"]).optional(),
      managerEmpId: z.string().optional(),
      workLocation: z.string().optional(),
    }).parse(req.body);

    // Close out the previous open record
    await app.prisma.employmentRecord.updateMany({
      where: { empId, endDate: null },
      data: { endDate: body.effectiveDate },
    });

    const rec = await app.prisma.employmentRecord.create({
      data: {
        empId, ...body,
        approvedBy: session.sub, approvedAt: new Date(),
      },
    });
    // Reflect changes on the live Employee row
    await app.prisma.employee.update({
      where: { id: empId },
      data: {
        positionId: body.positionId,
        title: body.title,
        departmentId: body.departmentId,
        teamId: body.teamId,
        teamRole: body.teamRole,
        employmentType: body.employmentType,
        managerEmpId: body.managerEmpId,
        workLocation: body.workLocation,
        updatedBy: session.sub,
      },
    });

    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "employment.change", target: empId, targetType: "Employee",
      category: "hr",
      metadata: { reasonCode: body.reasonCode, effectiveDate: body.effectiveDate.toISOString() },
    });
    return rec;
  });
};

export default orgRoutes;
