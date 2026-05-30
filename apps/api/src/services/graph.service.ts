// ────────────────────────────────────────────────────────────────────────────
//  src/services/graph.service.ts
//  Wrapper for ongoing Microsoft Graph calls (calendar, mail, user sync).
//
//  These functions take an access token + parameters and return typed data.
//  Right now most call bodies are TODO stubs that throw — once the tenant is
//  live, fill them in against the real Graph endpoints. The shapes are
//  designed so callers don't have to change.
// ────────────────────────────────────────────────────────────────────────────

import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch"; // Graph SDK requires global fetch in older Node
import { ServiceUnavailableError } from "../utils/errors.js";

/**
 * Build a Graph client authenticated with a delegated user access token.
 * Used for calls made on behalf of a signed-in user (calendar, send mail).
 */
export function graphClientFor(accessToken: string): Client {
  return Client.init({
    authProvider: (done) => done(null, accessToken),
    defaultVersion: "v1.0",
  });
}

// ── User directory sync ────────────────────────────────────────────────────

export interface DirectoryUser {
  entraObjectId: string;
  upn: string;
  email: string;
  displayName: string;
  title: string | null;
  department: string | null;
  manager: string | null;          // UPN of manager if available
  disabledAt: string | null;
}

/**
 * Pull all users from the tenant directory. Used by the nightly Entra sync
 * job to keep the Employee table in step with the source of truth.
 *
 * Requires User.Read.All application permission (admin-consented).
 */
export async function listDirectoryUsers(
  accessToken: string
): Promise<DirectoryUser[]> {
  const client = graphClientFor(accessToken);
  const select = "id,userPrincipalName,mail,displayName,jobTitle,department,accountEnabled";
  const out: DirectoryUser[] = [];

  let response: { value: GraphUser[]; ["@odata.nextLink"]?: string } = await client
    .api(`/users`)
    .select(select)
    .top(999)
    .get();

  while (true) {
    for (const u of response.value) {
      out.push({
        entraObjectId: u.id,
        upn: u.userPrincipalName ?? "",
        email: u.mail ?? u.userPrincipalName ?? "",
        displayName: u.displayName ?? "",
        title: u.jobTitle ?? null,
        department: u.department ?? null,
        manager: null, // populated below if requested
        disabledAt: u.accountEnabled === false ? new Date().toISOString() : null,
      });
    }
    if (!response["@odata.nextLink"]) break;
    response = await client.api(response["@odata.nextLink"]).get();
  }
  return out;
}

interface GraphUser {
  id: string;
  userPrincipalName?: string;
  mail?: string;
  displayName?: string;
  jobTitle?: string;
  department?: string;
  accountEnabled?: boolean;
}

// ── Calendar / Teams meetings ──────────────────────────────────────────────

export interface CalendarEventInput {
  subject: string;
  bodyHtml: string;
  startUtc: string;       // ISO 8601
  endUtc: string;
  attendeeUpns: string[]; // user@domain.com
  online?: boolean;       // create Teams meeting
}

export interface CalendarEventResult {
  id: string;
  webLink: string;
  joinUrl?: string;
}

/**
 * Create a calendar event for the signed-in user. If `online: true`, includes a
 * Teams join link via the onlineMeeting property.
 */
export async function createCalendarEvent(
  accessToken: string,
  input: CalendarEventInput
): Promise<CalendarEventResult> {
  const client = graphClientFor(accessToken);
  const body = {
    subject: input.subject,
    body: { contentType: "HTML", content: input.bodyHtml },
    start: { dateTime: input.startUtc, timeZone: "UTC" },
    end: { dateTime: input.endUtc, timeZone: "UTC" },
    attendees: input.attendeeUpns.map((upn) => ({
      emailAddress: { address: upn },
      type: "required",
    })),
    isOnlineMeeting: !!input.online,
    onlineMeetingProvider: input.online ? "teamsForBusiness" : undefined,
  };
  const res = (await client.api("/me/events").post(body)) as {
    id: string;
    webLink: string;
    onlineMeeting?: { joinUrl?: string };
  };
  return {
    id: res.id,
    webLink: res.webLink,
    joinUrl: res.onlineMeeting?.joinUrl,
  };
}

// ── Email (outbound) ───────────────────────────────────────────────────────

export interface SendMailInput {
  to: string[];
  cc?: string[];
  subject: string;
  bodyHtml: string;
  saveToSentItems?: boolean;
}

/**
 * Send a notification email from the signed-in user's mailbox. We use this so
 * emails appear to come from the human (e.g. HR sending an onboarding welcome).
 * System-generated emails should use a service mailbox with app permissions.
 */
export async function sendMail(
  accessToken: string,
  input: SendMailInput
): Promise<void> {
  const client = graphClientFor(accessToken);
  await client.api("/me/sendMail").post({
    message: {
      subject: input.subject,
      body: { contentType: "HTML", content: input.bodyHtml },
      toRecipients: input.to.map((address) => ({ emailAddress: { address } })),
      ccRecipients: (input.cc ?? []).map((address) => ({ emailAddress: { address } })),
    },
    saveToSentItems: input.saveToSentItems ?? true,
  });
}

// ── Group membership read (real impl — used at login) ──────────────────────

/**
 * Get the full group membership of a user. Used at login time to refresh
 * role assignments. The /me/getMemberGroups call already happens inline
 * during the token exchange, so this duplicate exists for the "manual
 * sync" admin button later.
 */
export async function fetchTransitiveGroups(
  accessToken: string
): Promise<string[]> {
  const client = graphClientFor(accessToken);
  try {
    const res = (await client
      .api("/me/getMemberGroups")
      .post({ securityEnabledOnly: false })) as { value?: string[] };
    return res.value || [];
  } catch {
    return [];
  }
}

/**
 * Fetch the signed-in user's M365 profile photo and return it as a base64
 * data URI suitable for storing in Employee.photoUrl or for inline rendering.
 *
 * Microsoft Graph's /me/photo/$value returns the binary; we convert it.
 * Most tenants serve up to 648×648 by default. We don't size-down here —
 * the caller may resize before storing.
 *
 * Returns null if the user has no photo set or we can't read it. Never throws.
 */
export async function fetchUserPhoto(
  accessToken: string
): Promise<string | null> {
  const client = graphClientFor(accessToken);
  try {
    const blob = (await client.api("/me/photo/$value").get()) as Blob;
    // The Graph SDK returns a fetch Response.blob() result on browsers
    // and an ArrayBuffer-shaped object on Node. Handle both.
    let buf: Buffer;
    if (typeof (blob as { arrayBuffer?: () => Promise<ArrayBuffer> }).arrayBuffer === "function") {
      const ab = await (blob as { arrayBuffer: () => Promise<ArrayBuffer> }).arrayBuffer();
      buf = Buffer.from(ab);
    } else if (blob instanceof Buffer) {
      buf = blob;
    } else {
      buf = Buffer.from(blob as unknown as ArrayBuffer);
    }
    if (buf.length === 0) return null;
    return `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    // User has no photo, or Graph denied — silent null is the right behaviour
    // because falling back to initials is always acceptable.
    return null;
  }
}
