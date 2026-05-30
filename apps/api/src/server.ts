// ────────────────────────────────────────────────────────────────────────────
//  src/server.ts
//  Fastify application entry point. Wires plugins → routes → error handler.
//  Designed so `npm run dev` (tsx watch) and `npm start` (node dist/) both
//  produce the same running app.
// ────────────────────────────────────────────────────────────────────────────

import Fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import sensible from "@fastify/sensible";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import { config } from "./config.js";
import { loggerConfig } from "./utils/logger.js";
import { AppError } from "./utils/errors.js";

import prismaPlugin from "./plugins/prisma.js";
import authPlugin from "./plugins/auth.js";
import corsPlugin from "./plugins/cors.js";

import authRoutes from "./routes/auth.routes.js";
import employeeRoutes from "./routes/employees.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import teamRoutes from "./routes/teams.routes.js";
import orgRoutes from "./routes/org.routes.js";
import kpiRoutes from "./routes/kpi.routes.js";
import leaveRoutes from "./routes/leave.routes.js";
import trainingRoutes from "./routes/training.routes.js";
import onboardingRoutes from "./routes/onboarding.routes.js";
import probationRoutes from "./routes/probation.routes.js";
import projectRatingRoutes from "./routes/project-ratings.routes.js";
import projectsRoutes from "./routes/projects.routes.js";
import documentsRoutes from "./routes/documents.routes.js";
import requestsRoutes from "./routes/requests.routes.js";
import exportsRoutes from "./routes/exports.routes.js";
import compensationRoutes from "./routes/compensation.routes.js";
import familyRoutes from "./routes/family.routes.js";
import peopleRoutes from "./routes/people.routes.js";
import lifecycleRoutes from "./routes/lifecycle.routes.js";
import permissionsRoutes from "./routes/permissions.routes.js";
import auditRoutes from "./routes/audit.routes.js";
import notificationRoutes from "./routes/notifications.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import m365Routes from "./routes/m365.routes.js";
import webhookRoutes from "./routes/webhooks.routes.js";
import holidayRoutes from "./routes/holidays.routes.js";
import assetRoutes from "./routes/assets.routes.js";
import announcementRoutes from "./routes/announcements.routes.js";
import commentRoutes from "./routes/comments.routes.js";
import sessionRoutes from "./routes/sessions.routes.js";
import securityRoutes from "./routes/security.routes.js";
import systemRoutes from "./routes/system.routes.js";

const VERSION = "0.1.0";

async function buildApp() {
  const app = Fastify({
    logger: loggerConfig,
    trustProxy: true,                           // honour X-Forwarded-* behind nginx
    bodyLimit: 5 * 1024 * 1024,                  // 5 MB max JSON — accommodates ≤2MB photo data URIs + headers
  });

  // ── Plugins ────────────────────────────────────────────────────────────
  await app.register(sensible);
  await app.register(corsPlugin);
  await app.register(prismaPlugin);
  await app.register(authPlugin);

  // ── OpenAPI / Swagger ──────────────────────────────────────────────────
  // Auto-generates spec from registered routes. Visit /api/docs for the UI;
  // /api/docs/json for the raw OpenAPI document (importable into Postman,
  // Insomnia, Stoplight, etc.).
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "SUDO Consultants Portal API",
        description: "Internal HR / KPI / Operations API. Auth: Bearer JWT via /api/v1/auth/login (Entra OIDC) or /api/v1/auth/dev-login (dev only).",
        version: VERSION,
      },
      servers: [
        { url: "http://localhost/api/v1", description: "Local docker-compose" },
        { url: "/api/v1", description: "Current host" },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "JWT obtained from /auth/login or /auth/dev-login",
          },
        },
      },
      security: [{ bearerAuth: [] }],
      tags: [
        { name: "auth",            description: "Authentication" },
        { name: "employees",       description: "Employee directory" },
        { name: "profile",         description: "Employee PII profile" },
        { name: "teams",           description: "Teams" },
        { name: "org",             description: "Departments / positions / employment history" },
        { name: "kpi",             description: "KPI cycles, templates, assignments" },
        { name: "leave",           description: "Leave policies, balances, requests" },
        { name: "training",        description: "Training catalog + assignments" },
        { name: "onboarding",      description: "Onboarding steps" },
        { name: "probation",       description: "Probation cases" },
        { name: "project-ratings", description: "Project rating chain" },
        { name: "projects",        description: "Projects + timesheets" },
        { name: "documents",       description: "Documents + e-signatures" },
        { name: "requests",        description: "Unified request workflow" },
        { name: "exports",         description: "Data exports" },
        { name: "compensation",    description: "Salary + payroll + bank" },
        { name: "family",          description: "Family + insurance" },
        { name: "people",          description: "Recognition + feedback + badges" },
        { name: "lifecycle",       description: "Air tickets, offboarding, background checks" },
        { name: "permissions",     description: "Permission catalog + role grants" },
        { name: "audit",           description: "Audit log" },
        { name: "notifications",   description: "In-app + outbound notifications" },
        { name: "admin",           description: "Admin dashboard data" },
        { name: "m365",            description: "Microsoft 365 integration" },
        { name: "webhooks",        description: "Webhook endpoints + deliveries" },
        { name: "holidays",        description: "Public holiday calendar" },
        { name: "assets",          description: "IT asset tracking" },
        { name: "announcements",   description: "Company announcements" },
        { name: "comments",        description: "Polymorphic comments" },
        { name: "sessions",        description: "User session management" },
        { name: "security",        description: "API keys + MFA" },
        { name: "system",          description: "Templates + jobs + backups + sync logs" },
      ],
    },
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: "/api/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
      tryItOutEnabled: true,
      persistAuthorization: true,
    },
    staticCSP: true,
  });

  // ── Health check (no auth, no DB blocking) ────────────────────────────
  app.get("/api/v1/health", async () => {
    let dbStatus: "connected" | "error" = "error";
    try {
      // Lightweight ping. raw query because we don't want Prisma to load
      // any model metadata here.
      await app.prisma.$queryRaw`SELECT 1`;
      dbStatus = "connected";
    } catch {
      dbStatus = "error";
    }
    return {
      status: dbStatus === "connected" ? "ok" : "degraded",
      db: dbStatus,
      version: VERSION,
      env: config.NODE_ENV,
      timestamp: new Date().toISOString(),
    };
  });

  // ── Routes ─────────────────────────────────────────────────────────────
  // Every route group lives under /api/v1/<resource>.
  await app.register(authRoutes,          { prefix: "/api/v1/auth" });
  await app.register(employeeRoutes,      { prefix: "/api/v1/employees" });
  await app.register(profileRoutes,       { prefix: "/api/v1/profiles" });
  await app.register(teamRoutes,          { prefix: "/api/v1/teams" });
  await app.register(orgRoutes,           { prefix: "/api/v1/org" });
  await app.register(kpiRoutes,           { prefix: "/api/v1/kpi" });
  await app.register(leaveRoutes,         { prefix: "/api/v1/leave" });
  await app.register(trainingRoutes,      { prefix: "/api/v1/training" });
  await app.register(onboardingRoutes,    { prefix: "/api/v1/onboarding" });
  await app.register(probationRoutes,     { prefix: "/api/v1/probation" });
  await app.register(projectRatingRoutes, { prefix: "/api/v1/project-ratings" });
  await app.register(projectsRoutes,      { prefix: "/api/v1/projects" });
  await app.register(documentsRoutes,     { prefix: "/api/v1/documents" });
  await app.register(requestsRoutes,      { prefix: "/api/v1/requests" });
  await app.register(exportsRoutes,       { prefix: "/api/v1/exports" });
  await app.register(compensationRoutes,  { prefix: "/api/v1/compensation" });
  await app.register(familyRoutes,        { prefix: "/api/v1/family" });
  await app.register(peopleRoutes,        { prefix: "/api/v1/people" });
  await app.register(lifecycleRoutes,     { prefix: "/api/v1/lifecycle" });
  await app.register(permissionsRoutes,   { prefix: "/api/v1/permissions" });
  await app.register(auditRoutes,         { prefix: "/api/v1/audit" });
  await app.register(notificationRoutes,  { prefix: "/api/v1/notifications" });
  await app.register(adminRoutes,         { prefix: "/api/v1/admin" });
  await app.register(m365Routes,          { prefix: "/api/v1/m365" });
  await app.register(webhookRoutes,       { prefix: "/api/v1/webhooks" });
  await app.register(holidayRoutes,       { prefix: "/api/v1/holidays" });
  await app.register(assetRoutes,         { prefix: "/api/v1/assets" });
  await app.register(announcementRoutes,  { prefix: "/api/v1/announcements" });
  await app.register(commentRoutes,       { prefix: "/api/v1/comments" });
  await app.register(sessionRoutes,       { prefix: "/api/v1/sessions" });
  await app.register(securityRoutes,      { prefix: "/api/v1/security" });
  await app.register(systemRoutes,        { prefix: "/api/v1/system" });

  // ── Global error handler ──────────────────────────────────────────────
  app.setErrorHandler((err: FastifyError, req: FastifyRequest, reply: FastifyReply) => {
    // AppErrors carry their own status + code
    if (err instanceof AppError) {
      req.log.warn({ err: { code: err.code, msg: err.message } }, "Handled AppError");
      return reply.code(err.statusCode).send({
        error: err.code,
        message: err.message,
        details: err.details,
      });
    }
    // Zod validation errors (thrown from .parse()) come through here with
    // `validation` set by sensible + a 400 status. We pass them along.
    if ((err as { validation?: unknown }).validation) {
      return reply.code(400).send({
        error: "validation_failed",
        message: err.message,
        details: (err as unknown as { validation: unknown }).validation,
      });
    }
    // Prisma errors that bubble all the way up are usually a missing record
    // (P2025) or unique constraint (P2002). Surface a 404 / 409.
    const code = (err as { code?: string }).code;
    if (code === "P2025") {
      return reply.code(404).send({ error: "not_found", message: "Record not found" });
    }
    if (code === "P2002") {
      return reply.code(409).send({
        error: "conflict",
        message: "A record with this unique value already exists",
        details: (err as { meta?: unknown }).meta,
      });
    }
    // Unknown — log full stack, return generic 500
    req.log.error({ err }, "Unhandled error");
    return reply.code(500).send({
      error: "internal_error",
      message: config.isProduction
        ? "An unexpected error occurred"
        : err.message,
    });
  });

  // 404 — JSON shape
  app.setNotFoundHandler((req, reply) => {
    reply.code(404).send({
      error: "not_found",
      message: `No route for ${req.method} ${req.url}`,
    });
  });

  return app;
}

// ── Boot ───────────────────────────────────────────────────────────────────
async function main() {
  const app = await buildApp();
  try {
    await app.listen({ port: config.PORT, host: "0.0.0.0" });
    app.log.info(`SUDO Portal API v${VERSION} listening on :${config.PORT}`);
    if (!config.isEntraConfigured) {
      app.log.warn(
        "Entra ID is NOT configured — /auth/login will return 503. Use /auth/dev-login in development."
      );
    }
  } catch (err) {
    app.log.error({ err }, "Failed to start server");
    process.exit(1);
  }

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    app.log.info({ signal }, "Shutting down");
    try {
      await app.close();
      process.exit(0);
    } catch (err) {
      app.log.error({ err }, "Error during shutdown");
      process.exit(1);
    }
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

// Only run if invoked directly (not when imported by tests).
// require.main works for CommonJS; for tsx-run scripts, NODE_ENV !== "test"
// is also a reliable fallback.
const isMain = typeof require !== "undefined" && require.main === module;
if (isMain || process.env.SUDO_FORCE_START === "1") {
  void main();
}

export { buildApp };
