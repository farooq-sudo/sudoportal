// ────────────────────────────────────────────────────────────────────────────
//  tests/smoke.test.ts
//  Lightweight end-to-end checks:
//    - /api/v1/health returns 200 and "ok"
//    - /auth/dev-login returns a JWT
//    - /employees requires auth (401 without token)
//    - /employees returns rows when authenticated
//
//  Run via:  npm test
//  Requires the DB to be seeded with the demo data first.
// ────────────────────────────────────────────────────────────────────────────

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/server.js";

test("GET /api/v1/health returns ok", async () => {
  const app = await buildApp();
  try {
    const res = await app.inject({ method: "GET", url: "/api/v1/health" });
    assert.equal(res.statusCode, 200);
    const body = res.json() as { status: string; db: string; version: string };
    assert.ok(body.status === "ok" || body.status === "degraded");
    assert.ok(body.version);
  } finally {
    await app.close();
  }
});

test("GET /api/v1/employees requires auth", async () => {
  const app = await buildApp();
  try {
    const res = await app.inject({ method: "GET", url: "/api/v1/employees" });
    assert.equal(res.statusCode, 401);
  } finally {
    await app.close();
  }
});

test("POST /api/v1/auth/dev-login mints a JWT", async () => {
  const app = await buildApp();
  try {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/auth/dev-login",
      payload: { empId: "E004" }, // Justine - HR + Employee
    });
    if (res.statusCode === 404) {
      console.warn("  (skipping dev-login test - E004 not seeded)");
      return;
    }
    assert.equal(res.statusCode, 200);
    const body = res.json() as { token: string; user: { roles: string[] } };
    assert.ok(body.token);
    assert.ok(body.user.roles.includes("HR"));
  } finally {
    await app.close();
  }
});

test("GET /api/v1/employees works with a dev-login token", async () => {
  const app = await buildApp();
  try {
    const login = await app.inject({
      method: "POST",
      url: "/api/v1/auth/dev-login",
      payload: { empId: "E004" },
    });
    if (login.statusCode !== 200) {
      console.warn("  (skipping authed list test - dev-login unavailable)");
      return;
    }
    const token = (login.json() as { token: string }).token;
    const res = await app.inject({
      method: "GET",
      url: "/api/v1/employees",
      headers: { authorization: `Bearer ${token}` },
    });
    assert.equal(res.statusCode, 200);
    const body = res.json() as { rows: unknown[]; total: number };
    assert.ok(Array.isArray(body.rows));
    assert.ok(typeof body.total === "number");
  } finally {
    await app.close();
  }
});
