// ────────────────────────────────────────────────────────────────────────────
//  src/routes/kpi.routes.ts
//  KPI cycles, sections, templates, assignments, acknowledgements, history.
//  This is the busiest route set in the API.
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";
import { notify } from "../services/notification.service.js";
import { dispatchWebhook } from "../services/webhook.service.js";
import { compositeScore, kpiStatusColor } from "../services/kpi.service.js";
import { NotFoundError, ForbiddenError, BadRequestError } from "../utils/errors.js";

const kpiRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // ─────────────────────────────────────────────────────────────────────
  //  CYCLES
  // ─────────────────────────────────────────────────────────────────────
  app.get("/cycles", async (req) => {
    await req.requireAuth();
    return app.prisma.kpiCycle.findMany({ orderBy: { startDate: "asc" } });
  });

  app.post("/cycles", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const body = z
      .object({
        id: z.string().min(1),
        label: z.string().min(1),
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        status: z.enum(["upcoming", "active", "closed"]).default("upcoming"),
      })
      .parse(req.body);
    const cycle = await app.prisma.kpiCycle.create({ data: body });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "kpi.cycle.create",
      target: cycle.id,
    });
    return cycle;
  });

  // Close a cycle: snapshot composites into history, mark closed.
  app.post("/cycles/:id/close", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const cycle = await app.prisma.kpiCycle.findUnique({ where: { id } });
    if (!cycle) throw new NotFoundError("Cycle");
    if (cycle.status === "closed") throw new BadRequestError("Cycle already closed");

    // For every employee with active assignments in this cycle, snapshot
    // composite + counts into KpiCycleHistory.
    const empAssigns = await app.prisma.kpiAssignment.findMany({
      where: { cycleId: id },
      include: { template: true },
    });
    const byEmp = new Map<string, typeof empAssigns>();
    for (const a of empAssigns) {
      if (!byEmp.has(a.empId)) byEmp.set(a.empId, []);
      byEmp.get(a.empId)!.push(a);
    }
    for (const [empId, assigns] of byEmp) {
      const composite = compositeScore(assigns) ?? 0;
      const buckets = { green: 0, amber: 0, red: 0, grey: 0 };
      for (const a of assigns) {
        buckets[kpiStatusColor(a, a.template)] += 1;
      }
      await app.prisma.kpiCycleHistory.upsert({
        where: { empId_cycleId: { empId, cycleId: id } },
        create: {
          empId,
          cycleId: id,
          composite,
          kpiCount: assigns.length,
          redCount: buckets.red,
          amberCount: buckets.amber,
          greenCount: buckets.green,
          sectionsJson: [],
          closedAt: new Date(),
        },
        update: {
          composite,
          kpiCount: assigns.length,
          redCount: buckets.red,
          amberCount: buckets.amber,
          greenCount: buckets.green,
          closedAt: new Date(),
        },
      });
    }

    const updated = await app.prisma.kpiCycle.update({
      where: { id },
      data: { status: "closed", closedAt: new Date(), closedBy: session.sub },
    });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "kpi.cycle.close",
      target: id,
      note: `${byEmp.size} scorecards snapshotted to history`,
    });
    await dispatchWebhook(app.prisma, {
      type: "kpi.cycle.closed",
      payload: { cycleId: id, snapshottedCount: byEmp.size },
    });
    return updated;
  });

  // ─────────────────────────────────────────────────────────────────────
  //  SECTIONS + TEMPLATES
  // ─────────────────────────────────────────────────────────────────────
  app.get("/sections", async (req) => {
    await req.requireAuth();
    const qs = z.object({ teamId: z.string().optional() }).parse(req.query);
    return app.prisma.kpiSection.findMany({
      where: qs.teamId ? { teamId: qs.teamId } : undefined,
      orderBy: { sortOrder: "asc" },
    });
  });

  app.get("/templates", async (req) => {
    await req.requireAuth();
    const qs = z
      .object({
        teamId: z.string().optional(),
        active: z.coerce.boolean().optional(),
      })
      .parse(req.query);
    return app.prisma.kpiTemplate.findMany({
      where: {
        ...(qs.teamId ? { teamId: qs.teamId } : {}),
        ...(qs.active !== undefined ? { active: qs.active } : {}),
      },
      orderBy: { krn: "asc" },
    });
  });

  app.post("/templates", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const body = z
      .object({
        krn: z.string().min(1),
        sectionId: z.string().optional(),
        teamId: z.string().optional(),
        title: z.string().min(1),
        description: z.string().optional(),
        target: z.string().min(1),
        unit: z.string().optional(),
        direction: z.enum(["HIGHER_IS_BETTER", "LOWER_IS_BETTER", "EXACT_MATCH"]).default("HIGHER_IS_BETTER"),
        validatorRole: z.enum(["TL", "PM", "HR", "AUTO"]).default("TL"),
        defaultWeight: z.number().int().min(0).max(100).default(5),
        cadence: z.string().optional(),
        autoComputed: z.boolean().default(false),
      })
      .parse(req.body);
    const created = await app.prisma.kpiTemplate.create({ data: body });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "kpi.template.create",
      target: created.krn,
      metadata: body as Record<string, unknown>,
    });
    return created;
  });

  // ─────────────────────────────────────────────────────────────────────
  //  ASSIGNMENTS
  // ─────────────────────────────────────────────────────────────────────

  /**
   * GET /assignments — list. Scope follows role:
   *   ADMIN/HR: all
   *   TL: assignments for your team
   *   PM: assignments you validate (validatorRole=PM)
   *   EMPLOYEE: only your own
   */
  app.get("/assignments", async (req) => {
    const session = await req.requireAuth();
    const qs = z
      .object({
        cycleId: z.string().optional(),
        empId: z.string().optional(),
        teamId: z.string().optional(),
        status: z.string().optional(),
      })
      .parse(req.query);

    const where: Record<string, unknown> = {};
    if (qs.cycleId) where.cycleId = qs.cycleId;
    if (qs.empId) where.empId = qs.empId;
    if (qs.status) where.status = qs.status;
    if (qs.teamId) {
      where.employee = { teamId: qs.teamId };
    }

    if (!session.roles.some((r) => ["ADMIN", "HR"].includes(r))) {
      if (session.roles.includes("TL")) {
        const me = await app.prisma.employee.findUnique({
          where: { id: session.sub },
          select: { teamId: true },
        });
        where.employee = { teamId: me?.teamId || "__none__" };
      } else if (session.roles.includes("PM")) {
        // PMs see what they validate (no team scope for now)
        where.template = { validatorRole: "PM" };
      } else {
        // employee
        where.empId = session.sub;
      }
    }

    return app.prisma.kpiAssignment.findMany({
      where,
      include: { template: true, employee: { select: { id: true, name: true, teamId: true } } },
      orderBy: { createdAt: "desc" },
      take: 500,
    });
  });

  // GET /assignments/:id
  app.get("/assignments/:id", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const a = await app.prisma.kpiAssignment.findUnique({
      where: { id },
      include: { template: true, employee: true },
    });
    if (!a) throw new NotFoundError("Assignment");
    // Visibility: the employee themselves, anyone in their team, or HR/Admin
    const canSee =
      session.sub === a.empId ||
      session.roles.some((r) => ["ADMIN", "HR"].includes(r)) ||
      (session.roles.includes("TL") &&
        (await app.prisma.employee.findUnique({
          where: { id: session.sub },
          select: { teamId: true },
        }))?.teamId === a.employee.teamId);
    if (!canSee) throw new ForbiddenError("Not your KPI");
    return a;
  });

  // POST /assignments — HR or TL drafts a new KPI assignment
  app.post("/assignments", async (req) => {
    const session = await req.requireRole("ADMIN", "HR", "TL");
    const body = z
      .object({
        templateKrn: z.string().min(1),
        empId: z.string().min(1),
        cycleId: z.string().min(1),
        scope: z.string().optional(),
        scopeLabel: z.string().optional(),
        weight: z.number().int().min(0).max(100),
        hrNote: z.string().optional(),
        tlNote: z.string().optional(),
      })
      .parse(req.body);

    const direction = session.roles.includes("HR") || session.roles.includes("ADMIN")
      ? "HR_TO_TL"
      : "TL_TO_HR";

    const created = await app.prisma.kpiAssignment.create({
      data: {
        templateKrn: body.templateKrn,
        empId: body.empId,
        cycleId: body.cycleId,
        scope: body.scope,
        scopeLabel: body.scopeLabel,
        weight: body.weight,
        progressNote: body.hrNote || body.tlNote || undefined,
        draftedBy: session.sub,
        approvalDirection: direction,
        status: "PENDING_APPROVAL",
      },
    });

    // Notify the approver
    const emp = await app.prisma.employee.findUnique({ where: { id: body.empId } });
    if (emp?.teamId) {
      const team = await app.prisma.team.findUnique({ where: { id: emp.teamId } });
      const approverEmpId =
        direction === "HR_TO_TL" ? team?.leadEmpId : null; // HR is the global approver, no single inbox
      if (approverEmpId) {
        await notify(app.prisma, {
          empId: approverEmpId,
          category: "KPI",
          title: "New KPI awaiting your approval",
          body: `${session.name} drafted ${body.templateKrn} for ${emp.name}`,
          icon: "send",
          color: "info",
          url: `/kpi-management#approval-queue`,
        });
      }
    }

    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "kpi.assignment.draft",
      target: created.id,
      metadata: { krn: body.templateKrn, empId: body.empId, weight: body.weight },
    });
    await dispatchWebhook(app.prisma, {
      type: "kpi.assignment.created",
      payload: { id: created.id, krn: body.templateKrn, empId: body.empId },
    });
    return created;
  });

  // POST /assignments/:id/approve — TL approves an HR draft (or HR acks a TL draft)
  app.post("/assignments/:id/approve", async (req) => {
    const session = await req.requireRole("ADMIN", "HR", "TL");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const a = await app.prisma.kpiAssignment.findUnique({
      where: { id },
      include: { template: true, employee: true },
    });
    if (!a) throw new NotFoundError("Assignment");
    if (a.status !== "PROGRESS_PENDING_VALIDATION") {
      throw new BadRequestError(`Cannot approve — status is ${a.status}`);
    }

    const updated = await app.prisma.kpiAssignment.update({
      where: { id },
      data:
        a.approvalDirection === "HR_TO_TL"
          ? { status: "ACTIVE", approvedBy: session.sub, approvedAt: new Date() }
          : { status: "ACTIVE", approvedBy: session.sub, approvedAt: new Date() },
    });

    await notify(app.prisma, {
      empId: a.empId,
          category: "KPI",
      title: "New KPI assigned to you",
      body: `${a.template.title} — please review and acknowledge`,
      icon: "trending",
      color: "info",
      url: `/kpis`,
    });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "kpi.assignment.approve",
      target: id,
    });
    return updated;
  });

  // POST /assignments/:id/reject
  app.post("/assignments/:id/reject", async (req) => {
    const session = await req.requireRole("ADMIN", "HR", "TL");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({ note: z.string().optional() }).parse(req.body || {});
    const updated = await app.prisma.kpiAssignment.update({
      where: { id },
      data: { status: "DRAFT", rejectedBy: session.sub, rejectionReason: body.note },
    });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "kpi.assignment.reject",
      target: id,
      note: body.note,
    });
    return updated;
  });

  // POST /assignments/:id/ack — employee acknowledges the assignment
  app.post("/assignments/:id/ack", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const a = await app.prisma.kpiAssignment.findUnique({ where: { id } });
    if (!a) throw new NotFoundError("Assignment");
    if (a.empId !== session.sub) throw new ForbiddenError("Not your KPI");
    // Acknowledgement is recorded in the audit log (and, at cycle level, in
    // KpiAcknowledgement via POST /acknowledgements). The assignment row has
    // no per-row ack timestamp, so we simply confirm and audit here.
    const updated = a;
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "kpi.assignment.ack",
      target: id,
    });
    return updated;
  });

  // POST /assignments/:id/submit-progress — employee submits a current value
  app.post("/assignments/:id/submit-progress", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({ value: z.string().min(1) }).parse(req.body);

    const a = await app.prisma.kpiAssignment.findUnique({
      where: { id },
      include: { template: true },
    });
    if (!a) throw new NotFoundError("Assignment");
    if (a.empId !== session.sub) throw new ForbiddenError("Not your KPI");

    const updated = await app.prisma.kpiAssignment.update({
      where: { id },
      data: {
        currentValue: body.value,
        lastProgressAt: new Date(),
        lastProgressBy: session.sub,
        // Auto-computed KPIs don't need validation; others do
        status: a.template.autoComputed ? "ACTIVE" : "PROGRESS_PENDING_VALIDATION",
      },
    });

    if (!a.template.autoComputed) {
      // Notify the validator (TL by default)
      const emp = await app.prisma.employee.findUnique({
        where: { id: a.empId },
        select: { teamId: true },
      });
      if (emp?.teamId) {
        const team = await app.prisma.team.findUnique({ where: { id: emp.teamId } });
        if (team?.leadEmpId) {
          await notify(app.prisma, {
            empId: team.leadEmpId,
          category: "KPI",
            title: "Progress submitted — please validate",
            body: `${session.name} submitted ${body.value} for ${a.template.title}`,
            icon: "edit",
            color: "info",
          });
        }
      }
    }
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "kpi.assignment.submit_progress",
      target: id,
      metadata: { value: body.value },
    });
    return updated;
  });

  // POST /assignments/:id/validate — TL/PM/HR confirms a submitted value
  app.post("/assignments/:id/validate", async (req) => {
    const session = await req.requireRole("ADMIN", "HR", "TL", "PM");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z
      .object({
        approved: z.boolean(),
        revisedValue: z.string().optional(),
        note: z.string().optional(),
      })
      .parse(req.body);
    const a = await app.prisma.kpiAssignment.findUnique({ where: { id } });
    if (!a) throw new NotFoundError("Assignment");
    const finalValue = body.revisedValue ?? a.currentValue ?? "";
    const updated = await app.prisma.kpiAssignment.update({
      where: { id },
      data: {
        status: "ACTIVE",
        currentValue: body.approved ? finalValue : a.currentValue,
        validatorEmpId: session.sub,
        validatedAt: new Date(),
        validationNote: body.note,
      },
    });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: body.approved ? "kpi.assignment.validate" : "kpi.assignment.revise",
      target: id,
      metadata: { finalValue, note: body.note },
    });
    return updated;
  });

  // ─────────────────────────────────────────────────────────────────────
  //  ACKNOWLEDGEMENTS (employee signs off on their scorecard)
  // ─────────────────────────────────────────────────────────────────────
  app.post("/acknowledgements", async (req) => {
    const session = await req.requireAuth();
    const body = z
      .object({
        cycleId: z.string().min(1),
        signature: z.string().min(1),
        signedVia: z.string().optional(),
      })
      .parse(req.body);

    // Compute totals from the user's active assignments in that cycle
    const assigns = await app.prisma.kpiAssignment.findMany({
      where: { empId: session.sub, cycleId: body.cycleId },
    });
    const ack = await app.prisma.kpiAcknowledgement.upsert({
      where: { empId_cycleId: { empId: session.sub, cycleId: body.cycleId } },
      create: {
        empId: session.sub,
        cycleId: body.cycleId,
        signedAt: new Date(),
        signature: body.signature,
        signedVia: body.signedVia || "portal",
        kpiCount: assigns.length,
        totalWeight: assigns.reduce((s: number, a: { weight: number }) => s + a.weight, 0),
      },
      update: {
        signedAt: new Date(),
        signature: body.signature,
        signedVia: body.signedVia || "portal",
      },
    });
    // Acknowledgement is recorded in KpiAcknowledgement (above); assignments
    // have no per-row ack field, so nothing further to stamp here.
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "kpi.acknowledge",
      target: `${session.sub}:${body.cycleId}`,
      note: `Signed ${assigns.length} KPIs`,
    });
    return ack;
  });

  // ─────────────────────────────────────────────────────────────────────
  //  HISTORY
  // ─────────────────────────────────────────────────────────────────────
  app.get("/history", async (req) => {
    const session = await req.requireAuth();
    const qs = z
      .object({ empId: z.string().optional(), cycleId: z.string().optional() })
      .parse(req.query);

    const where: Record<string, unknown> = {};
    if (qs.cycleId) where.cycleId = qs.cycleId;
    if (qs.empId) {
      where.empId = qs.empId;
    } else if (!session.roles.some((r) => ["ADMIN", "HR"].includes(r))) {
      // Default: own history only
      where.empId = session.sub;
    }
    return app.prisma.kpiCycleHistory.findMany({
      where,
      orderBy: { cycleId: "asc" },
    });
  });
};

export default kpiRoutes;
