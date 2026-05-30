// ────────────────────────────────────────────────────────────────────────────
//  src/routes/auth.routes.ts
//  /auth/login     — redirect to Microsoft login
//  /auth/callback  — handle OAuth code exchange, mint SUDO JWT, redirect back
//  /auth/me        — return current session info
//  /auth/logout    — clear local session and redirect to Microsoft logout
//  /auth/dev-login — DEV ONLY: mint a session for a seeded user without Entra
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import {
  buildLoginUrl,
  buildLogoutUrl,
  deriveRolesFromGroups,
  exchangeCodeForProfile,
} from "../services/entra.service.js";
import { fetchUserPhoto } from "../services/graph.service.js";
import { audit } from "../services/audit.service.js";
import { config } from "../config.js";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "../utils/errors.js";
import type { SudoRole } from "../plugins/auth.js";

const authRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // ── /auth/login ───────────────────────────────────────────────────────
  app.get("/login", async (req, reply) => {
    // Accept both ?redirectTo= (used by the frontend client) and ?redirect=
    // (legacy / curl) so the post-login return path is never lost.
    const q = req.query as { redirect?: string; redirectTo?: string };
    const redirectTo =
      typeof q.redirectTo === "string" ? q.redirectTo
      : typeof q.redirect === "string" ? q.redirect
      : undefined;
    const url = await buildLoginUrl(redirectTo);
    return reply.redirect(url);
  });

  // ── /auth/callback ────────────────────────────────────────────────────
  app.get("/callback", async (req, reply) => {
    const qs = z
      .object({
        code: z.string().min(1),
        state: z.string().min(1),
        error: z.string().optional(),
        error_description: z.string().optional(),
      })
      .safeParse(req.query);

    if (!qs.success) {
      throw new BadRequestError("Invalid callback parameters");
    }
    if (qs.data.error) {
      req.log.warn({ err: qs.data.error_description }, "Entra login failed");
      throw new UnauthorizedError(qs.data.error_description || qs.data.error);
    }

    const { profile, redirectTo } = await exchangeCodeForProfile(
      qs.data.code,
      qs.data.state
    );

    // Derive SUDO roles from group membership
    const roles: SudoRole[] = deriveRolesFromGroups(profile.groupIds);

    // Upsert the Employee record. We key on email which is stable across
    // tenant moves. If the user doesn't exist yet, create a stub.
    const employee = await app.prisma.employee.upsert({
      where: { email: profile.email },
      create: {
        id: `EX-${profile.entraObjectId.slice(0, 8).toUpperCase()}`,
        email: profile.email,
        workEmail: profile.email,
        entraObjectId: profile.entraObjectId,
        name: profile.displayName,
        roles,
        status: "CONFIRMED",
      },
      update: {
        entraObjectId: profile.entraObjectId,
        name: profile.displayName,
        roles,
      },
    });

    // Backfill profile photo from Microsoft Graph on first login (or any
    // login where the user has no photo set yet). We never overwrite a
    // user-uploaded photo — if photoUrl is non-null, leave it alone.
    if (!employee.photoUrl) {
      try {
        const photoDataUrl = await fetchUserPhoto(profile.accessToken);
        if (photoDataUrl) {
          await app.prisma.employee.update({
            where: { id: employee.id },
            data: { photoUrl: photoDataUrl },
          });
        }
      } catch (err) {
        // Non-fatal. Sign-in proceeds even if photo fetch fails.
        req.log.warn({ err }, "Failed to fetch M365 photo for " + employee.id);
      }
    }

    // Cache Entra identity metadata + access token for downstream Graph calls.
    // tokenCacheRef holds the access token; tokenExpiresAt lets us refresh
    // before calling Graph. In production, prefer hashing/encrypting the token
    // at rest (e.g. via a KMS key) — for the prototype we store as-is.
    await app.prisma.entraIdentity.upsert({
      where: { empId: employee.id },
      create: {
        empId: employee.id,
        entraObjectId: profile.entraObjectId,
        upn: profile.upn,
        lastSignInAt: new Date(),
        lastSignInIp: req.ip,
        groupIdsJson: profile.groupIds,
        tokenCacheRef: profile.accessToken,
      },
      update: {
        entraObjectId: profile.entraObjectId,
        upn: profile.upn,
        lastSignInAt: new Date(),
        lastSignInIp: req.ip,
        groupIdsJson: profile.groupIds,
        tokenCacheRef: profile.accessToken,
      },
    });

    // Audit
    await audit(app.prisma, {
      actorId: employee.id,
      actorName: employee.name,
      action: "auth.login",
      target: employee.id,
      note: `Signed in via Entra ID (${profile.upn})`,
    });

    // Mint SUDO JWT
    const token = app.issueSession({
      sub: employee.id,
      email: employee.email,
      name: employee.name,
      roles,
      entraObjectId: profile.entraObjectId,
    });

    // If the original /login call passed ?redirectTo=, send the user there
    // with the token as a query param. The frontend auth.js pulls it out,
    // stores it, and strips it from the URL.
    if (redirectTo) {
      const sep = redirectTo.includes("?") ? "&" : "?";
      return reply.redirect(`${redirectTo}${sep}token=${encodeURIComponent(token)}`);
    }

    // No explicit redirect → send to the portal that best fits their role.
    // Order matters: most-privileged landing first.
    const portalFor = (rs: string[]): string => {
      if (rs.includes("ADMIN")) return "/admin/";
      if (rs.includes("HR") || rs.includes("RECRUITER")) return "/hr/";
      if (rs.includes("PM")) return "/pm/";
      if (rs.includes("TL")) return "/team_lead/";
      return "/employee/";
    };
    const landing = portalFor(roles);
    return reply.redirect(`${landing}?token=${encodeURIComponent(token)}`);
  });

  // ── /auth/me ──────────────────────────────────────────────────────────
  app.get("/me", async (req) => {
    const session = await req.requireAuth();
    const emp = await app.prisma.employee.findUnique({
      where: { id: session.sub },
      include: { team: true },
    });
    if (!emp) throw new NotFoundError("Employee");
    return {
      id: emp.id,
      email: emp.email,
      name: emp.name,
      preferredName: emp.preferredName,
      title: emp.title,
      status: emp.status,
      teamId: emp.teamId,
      teamRole: emp.teamRole,
      team: emp.team ? { id: emp.team.id, name: emp.team.name, short: emp.team.short } : null,
      roles: emp.roles,
      managerEmpId: emp.managerEmpId,
      photoUrl: emp.photoUrl,
    };
  });

  // ── /auth/logout ──────────────────────────────────────────────────────
  app.post("/logout", async (req, reply) => {
    try {
      const session = await req.requireAuth();
      await audit(app.prisma, {
        actorId: session.sub,
        actorName: session.name,
        action: "auth.logout",
        target: session.sub,
      });
    } catch {
      // not authenticated — fine, still return logout URL
    }
    return { logoutUrl: buildLogoutUrl() };
  });

  // ── /auth/dev-login ──────────────────────────────────────────────────
  // Lets you sign in as any seeded user without going through Entra. Only
  // active when NODE_ENV !== "production". Useful for local testing of the
  // 5 demo personas (Justine, Khalid, Fatima, Reem, M. Farooq).
  app.post("/dev-login", async (req) => {
    if (config.isProduction) {
      throw new ForbiddenError("dev-login is disabled in production");
    }
    const body = z
      .object({ empId: z.string().min(1) })
      .parse(req.body);
    const emp = await app.prisma.employee.findUnique({ where: { id: body.empId } });
    if (!emp) throw new NotFoundError("Employee");
    const token = app.issueSession({
      sub: emp.id,
      email: emp.email,
      name: emp.name,
      roles: emp.roles as SudoRole[],
    });
    return {
      token,
      user: { id: emp.id, email: emp.email, name: emp.name, roles: emp.roles },
    };
  });
};

export default authRoutes;
