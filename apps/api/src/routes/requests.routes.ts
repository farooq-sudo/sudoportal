// ────────────────────────────────────────────────────────────────────────────
//  src/routes/requests.routes.ts
//
//  Unified request workflow. One Request row handles every "I'd like X"
//  scenario: profile edits, document requests, reimbursements, asset
//  requests, access requests, training nominations, transfers.
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";
import { notify } from "../services/notification.service.js";
import { ForbiddenError, NotFoundError, ConflictError } from "../utils/errors.js";

const RequestTypeEnum = z.enum([
  "PROFILE_EDIT", "DOCUMENT", "REIMBURSEMENT", "ASSET", "ACCESS",
  "TRAINING_NOMINATION", "TRANSFER", "LEAVE_BALANCE_CORRECTION", "OTHER",
]);

// Default approval chains per type
const DEFAULT_CHAIN: Record<string, string[]> = {
  PROFILE_EDIT: ["HR"],
  DOCUMENT: ["HR"],
  REIMBURSEMENT: ["PM", "FINANCE"],
  ASSET: ["TL", "HR"],
  ACCESS: ["TL", "ADMIN"],
  TRAINING_NOMINATION: ["TL", "HR"],
  TRANSFER: ["TL", "HR"],
  LEAVE_BALANCE_CORRECTION: ["HR"],
  OTHER: ["HR"],
};

const reqRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get("/", async (req) => {
    const session = await req.requireAuth();
    const qs = z.object({
      empId: z.string().optional(),
      type: RequestTypeEnum.optional(),
      status: z.string().optional(),
      pendingMine: z.coerce.boolean().optional(),
      limit: z.coerce.number().int().min(1).max(200).default(50),
      offset: z.coerce.number().int().min(0).default(0),
    }).parse(req.query);

    const isPrivileged = session.roles.some((r) => r === "ADMIN" || r === "HR");
    const where: Record<string, unknown> = {};

    if (qs.pendingMine) {
      where.approvals = {
        some: { approverEmpId: session.sub, decision: null },
      };
    } else if (qs.empId) {
      if (qs.empId !== session.sub && !isPrivileged) {
        throw new ForbiddenError("You can only view your own requests");
      }
      where.empId = qs.empId;
    } else if (!isPrivileged) {
      where.empId = session.sub;
    }
    if (qs.type) where.type = qs.type;
    if (qs.status) where.status = qs.status;

    const [items, total] = await Promise.all([
      app.prisma.request.findMany({
        where, take: qs.limit, skip: qs.offset,
        orderBy: { createdAt: "desc" },
        include: { approvals: { orderBy: { step: "asc" } } },
      }),
      app.prisma.request.count({ where }),
    ]);
    return { items, total };
  });

  app.get("/:id", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const r = await app.prisma.request.findUnique({
      where: { id },
      include: {
        approvals: { orderBy: { step: "asc" } },
        employee: { select: { id: true, name: true, email: true, photoUrl: true } },
      },
    });
    if (!r) throw new NotFoundError("Request");
    const isPrivileged = session.roles.some((s) => s === "ADMIN" || s === "HR");
    if (r.empId !== session.sub && !isPrivileged) {
      // Is the caller currently an approver?
      const isApprover = r.approvals.some((a: { id: string; step: number; approverRole: string; approverEmpId: string | null; decision: string | null; decidedAt: Date | null; comment: string | null }) => a.approverEmpId === session.sub);
      if (!isApprover) throw new ForbiddenError();
    }
    return r;
  });

  app.post("/", async (req) => {
    const session = await req.requireAuth();
    const body = z.object({
      type: RequestTypeEnum,
      title: z.string().min(1).max(200),
      body: z.string().optional(),
      dataJson: z.record(z.unknown()).optional(),
      amount: z.number().optional(),
      currency: z.string().optional(),
      attachmentUrls: z.array(z.string().url()).default([]),
      approvalChain: z.array(z.string()).optional(),
    }).parse(req.body);

    const chain = body.approvalChain ?? DEFAULT_CHAIN[body.type] ?? ["HR"];

    const r = await app.prisma.request.create({
      data: {
        empId: session.sub,
        type: body.type,
        status: "DRAFT",
        title: body.title,
        body: body.body,
        dataJson: body.dataJson as object | undefined,
        amount: body.amount,
        currency: body.currency,
        attachmentUrls: body.attachmentUrls,
        approvals: {
          create: chain.map((role, i) => ({ step: i + 1, approverRole: role })),
        },
      },
      include: { approvals: { orderBy: { step: "asc" } } },
    });

    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "request.create", target: r.id, targetType: "Request",
      metadata: { type: body.type },
    });
    return r;
  });

  app.post("/:id/submit", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const r = await app.prisma.request.findUnique({
      where: { id }, include: { approvals: { orderBy: { step: "asc" } } },
    });
    if (!r) throw new NotFoundError("Request");
    if (r.empId !== session.sub) throw new ForbiddenError();
    if (r.status !== "DRAFT") throw new ConflictError(`Cannot submit a ${r.status} request`);

    const firstStep = r.approvals[0];
    let approverEmpId: string | null = null;
    if (firstStep) {
      approverEmpId = await resolveApprover(app, r.empId, firstStep.approverRole);
    }

    await app.prisma.request.update({
      where: { id },
      data: { status: "PENDING_APPROVAL", submittedAt: new Date() },
    });
    if (firstStep) {
      await app.prisma.requestApproval.update({
        where: { id: firstStep.id },
        data: { approverEmpId },
      });
    }

    if (approverEmpId) {
      await notify(app.prisma, {
        empId: approverEmpId,
        category: "SYSTEM",
        title: `${r.type} request awaiting approval`,
        body: r.title,
        url: `/requests/${id}`,
      });
    }

    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "request.submit", target: id, targetType: "Request",
    });
    return { ok: true };
  });

  app.post("/:id/decide", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      decision: z.enum(["APPROVED", "REJECTED"]),
      comment: z.string().optional(),
    }).parse(req.body);

    const r = await app.prisma.request.findUnique({
      where: { id }, include: { approvals: { orderBy: { step: "asc" } } },
    });
    if (!r) throw new NotFoundError("Request");

    const pending = r.approvals.find((a: { id: string; step: number; approverRole: string; approverEmpId: string | null; decision: string | null; decidedAt: Date | null; comment: string | null }) => a.decision === null);
    if (!pending) throw new ConflictError("No pending approval step");
    if (pending.approverEmpId !== session.sub && !session.roles.includes("ADMIN")) {
      throw new ForbiddenError("This request is not awaiting your approval");
    }

    await app.prisma.requestApproval.update({
      where: { id: pending.id },
      data: {
        approverEmpId: session.sub,
        decision: body.decision,
        decidedAt: new Date(),
        comment: body.comment,
      },
    });

    if (body.decision === "REJECTED") {
      await app.prisma.request.update({
        where: { id },
        data: { status: "REJECTED", closedAt: new Date(), closedBy: session.sub, closeReason: body.comment },
      });
      await notify(app.prisma, {
        empId: r.empId,
        category: "SYSTEM",
        title: `Request rejected: ${r.title}`,
        body: body.comment ?? "Your request was rejected.",
        url: `/requests/${id}`,
      });
    } else {
      const remaining = r.approvals
        .filter((a: { id: string; step: number; approverRole: string; approverEmpId: string | null; decision: string | null; decidedAt: Date | null; comment: string | null }) => a.id !== pending.id && a.decision === null)
        .sort((a: {step:number}, b: {step:number}) => a.step - b.step);
      const next = remaining[0];
      if (next) {
        const approverEmpId = await resolveApprover(app, r.empId, next.approverRole);
        await app.prisma.requestApproval.update({
          where: { id: next.id }, data: { approverEmpId },
        });
        await notify(app.prisma, {
          empId: approverEmpId,
          category: "SYSTEM",
          title: `Request awaiting your approval`,
          body: r.title,
          url: `/requests/${id}`,
        });
      } else {
        await app.prisma.request.update({
          where: { id },
          data: { status: "APPROVED", completedAt: new Date() },
        });
        await notify(app.prisma, {
          empId: r.empId,
          category: "SYSTEM",
          title: `Request approved: ${r.title}`,
          body: "Your request was approved.",
          url: `/requests/${id}`,
        });
      }
    }

    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: `request.${body.decision.toLowerCase()}`,
      target: id, targetType: "Request",
      metadata: { comment: body.comment },
    });
    return { ok: true };
  });

  app.post("/:id/cancel", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const r = await app.prisma.request.findUnique({ where: { id } });
    if (!r) throw new NotFoundError("Request");
    if (r.empId !== session.sub) throw new ForbiddenError();
    if (r.status === "APPROVED" || r.status === "REJECTED") {
      throw new ConflictError("Cannot cancel a finalised request");
    }
    await app.prisma.request.update({
      where: { id },
      data: { status: "CANCELLED", closedAt: new Date(), closedBy: session.sub },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "request.cancel", target: id, targetType: "Request",
    });
    return { ok: true };
  });
};

async function resolveApprover(
  app: FastifyInstance, empId: string, role: string
): Promise<string | null> {
  if (role === "TL") {
    const emp = await app.prisma.employee.findUnique({ where: { id: empId } });
    return emp?.managerEmpId ?? null;
  }
  if (role === "PM") {
    const emp = await app.prisma.employee.findUnique({ where: { id: empId } });
    return emp?.pmEmpId ?? null;
  }
  if (role === "HR" || role === "ADMIN" || role === "FINANCE") {
    const u = await app.prisma.employee.findFirst({
      where: { roles: { has: role as "HR" | "ADMIN" | "FINANCE" }, active: true },
    });
    return u?.id ?? null;
  }
  return null;
}

export default reqRoutes;
