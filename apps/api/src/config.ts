// ────────────────────────────────────────────────────────────────────────────
//  src/config.ts
//  Typed config loader. Reads environment variables once, validates with
//  Zod, exits with a clear error if anything required is missing.
// ────────────────────────────────────────────────────────────────────────────

import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal"]).default("info"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 chars"),
  JWT_EXPIRES_IN: z.string().default("8h"),

  CORS_ORIGINS: z.string().default(""),

  // M365 / Entra — empty strings allowed in dev (auth routes will 503)
  ENTRA_TENANT_ID: z.string().default(""),
  ENTRA_CLIENT_ID: z.string().default(""),
  ENTRA_CLIENT_SECRET: z.string().default(""),
  ENTRA_REDIRECT_URI: z.string().default("http://localhost:3000/api/v1/auth/callback"),
  ENTRA_POST_LOGOUT_REDIRECT_URI: z.string().default("http://localhost:8080/"),

  ENTRA_GROUP_ADMIN: z.string().default(""),
  ENTRA_GROUP_HR: z.string().default(""),
  ENTRA_GROUP_PM: z.string().default(""),
  ENTRA_GROUP_TL: z.string().default(""),
  ENTRA_GROUP_EMPLOYEE: z.string().default(""),
  ENTRA_GROUP_FINANCE: z.string().default(""),
  ENTRA_GROUP_RECRUITER: z.string().default(""),
  ENTRA_GROUP_AUDITOR: z.string().default(""),

  M365_GRAPH_SCOPES: z.string().default("User.Read User.Read.All Group.Read.All"),

  ODOO_BASE_URL: z.string().default(""),
  ODOO_DB: z.string().default(""),
  ODOO_API_KEY: z.string().default(""),
  ODOO_API_KEY_USER: z.string().default("admin"),

  // SMTP / email
  SMTP_HOST: z.string().default(""),
  SMTP_PORT: z.coerce.number().int().default(587),
  SMTP_USER: z.string().default(""),
  SMTP_PASS: z.string().default(""),
  SMTP_FROM: z.string().default("noreply@sudoconsultants.com"),
  SMTP_SECURE: z.coerce.boolean().default(false),

  WEBHOOK_SIGNING_SECRET: z.string().default(""),

  SLACK_WEBHOOK_URL: z.string().default(""),

  ALLOW_DESTRUCTIVE_SEED: z
    .string()
    .default("false")
    .transform((s) => s.toLowerCase() === "true"),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("Invalid environment configuration:");
  for (const issue of parsed.error.issues) {
    // eslint-disable-next-line no-console
    console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

export const config = {
  ...parsed.data,
  // Derived: parsed list of allowed CORS origins
  corsOriginsList: parsed.data.CORS_ORIGINS
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
  // Derived: roleGroupMap — Entra group ObjectID → SUDO role
  entraRoleGroups: {
    admin: parsed.data.ENTRA_GROUP_ADMIN,
    hr: parsed.data.ENTRA_GROUP_HR,
    pm: parsed.data.ENTRA_GROUP_PM,
    tl: parsed.data.ENTRA_GROUP_TL,
    employee: parsed.data.ENTRA_GROUP_EMPLOYEE,
    finance: parsed.data.ENTRA_GROUP_FINANCE,
    recruiter: parsed.data.ENTRA_GROUP_RECRUITER,
    auditor: parsed.data.ENTRA_GROUP_AUDITOR,
  },
  // Helpers
  isProduction: parsed.data.NODE_ENV === "production",
  isEntraConfigured:
    !!parsed.data.ENTRA_TENANT_ID &&
    !!parsed.data.ENTRA_CLIENT_ID &&
    !!parsed.data.ENTRA_CLIENT_SECRET,
};

export type AppConfig = typeof config;
