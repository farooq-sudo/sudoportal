// ════════════════════════════════════════════════════════════════════════════
//  src/utils/serializers.ts
//
//  Presentation-layer serializers. Convert normalized Prisma rows into the
//  denormalized, display-friendly shapes the frontend portals expect.
//
//  Why this exists:
//    The prototype frontend reads friendly fields like `employee.dept`
//    ("Cloud Engineering"), `employee.lm` (manager *name*), `employee.status`
//    ("Confirmed"). The database stores normalized FKs + enums
//    (departmentId, managerEmpId, status=CONFIRMED). These serializers bridge
//    the two so the frontend needs minimal changes when we wire it to the API.
//
//  Contract: every list/detail endpoint that the frontend consumes should
//  return data through one of these serializers, so the shape is consistent
//  and documented in ONE place.
// ════════════════════════════════════════════════════════════════════════════

// ── Enum → display string maps ──────────────────────────────────────────────

const EMPLOYEE_STATUS_DISPLAY: Record<string, string> = {
  PROSPECT: "Prospect",
  ONBOARDING: "Onboarding",
  PROBATION: "Probation",
  CONFIRMED: "Confirmed",
  ON_LEAVE: "On Leave",
  SUSPENDED: "Suspended",
  OFFBOARDING: "Offboarding",
  TERMINATED: "Terminated",
};

const TEAM_ROLE_DISPLAY: Record<string, string> = {
  LEAD: "lead",
  MANAGER: "manager",
  MEMBER: "member",
  HR_BUSINESS_PARTNER: "hrbp",
};

export function displayEmployeeStatus(s: string | null | undefined): string {
  if (!s) return "Confirmed";
  return EMPLOYEE_STATUS_DISPLAY[s] ?? s;
}

export function displayTeamRole(r: string | null | undefined): string {
  if (!r) return "member";
  return TEAM_ROLE_DISPLAY[r] ?? r.toLowerCase();
}

// ── Date → ISO date-only string (frontend shows "2024-01-15") ───────────────
export function isoDate(d: Date | null | undefined): string | null {
  if (!d) return null;
  return d.toISOString().slice(0, 10);
}

// ── Types for serializer inputs (loose — accept Prisma rows + includes) ─────

interface EmployeeRowish {
  id: string;
  name: string;
  email: string;
  workEmail?: string | null;
  title?: string | null;
  status?: string | null;
  teamId?: string | null;
  teamRole?: string | null;
  departmentId?: string | null;
  managerEmpId?: string | null;
  pmEmpId?: string | null;
  photoUrl?: string | null;
  joinedAt?: Date | null;
  probationEnd?: string | Date | null;
  roles?: string[];
  active?: boolean;
  team?: { id: string; name: string; short: string } | null;
  department?: { id: string; name: string } | null;
  manager?: { id: string; name: string } | null;
}

export interface EmployeeDTO {
  id: string;
  name: string;
  email: string;
  workEmail: string | null;
  title: string | null;
  status: string;            // display form: "Confirmed"
  dept: string | null;       // department NAME (frontend shows the name)
  departmentId: string | null;
  teamId: string | null;
  teamRole: string;          // "member"
  team: string | null;       // team short, e.g. "PS"
  lm: string | null;         // line manager NAME (frontend shows the name)
  managerEmpId: string | null;
  pm: string | null;         // PM name placeholder (resolved separately if needed)
  pmEmpId: string | null;
  photoUrl: string | null;
  joined: string | null;     // ISO date
  roles: string[];
  active: boolean;
}

/**
 * Serialize an Employee row into the frontend DTO.
 * `managerName` is optional — pass it if the caller resolved it (avoids N+1).
 */
export function serializeEmployee(
  e: EmployeeRowish,
  opts: { managerName?: string | null; pmName?: string | null } = {}
): EmployeeDTO {
  return {
    id: e.id,
    name: e.name,
    email: e.email,
    workEmail: e.workEmail ?? null,
    title: e.title ?? null,
    status: displayEmployeeStatus(e.status),
    dept: e.department?.name ?? null,
    departmentId: e.departmentId ?? null,
    teamId: e.teamId ?? null,
    teamRole: displayTeamRole(e.teamRole),
    team: e.team?.short ?? null,
    lm: opts.managerName ?? e.manager?.name ?? null,
    managerEmpId: e.managerEmpId ?? null,
    pm: opts.pmName ?? null,
    pmEmpId: e.pmEmpId ?? null,
    photoUrl: e.photoUrl ?? null,
    joined: isoDate(e.joinedAt ?? null),
    roles: e.roles ?? [],
    active: e.active ?? true,
  };
}

// ── Team serializer ─────────────────────────────────────────────────────────

interface TeamRowish {
  id: string;
  name: string;
  short: string;
  color?: string | null;
  leadEmpId?: string | null;
  managerEmpId?: string | null;
  _count?: { employees?: number };
}

export interface TeamDTO {
  id: string;
  name: string;
  short: string;
  color: string | null;
  leadEmpId: string | null;
  managerEmpId: string | null;
  memberCount: number;
}

export function serializeTeam(t: TeamRowish): TeamDTO {
  return {
    id: t.id,
    name: t.name,
    short: t.short,
    color: t.color ?? null,
    leadEmpId: t.leadEmpId ?? null,
    managerEmpId: t.managerEmpId ?? null,
    memberCount: t._count?.employees ?? 0,
  };
}

// ── KPI assignment serializer (frontend "kpiCards"/"kpiAssignments" shape) ──

interface KpiAssignmentRowish {
  id: string;
  templateKrn: string;
  empId: string;
  cycleId: string;
  weight: number;
  status: string;
  currentValue?: string | null;
  approvalDirection?: string | null;
  validatorRole?: string | null;
  scopeLabel?: string | null;
  template?: { krn: string; title: string; target: string; unit?: string | null; direction: string } | null;
}

export interface KpiAssignmentDTO {
  id: string;
  krn: string;
  empId: string;
  cycleId: string;
  title: string;
  target: string;
  unit: string | null;
  weight: number;
  status: string;
  currentValue: string | null;
  approvalDirection: string | null;
  validatorRole: string | null;
  scopeLabel: string | null;
}

export function serializeKpiAssignment(a: KpiAssignmentRowish): KpiAssignmentDTO {
  return {
    id: a.id,
    krn: a.templateKrn,
    empId: a.empId,
    cycleId: a.cycleId,
    title: a.template?.title ?? a.templateKrn,
    target: a.template?.target ?? "",
    unit: a.template?.unit ?? null,
    weight: a.weight,
    status: a.status,
    currentValue: a.currentValue ?? null,
    approvalDirection: a.approvalDirection ?? null,
    validatorRole: a.validatorRole ?? null,
    scopeLabel: a.scopeLabel ?? null,
  };
}

// ── Leave request serializer (frontend "requests"/"timeoff" shape) ──────────

interface LeaveRequestRowish {
  id: string;
  empId: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  days: unknown;            // Prisma Decimal
  status: string;
  reason?: string | null;
  submittedAt?: Date | null;
  currentApprover?: string | null;
}

export interface LeaveRequestDTO {
  id: string;
  empId: string;
  type: string;             // friendly: "Annual Paid Leave"
  from: string | null;      // ISO date
  to: string | null;
  days: number;
  status: string;           // friendly: "Pending PM", "Approved"
  reason: string | null;
  submittedAt: string | null;
  currentApprover: string | null;
}

const LEAVE_TYPE_DISPLAY: Record<string, string> = {
  ANNUAL: "Annual Paid Leave",
  SICK: "Sick Leave",
  COMPASSIONATE: "Compassionate Leave",
  HAJJ: "Hajj Leave",
  MATERNITY: "Maternity Leave",
  PATERNITY: "Paternity Leave",
  STUDY: "Study Leave",
  UNPAID: "Unpaid Leave",
  WORK_FROM_HOME: "Work From Home",
  BUSINESS_TRAVEL: "Business Travel",
  COMP_OFF: "Comp Off",
};

const LEAVE_STATUS_DISPLAY: Record<string, string> = {
  DRAFT: "Draft",
  PENDING_PM: "Pending PM",
  PENDING_TL: "Pending TL",
  PENDING_HR: "Pending HR",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
  WITHDRAWN: "Withdrawn",
};

export function serializeLeaveRequest(r: LeaveRequestRowish): LeaveRequestDTO {
  return {
    id: r.id,
    empId: r.empId,
    type: LEAVE_TYPE_DISPLAY[r.leaveType] ?? r.leaveType,
    from: isoDate(r.startDate),
    to: isoDate(r.endDate),
    days: Number(r.days),
    status: LEAVE_STATUS_DISPLAY[r.status] ?? r.status,
    reason: r.reason ?? null,
    submittedAt: isoDate(r.submittedAt ?? null),
    currentApprover: r.currentApprover ?? null,
  };
}

// ── Notification serializer ─────────────────────────────────────────────────

interface NotificationRowish {
  id: string;
  title: string;
  body: string;
  icon?: string | null;
  color?: string | null;
  unread: boolean;
  url?: string | null;
  category: string;
  createdAt: Date;
}

export interface NotificationDTO {
  id: string;
  title: string;
  body: string;
  icon: string | null;
  color: string | null;
  unread: boolean;
  url: string | null;
  category: string;
  createdAt: string;
}

export function serializeNotification(n: NotificationRowish): NotificationDTO {
  return {
    id: n.id,
    title: n.title,
    body: n.body,
    icon: n.icon ?? null,
    color: n.color ?? null,
    unread: n.unread,
    url: n.url ?? null,
    category: n.category,
    createdAt: n.createdAt.toISOString(),
  };
}

// ── Backup serializer (frontend pageBackups expects time/type/size/status/retention) ──

interface BackupRowish {
  id: string;
  type: string;
  sizeBytes?: bigint | number | null;
  status: string;
  retentionDays?: number | null;
  startedAt: Date;
  finishedAt?: Date | null;
}

export interface BackupDTO {
  id: string;
  time: string;        // "2026-05-29 02:00"
  type: string;        // "Daily" / "Manual"
  size: string;        // "8.4 GB"
  status: string;      // "Complete"
  retention: string;   // "30 days"
}

function humanSize(bytes: bigint | number | null | undefined): string {
  if (bytes == null) return "—";
  const n = typeof bytes === "bigint" ? Number(bytes) : bytes;
  if (n < 1024) return n + " B";
  const units = ["KB", "MB", "GB", "TB"];
  let v = n / 1024, i = 0;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return v.toFixed(1) + " " + units[i];
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function serializeBackup(b: BackupRowish): BackupDTO {
  const t = b.startedAt;
  const time = t.toISOString().slice(0, 16).replace("T", " ");
  return {
    id: b.id,
    time,
    type: titleCase(b.type),
    size: humanSize(b.sizeBytes),
    status: titleCase(b.status),
    retention: b.retentionDays != null ? b.retentionDays + " days" : "—",
  };
}

// ── Data export serializer (frontend reports/exports list) ──────────────────

interface DataExportRowish {
  id: string;
  scope: string;
  format: string;
  status: string;
  rowCount?: number | null;
  fileUrl?: string | null;
  createdAt: Date;
  completedAt?: Date | null;
  expiresAt?: Date | null;
}

export interface DataExportDTO {
  id: string;
  scope: string;
  format: string;
  status: string;
  rows: number | null;
  fileUrl: string | null;
  requestedAt: string;
  completedAt: string | null;
  expiresAt: string | null;
}

export function serializeDataExport(x: DataExportRowish): DataExportDTO {
  return {
    id: x.id,
    scope: x.scope,
    format: x.format,
    status: titleCase(x.status),
    rows: x.rowCount ?? null,
    fileUrl: x.fileUrl ?? null,
    requestedAt: x.createdAt.toISOString(),
    completedAt: x.completedAt ? x.completedAt.toISOString() : null,
    expiresAt: x.expiresAt ? x.expiresAt.toISOString() : null,
  };
}

// ── Role + permission serializer (frontend pageRoles) ───────────────────────

interface RoleDefRowish {
  key: string;
  label: string;
  description?: string | null;
  color?: string | null;
  entraGroupId?: string | null;
  permissions?: Array<{ permission?: { key: string; label: string; category: string } | null }>;
  _count?: { permissions?: number };
}

export interface RoleDTO {
  key: string;
  name: string;
  description: string | null;
  color: string;          // frontend uses r.color for the card accent
  entraGroup: string;     // frontend shows the mapped Entra group
  members: number;        // frontend shows member count (0 until wired to a count query)
  permissionKeys: string[];
  permissionCount: number;
}

// Stable accent color per known role key (matches the prototype palette)
const ROLE_COLORS: Record<string, string> = {
  ADMIN: "#7C3AED", HR: "#2563EB", PM: "#0D9488", TL: "#D97706",
  EMPLOYEE: "#64748B", FINANCE: "#059669", RECRUITER: "#DB2777", AUDITOR: "#475569",
};

export function serializeRole(r: RoleDefRowish): RoleDTO {
  const perms = (r.permissions || [])
    .map((rp) => rp.permission?.key)
    .filter((k): k is string => !!k);
  return {
    key: r.key,
    name: r.label,
    description: r.description ?? null,
    color: r.color ?? ROLE_COLORS[r.key] ?? "#64748B",
    entraGroup: r.entraGroupId ?? `SUDO-${r.key}`,
    members: 0,
    permissionKeys: perms,
    permissionCount: r._count?.permissions ?? perms.length,
  };
}
