// ────────────────────────────────────────────────────────────────────────────
//  src/routes/projects.routes.ts
//
//  Projects (mirrored from ODOO), assignments, milestones, timesheets.
//  Most data flows in via ODOO sync; this route exposes read-mostly views
//  plus manual overrides for PM/HR.
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";
import { ForbiddenError, NotFoundError } from "../utils/errors.js";

const projRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // ── PROJECTS ──────────────────────────────────────────────────────────
  app.get("/", async (req) => {
    const session = await req.requireAuth();
    const qs = z.object({
      status: z.string().optional(),
      teamId: z.string().optional(),
      pmEmpId: z.string().optional(),
      search: z.string().optional(),
      limit: z.coerce.number().int().min(1).max(200).default(50),
      offset: z.coerce.number().int().min(0).default(0),
    }).parse(req.query);

    const where: Record<string, unknown> = {};
    if (qs.status) where.status = qs.status;
    if (qs.teamId) where.teamId = qs.teamId;
    if (qs.pmEmpId) where.pmEmpId = qs.pmEmpId;
    if (qs.search) {
      where.OR = [
        { name: { contains: qs.search, mode: "insensitive" } },
        { customer: { contains: qs.search, mode: "insensitive" } },
        { code: { contains: qs.search, mode: "insensitive" } },
      ];
    }

    // Non-privileged users see only projects they're on
    const isPriv = session.roles.some((r) => r === "ADMIN" || r === "HR" || r === "PM");
    if (!isPriv) {
      where.assignments = { some: { empId: session.sub, active: true } };
    }

    const [items, total] = await Promise.all([
      app.prisma.project.findMany({
        where, take: qs.limit, skip: qs.offset,
        orderBy: { createdAt: "desc" },
        include: {
          team: { select: { id: true, short: true, name: true } },
          _count: { select: { assignments: true, milestones: true } },
        },
      }),
      app.prisma.project.count({ where }),
    ]);
    return { items, total };
  });

  app.get("/:id", async (req) => {
    await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const p = await app.prisma.project.findUnique({
      where: { id },
      include: {
        team: true,
        assignments: { include: { employee: { select: { id: true, name: true, email: true, title: true, photoUrl: true } } } },
        milestones: { orderBy: { plannedDate: "asc" } },
      },
    });
    if (!p) throw new NotFoundError("Project");
    return p;
  });

  // Create / update — usually ODOO sync, but PMs can override
  app.post("/", async (req) => {
    const session = await req.requireRole("ADMIN", "HR", "PM");
    const body = z.object({
      id: z.string(),
      code: z.string().optional(),
      name: z.string(),
      customer: z.string().optional(),
      status: z.enum(["PROPOSED", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"]).default("ACTIVE"),
      pmEmpId: z.string().optional(),
      teamId: z.string().optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      budgetAmount: z.number().optional(),
      budgetCurrency: z.string().default("AED"),
      description: z.string().optional(),
    }).parse(req.body);

    const p = await app.prisma.project.upsert({
      where: { id: body.id },
      create: body,
      update: body,
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "project.upsert", target: body.id, targetType: "Project",
      category: "project",
    });
    return p;
  });

  // ── ASSIGNMENTS ──────────────────────────────────────────────────────
  app.post("/:projectId/assignments", async (req) => {
    const session = await req.requireRole("ADMIN", "HR", "PM");
    const { projectId } = z.object({ projectId: z.string() }).parse(req.params);
    const body = z.object({
      empId: z.string(),
      role: z.string().optional(),
      allocationPct: z.number().int().min(0).max(100).default(100),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
    }).parse(req.body);
    const a = await app.prisma.projectAssignment.upsert({
      where: { projectId_empId: { projectId, empId: body.empId } },
      create: { projectId, ...body, active: true },
      update: { ...body, active: true },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "project.assign", target: projectId, targetType: "Project",
      metadata: { empId: body.empId, allocationPct: body.allocationPct },
    });
    return a;
  });

  app.delete("/:projectId/assignments/:empId", async (req) => {
    const session = await req.requireRole("ADMIN", "HR", "PM");
    const { projectId, empId } = z.object({
      projectId: z.string(), empId: z.string(),
    }).parse(req.params);
    await app.prisma.projectAssignment.update({
      where: { projectId_empId: { projectId, empId } },
      data: { active: false, endDate: new Date() },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "project.unassign", target: projectId, targetType: "Project",
      metadata: { empId },
    });
    return { ok: true };
  });

  // ── MILESTONES ───────────────────────────────────────────────────────
  app.post("/:projectId/milestones", async (req) => {
    const session = await req.requireRole("ADMIN", "PM");
    const { projectId } = z.object({ projectId: z.string() }).parse(req.params);
    const body = z.object({
      name: z.string(),
      description: z.string().optional(),
      plannedDate: z.coerce.date(),
      ownerEmpId: z.string().optional(),
      status: z.string().default("planned"),
    }).parse(req.body);
    const m = await app.prisma.projectMilestone.create({
      data: { projectId, ...body },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "milestone.create", target: m.id, targetType: "ProjectMilestone",
    });
    return m;
  });

  app.patch("/milestones/:id", async (req) => {
    const session = await req.requireRole("ADMIN", "PM");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      actualDate: z.coerce.date().optional(),
      status: z.string().optional(),
      description: z.string().optional(),
    }).parse(req.body);
    const m = await app.prisma.projectMilestone.update({
      where: { id }, data: body,
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "milestone.update", target: id, targetType: "ProjectMilestone",
      metadata: body,
    });
    return m;
  });

  // ── TIMESHEETS ───────────────────────────────────────────────────────
  app.get("/timesheets", async (req) => {
    const session = await req.requireAuth();
    const qs = z.object({
      empId: z.string().optional(),
      projectId: z.string().optional(),
      from: z.coerce.date().optional(),
      to: z.coerce.date().optional(),
      limit: z.coerce.number().int().min(1).max(500).default(100),
    }).parse(req.query);
    const where: Record<string, unknown> = {};
    const isPriv = session.roles.some((r) => r === "ADMIN" || r === "HR" || r === "PM");
    if (qs.empId) {
      if (qs.empId !== session.sub && !isPriv) throw new ForbiddenError();
      where.empId = qs.empId;
    } else if (!isPriv) {
      where.empId = session.sub;
    }
    if (qs.projectId) where.projectId = qs.projectId;
    if (qs.from || qs.to) where.date = { gte: qs.from, lte: qs.to };
    const items = await app.prisma.timesheet.findMany({
      where, take: qs.limit,
      orderBy: { date: "desc" },
      include: { project: { select: { id: true, name: true } } },
    });
    return { items };
  });

  app.post("/timesheets", async (req) => {
    const session = await req.requireAuth();
    const body = z.object({
      projectId: z.string().optional(),
      date: z.coerce.date(),
      hours: z.number().min(0).max(24),
      description: z.string().optional(),
      billable: z.boolean().default(true),
    }).parse(req.body);
    const t = await app.prisma.timesheet.create({
      data: { empId: session.sub, ...body },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "timesheet.create", target: t.id, targetType: "Timesheet",
    });
    return t;
  });

  app.post("/timesheets/:id/approve", async (req) => {
    const session = await req.requireRole("ADMIN", "PM", "TL");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const t = await app.prisma.timesheet.update({
      where: { id },
      data: { approved: true, approvedBy: session.sub, approvedAt: new Date() },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "timesheet.approve", target: id, targetType: "Timesheet",
    });
    return t;
  });
};

export default projRoutes;
