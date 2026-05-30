// ────────────────────────────────────────────────────────────────────────────
//  src/routes/people.routes.ts
//  Recognition wall, feedback sessions, 1:1 notes, badges + awards.
//  Grouped because they're all "people-soft" features used by managers.
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";
import { notify } from "../services/notification.service.js";
import { ForbiddenError, NotFoundError } from "../utils/errors.js";

const peopleRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // ══════════════════════════════════════════════════════════════════════
  //  RECOGNITION WALL
  // ══════════════════════════════════════════════════════════════════════
  app.get("/recognitions", async (req) => {
    await req.requireAuth();
    const qs = z.object({
      receiverEmpId: z.string().optional(),
      giverEmpId: z.string().optional(),
      isPublic: z.coerce.boolean().optional(),
      limit: z.coerce.number().int().min(1).max(100).default(30),
      offset: z.coerce.number().int().min(0).default(0),
    }).parse(req.query);
    const where: Record<string, unknown> = {};
    if (qs.receiverEmpId) where.receiverEmpId = qs.receiverEmpId;
    if (qs.giverEmpId) where.giverEmpId = qs.giverEmpId;
    if (qs.isPublic !== undefined) where.isPublic = qs.isPublic;
    const [items, total] = await Promise.all([
      app.prisma.recognition.findMany({
        where, take: qs.limit, skip: qs.offset,
        orderBy: { givenAt: "desc" },
        include: {
          giver: { select: { id: true, name: true, photoUrl: true } },
          receiver: { select: { id: true, name: true, photoUrl: true } },
        },
      }),
      app.prisma.recognition.count({ where }),
    ]);
    return { items, total };
  });

  app.post("/recognitions", async (req) => {
    const session = await req.requireAuth();
    const body = z.object({
      receiverEmpId: z.string(),
      category: z.string(),  // TEAMWORK, CUSTOMER, INNOVATION
      message: z.string().min(1).max(500),
      points: z.number().int().min(0).max(100).default(0),
      isPublic: z.boolean().default(true),
    }).parse(req.body);
    if (body.receiverEmpId === session.sub) {
      throw new ForbiddenError("You cannot recognise yourself");
    }
    const r = await app.prisma.recognition.create({
      data: { giverEmpId: session.sub, ...body },
      include: {
        giver: { select: { id: true, name: true, photoUrl: true } },
        receiver: { select: { id: true, name: true, photoUrl: true } },
      },
    });
    await notify(app.prisma, {
      empId: body.receiverEmpId,
      category: "RECOGNITION",
      title: `${session.name} recognised you!`,
      body: body.message,
      color: "ok",
      url: `/recognition/${r.id}`,
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "recognition.give", target: body.receiverEmpId, targetType: "Employee",
      category: "people",
    });
    return r;
  });

  // ══════════════════════════════════════════════════════════════════════
  //  FEEDBACK SESSIONS (1:1s, skip-levels, peer)
  // ══════════════════════════════════════════════════════════════════════
  app.get("/feedback-sessions", async (req) => {
    const session = await req.requireAuth();
    const qs = z.object({
      empId: z.string().optional(),
      managerEmpId: z.string().optional(),
      upcoming: z.coerce.boolean().optional(),
      limit: z.coerce.number().int().min(1).max(100).default(50),
    }).parse(req.query);
    const where: Record<string, unknown> = {};
    if (qs.empId) where.empId = qs.empId;
    if (qs.managerEmpId) where.managerEmpId = qs.managerEmpId;
    if (qs.upcoming) where.scheduledAt = { gte: new Date() };

    if (!qs.empId && !qs.managerEmpId) {
      // Default: my sessions (either side)
      where.OR = [{ empId: session.sub }, { managerEmpId: session.sub }];
    }

    const items = await app.prisma.feedbackSession.findMany({
      where, take: qs.limit,
      orderBy: { scheduledAt: "desc" },
      include: {
        employee: { select: { id: true, name: true, photoUrl: true } },
        manager:  { select: { id: true, name: true, photoUrl: true } },
      },
    });
    return { items };
  });

  app.post("/feedback-sessions", async (req) => {
    const session = await req.requireAuth();
    const body = z.object({
      empId: z.string(),
      kind: z.enum(["ONE_ON_ONE", "SKIP_LEVEL", "PEER_FEEDBACK", "PROBATION_CHECKIN", "CYCLE_REVIEW", "EXIT_INTERVIEW"]).default("ONE_ON_ONE"),
      scheduledAt: z.coerce.date(),
      durationMin: z.number().int().min(5).max(180).default(30),
      location: z.string().optional(),
      agenda: z.string().optional(),
    }).parse(req.body);
    // Only managers / HR / PM can schedule 1:1s on others; employees can request their own
    const isPriv = session.roles.some((r) => r === "ADMIN" || r === "HR" || r === "PM" || r === "TL");
    if (!isPriv && body.empId !== session.sub) {
      throw new ForbiddenError();
    }
    const s = await app.prisma.feedbackSession.create({
      data: {
        empId: body.empId,
        managerEmpId: session.sub,
        kind: body.kind,
        scheduledAt: body.scheduledAt,
        durationMin: body.durationMin,
        location: body.location,
        agenda: body.agenda,
      },
    });
    await notify(app.prisma, {
      empId: body.empId,
      category: "FEEDBACK",
      title: `${body.kind.replace("_", " ").toLowerCase()} scheduled with ${session.name}`,
      body: `${body.scheduledAt.toLocaleString()}${body.location ? ` · ${body.location}` : ""}`,
      url: `/feedback/${s.id}`,
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "feedback.schedule", target: s.id, targetType: "FeedbackSession",
    });
    return s;
  });

  app.patch("/feedback-sessions/:id", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const s = await app.prisma.feedbackSession.findUnique({ where: { id } });
    if (!s) throw new NotFoundError("Feedback session");
    if (s.managerEmpId !== session.sub && !session.roles.includes("ADMIN") && !session.roles.includes("HR")) {
      throw new ForbiddenError();
    }
    const body = z.object({
      status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED", "RESCHEDULED", "NO_SHOW"]).optional(),
      scheduledAt: z.coerce.date().optional(),
      outcomeSummary: z.string().optional(),
      privateNotes: z.string().optional(),
      followUpDate: z.coerce.date().optional(),
      completedAt: z.coerce.date().optional(),
    }).parse(req.body);
    const updated = await app.prisma.feedbackSession.update({ where: { id }, data: body });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "feedback.update", target: id, targetType: "FeedbackSession",
    });
    return updated;
  });

  // ── 1:1 NOTES ────────────────────────────────────────────────────────
  app.get("/notes/:subjectEmpId", async (req) => {
    const session = await req.requireAuth();
    const { subjectEmpId } = z.object({ subjectEmpId: z.string() }).parse(req.params);
    // Visibility:
    //   - PRIVATE: only author sees
    //   - SHARED: both author and subject see
    //   - HR_ONLY: HR sees
    const isSelf = session.sub === subjectEmpId;
    const isHR = session.roles.some((r) => r === "ADMIN" || r === "HR");
    const items = await app.prisma.oneOnOneNote.findMany({
      where: {
        subjectEmpId,
        OR: [
          { authorEmpId: session.sub },
          ...(isSelf ? [{ visibility: "SHARED" }] : []),
          ...(isHR ? [{ visibility: "HR_ONLY" }, { visibility: "SHARED" }] : []),
        ],
      },
      orderBy: { createdAt: "desc" },
      include: { author: { select: { id: true, name: true } } },
    });
    return { items };
  });

  app.post("/notes", async (req) => {
    const session = await req.requireAuth();
    const body = z.object({
      sessionId: z.string().optional(),
      subjectEmpId: z.string(),
      visibility: z.enum(["PRIVATE", "SHARED", "HR_ONLY"]).default("PRIVATE"),
      category: z.string().optional(),
      body: z.string().min(1),
      pinned: z.boolean().default(false),
    }).parse(req.body);
    const n = await app.prisma.oneOnOneNote.create({
      data: { authorEmpId: session.sub, ...body },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "note.create", target: body.subjectEmpId, targetType: "Employee",
      metadata: { visibility: body.visibility, category: body.category },
    });
    return n;
  });

  // ══════════════════════════════════════════════════════════════════════
  //  BADGES
  // ══════════════════════════════════════════════════════════════════════
  app.get("/badges", async () => {
    const items = await app.prisma.badge.findMany({
      where: { active: true }, orderBy: { name: "asc" },
    });
    return { items };
  });

  app.post("/badges", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const body = z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().optional(),
      icon: z.string().optional(),
      color: z.string().optional(),
      rarity: z.string().optional(),
      points: z.number().int().default(0),
    }).parse(req.body);
    const b = await app.prisma.badge.upsert({
      where: { id: body.id }, create: body, update: body,
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "badge.upsert", target: body.id, targetType: "Badge",
    });
    return b;
  });

  // Award a badge
  app.post("/badges/:badgeId/award", async (req) => {
    const session = await req.requireAuth();
    const { badgeId } = z.object({ badgeId: z.string() }).parse(req.params);
    const body = z.object({
      empId: z.string(),
      reason: z.string().optional(),
      isPublic: z.boolean().default(true),
    }).parse(req.body);
    // Allowed: ADMIN/HR/PM/TL (or any role specified in badge's grantableByRoles)
    const isPriv = session.roles.some((r) => r === "ADMIN" || r === "HR" || r === "PM" || r === "TL");
    if (!isPriv) throw new ForbiddenError("You cannot award badges");
    const award = await app.prisma.badgeAward.create({
      data: { badgeId, empId: body.empId, awardedBy: session.sub, reason: body.reason, isPublic: body.isPublic },
      include: { badge: true, employee: { select: { id: true, name: true } } },
    });
    await notify(app.prisma, {
      empId: body.empId,
      category: "RECOGNITION",
      title: `You earned the "${award.badge.name}" badge!`,
      body: body.reason ?? "",
      color: "ok",
      url: `/badges`,
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "badge.award", target: body.empId, targetType: "Employee",
      metadata: { badgeId, awardId: award.id },
    });
    return award;
  });

  app.get("/badges/awards/:empId", async (req) => {
    await req.requireAuth();
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const awards = await app.prisma.badgeAward.findMany({
      where: { empId }, orderBy: { awardedAt: "desc" },
      include: { badge: true },
    });
    return { empId, awards };
  });
};

export default peopleRoutes;
