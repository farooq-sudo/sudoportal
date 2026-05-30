// ────────────────────────────────────────────────────────────────────────────
//  src/routes/system.routes.ts
//  System-level admin: notification templates, scheduled jobs, backups,
//  integration sync logs, onboarding plans.
//  Admin-only (some endpoints HR-readable).
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";
import { serializeBackup } from "../utils/serializers.js";

const sysRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // ═══════════════════════════════════════════════════════════════════════
  //  NOTIFICATION TEMPLATES
  // ═══════════════════════════════════════════════════════════════════════
  app.get("/notification-templates", async (req) => {
    await req.requireRole("ADMIN", "HR");
    const items = await app.prisma.notificationTemplate.findMany({
      where: { active: true },
      orderBy: { id: "asc" },
    });
    return { items };
  });

  app.post("/notification-templates", async (req) => {
    const session = await req.requireRole("ADMIN");
    const body = z.object({
      id: z.string(),
      name: z.string(),
      category: z.enum(["KPI", "TRAINING", "ONBOARDING", "PROBATION", "LEAVE", "RECOGNITION", "ANNOUNCEMENT", "SYSTEM", "DOCUMENT", "FEEDBACK"]),
      channels: z.array(z.enum(["IN_APP", "EMAIL", "SLACK", "TEAMS", "SMS"])).default(["IN_APP"]),
      subjectTemplate: z.string().optional(),
      bodyTemplate: z.string(),
      icon: z.string().optional(),
      color: z.string().optional(),
    }).parse(req.body);
    const t = await app.prisma.notificationTemplate.upsert({
      where: { id: body.id }, create: body, update: body,
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "template.upsert", target: body.id, targetType: "NotificationTemplate",
      category: "system",
    });
    return t;
  });

  // ═══════════════════════════════════════════════════════════════════════
  //  SCHEDULED JOBS
  // ═══════════════════════════════════════════════════════════════════════
  app.get("/jobs", async (req) => {
    await req.requireRole("ADMIN", "AUDITOR");
    const qs = z.object({
      kind: z.string().optional(),
      status: z.string().optional(),
      limit: z.coerce.number().int().min(1).max(500).default(100),
    }).parse(req.query);
    const where: Record<string, unknown> = {};
    if (qs.kind) where.kind = qs.kind;
    if (qs.status) where.status = qs.status;
    const items = await app.prisma.scheduledJob.findMany({
      where, take: qs.limit,
      orderBy: { runAt: "desc" },
    });
    return { items };
  });

  app.post("/jobs", async (req) => {
    const session = await req.requireRole("ADMIN");
    const body = z.object({
      kind: z.string(),
      runAt: z.coerce.date().default(() => new Date()),
      scheduleCron: z.string().optional(),
      payload: z.record(z.unknown()).optional(),
      maxAttempts: z.number().int().min(1).max(10).default(3),
    }).parse(req.body);
    const j = await app.prisma.scheduledJob.create({
      data: { ...body, payload: body.payload as object | undefined, status: "pending" },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "job.queue", target: j.id, targetType: "ScheduledJob",
      category: "system",
      metadata: { kind: body.kind },
    });
    return j;
  });

  app.post("/jobs/:id/retry", async (req) => {
    const session = await req.requireRole("ADMIN");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const j = await app.prisma.scheduledJob.update({
      where: { id },
      data: { status: "pending", runAt: new Date(), lastError: null },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "job.retry", target: id, targetType: "ScheduledJob",
      category: "system",
    });
    return j;
  });

  // ═══════════════════════════════════════════════════════════════════════
  //  BACKUPS
  // ═══════════════════════════════════════════════════════════════════════
  app.get("/backups", async (req) => {
    await req.requireRole("ADMIN", "AUDITOR");
    const items = await app.prisma.backupRecord.findMany({
      orderBy: { startedAt: "desc" }, take: 100,
    });
    return { items: items.map(serializeBackup) };
  });

  app.post("/backups", async (req) => {
    const session = await req.requireRole("ADMIN");
    // Manually trigger a backup
    const body = z.object({
      type: z.enum(["MANUAL", "PRE_MIGRATION"]).default("MANUAL"),
      retentionDays: z.number().int().min(1).max(365).default(30),
    }).parse(req.body);

    const b = await app.prisma.backupRecord.create({
      data: {
        type: body.type,
        storageRef: `manual/${new Date().toISOString()}`,
        status: "running",
        retentionDays: body.retentionDays,
        triggeredBy: session.sub,
      },
    });
    // Schedule a job to actually run the backup
    await app.prisma.scheduledJob.create({
      data: {
        kind: "db.backup",
        runAt: new Date(),
        payload: { backupId: b.id, type: body.type } as object,
        status: "pending",
      },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "backup.trigger", target: b.id, targetType: "BackupRecord",
      category: "system", severity: "security",
    });
    return b;
  });

  // ═══════════════════════════════════════════════════════════════════════
  //  INTEGRATION SYNC LOGS
  // ═══════════════════════════════════════════════════════════════════════
  app.get("/sync-logs", async (req) => {
    await req.requireRole("ADMIN", "AUDITOR");
    const qs = z.object({
      integrationId: z.string().optional(),
      status: z.string().optional(),
      limit: z.coerce.number().int().min(1).max(500).default(100),
    }).parse(req.query);
    const where: Record<string, unknown> = {};
    if (qs.integrationId) where.integrationId = qs.integrationId;
    if (qs.status) where.status = qs.status;
    const items = await app.prisma.integrationSyncLog.findMany({
      where, take: qs.limit,
      orderBy: { startedAt: "desc" },
      include: { integration: { select: { id: true, name: true } } },
    });
    return { items };
  });

  // Manually trigger a sync for one integration
  app.post("/integrations/:id/sync", async (req) => {
    const session = await req.requireRole("ADMIN");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const job = await app.prisma.scheduledJob.create({
      data: {
        kind: "integration.sync",
        runAt: new Date(),
        payload: { integrationId: id } as object,
        status: "pending",
      },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "integration.sync_now", target: id, targetType: "Integration",
      category: "system",
    });
    return { jobId: job.id, integrationId: id };
  });

  // ═══════════════════════════════════════════════════════════════════════
  //  ONBOARDING PLANS — plan-level metadata
  // ═══════════════════════════════════════════════════════════════════════
  app.get("/onboarding-plan/:empId", async (req) => {
    const session = await req.requireAuth();
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const isSelf = session.sub === empId;
    const isPriv = session.roles.some((r) => r === "ADMIN" || r === "HR");
    if (!isSelf && !isPriv) throw new Error("forbidden");
    const plan = await app.prisma.onboardingPlan.findUnique({ where: { empId } });
    return plan;
  });

  app.put("/onboarding-plan/:empId", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const body = z.object({
      targetCompletionAt: z.coerce.date().optional(),
      progressPct: z.number().int().min(0).max(100).optional(),
      status: z.string().optional(),
      assignedBuddyEmpId: z.string().optional(),
      notes: z.string().optional(),
    }).parse(req.body);
    const plan = await app.prisma.onboardingPlan.upsert({
      where: { empId },
      create: { empId, ...body },
      update: body,
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "onboarding.plan.update", target: empId, targetType: "Employee",
      category: "hr",
    });
    return plan;
  });
};

export default sysRoutes;
