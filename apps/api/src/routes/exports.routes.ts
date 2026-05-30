// ────────────────────────────────────────────────────────────────────────────
//  src/routes/exports.routes.ts
//
//  Data exports. Users (HR / Admin / Auditor) request an export by scope and
//  format; a background worker processes it; the user downloads when ready.
//  Signed URLs expire to limit data leakage.
//
//  This route handles the request lifecycle. The actual export generation
//  is a job kind in ScheduledJob; the worker (deferred) writes the file
//  and updates status to READY.
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";
import { serializeDataExport } from "../utils/serializers.js";
import { notify } from "../services/notification.service.js";
import { ForbiddenError, NotFoundError, ConflictError, BadRequestError } from "../utils/errors.js";

const ScopeEnum = z.enum([
  "EMPLOYEES", "KPIS", "TRAININGS", "AUDIT_LOG", "LEAVE",
  "PAYROLL", "PROJECT_RATINGS", "FULL_TENANT",
]);
const FormatEnum = z.enum(["CSV", "XLSX", "JSON", "PDF"]);

// Who can export what
const SCOPE_PERMISSION: Record<string, string[]> = {
  EMPLOYEES:        ["ADMIN", "HR", "AUDITOR"],
  KPIS:             ["ADMIN", "HR", "AUDITOR"],
  TRAININGS:        ["ADMIN", "HR", "AUDITOR"],
  AUDIT_LOG:        ["ADMIN", "AUDITOR"],
  LEAVE:            ["ADMIN", "HR"],
  PAYROLL:          ["ADMIN", "HR", "FINANCE"],
  PROJECT_RATINGS:  ["ADMIN", "HR"],
  FULL_TENANT:      ["ADMIN"],
};

const exportRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // List my exports (or all if admin)
  app.get("/", async (req) => {
    const session = await req.requireAuth();
    const qs = z.object({
      mineOnly: z.coerce.boolean().default(true),
      status: z.string().optional(),
      limit: z.coerce.number().int().min(1).max(100).default(50),
      offset: z.coerce.number().int().min(0).default(0),
    }).parse(req.query);

    const isAdmin = session.roles.includes("ADMIN");
    const where: Record<string, unknown> = {};
    if (qs.mineOnly || !isAdmin) where.requestedBy = session.sub;
    if (qs.status) where.status = qs.status;

    const [items, total] = await Promise.all([
      app.prisma.dataExport.findMany({
        where, take: qs.limit, skip: qs.offset,
        orderBy: { createdAt: "desc" },
        include: { requester: { select: { id: true, name: true } } },
      }),
      app.prisma.dataExport.count({ where }),
    ]);
    return { items: items.map(serializeDataExport), total };
  });

  // Get one
  app.get("/:id", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const x = await app.prisma.dataExport.findUnique({ where: { id } });
    if (!x) throw new NotFoundError("Data export");
    if (x.requestedBy !== session.sub && !session.roles.includes("ADMIN")) {
      throw new ForbiddenError("You can only see exports you requested");
    }
    return x;
  });

  // Request a new export
  app.post("/", async (req) => {
    const session = await req.requireAuth();
    const body = z.object({
      scope: ScopeEnum,
      format: FormatEnum,
      filtersJson: z.record(z.unknown()).optional(),
      includeFieldsJson: z.array(z.string()).optional(),
    }).parse(req.body);

    const allowedRoles = SCOPE_PERMISSION[body.scope] ?? [];
    if (!session.roles.some((r) => allowedRoles.includes(r))) {
      throw new ForbiddenError(
        `Your role does not allow exporting ${body.scope}. Required: ${allowedRoles.join(" / ")}`
      );
    }
    if (body.scope === "FULL_TENANT" && body.format !== "JSON" && body.format !== "XLSX") {
      throw new BadRequestError("FULL_TENANT exports must be JSON or XLSX");
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const x = await app.prisma.dataExport.create({
      data: {
        requestedBy: session.sub,
        scope: body.scope,
        format: body.format,
        filtersJson: body.filtersJson as object | undefined,
        includeFieldsJson: body.includeFieldsJson as object | undefined,
        status: "REQUESTED",
        expiresAt,
      },
    });

    // Queue a background job to process this export
    await app.prisma.scheduledJob.create({
      data: {
        kind: "data.export",
        runAt: new Date(),
        payload: { exportId: x.id, scope: body.scope, format: body.format } as object,
        status: "pending",
      },
    });

    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "data.export.request", target: x.id, targetType: "DataExport",
      category: "data",
      severity: body.scope === "FULL_TENANT" ? "security" : "info",
      metadata: { scope: body.scope, format: body.format },
    });

    return x;
  });

  // Mark as downloaded (called by frontend after fetching the file)
  app.post("/:id/downloaded", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const x = await app.prisma.dataExport.findUnique({ where: { id } });
    if (!x) throw new NotFoundError("Data export");
    if (x.requestedBy !== session.sub && !session.roles.includes("ADMIN")) {
      throw new ForbiddenError();
    }
    if (x.status !== "READY") {
      throw new ConflictError(`Export is not ready (status: ${x.status})`);
    }

    await app.prisma.dataExport.update({
      where: { id },
      data: { status: "DOWNLOADED", downloadedAt: new Date() },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "data.export.download", target: id, targetType: "DataExport",
      category: "data",
    });
    return { ok: true };
  });

  // Worker callback — typically called by the export worker after writing the file
  app.post("/:id/_complete", async (req) => {
    await req.requireRole("ADMIN");  // service-only in production via internal token
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      fileUrl: z.string().url(),
      fileSizeBytes: z.number().int().min(0).optional(),
      rowCount: z.number().int().min(0).optional(),
    }).parse(req.body);

    const x = await app.prisma.dataExport.update({
      where: { id },
      data: {
        fileUrl: body.fileUrl,
        fileSizeBytes: body.fileSizeBytes,
        rowCount: body.rowCount,
        status: "READY",
        completedAt: new Date(),
      },
    });
    await notify(app.prisma, {
      empId: x.requestedBy,
      category: "SYSTEM",
      title: "Your data export is ready",
      body: `${x.scope} as ${x.format} · ${x.rowCount ?? "?"} rows. Available for 7 days.`,
      url: `/exports/${id}`,
    });
    return x;
  });
};

export default exportRoutes;
