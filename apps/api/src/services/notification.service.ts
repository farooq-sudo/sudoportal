// ────────────────────────────────────────────────────────────────────────────
//  src/services/notification.service.ts
//  Writes to the Notification table (in-portal bell badge) and optionally
//  fans out to Slack + email. Email and Slack fanout are best-effort —
//  failures here MUST NOT block the underlying mutation.
// ────────────────────────────────────────────────────────────────────────────

import type { PrismaClient } from "@prisma/client";
import { config } from "../config.js";
import { sendEmail } from "./email.service.js";

export interface NotificationInput {
  empId?: string | null;        // null = broadcast / no target user
  category: "KPI" | "TRAINING" | "ONBOARDING" | "PROBATION" | "LEAVE"
          | "RECOGNITION" | "ANNOUNCEMENT" | "SYSTEM" | "DOCUMENT" | "FEEDBACK";
  title: string;
  body: string;
  icon?: string;
  color?: "info" | "warn" | "danger" | "ok";
  url?: string;
  payload?: Record<string, unknown>;
  // Best-effort outbound channels
  sendSlack?: boolean;
  sendEmail?: boolean;
  emailTo?: string;             // if sendEmail and recipient differs from empId's email
}

export async function notify(
  prisma: PrismaClient,
  input: NotificationInput
): Promise<void> {
  await prisma.notification.create({
    data: {
      empId: input.empId || null,
      category: input.category,
      channel: "IN_APP",
      title: input.title,
      body: input.body,
      icon: input.icon,
      color: input.color || "info",
      url: input.url,
      payload: input.payload as object | undefined,
    },
  });

  // Best-effort Slack fanout
  if (input.sendSlack && config.SLACK_WEBHOOK_URL) {
    try {
      await fetch(config.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `*${input.title}*\n${input.body}`,
        }),
      });
    } catch {
      // intentionally swallowed — notification was persisted, that's enough
    }
  }

  // Best-effort email fanout via SMTP. Looks up recipient address by empId
  // unless an explicit emailTo is provided.
  if (input.sendEmail) {
    try {
      let to = input.emailTo;
      if (!to && input.empId) {
        const emp = await prisma.employee.findUnique({
          where: { id: input.empId },
          select: { email: true, workEmail: true },
        });
        to = emp?.workEmail || emp?.email || undefined;
      }
      if (to) {
        await sendEmail({
          to,
          subject: input.title,
          html: `<p>${input.body}</p>${input.url ? `<p><a href="${input.url}">Open in portal →</a></p>` : ""}`,
        });
      }
    } catch {
      // Best-effort — DB notification is the source of truth
    }
  }
}
