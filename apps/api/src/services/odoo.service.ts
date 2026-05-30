// ════════════════════════════════════════════════════════════════════════════
//  src/services/odoo.service.ts
//  ODOO ERP integration via JSON-RPC at /jsonrpc.
//
//  Authentication: ODOO supports two patterns:
//   - session-cookie auth (login/password — fragile, not used here)
//   - API-key auth (recommended, used here). Generate from ODOO user preferences.
//
//  We use JSON-RPC over HTTPS, model methods called via `execute_kw`.
//  Reference: https://www.odoo.com/documentation/17.0/developer/reference/external_api.html
// ════════════════════════════════════════════════════════════════════════════

import { ServiceUnavailableError, ExternalServiceError } from "../utils/errors.js";
import { config } from "../config.js";

export interface OdooProject {
  id: number;
  name: string;
  customer: string | null;
  managerEmail: string | null;
  startDate: string | null;
  endDate: string | null;
  state: string | null;
  milestonesAdherence: number | null; // 0–100, null when not measurable
}

export interface OdooMilestone {
  id: number;
  projectId: number;
  name: string;
  deadline: string | null;
  completionDate: string | null;
  reached: boolean;
}

export interface OdooTimesheetSummary {
  empEmail: string;
  cycleId: string;
  billableHours: number;
  totalHours: number;
  utilisationPct: number;
}

interface JsonRpcRequest {
  jsonrpc: "2.0";
  method: "call";
  params: {
    service: "object";
    method: "execute_kw";
    args: [
      string,             // db
      number,             // uid (or use API key path below)
      string,             // password / API key
      string,             // model
      string,             // method
      unknown[],          // positional args
      Record<string, unknown>?, // kwargs
    ];
  };
  id: number;
}

interface JsonRpcResponse<T> {
  jsonrpc: "2.0";
  id: number;
  result?: T;
  error?: { code: number; message: string; data?: unknown };
}

function ensureConfigured(): void {
  if (!config.ODOO_BASE_URL || !config.ODOO_DB || !config.ODOO_API_KEY) {
    throw new ServiceUnavailableError(
      "ODOO",
      "ODOO_BASE_URL / ODOO_DB / ODOO_API_KEY not configured"
    );
  }
}

let cachedUid: number | null = null;
let cachedAt = 0;
const UID_CACHE_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Authenticate against ODOO and return the user ID (uid). Cached for 30 minutes
 * because uid rarely changes; the API key is what does the work.
 */
async function authenticate(): Promise<number> {
  ensureConfigured();
  if (cachedUid !== null && Date.now() - cachedAt < UID_CACHE_MS) {
    return cachedUid;
  }
  const resp = await fetch(`${config.ODOO_BASE_URL}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "common",
        method: "authenticate",
        args: [config.ODOO_DB, config.ODOO_API_KEY_USER || "admin", config.ODOO_API_KEY, {}],
      },
      id: 1,
    }),
  });
  if (!resp.ok) {
    throw new ExternalServiceError("ODOO", `Auth HTTP ${resp.status}`);
  }
  const data = (await resp.json()) as JsonRpcResponse<number | false>;
  if (data.error) throw new ExternalServiceError("ODOO", data.error.message);
  if (!data.result) {
    throw new ExternalServiceError("ODOO", "Authentication failed — bad API key?");
  }
  cachedUid = data.result;
  cachedAt = Date.now();
  return cachedUid;
}

/**
 * Generic execute_kw call. Wraps ODOO's standard model-method invocation.
 */
async function executeKw<T>(
  model: string,
  method: string,
  args: unknown[] = [],
  kwargs: Record<string, unknown> = {}
): Promise<T> {
  ensureConfigured();
  const uid = await authenticate();
  const payload: JsonRpcRequest = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [config.ODOO_DB, uid, config.ODOO_API_KEY, model, method, args, kwargs],
    },
    id: Math.floor(Math.random() * 1_000_000),
  };
  const resp = await fetch(`${config.ODOO_BASE_URL}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    throw new ExternalServiceError("ODOO", `${method} HTTP ${resp.status}`);
  }
  const data = (await resp.json()) as JsonRpcResponse<T>;
  if (data.error) {
    throw new ExternalServiceError(
      "ODOO",
      `${model}.${method}: ${data.error.message}`
    );
  }
  return data.result as T;
}

// ── Public API ─────────────────────────────────────────────────────────────

export async function listProjects(): Promise<OdooProject[]> {
  // Fetch active projects with key fields. ODOO's project.project model.
  interface Raw {
    id: number;
    name: string;
    partner_id: false | [number, string];
    user_id: false | [number, string];
    date_start: false | string;
    date: false | string;
    stage_id: false | [number, string];
  }
  const rows = await executeKw<Raw[]>(
    "project.project",
    "search_read",
    [[["active", "=", true]]],
    { fields: ["id", "name", "partner_id", "user_id", "date_start", "date", "stage_id"], limit: 500 }
  );

  // For each project, also pull manager email (one-shot batch)
  const managerIds = Array.from(new Set(rows.map((r) => (Array.isArray(r.user_id) ? r.user_id[0] : null)).filter((x): x is number => !!x)));
  let managerEmailById = new Map<number, string>();
  if (managerIds.length > 0) {
    interface UserRow { id: number; email: string | false }
    const users = await executeKw<UserRow[]>(
      "res.users", "read", [managerIds], { fields: ["id", "email"] }
    );
    managerEmailById = new Map(users.map((u) => [u.id, u.email || ""]));
  }

  // Adherence: per project, milestone reached vs total
  const adherenceByProject = new Map<number, number>();
  if (rows.length > 0) {
    interface MilestoneRow { id: number; project_id: false | [number, string]; deadline: false | string; reached: boolean }
    const ms = await executeKw<MilestoneRow[]>(
      "project.milestone", "search_read",
      [[["project_id", "in", rows.map((r) => r.id)]]],
      { fields: ["id", "project_id", "deadline", "reached"] }
    );
    const byProj = new Map<number, { total: number; reached: number }>();
    for (const m of ms) {
      if (!Array.isArray(m.project_id)) continue;
      const pid = m.project_id[0];
      const cur = byProj.get(pid) ?? { total: 0, reached: 0 };
      cur.total += 1;
      if (m.reached) cur.reached += 1;
      byProj.set(pid, cur);
    }
    for (const [pid, { total, reached }] of byProj) {
      adherenceByProject.set(pid, total === 0 ? 100 : Math.round((reached / total) * 100));
    }
  }

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    customer: Array.isArray(r.partner_id) ? r.partner_id[1] : null,
    managerEmail: Array.isArray(r.user_id) ? managerEmailById.get(r.user_id[0]) ?? null : null,
    startDate: r.date_start || null,
    endDate: r.date || null,
    state: Array.isArray(r.stage_id) ? r.stage_id[1] : null,
    milestonesAdherence: adherenceByProject.get(r.id) ?? null,
  }));
}

export async function projectMilestoneAdherence(projectId: number): Promise<number | null> {
  interface Row { id: number; deadline: false | string; reached: boolean }
  const ms = await executeKw<Row[]>(
    "project.milestone", "search_read",
    [[["project_id", "=", projectId]]],
    { fields: ["id", "deadline", "reached"] }
  );
  if (ms.length === 0) return null;
  const reached = ms.filter((m) => m.reached).length;
  return Math.round((reached / ms.length) * 100);
}

export async function listMilestones(projectId: number): Promise<OdooMilestone[]> {
  interface Row {
    id: number;
    project_id: false | [number, string];
    name: string;
    deadline: false | string;
    deadline_assigned_date: false | string;
    reached: boolean;
  }
  const rows = await executeKw<Row[]>(
    "project.milestone", "search_read",
    [[["project_id", "=", projectId]]],
    { fields: ["id", "project_id", "name", "deadline", "deadline_assigned_date", "reached"] }
  );
  return rows.map((r) => ({
    id: r.id,
    projectId,
    name: r.name,
    deadline: r.deadline || null,
    completionDate: r.deadline_assigned_date || null,
    reached: r.reached,
  }));
}

export async function timesheetsForCycle(
  cycleStart: Date,
  cycleEnd: Date
): Promise<OdooTimesheetSummary[]> {
  // Pull account.analytic.line entries between dates, group by employee email
  interface Row {
    id: number;
    employee_id: false | [number, string];
    unit_amount: number;        // hours
    project_id: false | [number, string];
  }
  const startStr = cycleStart.toISOString().slice(0, 10);
  const endStr = cycleEnd.toISOString().slice(0, 10);
  const lines = await executeKw<Row[]>(
    "account.analytic.line", "search_read",
    [[["date", ">=", startStr], ["date", "<=", endStr]]],
    { fields: ["id", "employee_id", "unit_amount", "project_id"], limit: 100_000 }
  );

  // Get unique employee IDs → emails
  const empIds = Array.from(new Set(lines.map((l) => (Array.isArray(l.employee_id) ? l.employee_id[0] : null)).filter((x): x is number => !!x)));
  let emailById = new Map<number, string>();
  if (empIds.length > 0) {
    interface EmpRow { id: number; work_email: string | false }
    const emps = await executeKw<EmpRow[]>(
      "hr.employee", "read", [empIds], { fields: ["id", "work_email"] }
    );
    emailById = new Map(emps.map((e) => [e.id, e.work_email || ""]));
  }

  // Aggregate hours per employee
  const agg = new Map<string, { billable: number; total: number }>();
  for (const l of lines) {
    if (!Array.isArray(l.employee_id)) continue;
    const email = emailById.get(l.employee_id[0]);
    if (!email) continue;
    const isBillable = Array.isArray(l.project_id); // billable = has project
    const cur = agg.get(email) ?? { billable: 0, total: 0 };
    cur.total += l.unit_amount;
    if (isBillable) cur.billable += l.unit_amount;
    agg.set(email, cur);
  }

  const cycleId = `${startStr}_${endStr}`;
  return Array.from(agg.entries()).map(([empEmail, { billable, total }]) => ({
    empEmail,
    cycleId,
    billableHours: Math.round(billable * 100) / 100,
    totalHours: Math.round(total * 100) / 100,
    utilisationPct: total === 0 ? 0 : Math.round((billable / total) * 100),
  }));
}

/**
 * Health check — returns true if ODOO is reachable and credentials are valid.
 */
export async function ping(): Promise<boolean> {
  if (!config.ODOO_BASE_URL || !config.ODOO_DB || !config.ODOO_API_KEY) return false;
  try {
    await authenticate();
    return true;
  } catch {
    return false;
  }
}
