// ────────────────────────────────────────────────────────────────────────────
//  src/routes/employees.routes.ts
//  CRUD on employees. Read scopes by role:
//    - ADMIN / HR: see everyone
//    - TL: see your direct reports (teamId match, teamRole === MEMBER)
//    - PM: see anyone you've worked with (same project) — TODO when projects
//          model lands; for now PMs see everyone
//    - EMPLOYEE: only themselves
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";
import { NotFoundError, ForbiddenError } from "../utils/errors.js";
import { serializeEmployee } from "../utils/serializers.js";

const employeeRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // ── LIST employees ────────────────────────────────────────────────────
  app.get("/", async (req) => {
    const session = await req.requireAuth();
    const qs = z
      .object({
        teamId: z.string().optional(),
        status: z.string().optional(),
        search: z.string().optional(),
        limit: z.coerce.number().int().min(1).max(500).default(100),
        offset: z.coerce.number().int().min(0).default(0),
      })
      .parse(req.query);

    const where: Record<string, unknown> = {};
    if (qs.teamId) where.teamId = qs.teamId;
    if (qs.status) where.status = qs.status;
    if (qs.search) {
      where.OR = [
        { name: { contains: qs.search, mode: "insensitive" } },
        { email: { contains: qs.search, mode: "insensitive" } },
        { title: { contains: qs.search, mode: "insensitive" } },
      ];
    }

    // Apply scope
    const isPrivileged = session.roles.some((r) =>
      ["ADMIN", "HR", "PM"].includes(r)
    );
    if (!isPrivileged) {
      if (session.roles.includes("TL")) {
        // TL sees their team. Look up their team via DB.
        const me = await app.prisma.employee.findUnique({
          where: { id: session.sub },
          select: { teamId: true },
        });
        where.teamId = me?.teamId || "__none__";
      } else {
        // Plain employees see only themselves
        where.id = session.sub;
      }
    }

    const [rows, total] = await Promise.all([
      app.prisma.employee.findMany({
        where,
        include: {
          team: { select: { id: true, name: true, short: true } },
          department: { select: { id: true, name: true } },
          manager: { select: { id: true, name: true } },
        },
        orderBy: { name: "asc" },
        take: qs.limit,
        skip: qs.offset,
      }),
      app.prisma.employee.count({ where }),
    ]);
    return {
      rows: rows.map((r: (typeof rows)[number]) => serializeEmployee(r)),
      total, limit: qs.limit, offset: qs.offset,
    };
  });

  // ── GET single employee ───────────────────────────────────────────────
  app.get("/:id", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const isPrivileged = session.roles.some((r) => ["ADMIN", "HR", "PM"].includes(r));
    if (!isPrivileged && session.sub !== id) {
      // TL can read their direct reports; check that
      if (session.roles.includes("TL")) {
        const target = await app.prisma.employee.findUnique({
          where: { id },
          select: { teamId: true },
        });
        const me = await app.prisma.employee.findUnique({
          where: { id: session.sub },
          select: { teamId: true },
        });
        if (!target || !me || target.teamId !== me.teamId) {
          throw new ForbiddenError("You can only view your team");
        }
      } else {
        throw new ForbiddenError("You can only view your own profile");
      }
    }

    const emp = await app.prisma.employee.findUnique({
      where: { id },
      include: { team: true },
    });
    if (!emp) throw new NotFoundError("Employee");
    return emp;
  });

  // ── UPDATE employee (Admin / HR) ─────────────────────────────────────
  app.patch("/:id", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z
      .object({
        name: z.string().min(1).optional(),
        title: z.string().optional(),
        status: z
          .enum(["PROSPECT", "ONBOARDING", "PROBATION", "CONFIRMED", "ON_LEAVE", "SUSPENDED", "OFFBOARDING", "TERMINATED"])
          .optional(),
        teamId: z.string().nullable().optional(),
        teamRole: z.enum(["LEAD", "MANAGER", "MEMBER", "HR_BUSINESS_PARTNER"]).nullable().optional(),
        managerEmpId: z.string().nullable().optional(),
        roles: z.array(z.enum(["ADMIN", "HR", "PM", "TL", "EMPLOYEE", "FINANCE", "RECRUITER", "AUDITOR"])).optional(),
      })
      .parse(req.body);

    const updated = await app.prisma.employee.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.teamId !== undefined ? { teamId: body.teamId } : {}),
        ...(body.teamRole !== undefined ? { teamRole: body.teamRole } : {}),
        ...(body.managerEmpId !== undefined ? { managerEmpId: body.managerEmpId } : {}),
        ...(body.roles !== undefined ? { roles: body.roles } : {}),
      },
    });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "employee.update",
      target: id,
      metadata: body as Record<string, unknown>,
    });
    return updated;
  });
  // ── UPDATE profile photo ──────────────────────────────────────────────
  // Anyone can update their OWN photo. Admin/HR can update anyone's.
  // Body: { photoDataUrl: "data:image/png;base64,..." } or { photoUrl: "https://..." }
  app.patch("/:id/photo", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);

    // Permission: must be self OR Admin/HR
    const isSelf = session.sub === id;
    const isPrivileged = session.roles.some((r) => r === "ADMIN" || r === "HR");
    if (!isSelf && !isPrivileged) {
      throw new ForbiddenError("You can only change your own profile photo");
    }

    const body = z
      .object({
        photoDataUrl: z
          .string()
          .regex(
            /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/,
            "photoDataUrl must be a data:image/png|jpeg|jpg|webp|gif;base64,... URI"
          )
          .optional(),
        photoUrl: z.string().url().optional(),
      })
      .refine(
        (v) => !!v.photoDataUrl !== !!v.photoUrl,
        "Provide exactly one of photoDataUrl or photoUrl"
      )
      .parse(req.body);

    const value = body.photoDataUrl ?? body.photoUrl!;

    // Hard ceiling — 2MB data URI (~1.5MB binary). Larger should go to S3/CDN
    // and the client should PATCH with photoUrl instead.
    if (value.length > 2_000_000) {
      throw new ForbiddenError(
        "Photo too large (max 2MB inline). Upload to storage first, then PATCH with photoUrl."
      );
    }

    const updated = await app.prisma.employee.update({
      where: { id },
      data: { photoUrl: value },
      select: { id: true, photoUrl: true, updatedAt: true },
    });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "employee.photo.update",
      target: id,
      metadata: { source: body.photoDataUrl ? "upload" : "url", bytes: value.length },
    });
    return updated;
  });

  // ── DELETE profile photo (revert to initials fallback) ────────────────
  app.delete("/:id/photo", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const isSelf = session.sub === id;
    const isPrivileged = session.roles.some((r) => r === "ADMIN" || r === "HR");
    if (!isSelf && !isPrivileged) {
      throw new ForbiddenError("You can only remove your own profile photo");
    }

    const updated = await app.prisma.employee.update({
      where: { id },
      data: { photoUrl: null },
      select: { id: true, photoUrl: true },
    });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "employee.photo.delete",
      target: id,
    });
    return updated;
  });
};

export default employeeRoutes;
