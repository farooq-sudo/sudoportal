// ════════════════════════════════════════════════════════════════════════════
//  src/routes/m365.routes.ts
//  Proxy endpoints for Microsoft Graph calls. The frontend never talks to
//  Graph directly; we use the user's cached access token (from EntraIdentity)
//  to make the call on their behalf.
//
//  Token lifetime caveat: the access token cached at login expires ~1 hour
//  later. If the call returns 401, the route surfaces a clear message asking
//  the user to refresh / re-sign-in. Full silent refresh requires storing the
//  refresh token too — a future enhancement.
// ════════════════════════════════════════════════════════════════════════════

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import {
  createCalendarEvent,
  listDirectoryUsers,
  sendMail,
} from "../services/graph.service.js";
import { audit } from "../services/audit.service.js";
import { ServiceUnavailableError } from "../utils/errors.js";

/**
 * Get the cached access token for the current user, or surface a clear error
 * when the cache is empty / expired.
 */
async function getGraphTokenForUser(
  app: FastifyInstance,
  empId: string
): Promise<string> {
  const ident = await app.prisma.entraIdentity.findUnique({
    where: { empId },
  });
  if (!ident?.tokenCacheRef) {
    throw new ServiceUnavailableError(
      "Microsoft Graph",
      "No cached Entra access token. Sign out and sign back in to refresh."
    );
  }
  return ident.tokenCacheRef;
}

const m365Routes: FastifyPluginAsync = async (app: FastifyInstance) => {

  // ── Connection status / diagnostics ────────────────────────────────────
  // Admin-only. Lets you verify Entra is correctly configured WITHOUT having
  // to complete a full sign-in. Returns which env vars are set (never their
  // values) + which role-group mappings are wired.
  app.get("/status", async (req) => {
    await req.requireRole("ADMIN");
    const { config } = await import("../config.js");
    const groups = config.entraRoleGroups;
    return {
      entraConfigured: config.isEntraConfigured,
      checks: {
        tenantId: !!config.ENTRA_TENANT_ID,
        clientId: !!config.ENTRA_CLIENT_ID,
        clientSecret: !!config.ENTRA_CLIENT_SECRET,
        redirectUri: config.ENTRA_REDIRECT_URI,
        graphScopes: config.M365_GRAPH_SCOPES,
      },
      roleGroupsMapped: {
        ADMIN: !!groups.admin,
        HR: !!groups.hr,
        PM: !!groups.pm,
        TL: !!groups.tl,
        EMPLOYEE: !!groups.employee,
        FINANCE: !!groups.finance,
        RECRUITER: !!groups.recruiter,
        AUDITOR: !!groups.auditor,
      },
      hint: config.isEntraConfigured
        ? "Entra is configured. Test a full login at /api/v1/auth/login"
        : "Set ENTRA_TENANT_ID, ENTRA_CLIENT_ID, ENTRA_CLIENT_SECRET in .env",
    };
  });
  // Current user's cached groups
  app.get("/me/groups", async (req) => {
    const session = await req.requireAuth();
    const ident = await app.prisma.entraIdentity.findUnique({
      where: { empId: session.sub },
    });
    return {
      groupIds: ident?.groupIdsJson ?? [],
      lastSignInAt: ident?.lastSignInAt ?? null,
    };
  });

  // Directory listing (admin) — pulls every user from Entra
  app.get("/users", async (req) => {
    const session = await req.requireRole("ADMIN");
    const token = await getGraphTokenForUser(app, session.sub);
    const users = await listDirectoryUsers(token);
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "m365.users.list", category: "system",
      metadata: { count: users.length },
    });
    return { items: users, total: users.length };
  });

  // Create calendar event (with optional Teams meeting)
  app.post("/calendar-event", async (req) => {
    const session = await req.requireAuth();
    const body = z.object({
      subject: z.string().min(1),
      bodyHtml: z.string().default(""),
      startUtc: z.string(),
      endUtc: z.string(),
      attendeeUpns: z.array(z.string()),
      online: z.boolean().default(true),
    }).parse(req.body);
    const token = await getGraphTokenForUser(app, session.sub);
    const result = await createCalendarEvent(token, body);
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "m365.calendar.create", target: result.id, targetType: "CalendarEvent",
      category: "system",
      metadata: { subject: body.subject, online: body.online },
    });
    return result;
  });

  // Send mail as the current user
  app.post("/send-mail", async (req) => {
    const session = await req.requireAuth();
    const body = z.object({
      to: z.array(z.string().email()),
      cc: z.array(z.string().email()).optional(),
      subject: z.string().min(1),
      bodyHtml: z.string().min(1),
      saveToSentItems: z.boolean().default(true),
    }).parse(req.body);
    const token = await getGraphTokenForUser(app, session.sub);
    await sendMail(token, body);
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "m365.mail.send", category: "system",
      metadata: { to: body.to, subject: body.subject },
    });
    return { sent: true };
  });

  // Manual sync — refresh the current user's directory metadata from Graph.
  // Useful when an admin updates a user in Entra and wants the portal to pick
  // it up immediately rather than waiting for the nightly sync.
  app.post("/sync/me", async (req) => {
    const session = await req.requireAuth();
    const token = await getGraphTokenForUser(app, session.sub);
    // Use listDirectoryUsers and filter — overkill for one user, but reuses
    // the same validated code path. A future optimisation could call /me directly.
    const all = await listDirectoryUsers(token);
    const me = all.find((u) => u.entraObjectId === session.entraObjectId);
    if (!me) {
      throw new ServiceUnavailableError(
        "Microsoft Graph", "Current user not found in directory listing"
      );
    }
    await app.prisma.employee.update({
      where: { id: session.sub },
      data: {
        name: me.displayName,
        title: me.title ?? undefined,
      },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "m365.sync.self", category: "system",
    });
    return { synced: true, user: me };
  });
};

export default m365Routes;
