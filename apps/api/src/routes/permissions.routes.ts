// ────────────────────────────────────────────────────────────────────────────
//  src/routes/permissions.routes.ts
//  Fine-grained permission catalog + role definitions + grants.
//  Admin only.
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";
import { serializeRole } from "../utils/serializers.js";

const permRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // ── PERMISSIONS CATALOG ───────────────────────────────────────────────
  app.get("/permissions", async (req) => {
    await req.requireRole("ADMIN", "AUDITOR");
    const items = await app.prisma.permission.findMany({
      where: { active: true }, orderBy: [{ category: "asc" }, { key: "asc" }],
    });
    return { items };
  });

  app.post("/permissions", async (req) => {
    const session = await req.requireRole("ADMIN");
    const body = z.object({
      key: z.string().regex(/^[a-z_]+(\.[a-z_]+)+$/),
      category: z.string(),
      label: z.string(),
      description: z.string().optional(),
    }).parse(req.body);
    const p = await app.prisma.permission.upsert({
      where: { key: body.key }, create: body, update: body,
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "permission.upsert", target: body.key, targetType: "Permission",
      severity: "security",
    });
    return p;
  });

  // ── ROLE DEFINITIONS ──────────────────────────────────────────────────
  app.get("/roles", async (req) => {
    await req.requireRole("ADMIN", "HR", "AUDITOR");
    const items = await app.prisma.roleDefinition.findMany({
      where: { active: true },
      include: {
        permissions: { include: { permission: { select: { key: true, label: true, category: true } } } },
      },
      orderBy: { key: "asc" },
    });
    return { items: items.map(serializeRole) };
  });

  app.post("/roles", async (req) => {
    const session = await req.requireRole("ADMIN");
    const body = z.object({
      key: z.string(),
      label: z.string(),
      description: z.string().optional(),
    }).parse(req.body);
    const r = await app.prisma.roleDefinition.upsert({
      where: { key: body.key }, create: body, update: body,
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "role.upsert", target: body.key, targetType: "RoleDefinition",
      severity: "security",
    });
    return r;
  });

  // Grant / revoke permission on role
  app.post("/roles/:roleKey/permissions", async (req) => {
    const session = await req.requireRole("ADMIN");
    const { roleKey } = z.object({ roleKey: z.string() }).parse(req.params);
    const body = z.object({ permissionKey: z.string() }).parse(req.body);
    const grant = await app.prisma.rolePermission.upsert({
      where: { roleKey_permissionKey: { roleKey, permissionKey: body.permissionKey } },
      create: { roleKey, permissionKey: body.permissionKey, grantedBy: session.sub },
      update: {},
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "role.grant_permission", target: roleKey, targetType: "RoleDefinition",
      severity: "security",
      metadata: { permissionKey: body.permissionKey },
    });
    return grant;
  });

  app.delete("/roles/:roleKey/permissions/:permKey", async (req) => {
    const session = await req.requireRole("ADMIN");
    const { roleKey, permKey } = z.object({
      roleKey: z.string(), permKey: z.string(),
    }).parse(req.params);
    await app.prisma.rolePermission.delete({
      where: { roleKey_permissionKey: { roleKey, permissionKey: permKey } },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "role.revoke_permission", target: roleKey, targetType: "RoleDefinition",
      severity: "security",
      metadata: { permissionKey: permKey },
    });
    return { ok: true };
  });
};

export default permRoutes;
