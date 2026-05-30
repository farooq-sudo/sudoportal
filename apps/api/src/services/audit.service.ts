// ────────────────────────────────────────────────────────────────────────────
//  src/services/audit.service.ts
//  Append-only audit log. Every mutation in the system should call audit().
//  Reads via the /audit endpoint (Admin only).
// ────────────────────────────────────────────────────────────────────────────

import type { PrismaClient } from "@prisma/client";

export interface AuditEntry {
  actorId: string | null;        // null = system
  actorName: string;             // denormalized for fast list reads
  actorIpAddress?: string;
  actorUserAgent?: string;
  action: string;                // e.g. "kpi.draft", "leave.request.approve"
  category?: string;             // e.g. "kpi", "leave", "hr"
  target?: string;               // ID of the affected entity
  targetType?: string;           // model name, e.g. "LeaveRequest"
  note?: string;
  metadata?: Record<string, unknown>;
  severity?: "info" | "warn" | "security";
}

export async function audit(prisma: PrismaClient, entry: AuditEntry): Promise<void> {
  await prisma.auditLog.create({
    data: {
      actorId: entry.actorId,
      actorName: entry.actorName,
      actorIpAddress: entry.actorIpAddress,
      actorUserAgent: entry.actorUserAgent,
      action: entry.action,
      category: entry.category ?? entry.action.split(".")[0],
      target: entry.target,
      targetType: entry.targetType,
      note: entry.note,
      metadata: (entry.metadata as object | undefined) ?? undefined,
      severity: entry.severity ?? "info",
    },
  });
}
