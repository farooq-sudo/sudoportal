// ────────────────────────────────────────────────────────────────────────────
//  src/services/entra.service.ts
//  Microsoft Entra ID (Azure AD) OpenID Connect flow.
//
//  Login flow:
//    1. Browser hits  /api/v1/auth/login
//       → we build a Microsoft login URL with state+nonce, redirect.
//    2. User signs in at https://login.microsoftonline.com/.../oauth2/v2.0/authorize
//    3. Microsoft redirects back to ENTRA_REDIRECT_URI?code=...&state=...
//    4. /api/v1/auth/callback exchanges the code for tokens via MSAL.
//    5. We fetch the user's group memberships from Graph, derive roles,
//       upsert the Employee record, and return a SUDO JWT.
//
//  The MSAL token cache lives in process memory. For multi-instance
//  deployments we'd swap this for a Redis-backed cache (see MSAL docs).
// ────────────────────────────────────────────────────────────────────────────

import * as msal from "@azure/msal-node";
import { config } from "../config.js";
import { ServiceUnavailableError, UnauthorizedError } from "../utils/errors.js";
import type { SudoRole } from "../plugins/auth.js";

let cachedClient: msal.ConfidentialClientApplication | null = null;

/**
 * Build (and memoize) the MSAL confidential client. Returns null if Entra
 * is not configured — callers should treat that as a 503.
 */
function getMsalClient(): msal.ConfidentialClientApplication {
  if (!config.isEntraConfigured) {
    throw new ServiceUnavailableError(
      "Entra ID",
      "ENTRA_TENANT_ID / ENTRA_CLIENT_ID / ENTRA_CLIENT_SECRET not configured"
    );
  }
  if (cachedClient) return cachedClient;

  cachedClient = new msal.ConfidentialClientApplication({
    auth: {
      clientId: config.ENTRA_CLIENT_ID,
      authority: `https://login.microsoftonline.com/${config.ENTRA_TENANT_ID}`,
      clientSecret: config.ENTRA_CLIENT_SECRET,
    },
    system: {
      loggerOptions: {
        loggerCallback: () => {}, // silence MSAL — we log via Fastify
        piiLoggingEnabled: false,
        logLevel: msal.LogLevel.Warning,
      },
    },
  });
  return cachedClient;
}

/** State store for the OAuth state parameter (in-memory, ephemeral). */
const oauthStateStore = new Map<string, { createdAt: number; redirectTo?: string }>();
const STATE_TTL_MS = 10 * 60 * 1000;

function pruneStates() {
  const now = Date.now();
  for (const [k, v] of oauthStateStore) {
    if (now - v.createdAt > STATE_TTL_MS) oauthStateStore.delete(k);
  }
}

/**
 * Build the Microsoft login redirect URL the browser should be sent to.
 */
export async function buildLoginUrl(redirectTo?: string): Promise<string> {
  const client = getMsalClient();
  pruneStates();
  const state = crypto.randomUUID();
  oauthStateStore.set(state, { createdAt: Date.now(), redirectTo });

  const authUrl = await client.getAuthCodeUrl({
    scopes: config.M365_GRAPH_SCOPES.split(" ").filter(Boolean),
    redirectUri: config.ENTRA_REDIRECT_URI,
    state,
    prompt: "select_account",
  });
  return authUrl;
}

export interface EntraUserProfile {
  entraObjectId: string;
  upn: string;
  email: string;
  displayName: string;
  groupIds: string[];
  accessToken: string;
  idToken: string;
  expiresOn: Date | null;
}

/**
 * Exchange an OAuth authorization code for tokens, then fetch the user's
 * basic profile and group memberships from Microsoft Graph.
 */
export async function exchangeCodeForProfile(
  code: string,
  state: string
): Promise<{ profile: EntraUserProfile; redirectTo?: string }> {
  const client = getMsalClient();
  const stashed = oauthStateStore.get(state);
  if (!stashed) {
    throw new UnauthorizedError("Invalid or expired auth state");
  }
  oauthStateStore.delete(state);

  const result = await client.acquireTokenByCode({
    code,
    scopes: config.M365_GRAPH_SCOPES.split(" ").filter(Boolean),
    redirectUri: config.ENTRA_REDIRECT_URI,
  });

  if (!result || !result.account) {
    throw new UnauthorizedError("Token exchange failed");
  }

  // Fetch group memberships using the access token. We use a direct fetch
  // here rather than the Graph SDK because we already have the bearer
  // token in hand.
  const groupIds = await fetchUserGroupIds(result.accessToken);

  return {
    profile: {
      entraObjectId: result.account.homeAccountId.split(".")[0]!,
      upn: result.account.username,
      email: result.account.username, // Entra often uses UPN as email
      displayName: result.account.name || result.account.username,
      groupIds,
      accessToken: result.accessToken,
      idToken: result.idToken,
      expiresOn: result.expiresOn,
    },
    redirectTo: stashed.redirectTo,
  };
}

/**
 * Fetch the Graph IDs of every group the signed-in user is a transitive
 * member of. Used to derive SUDO roles.
 */
async function fetchUserGroupIds(accessToken: string): Promise<string[]> {
  try {
    // POST /me/getMemberGroups returns just the GUIDs (transitive).
    const res = await fetch(
      "https://graph.microsoft.com/v1.0/me/getMemberGroups",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ securityEnabledOnly: false }),
      }
    );
    if (!res.ok) {
      return [];
    }
    const data = (await res.json()) as { value?: string[] };
    return data.value || [];
  } catch {
    return [];
  }
}

/**
 * Map the user's Entra group memberships to SUDO roles using the
 * ENTRA_GROUP_* config. A user belongs to multiple roles if they're in
 * multiple groups — that's the multi-role case (HR + Employee, etc.).
 */
export function deriveRolesFromGroups(groupIds: string[]): SudoRole[] {
  const roles = new Set<SudoRole>();
  const mapping: Array<[string, SudoRole]> = [
    [config.entraRoleGroups.admin, "ADMIN"],
    [config.entraRoleGroups.hr, "HR"],
    [config.entraRoleGroups.pm, "PM"],
    [config.entraRoleGroups.tl, "TL"],
    [config.entraRoleGroups.employee, "EMPLOYEE"],
    [config.entraRoleGroups.finance, "FINANCE"],
    [config.entraRoleGroups.recruiter, "RECRUITER"],
    [config.entraRoleGroups.auditor, "AUDITOR"],
  ];
  for (const [groupId, role] of mapping) {
    if (groupId && groupIds.includes(groupId)) roles.add(role);
  }
  // Every authenticated tenant user is implicitly an Employee — gives them
  // access to their own portal even if no role groups have been wired up.
  roles.add("EMPLOYEE");
  return Array.from(roles);
}

/** Build the post-logout redirect URL to send the browser to. */
export function buildLogoutUrl(): string {
  if (!config.isEntraConfigured) return config.ENTRA_POST_LOGOUT_REDIRECT_URI;
  const tenantId = config.ENTRA_TENANT_ID;
  const postLogout = encodeURIComponent(config.ENTRA_POST_LOGOUT_REDIRECT_URI);
  return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/logout?post_logout_redirect_uri=${postLogout}`;
}
