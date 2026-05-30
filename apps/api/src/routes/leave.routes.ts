// ────────────────────────────────────────────────────────────────────────────
//  src/routes/leave.routes.ts
//
//  Leave management — policies, balances, requests, approvals.
//
//  Workflow (matches the prototype):
//    1. Employee POST /requests with {leaveType, startDate, endDate, reason}
//       → status DRAFT, balance.pending incremented
//    2. Employee POST /requests/:id/submit
//       → status PENDING_PM (or first role in approval chain)
//    3. Each approver in chain calls POST /requests/:id/approve | /reject
//       → advances to next role, or finalises
//    4. On APPROVED: balance.used += days, balance.pending -= days
//       On REJECTED: balance.pending -= days
//    5. Employee can withdraw a pending request via POST /requests/:id/withdraw
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";
import { notify } from "../services/notification.service.js";
import { BadRequestError, ForbiddenError, NotFoundError, ConflictError } from "../utils/errors.js";

const LeaveTypeEnum = z.enum([
  "ANNUAL", "SICK", "COMPASSIONATE", "HAJJ", "MATERNITY", "PATERNITY",
  "STUDY", "UNPAID", "WORK_FROM_HOME", "BUSINESS_TRAVEL", "COMP_OFF",
]);

function daysBetween(start: Date, end: Date, isHalfDay: boolean): number {
  const ms = end.getTime() - start.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
  return isHalfDay ? 0.5 : days;
}

const leaveRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // ══════════════════════════════════════════════════════════════════════════
  //  LEAVE POLICIES — HR/Admin manage
  // ══════════════════════════════════════════════════════════════════════════

  app.get("/policies", async (req) => {
    await req.requireAuth();
    const policies = await app.prisma.leavePolicy.findMany({
      where: { active: true },
      orderBy: [{ leaveType: "asc" }, { createdAt: "desc" }],
    });
    return { items: policies };
  });

  app.post("/policies", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const body = z.object({
      name: z.string().min(1),
      leaveType: LeaveTypeEnum,
      entitlementDays: z.number().min(0).max(365),
      appliesToDepartmentId: z.string().optional(),
      appliesToTeamId: z.string().optional(),
      carryOverDays: z.number().min(0).default(0),
      paid: z.boolean().default(true),
      approvalChain: z.array(z.string()).default(["PM", "HR"]),
      minNoticeDays: z.number().int().min(0).default(0),
      maxConsecutiveDays: z.number().int().min(1).optional(),
    }).parse(req.body);

    const policy = await app.prisma.leavePolicy.create({ data: body });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "leave.policy.create", target: policy.id,
      metadata: { leaveType: body.leaveType, entitlementDays: body.entitlementDays },
    });
    return policy;
  });

  app.patch("/policies/:id", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      name: z.string().optional(),
      entitlementDays: z.number().min(0).optional(),
      carryOverDays: z.number().min(0).optional(),
      paid: z.boolean().optional(),
      approvalChain: z.array(z.string()).optional(),
      active: z.boolean().optional(),
    }).parse(req.body);

    const policy = await app.prisma.leavePolicy.update({ where: { id }, data: body });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "leave.policy.update", target: id, metadata: body,
    });
    return policy;
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  LEAVE BALANCES — self-read; HR can read anyone
  // ══════════════════════════════════════════════════════════════════════════

  app.get("/balances/:empId", async (req) => {
    const session = await req.requireAuth();
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const qs = z.object({ year: z.coerce.number().int().optional() }).parse(req.query);

    const isSelf = session.sub === empId;
    const isPrivileged = session.roles.some((r) => r === "ADMIN" || r === "HR");
    const isManager = await app.prisma.employee.findFirst({
      where: { id: empId, managerEmpId: session.sub },
    });
    if (!isSelf && !isPrivileged && !isManager) {
      throw new ForbiddenError("You can only view your own leave balances");
    }

    const year = qs.year ?? new Date().getFullYear();
    const balances = await app.prisma.leaveBalance.findMany({
      where: { empId, year },
      orderBy: { leaveType: "asc" },
    });
    return { empId, year, balances };
  });

  // HR-only: manually correct a balance
  app.patch("/balances/:empId/:leaveType", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const { empId, leaveType } = z.object({
      empId: z.string(),
      leaveType: LeaveTypeEnum,
    }).parse(req.params);
    const body = z.object({
      year: z.number().int(),
      entitled: z.number().min(0).optional(),
      carriedOver: z.number().min(0).optional(),
      notes: z.string().optional(),
    }).parse(req.body);

    const existing = await app.prisma.leaveBalance.findUnique({
      where: { empId_year_leaveType: { empId, year: body.year, leaveType } },
    });

    const entitled = body.entitled ?? existing?.entitled ?? 0;
    const carriedOver = body.carriedOver ?? existing?.carriedOver ?? 0;
    const used = existing?.used ?? 0;
    const pending = existing?.pending ?? 0;
    const remaining = Number(entitled) + Number(carriedOver) - Number(used) - Number(pending);

    const balance = await app.prisma.leaveBalance.upsert({
      where: { empId_year_leaveType: { empId, year: body.year, leaveType } },
      create: {
        empId, year: body.year, leaveType,
        entitled, carriedOver, used, pending, remaining,
        notes: body.notes,
      },
      update: {
        entitled, carriedOver, remaining,
        notes: body.notes,
        lastRecalcAt: new Date(),
      },
    });

    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "leave.balance.correct",
      target: empId, targetType: "Employee",
      metadata: { leaveType, year: body.year, before: existing, after: balance },
    });
    return balance;
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  LEAVE REQUESTS
  // ══════════════════════════════════════════════════════════════════════════

  // List: employees see own; managers see direct reports; HR/Admin see all
  app.get("/requests", async (req) => {
    const session = await req.requireAuth();
    const qs = z.object({
      empId: z.string().optional(),
      status: z.string().optional(),
      pendingMine: z.coerce.boolean().optional(),
      limit: z.coerce.number().int().min(1).max(200).default(50),
      offset: z.coerce.number().int().min(0).default(0),
    }).parse(req.query);

    const isPrivileged = session.roles.some((r) => r === "ADMIN" || r === "HR");
    const where: Record<string, unknown> = {};

    if (qs.pendingMine) {
      where.currentApprover = session.sub;
    } else if (qs.empId) {
      if (qs.empId !== session.sub && !isPrivileged) {
        const isManager = await app.prisma.employee.findFirst({
          where: { id: qs.empId, managerEmpId: session.sub },
        });
        if (!isManager) throw new ForbiddenError("You can only see your own requests");
      }
      where.empId = qs.empId;
    } else if (!isPrivileged) {
      where.empId = session.sub;
    }

    if (qs.status) where.status = qs.status;

    const [items, total] = await Promise.all([
      app.prisma.leaveRequest.findMany({
        where, take: qs.limit, skip: qs.offset,
        orderBy: { createdAt: "desc" },
        include: { approvals: { orderBy: { step: "asc" } } },
      }),
      app.prisma.leaveRequest.count({ where }),
    ]);
    return { items, total };
  });

  // Create a leave request (DRAFT)
  app.post("/requests", async (req) => {
    const session = await req.requireAuth();
    const body = z.object({
      empId: z.string().optional(),
      leaveType: LeaveTypeEnum,
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
      isHalfDay: z.boolean().default(false),
      halfDaySession: z.enum(["MORNING", "AFTERNOON"]).optional(),
      reason: z.string().optional(),
      attachmentUrls: z.array(z.string().url()).default([]),
    }).parse(req.body);

    const empId = body.empId || session.sub;
    if (empId !== session.sub && !session.roles.includes("ADMIN") && !session.roles.includes("HR")) {
      throw new ForbiddenError("You can only create requests for yourself");
    }
    if (body.endDate < body.startDate) {
      throw new BadRequestError("endDate must be on or after startDate");
    }

    const days = daysBetween(body.startDate, body.endDate, body.isHalfDay);

    // Find applicable policy → determines approval chain
    const policy = await app.prisma.leavePolicy.findFirst({
      where: { leaveType: body.leaveType, active: true },
      orderBy: { createdAt: "desc" },
    });
    const chain = policy?.approvalChain ?? ["PM", "HR"];

    const request = await app.prisma.leaveRequest.create({
      data: {
        empId,
        leaveType: body.leaveType,
        startDate: body.startDate,
        endDate: body.endDate,
        days,
        isHalfDay: body.isHalfDay,
        halfDaySession: body.halfDaySession,
        reason: body.reason,
        status: "DRAFT",
        attachmentUrls: body.attachmentUrls,
        approvalChain: chain,
        approvals: {
          create: chain.map((role: string, i: number) => ({
            step: i + 1,
            approverRole: role,
          })),
        },
      },
      include: { approvals: true },
    });

    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "leave.request.create", target: request.id,
      metadata: { leaveType: body.leaveType, days },
    });
    return request;
  });

  // Submit a draft for approval
  app.post("/requests/:id/submit", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const request = await app.prisma.leaveRequest.findUnique({
      where: { id }, include: { approvals: { orderBy: { step: "asc" } } },
    });
    if (!request) throw new NotFoundError("Leave request");
    if (request.empId !== session.sub) {
      throw new ForbiddenError("You can only submit your own requests");
    }
    if (request.status !== "DRAFT") {
      throw new ConflictError(`Cannot submit a request in status ${request.status}`);
    }

    // Resolve current approver from the chain's first step
    const firstStep = request.approvals[0];
    let approverEmpId: string | null = null;
    if (firstStep?.approverRole === "PM") {
      const emp = await app.prisma.employee.findUnique({ where: { id: request.empId } });
      approverEmpId = emp?.pmEmpId ?? null;
    } else if (firstStep?.approverRole === "TL") {
      const emp = await app.prisma.employee.findUnique({ where: { id: request.empId } });
      approverEmpId = emp?.managerEmpId ?? null;
    } else if (firstStep?.approverRole === "HR") {
      const hrs = await app.prisma.employee.findMany({
        where: { roles: { has: "HR" }, active: true },
        take: 1,
      });
      approverEmpId = hrs[0]?.id ?? null;
    }

    const statusForRole = (role: string) =>
      role === "PM" ? "PENDING_PM" : role === "TL" ? "PENDING_TL" : "PENDING_HR";

    const updated = await app.prisma.leaveRequest.update({
      where: { id },
      data: {
        status: statusForRole(firstStep?.approverRole ?? "HR"),
        submittedAt: new Date(),
        currentApprover: approverEmpId,
        approvals: firstStep ? {
          update: {
            where: { id: firstStep.id },
            data: { approverEmpId },
          },
        } : undefined,
      },
      include: { approvals: { orderBy: { step: "asc" } } },
    });

    // Increment pending in balance
    const year = request.startDate.getFullYear();
    await app.prisma.leaveBalance.upsert({
      where: { empId_year_leaveType: { empId: request.empId, year, leaveType: request.leaveType } },
      create: {
        empId: request.empId, year, leaveType: request.leaveType,
        entitled: 0, carriedOver: 0, used: 0, pending: request.days,
        remaining: -Number(request.days),
      },
      update: {
        pending: { increment: Number(request.days) },
        remaining: { decrement: Number(request.days) },
      },
    });

    if (approverEmpId) {
      await notify(app.prisma, {
        empId: approverEmpId,
        category: "LEAVE",
        title: `Leave request awaiting your approval`,
        body: `${session.name} requested ${request.days} day(s) of ${request.leaveType}`,
        url: `/leave/requests/${request.id}`,
      });
    }

    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "leave.request.submit", target: id,
    });
    return updated;
  });

  // Approve or reject
  app.post("/requests/:id/decide", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      decision: z.enum(["APPROVED", "REJECTED"]),
      comment: z.string().optional(),
    }).parse(req.body);

    const request = await app.prisma.leaveRequest.findUnique({
      where: { id }, include: { approvals: { orderBy: { step: "asc" } } },
    });
    if (!request) throw new NotFoundError("Leave request");
    if (request.currentApprover !== session.sub &&
        !session.roles.includes("ADMIN")) {
      throw new ForbiddenError("This request is not awaiting your approval");
    }

    const pendingStep = request.approvals.find((a: { id: string; step: number; approverRole: string; approverEmpId: string | null; decision: string | null; decidedAt: Date | null; comment: string | null }) => a.decision === null);
    if (!pendingStep) throw new ConflictError("No pending approval step");

    await app.prisma.leaveApproval.update({
      where: { id: pendingStep.id },
      data: {
        approverEmpId: session.sub,
        decision: body.decision,
        decidedAt: new Date(),
        comment: body.comment,
      },
    });

    const year = request.startDate.getFullYear();

    if (body.decision === "REJECTED") {
      await app.prisma.leaveRequest.update({
        where: { id },
        data: {
          status: "REJECTED",
          finalisedAt: new Date(),
          currentApprover: null,
        },
      });
      // Release pending from balance
      await app.prisma.leaveBalance.update({
        where: { empId_year_leaveType: { empId: request.empId, year, leaveType: request.leaveType } },
        data: {
          pending: { decrement: Number(request.days) },
          remaining: { increment: Number(request.days) },
        },
      });
      await notify(app.prisma, {
        empId: request.empId,
        category: "LEAVE",
        title: "Leave request rejected",
        body: body.comment ?? "Your leave request was rejected.",
        url: `/leave/requests/${id}`,
      });
    } else {
      // Find next pending step
      const remaining = request.approvals
        .filter((a: { id: string; step: number; approverRole: string; approverEmpId: string | null; decision: string | null; decidedAt: Date | null; comment: string | null }) => a.id !== pendingStep.id && a.decision === null)
        .sort((a: {step:number}, b: {step:number}) => a.step - b.step);
      const nextStep = remaining[0];

      if (nextStep) {
        // Advance to next approver
        let nextApproverId: string | null = null;
        if (nextStep.approverRole === "TL") {
          const emp = await app.prisma.employee.findUnique({ where: { id: request.empId } });
          nextApproverId = emp?.managerEmpId ?? null;
        } else if (nextStep.approverRole === "PM") {
          const emp = await app.prisma.employee.findUnique({ where: { id: request.empId } });
          nextApproverId = emp?.pmEmpId ?? null;
        } else if (nextStep.approverRole === "HR") {
          const hrs = await app.prisma.employee.findMany({
            where: { roles: { has: "HR" }, active: true }, take: 1,
          });
          nextApproverId = hrs[0]?.id ?? null;
        }
        const statusForRole = (role: string) =>
          role === "PM" ? "PENDING_PM" : role === "TL" ? "PENDING_TL" : "PENDING_HR";

        await app.prisma.leaveRequest.update({
          where: { id },
          data: {
            status: statusForRole(nextStep.approverRole),
            currentApprover: nextApproverId,
          },
        });
        await app.prisma.leaveApproval.update({
          where: { id: nextStep.id },
          data: { approverEmpId: nextApproverId },
        });

        if (nextApproverId) {
          await notify(app.prisma, {
            empId: nextApproverId,
            category: "LEAVE",
            title: "Leave request awaiting your approval",
            body: `${request.empId}'s leave needs your decision (escalated from ${pendingStep.approverRole})`,
            url: `/leave/requests/${id}`,
          });
        }
      } else {
        // Final approval
        await app.prisma.leaveRequest.update({
          where: { id },
          data: {
            status: "APPROVED",
            finalisedAt: new Date(),
            currentApprover: null,
          },
        });
        // Move from pending to used
        await app.prisma.leaveBalance.update({
          where: { empId_year_leaveType: { empId: request.empId, year, leaveType: request.leaveType } },
          data: {
            pending: { decrement: Number(request.days) },
            used: { increment: Number(request.days) },
          },
        });
        await notify(app.prisma, {
          empId: request.empId,
          category: "LEAVE",
          title: "Leave request approved",
          body: `Your ${request.leaveType} for ${request.days} day(s) was approved.`,
          url: `/leave/requests/${id}`,
        });
      }
    }

    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: `leave.request.${body.decision.toLowerCase()}`, target: id,
      metadata: { comment: body.comment, step: pendingStep.step },
    });

    const updated = await app.prisma.leaveRequest.findUnique({
      where: { id }, include: { approvals: { orderBy: { step: "asc" } } },
    });
    return updated;
  });

  // Withdraw an in-flight request
  app.post("/requests/:id/withdraw", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const request = await app.prisma.leaveRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundError("Leave request");
    if (request.empId !== session.sub) {
      throw new ForbiddenError("You can only withdraw your own requests");
    }
    if (request.status === "APPROVED" || request.status === "REJECTED") {
      throw new ConflictError("Cannot withdraw a finalised request");
    }

    await app.prisma.leaveRequest.update({
      where: { id },
      data: {
        status: "WITHDRAWN",
        cancelledAt: new Date(),
        currentApprover: null,
      },
    });

    // Release pending if it was tracked
    if (request.status !== "DRAFT") {
      const year = request.startDate.getFullYear();
      await app.prisma.leaveBalance.update({
        where: { empId_year_leaveType: { empId: request.empId, year, leaveType: request.leaveType } },
        data: {
          pending: { decrement: Number(request.days) },
          remaining: { increment: Number(request.days) },
        },
      });
    }

    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "leave.request.withdraw", target: id,
    });
    return { ok: true };
  });
};

export default leaveRoutes;
