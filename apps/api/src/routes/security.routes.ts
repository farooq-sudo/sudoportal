// ────────────────────────────────────────────────────────────────────────────
//  src/routes/security.routes.ts
//  API keys (service-to-service tokens) + MFA device enrollment.
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import crypto from "node:crypto";
import { audit } from "../services/audit.service.js";
import { ForbiddenError, NotFoundError } from "../utils/errors.js";

const securityRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // ═══════════════════════════════════════════════════════════════════════
  //  API KEYS — Admin manages service-to-service tokens
  // ═══════════════════════════════════════════════════════════════════════
  app.get("/api-keys", async (req) => {
    await req.requireRole("ADMIN");
    const items = await app.prisma.apiKey.findMany({
      orderBy: { createdAt: "desc" },
      // never return keyHash in lists
      select: {
        id: true, name: true, scope: true, createdBy: true,
        expiresAt: true, revokedAt: true, lastUsedAt: true,
        active: true, createdAt: true,
      },
    });
    return { items };
  });

  app.post("/api-keys", async (req) => {
    const session = await req.requireRole("ADMIN");
    const body = z.object({
      name: z.string().min(1).max(120),
      scope: z.array(z.string()).default([]),
      expiresAt: z.coerce.date().optional(),
    }).parse(req.body);

    // Generate a token, hash it for storage; return plain token ONCE
    const plain = `sudo_${crypto.randomBytes(32).toString("hex")}`;
    const keyHash = crypto.createHash("sha256").update(plain).digest("hex");

    const key = await app.prisma.apiKey.create({
      data: {
        name: body.name,
        keyHash,
        scope: body.scope,
        createdBy: session.sub,
        expiresAt: body.expiresAt,
      },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "apikey.create", target: key.id, targetType: "ApiKey",
      category: "security", severity: "security",
      metadata: { name: body.name, scope: body.scope },
    });
    return {
      ...key,
      keyHash: undefined,
      plainTextKey: plain,
      _warning: "Save this token now — it will not be shown again.",
    };
  });

  app.post("/api-keys/:id/revoke", async (req) => {
    const session = await req.requireRole("ADMIN");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const k = await app.prisma.apiKey.update({
      where: { id },
      data: { revokedAt: new Date(), active: false },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "apikey.revoke", target: id, targetType: "ApiKey",
      category: "security", severity: "security",
    });
    return k;
  });

  // ═══════════════════════════════════════════════════════════════════════
  //  MFA DEVICES — self-managed (Entra usually handles, but we record fallbacks)
  // ═══════════════════════════════════════════════════════════════════════
  app.get("/mfa/devices", async (req) => {
    const session = await req.requireAuth();
    const items = await app.prisma.mfaDevice.findMany({
      where: { empId: session.sub, active: true },
      orderBy: { enrolledAt: "desc" },
    });
    return { items };
  });

  app.post("/mfa/devices", async (req) => {
    const session = await req.requireAuth();
    const body = z.object({
      kind: z.enum(["TOTP", "FIDO2", "SMS", "EMAIL"]),
      label: z.string().optional(),
    }).parse(req.body);
    const d = await app.prisma.mfaDevice.create({
      data: { empId: session.sub, ...body },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "mfa.enroll", target: d.id, targetType: "MfaDevice",
      category: "security",
      metadata: { kind: body.kind },
    });
    return d;
  });

  app.delete("/mfa/devices/:id", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const d = await app.prisma.mfaDevice.findUnique({ where: { id } });
    if (!d) throw new NotFoundError("MFA device");
    if (d.empId !== session.sub && !session.roles.includes("ADMIN")) {
      throw new ForbiddenError();
    }
    await app.prisma.mfaDevice.update({
      where: { id }, data: { active: false },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "mfa.remove", target: id, targetType: "MfaDevice",
      category: "security",
    });
    return { ok: true };
  });

  // Admin: list MFA devices for any user
  app.get("/mfa/devices/employee/:empId", async (req) => {
    await req.requireRole("ADMIN", "HR");
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const items = await app.prisma.mfaDevice.findMany({
      where: { empId },
      orderBy: { enrolledAt: "desc" },
    });
    return { empId, items };
  });
};

export default securityRoutes;
