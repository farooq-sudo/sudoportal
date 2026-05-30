-- ════════════════════════════════════════════════════════════════════════════
--  rls-policies.sql
--  Row-level security policies for SUDO Portal.
--
--  How it works:
--    The Fastify auth plugin sets two session-scoped GUCs at the start of each
--    request:
--
--      SET LOCAL app.current_user_id = '<empId>';
--      SET LOCAL app.current_user_roles = 'ADMIN,HR,EMPLOYEE';
--
--    These policies use current_setting('app.current_user_id', true) and
--    string_to_array(current_setting('app.current_user_roles', true), ',') to
--    decide what each row-level fetch may see.
--
--  How to apply:
--    psql $DATABASE_URL -f db/rls-policies.sql
--    or via the docker-compose: docker compose exec db psql -U sudo -d sudo_portal -f /db/rls-policies.sql
--
--  These policies are advisory: the application enforces equivalent checks
--  in route handlers. RLS is defence-in-depth — if a route forgets a check,
--  RLS still prevents leakage.
--
--  Conventions:
--    - Tables with PII or sensitive data → RLS enabled
--    - ADMIN role bypasses all RLS via BYPASSRLS GRANT
--    - Read policies named "<table>_select_<who>"; write policies "<table>_modify_<who>"
-- ════════════════════════════════════════════════════════════════════════════

-- Drop existing policies so this file is idempotent
DO $$
DECLARE r record;
BEGIN
  FOR r IN (
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- ── Helper: current user / role ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION app_current_user() RETURNS text AS $$
  SELECT current_setting('app.current_user_id', true);
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION app_has_role(role text) RETURNS boolean AS $$
  SELECT role = ANY(string_to_array(coalesce(current_setting('app.current_user_roles', true), ''), ','));
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION app_is_admin() RETURNS boolean AS $$
  SELECT app_has_role('ADMIN');
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION app_is_hr() RETURNS boolean AS $$
  SELECT app_has_role('HR') OR app_has_role('ADMIN');
$$ LANGUAGE sql STABLE;

-- ── EmployeeProfile (most sensitive — PII) ──────────────────────────────────
ALTER TABLE "EmployeeProfile" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "EmployeeProfile_select" ON "EmployeeProfile"
  FOR SELECT USING (
    app_is_hr()
    OR "empId" = app_current_user()
  );

CREATE POLICY "EmployeeProfile_modify" ON "EmployeeProfile"
  FOR ALL USING (
    app_is_hr()
    OR ("empId" = app_current_user() AND NOT app_is_admin())  -- self can edit non-PII via app
  );

-- ── SalaryRecord ────────────────────────────────────────────────────────────
ALTER TABLE "SalaryRecord" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SalaryRecord_select" ON "SalaryRecord"
  FOR SELECT USING (
    app_is_hr() OR app_has_role('FINANCE')
  );

CREATE POLICY "SalaryRecord_modify" ON "SalaryRecord"
  FOR ALL USING (
    app_is_hr()
  );

-- ── BankAccount ─────────────────────────────────────────────────────────────
ALTER TABLE "BankAccount" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "BankAccount_select" ON "BankAccount"
  FOR SELECT USING (
    app_is_hr() OR app_has_role('FINANCE')
    OR "empId" = app_current_user()
  );

CREATE POLICY "BankAccount_modify" ON "BankAccount"
  FOR ALL USING (
    app_is_hr() OR "empId" = app_current_user()
  );

-- ── FamilyMember ────────────────────────────────────────────────────────────
ALTER TABLE "FamilyMember" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "FamilyMember_select" ON "FamilyMember"
  FOR SELECT USING (
    app_is_hr() OR "empId" = app_current_user()
  );

CREATE POLICY "FamilyMember_modify" ON "FamilyMember"
  FOR ALL USING (
    app_is_hr() OR "empId" = app_current_user()
  );

-- ── Document (visibility scope) ─────────────────────────────────────────────
ALTER TABLE "Document" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Document_select" ON "Document"
  FOR SELECT USING (
    app_is_hr()
    OR "empId" IS NULL          -- org-wide policy documents
    OR "empId" = app_current_user()
  );

CREATE POLICY "Document_modify" ON "Document"
  FOR ALL USING (
    app_is_hr()
  );

-- ── AuditLog (read-only for everyone except ADMIN + AUDITOR) ────────────────
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "AuditLog_select" ON "AuditLog"
  FOR SELECT USING (
    app_is_admin() OR app_has_role('AUDITOR')
  );

-- AuditLog inserts come from the application; policy doesn't grant DELETE/UPDATE.
CREATE POLICY "AuditLog_insert" ON "AuditLog"
  FOR INSERT WITH CHECK (true);

-- ── LeaveRequest ────────────────────────────────────────────────────────────
ALTER TABLE "LeaveRequest" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "LeaveRequest_select" ON "LeaveRequest"
  FOR SELECT USING (
    app_is_hr()
    OR "empId" = app_current_user()
    OR "currentApprover" = app_current_user()
  );

CREATE POLICY "LeaveRequest_modify" ON "LeaveRequest"
  FOR ALL USING (
    app_is_hr()
    OR "empId" = app_current_user()
    OR "currentApprover" = app_current_user()
  );

-- ── Notification ────────────────────────────────────────────────────────────
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notification_select" ON "Notification"
  FOR SELECT USING (
    app_is_admin()
    OR "empId" = app_current_user()
    OR "empId" IS NULL         -- broadcast notifications visible to all
  );

CREATE POLICY "Notification_modify" ON "Notification"
  FOR ALL USING (
    app_is_admin() OR "empId" = app_current_user()
  );

-- ── UserSession ─────────────────────────────────────────────────────────────
ALTER TABLE "UserSession" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "UserSession_select" ON "UserSession"
  FOR SELECT USING (
    app_is_admin() OR "empId" = app_current_user()
  );

CREATE POLICY "UserSession_modify" ON "UserSession"
  FOR ALL USING (
    app_is_admin() OR "empId" = app_current_user()
  );

-- ── ApiKey (Admin only) ─────────────────────────────────────────────────────
ALTER TABLE "ApiKey" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ApiKey_all" ON "ApiKey" FOR ALL USING (app_is_admin());

-- ── MfaDevice ───────────────────────────────────────────────────────────────
ALTER TABLE "MfaDevice" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "MfaDevice_select" ON "MfaDevice"
  FOR SELECT USING (app_is_hr() OR "empId" = app_current_user());

CREATE POLICY "MfaDevice_modify" ON "MfaDevice"
  FOR ALL USING (app_is_admin() OR "empId" = app_current_user());

-- ── LoginAttempt (Admin/Auditor only) ───────────────────────────────────────
ALTER TABLE "LoginAttempt" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "LoginAttempt_select" ON "LoginAttempt"
  FOR SELECT USING (app_is_admin() OR app_has_role('AUDITOR'));

CREATE POLICY "LoginAttempt_insert" ON "LoginAttempt"
  FOR INSERT WITH CHECK (true);

-- ── BackgroundCheck (HR + Recruiter only) ───────────────────────────────────
ALTER TABLE "BackgroundCheck" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "BackgroundCheck_all" ON "BackgroundCheck"
  FOR ALL USING (app_is_hr() OR app_has_role('RECRUITER'));

-- ── OneOnOneNote (visibility-aware) ─────────────────────────────────────────
ALTER TABLE "OneOnOneNote" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "OneOnOneNote_select" ON "OneOnOneNote"
  FOR SELECT USING (
    "authorEmpId" = app_current_user()
    OR (visibility = 'SHARED' AND "subjectEmpId" = app_current_user())
    OR (visibility = 'HR_ONLY' AND app_is_hr())
    OR app_is_admin()
  );

-- Everything else is wide-open by default; the application enforces auth.
-- Add more policies here as new sensitive tables are added.
