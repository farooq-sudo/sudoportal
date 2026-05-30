// ────────────────────────────────────────────────────────────────────────────
//  src/services/webhook.service.ts
//  Outbound webhooks. On significant events (KPI assigned, probation
//  decision, etc.) we POST a signed JSON payload to every configured
//  WebhookEndpoint subscribed to that event. STUB for now — dispatch loop
//  is sketched but the HTTP delivery is left for the next iteration.
// ────────────────────────────────────────────────────────────────────────────

import crypto from "node:crypto";
import type { PrismaClient } from "@prisma/client";
import { config } from "../config.js";

export interface WebhookEvent {
  type: string;                       // "kpi.assignment.created", "probation.decision"
  payload: Record<string, unknown>;
}

/**
 * Enqueue a webhook event. Looks up every active endpoint subscribed to
 * `event.type` and creates a WebhookDelivery row. A separate background
 * worker (not yet wired) actually performs the HTTP POSTs with retries
 * and exponential backoff.
 */
export async function dispatchWebhook(
  prisma: PrismaClient,
  event: WebhookEvent
): Promise<void> {
  const endpoints = await prisma.webhookEndpoint.findMany({
    where: {
      active: true,
      events: { has: event.type },
    },
  });
  if (endpoints.length === 0) return;

  await prisma.$transaction(
    endpoints.map((ep: { id: string }) =>
      prisma.webhookDelivery.create({
        data: {
          endpointId: ep.id,
          event: event.type,
          payload: event.payload as object,
          status: "pending",
          attempts: 0,
        },
      })
    )
  );
}

/**
 * Compute the HMAC-SHA256 signature for an outbound webhook body. Sent in
 * the X-SUDO-Signature header; receivers MUST verify before trusting the
 * payload.
 */
export function signPayload(rawBody: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
}

/**
 * Verify an INBOUND webhook signature. Used by /webhooks/inbound to
 * authenticate posts from external systems (e.g. ODOO).
 */
export function verifyInboundSignature(
  rawBody: string,
  signatureHeader: string | undefined
): boolean {
  if (!signatureHeader || !config.WEBHOOK_SIGNING_SECRET) return false;
  const expected = signPayload(rawBody, config.WEBHOOK_SIGNING_SECRET);
  // Constant-time comparison
  if (signatureHeader.length !== expected.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(signatureHeader),
    Buffer.from(expected)
  );
}
