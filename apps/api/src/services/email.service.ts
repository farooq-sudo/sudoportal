// ════════════════════════════════════════════════════════════════════════════
//  src/services/email.service.ts
//  SMTP email transport via nodemailer.
//
//  Usage:
//    await sendEmail({
//      to: "alice@example.com",
//      subject: "Your leave request was approved",
//      html: "<p>...</p>",
//    });
//
//  Configuration via env (see .env.example):
//    SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_SECURE
//
//  If SMTP_HOST is empty, emails are logged to console and return success
//  (useful for dev without an SMTP server).
//
//  For Microsoft 365 outbound mail with user impersonation, use Graph's
//  sendMail instead (see graph.service.ts). This module is for system mail
//  (password resets, scheduled notifications) sent from a service mailbox.
// ════════════════════════════════════════════════════════════════════════════

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { config } from "../config.js";
import { ExternalServiceError } from "../utils/errors.js";

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (transporter) return transporter;
  if (!config.SMTP_HOST) return null;
  transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_SECURE,
    auth: config.SMTP_USER && config.SMTP_PASS
      ? { user: config.SMTP_USER, pass: config.SMTP_PASS }
      : undefined,
    pool: true,
    maxConnections: 5,
  });
  return transporter;
}

export interface SendEmailInput {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  html: string;
  text?: string;             // optional plaintext fallback (auto-generated from html if absent)
  from?: string;             // override SMTP_FROM
  replyTo?: string;
}

export interface SendEmailResult {
  messageId: string;
  delivered: boolean;       // false when SMTP not configured and we just logged
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const t = getTransporter();
  if (!t) {
    // No SMTP configured — log and pretend success. Wire SMTP in production.
    // eslint-disable-next-line no-console
    console.log("[email:DRY-RUN]", {
      to: input.to, subject: input.subject, htmlLen: input.html.length,
    });
    return { messageId: `dry-run-${Date.now()}`, delivered: false };
  }
  try {
    const info = await t.sendMail({
      from: input.from || config.SMTP_FROM,
      to: input.to,
      cc: input.cc,
      bcc: input.bcc,
      subject: input.subject,
      html: input.html,
      text: input.text ?? stripHtml(input.html),
      replyTo: input.replyTo,
    });
    return { messageId: info.messageId, delivered: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new ExternalServiceError("SMTP", msg);
  }
}

/**
 * Quick health check — verifies SMTP credentials by attempting a connection.
 * Returns false when SMTP is unconfigured or the server is unreachable.
 */
export async function verifyEmailTransport(): Promise<boolean> {
  const t = getTransporter();
  if (!t) return false;
  try {
    await t.verify();
    return true;
  } catch {
    return false;
  }
}

/** Minimal HTML → text for the plaintext fallback. Not a full sanitiser. */
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
