// ────────────────────────────────────────────────────────────────────────────
//  src/routes/assets.routes.ts
//  IT asset tracking — laptops, monitors, phones — and assignment history.
//  IT/HR manage; employees can view their own assigned items.
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import crypto from "node:crypto";
import { audit } from "../services/audit.service.js";
import { notify } from "../services/notification.service.js";
import { ForbiddenError, NotFoundError, ConflictError } from "../utils/errors.js";

const CategoryEnum = z.enum([
  "LAPTOP", "DESKTOP", "MONITOR", "PHONE", "TABLET",
  "HEADSET", "DOCK", "KEYBOARD", "MOUSE", "PRINTER",
  "ACCESS_CARD", "VEHICLE", "OTHER",
]);
const StatusEnum = z.enum([
  "AVAILABLE", "ASSIGNED", "IN_REPAIR", "RETIRED", "LOST", "STOLEN",
]);

const assetRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // List assets
  app.get("/", async (req) => {
    await req.requireRole("ADMIN", "HR");
    const qs = z.object({
      category: CategoryEnum.optional(),
      status: StatusEnum.optional(),
      location: z.string().optional(),
      search: z.string().optional(),
      limit: z.coerce.number().int().min(1).max(500).default(100),
      offset: z.coerce.number().int().min(0).default(0),
    }).parse(req.query);

    const where: Record<string, unknown> = { deletedAt: null };
    if (qs.category) where.category = qs.category;
    if (qs.status) where.status = qs.status;
    if (qs.location) where.location = qs.location;
    if (qs.search) {
      where.OR = [
        { id: { contains: qs.search, mode: "insensitive" } },
        { serialNumber: { contains: qs.search, mode: "insensitive" } },
        { assetTag: { contains: qs.search, mode: "insensitive" } },
        { brand: { contains: qs.search, mode: "insensitive" } },
        { model: { contains: qs.search, mode: "insensitive" } },
      ];
    }
    const [items, total] = await Promise.all([
      app.prisma.asset.findMany({
        where, take: qs.limit, skip: qs.offset,
        orderBy: { createdAt: "desc" },
        include: {
          assignments: {
            where: { active: true },
            take: 1,
            orderBy: { assignedAt: "desc" },
          },
        },
      }),
      app.prisma.asset.count({ where }),
    ]);
    return { items, total };
  });

  app.get("/:id", async (req) => {
    await req.requireRole("ADMIN", "HR");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const a = await app.prisma.asset.findUnique({
      where: { id },
      include: { assignments: { orderBy: { assignedAt: "desc" } } },
    });
    if (!a) throw new NotFoundError("Asset");
    return a;
  });

  // Create / upsert
  app.post("/", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const body = z.object({
      id: z.string(),
      category: CategoryEnum,
      brand: z.string().optional(),
      model: z.string().optional(),
      serialNumber: z.string().optional(),
      assetTag: z.string().optional(),
      purchaseDate: z.coerce.date().optional(),
      purchasePrice: z.number().optional(),
      currency: z.string().default("AED"),
      warrantyUntil: z.coerce.date().optional(),
      supplier: z.string().optional(),
      location: z.string().optional(),
      specifications: z.record(z.unknown()).optional(),
      notes: z.string().optional(),
    }).parse(req.body);

    const a = await app.prisma.asset.upsert({
      where: { id: body.id },
      create: { ...body, specifications: body.specifications as object | undefined },
      update: { ...body, specifications: body.specifications as object | undefined },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "asset.upsert", target: body.id, targetType: "Asset",
      category: "it",
      metadata: { category: body.category },
    });
    return a;
  });

  app.patch("/:id", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      status: StatusEnum.optional(),
      location: z.string().optional(),
      notes: z.string().optional(),
      specifications: z.record(z.unknown()).optional(),
    }).parse(req.body);
    const a = await app.prisma.asset.update({
      where: { id },
      data: { ...body, specifications: body.specifications as object | undefined },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "asset.update", target: id, targetType: "Asset",
      category: "it", metadata: body,
    });
    return a;
  });

  // ── Assignment ────────────────────────────────────────────────────────
  // Assign asset to employee
  app.post("/:id/assign", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      empId: z.string(),
      notes: z.string().optional(),
    }).parse(req.body);

    const asset = await app.prisma.asset.findUnique({ where: { id } });
    if (!asset) throw new NotFoundError("Asset");
    if (asset.status !== "AVAILABLE") {
      throw new ConflictError(`Asset is ${asset.status} — cannot assign`);
    }

    const assignment = await app.prisma.assetAssignment.create({
      data: {
        assetId: id,
        empId: body.empId,
        assignedBy: session.sub,
        active: true,
      },
    });
    await app.prisma.asset.update({
      where: { id }, data: { status: "ASSIGNED" },
    });
    await notify(app.prisma, {
      empId: body.empId,
      category: "SYSTEM",
      title: `Asset assigned: ${asset.category}`,
      body: `${asset.brand ?? ""} ${asset.model ?? ""} (${id}) is now assigned to you. Please review the handover form.`,
      url: `/assets/me`,
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "asset.assign", target: id, targetType: "Asset",
      category: "it",
      metadata: { empId: body.empId },
    });
    return assignment;
  });

  // Employee acknowledges handover form
  app.post("/assignments/:id/acknowledge", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const a = await app.prisma.assetAssignment.findUnique({ where: { id } });
    if (!a) throw new NotFoundError("Assignment");
    if (a.empId !== session.sub) {
      throw new ForbiddenError("You can only acknowledge your own assignments");
    }
    const hash = crypto.createHash("sha256")
      .update(`${a.id}|${a.assetId}|${a.empId}|${new Date().toISOString()}`)
      .digest("hex");
    const updated = await app.prisma.assetAssignment.update({
      where: { id },
      data: { acknowledgementSignedAt: new Date(), acknowledgementSignedHash: hash },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "asset.acknowledge", target: id, targetType: "AssetAssignment",
    });
    return updated;
  });

  // Return asset
  app.post("/assignments/:id/return", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      returnCondition: z.enum(["GOOD", "FAIR", "DAMAGED"]).default("GOOD"),
      returnNotes: z.string().optional(),
    }).parse(req.body);
    const a = await app.prisma.assetAssignment.findUnique({ where: { id } });
    if (!a) throw new NotFoundError("Assignment");
    if (!a.active) throw new ConflictError("Assignment already closed");

    await app.prisma.assetAssignment.update({
      where: { id },
      data: {
        returnedAt: new Date(),
        returnCondition: body.returnCondition,
        returnNotes: body.returnNotes,
        receivedBy: session.sub,
        active: false,
      },
    });
    await app.prisma.asset.update({
      where: { id: a.assetId },
      data: {
        status: body.returnCondition === "DAMAGED" ? "IN_REPAIR" : "AVAILABLE",
      },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "asset.return", target: a.assetId, targetType: "Asset",
      category: "it",
      metadata: { empId: a.empId, condition: body.returnCondition },
    });
    return { ok: true };
  });

  // My assets (employee self-view)
  app.get("/me", async (req) => {
    const session = await req.requireAuth();
    const items = await app.prisma.assetAssignment.findMany({
      where: { empId: session.sub, active: true },
      include: { asset: true },
      orderBy: { assignedAt: "desc" },
    });
    return { items };
  });

  // Per-employee view (HR)
  app.get("/employee/:empId", async (req) => {
    const session = await req.requireAuth();
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const isSelf = session.sub === empId;
    const isPriv = session.roles.some((r) => r === "ADMIN" || r === "HR");
    if (!isSelf && !isPriv) throw new ForbiddenError();
    const items = await app.prisma.assetAssignment.findMany({
      where: { empId },
      include: { asset: true },
      orderBy: { assignedAt: "desc" },
    });
    return { empId, items };
  });
};

export default assetRoutes;
