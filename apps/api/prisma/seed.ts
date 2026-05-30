// ════════════════════════════════════════════════════════════════════════════
//  prisma/seed.ts
//  Loads JSON fixtures from prisma/seed-data/ and seeds default catalog data
//  (holidays, departments, positions, permissions, leave policies, etc.).
//
//  Usage:
//    npm run db:seed              # idempotent — upserts existing rows
//    npm run db:seed:reset        # wipes ALL data first (ALLOW_DESTRUCTIVE_SEED required)
//
//  Layout:
//    Section 1 — Defaults written by the seed itself (catalog data)
//    Section 2 — JSON fixtures loaded from seed-data/*.json (sample data)
// ════════════════════════════════════════════════════════════════════════════

import { PrismaClient } from "@prisma/client";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const SEED_DIR = join(__dirname, "seed-data");
const prisma = new PrismaClient();

const args = new Set(process.argv.slice(2));
const RESET = args.has("--reset");
const ALLOW_DESTRUCTIVE = process.env.ALLOW_DESTRUCTIVE_SEED?.toLowerCase() === "true";

// ── Helpers ────────────────────────────────────────────────────────────────

function load<T>(file: string): T[] {
  const p = join(SEED_DIR, file);
  if (!existsSync(p)) {
    console.warn(`  [skip] ${file} (not present)`);
    return [];
  }
  return JSON.parse(readFileSync(p, "utf8")) as T[];
}

function parseDateOrNull(v: unknown): Date | null {
  if (!v || typeof v !== "string") return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

type EmpStatus = "PROSPECT" | "ONBOARDING" | "PROBATION" | "CONFIRMED" | "ON_LEAVE" | "SUSPENDED" | "OFFBOARDING" | "TERMINATED";

function mapEmployeeStatus(s: string | undefined): EmpStatus {
  if (!s) return "CONFIRMED";
  const v = s.toLowerCase();
  if (v.startsWith("prospect")) return "PROSPECT";
  if (v.startsWith("onboard")) return "ONBOARDING";
  if (v.startsWith("probat")) return "PROBATION";
  if (v.startsWith("on leave") || v === "on_leave") return "ON_LEAVE";
  if (v.startsWith("suspend")) return "SUSPENDED";
  if (v.startsWith("offboard")) return "OFFBOARDING";
  if (v.startsWith("termin")) return "TERMINATED";
  return "CONFIRMED";
}

function mapTeamRole(s: string | undefined): "LEAD" | "MANAGER" | "MEMBER" {
  if (!s) return "MEMBER";
  const v = s.toLowerCase();
  if (v === "lead") return "LEAD";
  if (v === "manager") return "MANAGER";
  return "MEMBER";
}

type SudoRole = "ADMIN" | "HR" | "PM" | "TL" | "EMPLOYEE" | "FINANCE" | "RECRUITER" | "AUDITOR";

function mapRoles(roles: unknown): SudoRole[] {
  if (!Array.isArray(roles)) return ["EMPLOYEE"];
  return roles
    .map((r) => String(r).toUpperCase())
    .filter((r): r is SudoRole =>
      ["ADMIN", "HR", "PM", "TL", "EMPLOYEE", "FINANCE", "RECRUITER", "AUDITOR"].includes(r)
    );
}

// ════════════════════════════════════════════════════════════════════════════
//  SECTION 1 — DEFAULTS (catalog data)
// ════════════════════════════════════════════════════════════════════════════

async function seedDepartments() {
  const defaults = [
    { id: "DEPT-EXEC",  name: "Executive Office",        code: "EXEC", description: "Leadership team" },
    { id: "DEPT-CE",    name: "Cloud Engineering",       code: "CE",   description: "Architecture, implementation, ops" },
    { id: "DEPT-ADV",   name: "Advisory",                code: "ADV",  description: "Strategic + technical advisory" },
    { id: "DEPT-OPS",   name: "People Operations",       code: "POPS", description: "HR + Talent + L&D" },
    { id: "DEPT-FIN",   name: "Finance & Admin",         code: "FIN",  description: "Finance, procurement, facilities" },
  ];
  for (const d of defaults) {
    await prisma.department.upsert({ where: { id: d.id }, create: d, update: d });
  }
  console.log(`  ✓ departments  ${defaults.length}`);
}

async function seedPositions() {
  const defaults = [
    { id: "POS-CEO",    title: "Chief Executive Officer",  jobFamily: "Executive",  level: 10, grade: "E1", currency: "AED" },
    { id: "POS-COO",    title: "Chief Operating Officer",  jobFamily: "Executive",  level: 10, grade: "E1", currency: "AED" },
    { id: "POS-DIR",    title: "Director",                 jobFamily: "Executive",  level: 9,  grade: "D1", currency: "AED" },
    { id: "POS-MGR",    title: "Manager",                  jobFamily: "Management", level: 7,  grade: "M1", currency: "AED" },
    { id: "POS-TL",     title: "Team Lead",                jobFamily: "Management", level: 6,  grade: "TL1", currency: "AED" },
    { id: "POS-SA",     title: "Solutions Architect",      jobFamily: "Engineering", level: 6, grade: "P4", currency: "AED" },
    { id: "POS-SR-CE",  title: "Senior Cloud Engineer",    jobFamily: "Engineering", level: 5, grade: "P3", currency: "AED" },
    { id: "POS-CE",     title: "Cloud Engineer",           jobFamily: "Engineering", level: 4, grade: "P2", currency: "AED" },
    { id: "POS-JR-CE",  title: "Junior Cloud Engineer",    jobFamily: "Engineering", level: 3, grade: "P1", currency: "AED" },
    { id: "POS-PM",     title: "Project Manager",          jobFamily: "Delivery",    level: 6, grade: "PM1", currency: "AED" },
    { id: "POS-SR-PM",  title: "Senior Project Manager",   jobFamily: "Delivery",    level: 7, grade: "PM2", currency: "AED" },
    { id: "POS-CONS",   title: "Consultant",               jobFamily: "Advisory",    level: 5, grade: "C2", currency: "AED" },
    { id: "POS-SR-CONS",title: "Senior Consultant",        jobFamily: "Advisory",    level: 6, grade: "C3", currency: "AED" },
    { id: "POS-HR-GEN", title: "HR Generalist",            jobFamily: "People",      level: 4, grade: "HR2", currency: "AED" },
    { id: "POS-HR-MGR", title: "HR Manager",               jobFamily: "People",      level: 7, grade: "HR4", currency: "AED" },
    { id: "POS-RECR",   title: "Recruiter",                jobFamily: "People",      level: 4, grade: "HR2", currency: "AED" },
    { id: "POS-FIN-CTRL", title: "Financial Controller",   jobFamily: "Finance",     level: 7, grade: "F4", currency: "AED" },
    { id: "POS-ACCT",   title: "Accountant",               jobFamily: "Finance",     level: 4, grade: "F2", currency: "AED" },
    { id: "POS-ADMIN",  title: "System Administrator",     jobFamily: "IT",          level: 5, grade: "IT3", currency: "AED" },
  ];
  for (const p of defaults) {
    await prisma.position.upsert({ where: { id: p.id }, create: p, update: p });
  }
  console.log(`  ✓ positions    ${defaults.length}`);
}

async function seedHolidays() {
  const ae2026 = [
    { name: "New Year's Day",                  date: "2026-01-01", category: "PUBLIC" as const },
    { name: "Eid Al Fitr",                     date: "2026-03-20", endDate: "2026-03-23", category: "RELIGIOUS" as const, religion: "Muslim" },
    { name: "Arafah Day",                      date: "2026-05-26", category: "RELIGIOUS" as const, religion: "Muslim" },
    { name: "Eid Al Adha",                     date: "2026-05-27", endDate: "2026-05-29", category: "RELIGIOUS" as const, religion: "Muslim" },
    { name: "Islamic New Year",                date: "2026-06-16", category: "RELIGIOUS" as const, religion: "Muslim" },
    { name: "Prophet Muhammad's Birthday",     date: "2026-08-24", category: "RELIGIOUS" as const, religion: "Muslim" },
    { name: "Commemoration Day",               date: "2026-12-01", category: "NATIONAL" as const },
    { name: "UAE National Day",                date: "2026-12-02", endDate: "2026-12-03", category: "NATIONAL" as const },
  ].map((h) => ({ ...h, country: "AE" }));
  const sa2026 = [
    { name: "Saudi Founding Day",              date: "2026-02-22", category: "NATIONAL" as const },
    { name: "Eid Al Fitr",                     date: "2026-03-20", endDate: "2026-03-23", category: "RELIGIOUS" as const, religion: "Muslim" },
    { name: "Eid Al Adha",                     date: "2026-05-27", endDate: "2026-05-30", category: "RELIGIOUS" as const, religion: "Muslim" },
    { name: "Saudi National Day",              date: "2026-09-23", category: "NATIONAL" as const },
  ].map((h) => ({ ...h, country: "SA" }));

  let created = 0;
  for (const h of [...ae2026, ...sa2026]) {
    const data = {
      ...h,
      date: new Date(h.date),
      endDate: h.endDate ? new Date(h.endDate) : null,
    };
    try {
      await prisma.holiday.create({ data });
      created++;
    } catch {
      // duplicate (country+date+name unique) — skip
    }
  }
  console.log(`  ✓ holidays     ${created} created (+ skipped duplicates)`);
}

async function seedLeavePolicies() {
  const defaults = [
    { name: "Annual Leave — Full-time UAE",  leaveType: "ANNUAL" as const,        entitlementDays: 22, carryOverDays: 5,  paid: true,  approvalChain: ["PM", "HR"], appliesToEmploymentType: "FULL_TIME" as const },
    { name: "Sick Leave",                     leaveType: "SICK" as const,          entitlementDays: 15, carryOverDays: 0,  paid: true,  approvalChain: ["HR"] },
    { name: "Maternity Leave",                leaveType: "MATERNITY" as const,     entitlementDays: 60, carryOverDays: 0,  paid: true,  approvalChain: ["HR"] },
    { name: "Paternity Leave",                leaveType: "PATERNITY" as const,     entitlementDays: 5,  carryOverDays: 0,  paid: true,  approvalChain: ["HR"] },
    { name: "Compassionate Leave",            leaveType: "COMPASSIONATE" as const, entitlementDays: 5,  carryOverDays: 0,  paid: true,  approvalChain: ["HR"] },
    { name: "Hajj Leave (one-time)",          leaveType: "HAJJ" as const,          entitlementDays: 30, carryOverDays: 0,  paid: false, approvalChain: ["HR"] },
    { name: "Study Leave",                    leaveType: "STUDY" as const,         entitlementDays: 5,  carryOverDays: 0,  paid: false, approvalChain: ["TL", "HR"] },
    { name: "Work From Home",                 leaveType: "WORK_FROM_HOME" as const,entitlementDays: 0,  carryOverDays: 0,  paid: true,  approvalChain: ["TL"] },
    { name: "Comp Off",                       leaveType: "COMP_OFF" as const,      entitlementDays: 0,  carryOverDays: 30, paid: true,  approvalChain: ["TL"] },
  ];
  await prisma.leavePolicy.deleteMany({ where: { name: { in: defaults.map((d) => d.name) } } });
  for (const p of defaults) {
    await prisma.leavePolicy.create({ data: p });
  }
  console.log(`  ✓ leavePolicies ${defaults.length}`);
}

async function seedPermissions() {
  const perms = [
    { key: "kpi.cycle.create",        category: "kpi",          label: "Create KPI cycles" },
    { key: "kpi.cycle.close",         category: "kpi",          label: "Close KPI cycles" },
    { key: "kpi.template.create",     category: "kpi",          label: "Create KPI templates" },
    { key: "kpi.assignment.draft",    category: "kpi",          label: "Draft KPI assignments" },
    { key: "kpi.assignment.approve",  category: "kpi",          label: "Approve KPI assignments" },
    { key: "kpi.assignment.validate", category: "kpi",          label: "Validate KPI progress" },
    { key: "employee.create",         category: "hr",           label: "Create employees" },
    { key: "employee.update",         category: "hr",           label: "Update employees" },
    { key: "employee.delete",         category: "hr",           label: "Delete (soft) employees" },
    { key: "employee.salary.view",    category: "hr",           label: "View salary records" },
    { key: "employee.salary.edit",    category: "hr",           label: "Edit salary records" },
    { key: "employee.pii.view",       category: "hr",           label: "View PII (passport, visa, etc.)" },
    { key: "employee.pii.edit",       category: "hr",           label: "Edit PII fields" },
    { key: "leave.policy.manage",     category: "leave",        label: "Manage leave policies" },
    { key: "leave.balance.correct",   category: "leave",        label: "Correct leave balances" },
    { key: "leave.request.approve",   category: "leave",        label: "Approve leave requests" },
    { key: "document.upload",         category: "documents",    label: "Upload documents" },
    { key: "document.revoke",         category: "documents",    label: "Revoke documents" },
    { key: "document.sign",           category: "documents",    label: "Sign documents" },
    { key: "data.export.employees",   category: "data",         label: "Export employee data" },
    { key: "data.export.payroll",     category: "data",         label: "Export payroll data" },
    { key: "data.export.audit",       category: "data",         label: "Export audit log" },
    { key: "data.export.tenant",      category: "data",         label: "Export full tenant" },
    { key: "admin.config.edit",       category: "admin",        label: "Edit system config" },
    { key: "admin.session.revoke",    category: "admin",        label: "Revoke user sessions" },
    { key: "admin.role.manage",       category: "admin",        label: "Manage roles & permissions" },
    { key: "admin.integration.manage",category: "admin",        label: "Manage integrations" },
    { key: "admin.webhook.manage",    category: "admin",        label: "Manage webhooks" },
    { key: "admin.apikey.manage",     category: "admin",        label: "Manage API keys" },
    { key: "admin.backup.trigger",    category: "admin",        label: "Trigger backups" },
    { key: "comms.announcement.publish", category: "comms",     label: "Publish announcements" },
    { key: "audit.log.view",          category: "audit",        label: "View audit log" },
  ];
  for (const p of perms) {
    await prisma.permission.upsert({ where: { key: p.key }, create: p, update: p });
  }
  console.log(`  ✓ permissions  ${perms.length}`);
  return perms;
}

async function seedRoles(perms: Array<{ key: string }>) {
  const roles = [
    { key: "ADMIN",      label: "Administrator", isSystem: true,  description: "Full access" },
    { key: "HR",         label: "Human Resources", isSystem: true, description: "HR operations" },
    { key: "PM",         label: "Project Manager", isSystem: true, description: "Project management" },
    { key: "TL",         label: "Team Lead", isSystem: true,       description: "Team leadership" },
    { key: "EMPLOYEE",   label: "Employee", isSystem: true,        description: "Standard user" },
    { key: "FINANCE",    label: "Finance", isSystem: true,         description: "Payroll + adjustments" },
    { key: "RECRUITER",  label: "Recruiter", isSystem: true,       description: "Hiring + background checks" },
    { key: "AUDITOR",    label: "Auditor", isSystem: true,         description: "Read-only across audit + reports" },
  ];
  for (const r of roles) {
    await prisma.roleDefinition.upsert({ where: { key: r.key }, create: r, update: r });
  }

  const grants: Record<string, string[]> = {
    ADMIN: perms.map((p) => p.key),
    HR: [
      "employee.create", "employee.update", "employee.delete",
      "employee.salary.view", "employee.salary.edit",
      "employee.pii.view", "employee.pii.edit",
      "leave.policy.manage", "leave.balance.correct", "leave.request.approve",
      "document.upload", "document.revoke",
      "kpi.cycle.create", "kpi.cycle.close", "kpi.template.create",
      "kpi.assignment.draft", "kpi.assignment.approve",
      "data.export.employees", "data.export.payroll",
      "comms.announcement.publish", "audit.log.view",
    ],
    PM: ["kpi.assignment.draft", "kpi.assignment.validate", "leave.request.approve", "document.upload"],
    TL: ["kpi.assignment.draft", "kpi.assignment.approve", "kpi.assignment.validate", "leave.request.approve"],
    EMPLOYEE: ["document.sign"],
    FINANCE: ["employee.salary.view", "employee.salary.edit", "data.export.payroll"],
    RECRUITER: ["employee.create", "employee.update"],
    AUDITOR: ["audit.log.view", "data.export.audit", "employee.salary.view"],
  };

  let count = 0;
  for (const [roleKey, permKeys] of Object.entries(grants)) {
    for (const permissionKey of permKeys) {
      try {
        await prisma.rolePermission.upsert({
          where: { roleKey_permissionKey: { roleKey, permissionKey } },
          create: { roleKey, permissionKey },
          update: {},
        });
        count++;
      } catch {
        // ignore
      }
    }
  }
  console.log(`  ✓ roles        ${roles.length} (with ${count} permission grants)`);
}

async function seedNotificationTemplates() {
  const templates = [
    { id: "kpi.cycle.opened", name: "KPI cycle opened", category: "KPI" as const,
      subjectTemplate: "KPI cycle {{cycle}} is now open",
      bodyTemplate: "The KPI cycle {{cycle}} has been opened. Your KPIs will be drafted in the coming days." },
    { id: "kpi.assignment.assigned", name: "KPI assigned", category: "KPI" as const,
      subjectTemplate: "New KPI assigned: {{title}}",
      bodyTemplate: "{{actor}} has assigned a new KPI: {{title}}. Please review and acknowledge." },
    { id: "leave.request.submitted", name: "Leave request submitted", category: "LEAVE" as const,
      subjectTemplate: "Leave request from {{employee}}",
      bodyTemplate: "{{employee}} requested {{days}} day(s) of {{leaveType}} from {{startDate}} to {{endDate}}." },
    { id: "leave.request.approved", name: "Leave approved", category: "LEAVE" as const,
      subjectTemplate: "Leave approved",
      bodyTemplate: "Your {{leaveType}} for {{days}} day(s) was approved." },
    { id: "document.signature.requested", name: "Document signature requested", category: "DOCUMENT" as const,
      subjectTemplate: "Please sign: {{title}}",
      bodyTemplate: "A document is awaiting your signature: {{title}}." },
    { id: "probation.checkin.reminder", name: "Probation check-in reminder", category: "PROBATION" as const,
      subjectTemplate: "Probation 1:1 reminder",
      bodyTemplate: "Probation check-in for {{employee}} is scheduled for {{date}}." },
    { id: "recognition.received", name: "Recognition received", category: "RECOGNITION" as const,
      subjectTemplate: "{{from}} recognised you",
      bodyTemplate: "{{from}} recognised you for {{category}}: {{message}}" },
    { id: "training.assigned", name: "Training assigned", category: "TRAINING" as const,
      subjectTemplate: "New training: {{training}}",
      bodyTemplate: "You've been enrolled in {{training}}. Due by {{dueAt}}." },
  ];
  for (const t of templates) {
    await prisma.notificationTemplate.upsert({
      where: { id: t.id },
      create: { ...t, channels: ["IN_APP", "EMAIL"] },
      update: t,
    });
  }
  console.log(`  ✓ notif. tmpl  ${templates.length}`);
}

async function seedSystemConfig() {
  const defaults: Array<{ key: string; category: string; value: unknown; description?: string }> = [
    { key: "kpi.weighting.default", category: "kpi",
      value: { progress: 40, ratings: 30, peer: 20, badges: 10 },
      description: "Default composite KPI weighting (must sum to 100)" },
    { key: "leave.year.start_month", category: "leave",
      value: 1, description: "Month leave-year resets (1 = January)" },
    { key: "probation.duration_months", category: "hr",
      value: 6, description: "Default probation duration in months" },
    { key: "session.duration_hours", category: "auth",
      value: 8, description: "Web session TTL in hours" },
    { key: "data_export.expiry_days", category: "data",
      value: 7, description: "Signed URL lifetime for export files" },
    { key: "notification.retry.max_attempts", category: "notifications",
      value: 5, description: "Max retry attempts for outbound delivery" },
    { key: "feature_flags", category: "system",
      value: { recognitionWall: true, badgeAwards: true, peerFeedback: true, dataExports: true },
      description: "Runtime feature toggles" },
  ];
  for (const c of defaults) {
    await prisma.systemConfig.upsert({
      where: { key: c.key },
      create: { ...c, value: c.value as object },
      update: { value: c.value as object, category: c.category, description: c.description },
    });
  }
  console.log(`  ✓ systemConfig ${defaults.length}`);
}

async function seedIntegrations() {
  const defaults = [
    { id: "m365",   name: "Microsoft 365",     category: "SSO",  vendor: "Microsoft", status: "connected", enabled: true,
      configJson: { tenantId: "from-env", scopes: ["User.Read", "Group.Read.All", "User.ReadBasic.All"] } },
    { id: "odoo",   name: "Odoo ERP",          category: "ERP",  vendor: "Odoo", status: "disconnected", enabled: false,
      configJson: { baseUrl: "from-env", db: "from-env" } },
    { id: "slack",  name: "Slack",             category: "CHAT", vendor: "Slack", status: "disconnected", enabled: false,
      configJson: { webhookUrl: "from-env" } },
    { id: "credly", name: "Credly",            category: "CERT", vendor: "Credly", status: "disconnected", enabled: false },
    { id: "docusign", name: "DocuSign",        category: "ESIGN", vendor: "DocuSign", status: "disconnected", enabled: false },
  ];
  for (const i of defaults) {
    await prisma.integration.upsert({
      where: { id: i.id },
      create: { ...i, configJson: i.configJson as object | undefined },
      update: i,
    });
  }
  console.log(`  ✓ integrations ${defaults.length}`);
}

// ════════════════════════════════════════════════════════════════════════════
//  SECTION 2 — JSON FIXTURES (sample/demo data)
// ════════════════════════════════════════════════════════════════════════════

interface JsonEmployee {
  id: string;
  email: string;
  name: string;
  title?: string;
  status?: string;
  joinedAt?: string;
  probationEnd?: string;
  managerEmpId?: string;
  pmEmpId?: string;
  teamId?: string;
  teamRole?: string;
  roles?: string[];
  photoUrl?: string;
  positionId?: string;
  departmentId?: string;
}

async function seedTeams() {
  const items = load<{ id: string; name: string; short: string; color?: string; leadEmpId?: string; managerEmpId?: string; departmentId?: string }>("teams.json");
  for (const t of items) {
    await prisma.team.upsert({
      where: { id: t.id },
      create: {
        id: t.id, name: t.name, short: t.short, color: t.color,
        departmentId: t.departmentId ?? "DEPT-CE",
      },
      update: {
        name: t.name, short: t.short, color: t.color,
      },
    });
  }
  console.log(`  ✓ teams        ${items.length}`);
}

async function seedEmployees() {
  const items = load<JsonEmployee>("employees.json");
  let skipped = 0;
  // Pass 1: create employees without manager refs
  for (const e of items) {
    try {
      await prisma.employee.upsert({
        where: { id: e.id },
        create: {
          id: e.id, email: e.email, workEmail: e.email, name: e.name, title: e.title,
          status: mapEmployeeStatus(e.status),
          joinedAt: parseDateOrNull(e.joinedAt),
          probationEnd: parseDateOrNull(e.probationEnd),
          teamId: e.teamId, teamRole: mapTeamRole(e.teamRole),
          roles: mapRoles(e.roles), photoUrl: e.photoUrl,
          positionId: e.positionId, departmentId: e.departmentId,
        },
        update: {
          email: e.email, name: e.name, title: e.title,
          status: mapEmployeeStatus(e.status),
          teamId: e.teamId, roles: mapRoles(e.roles), photoUrl: e.photoUrl,
        },
      });
    } catch (err) {
      skipped++;
      console.warn(`    [skip] employee ${e.id} (${e.email}): ${err instanceof Error ? err.message.split("\n")[0] : err}`);
    }
  }
  // Pass 2: manager + pm refs now that everyone exists
  for (const e of items) {
    if (e.managerEmpId || e.pmEmpId) {
      await prisma.employee.update({
        where: { id: e.id },
        data: { managerEmpId: e.managerEmpId, pmEmpId: e.pmEmpId },
      }).catch(() => undefined);
    }
  }
  // Pass 3: empty profiles
  for (const e of items) {
    await prisma.employeeProfile.upsert({
      where: { empId: e.id }, create: { empId: e.id }, update: {},
    });
  }
  // Pass 4: team lead refs
  const teams = load<{ id: string; leadEmpId?: string; managerEmpId?: string }>("teams.json");
  for (const t of teams) {
    if (t.leadEmpId || t.managerEmpId) {
      await prisma.team.update({
        where: { id: t.id },
        data: { leadEmpId: t.leadEmpId, managerEmpId: t.managerEmpId },
      }).catch(() => undefined);
    }
  }
  // Demo personas: give a few representative seeded employees elevated roles
  // so the staging demo tiles (Admin/HR/PM/TL) work out of the box. Safe to
  // run repeatedly. In real deployments roles come from Entra group mapping.
  const demoRoles: Array<{ id: string; roles: SudoRole[] }> = [
    { id: "E001", roles: ["ADMIN", "EMPLOYEE"] },
    { id: "E004", roles: ["HR", "EMPLOYEE"] },
    { id: "E006", roles: ["PM", "EMPLOYEE"] },
    { id: "E003", roles: ["TL", "EMPLOYEE"] },
  ];
  for (const d of demoRoles) {
    await prisma.employee.update({
      where: { id: d.id },
      data: { roles: d.roles },
    }).catch(() => undefined);
  }
  console.log(`  ✓ employees    ${items.length - skipped}${skipped ? ` (${skipped} skipped)` : ""} (+ demo roles)`);
}

async function seedKpiCycles() {
  const items = load<{ id: string; label: string; startDate: string; endDate: string; status: string }>("kpi-cycles.json");
  for (const c of items) {
    await prisma.kpiCycle.upsert({
      where: { id: c.id },
      create: {
        id: c.id, label: c.label,
        startDate: new Date(c.startDate), endDate: new Date(c.endDate),
        status: c.status,
      },
      update: { label: c.label, status: c.status },
    });
  }
  console.log(`  ✓ kpiCycles    ${items.length}`);
}

async function seedKpiSections() {
  const items = load<{ id: string; teamId?: string; title: string; description?: string; sortOrder?: number }>("kpi-sections.json");
  for (const s of items) {
    await prisma.kpiSection.upsert({
      where: { id: s.id },
      create: { id: s.id, teamId: s.teamId, title: s.title, description: s.description, sortOrder: s.sortOrder ?? 100 },
      update: { title: s.title, description: s.description, sortOrder: s.sortOrder ?? 100 },
    });
  }
  console.log(`  ✓ kpiSections  ${items.length}`);
}

async function seedKpiTemplates() {
  const items = load<{
    krn: string; sectionId?: string; teamId?: string; title: string; description?: string;
    target: string; unit?: string; direction?: string; weightDefault?: number;
    frequency?: string; validatorRole?: string; scopeKind?: string; autoComputed?: boolean;
  }>("kpi-templates.json");
  for (const t of items) {
    await prisma.kpiTemplate.upsert({
      where: { krn: t.krn },
      create: {
        krn: t.krn, sectionId: t.sectionId, teamId: t.teamId,
        title: t.title, description: t.description,
        target: t.target, unit: t.unit,
        direction: (t.direction?.toUpperCase().replace(/-/g, "_") ?? "HIGHER_IS_BETTER") as "HIGHER_IS_BETTER" | "LOWER_IS_BETTER" | "EXACT_MATCH" | "BOOLEAN_DONE",
        weightDefault: t.weightDefault,
        frequency: (t.frequency?.toUpperCase() ?? "QUARTERLY") as "ONE_OFF" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "SEMI_ANNUAL" | "ANNUAL",
        validatorRole: (t.validatorRole?.toUpperCase() ?? "TL") as "TL" | "PM" | "HR" | "ADMIN" | "AUTO" | "PEER",
        scopeKind: t.scopeKind, autoComputed: t.autoComputed ?? false,
        active: true,
      },
      update: { title: t.title, description: t.description, target: t.target },
    });
  }
  console.log(`  ✓ kpiTemplates ${items.length}`);
}

async function seedTrainingCatalogue() {
  const items = load<{ id: string; title: string; category?: string; provider?: string; mandatory?: boolean; durationHours?: number; validityMonths?: number; url?: string }>("trainings.json");
  for (const t of items) {
    await prisma.trainingCatalogue.upsert({
      where: { id: t.id },
      create: {
        id: t.id, title: t.title, category: t.category, provider: t.provider,
        mandatory: t.mandatory ?? false,
        durationHours: t.durationHours, validityMonths: t.validityMonths,
        url: t.url, active: true,
      },
      update: { title: t.title, category: t.category, provider: t.provider },
    });
  }
  console.log(`  ✓ trainings    ${items.length}`);
}

async function seedBadges() {
  const items = load<{ id: string; name: string; description?: string; icon?: string }>("badges.json");
  if (items.length === 0) {
    const defaults = [
      { id: "b-rising-star",  name: "Rising Star",           icon: "⭐", rarity: "common", description: "Exceptional first quarter" },
      { id: "b-mentor",       name: "Mentor of the Month",   icon: "🎓", rarity: "rare",   description: "Outstanding mentoring" },
      { id: "b-innovator",    name: "Innovator",             icon: "💡", rarity: "rare",   description: "Brought a creative solution" },
      { id: "b-customer-hero",name: "Customer Hero",         icon: "🦸", rarity: "rare",   description: "Went above and beyond for a customer" },
      { id: "b-team-player",  name: "Team Player",           icon: "🤝", rarity: "common", description: "Outstanding team contribution" },
      { id: "b-perfect-cycle",name: "Perfect Cycle",         icon: "🏆", rarity: "legendary", description: "100% KPI achievement" },
    ];
    for (const b of defaults) {
      await prisma.badge.upsert({ where: { id: b.id }, create: b, update: b });
    }
    console.log(`  ✓ badges       ${defaults.length} (defaults)`);
  } else {
    for (const b of items) {
      await prisma.badge.upsert({
        where: { id: b.id },
        create: { id: b.id, name: b.name, description: b.description, icon: b.icon, active: true },
        update: { name: b.name, description: b.description, icon: b.icon },
      });
    }
    console.log(`  ✓ badges       ${items.length}`);
  }
}

// ════════════════════════════════════════════════════════════════════════════
//  MAIN
// ════════════════════════════════════════════════════════════════════════════

async function main() {
  if (RESET) {
    if (!ALLOW_DESTRUCTIVE) {
      console.error("✗ --reset requires ALLOW_DESTRUCTIVE_SEED=true");
      process.exit(1);
    }
    console.log("⚠ DESTRUCTIVE RESET — wiping all data");
    // Order matters: deepest deps first
    await prisma.$transaction([
      prisma.documentSignature.deleteMany(),
      prisma.document.deleteMany(),
      prisma.kpiCycleHistory.deleteMany(),
      prisma.kpiAcknowledgement.deleteMany(),
      prisma.kpiAssignment.deleteMany(),
      prisma.kpiTemplate.deleteMany(),
      prisma.kpiSection.deleteMany(),
      prisma.kpiCycle.deleteMany(),
      prisma.leaveApproval.deleteMany(),
      prisma.leaveRequest.deleteMany(),
      prisma.leaveBalance.deleteMany(),
      prisma.leavePolicy.deleteMany(),
      prisma.requestApproval.deleteMany(),
      prisma.request.deleteMany(),
      prisma.recognition.deleteMany(),
      prisma.oneOnOneNote.deleteMany(),
      prisma.feedbackSession.deleteMany(),
      prisma.projectRating.deleteMany(),
      prisma.probationCase.deleteMany(),
      prisma.badgeAward.deleteMany(),
      prisma.badge.deleteMany(),
      prisma.trainingCompletion.deleteMany(),
      prisma.trainingAssignment.deleteMany(),
      prisma.trainingCatalogue.deleteMany(),
      prisma.certification.deleteMany(),
      prisma.onboardingStep.deleteMany(),
      prisma.onboardingPlan.deleteMany(),
      prisma.backgroundCheck.deleteMany(),
      prisma.timesheet.deleteMany(),
      prisma.projectAssignment.deleteMany(),
      prisma.projectMilestone.deleteMany(),
      prisma.project.deleteMany(),
      prisma.assetAssignment.deleteMany(),
      prisma.asset.deleteMany(),
      prisma.announcementAcknowledgement.deleteMany(),
      prisma.announcement.deleteMany(),
      prisma.comment.deleteMany(),
      prisma.holiday.deleteMany(),
      prisma.airTicketUsage.deleteMany(),
      prisma.airTicketAllowance.deleteMany(),
      prisma.offboardingCase.deleteMany(),
      prisma.insuranceDependent.deleteMany(),
      prisma.insurancePolicy.deleteMany(),
      prisma.familyMember.deleteMany(),
      prisma.bankAccount.deleteMany(),
      prisma.payrollAdjustment.deleteMany(),
      prisma.allowanceItem.deleteMany(),
      prisma.salaryRecord.deleteMany(),
      prisma.employmentRecord.deleteMany(),
      prisma.dataExport.deleteMany(),
      prisma.backupRecord.deleteMany(),
      prisma.integrationSyncLog.deleteMany(),
      prisma.webhookDelivery.deleteMany(),
      prisma.webhookEndpoint.deleteMany(),
      prisma.integration.deleteMany(),
      prisma.scheduledJob.deleteMany(),
      prisma.systemConfig.deleteMany(),
      prisma.notification.deleteMany(),
      prisma.notificationTemplate.deleteMany(),
      prisma.auditLog.deleteMany(),
      prisma.loginAttempt.deleteMany(),
      prisma.userSession.deleteMany(),
      prisma.mfaDevice.deleteMany(),
      prisma.apiKey.deleteMany(),
      prisma.rolePermission.deleteMany(),
      prisma.roleDefinition.deleteMany(),
      prisma.permission.deleteMany(),
      prisma.entraIdentity.deleteMany(),
      prisma.employeeProfile.deleteMany(),
      prisma.employee.deleteMany(),
      prisma.team.deleteMany(),
      prisma.position.deleteMany(),
      prisma.department.deleteMany(),
    ]);
  }

  console.log("\n— Catalog defaults —");
  await seedDepartments();
  await seedPositions();
  await seedHolidays();
  await seedLeavePolicies();
  const perms = await seedPermissions();
  await seedRoles(perms);
  await seedNotificationTemplates();
  await seedSystemConfig();
  await seedIntegrations();

  console.log("\n— Sample / demo data —");
  await seedTeams();
  await seedEmployees();
  await seedKpiCycles();
  await seedKpiSections();
  await seedKpiTemplates();
  await seedTrainingCatalogue();
  await seedBadges();

  console.log("\n✓ Seeding complete");
}

main()
  .catch((e) => {
    console.error("✗ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
