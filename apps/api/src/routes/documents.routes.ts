// ────────────────────────────────────────────────────────────────────────────
//  src/routes/documents.routes.ts
//  Document upload, retrieval, e-signature.
//
//  In production, file binaries go to S3 / Azure Blob. This route stores
//  metadata + the storage URL. Signed URLs are minted server-side and short-
//  lived. For the prototype we accept any URL the caller supplies.
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import crypto from "node:crypto";
import { audit } from "../services/audit.service.js";
import { notify } from "../services/notification.service.js";
import { BadRequestError, ForbiddenError, NotFoundError, ConflictError } from "../utils/errors.js";

const DocumentCategoryEnum = z.enum([
  "OFFER_LETTER", "CONTRACT", "PASSPORT", "EMIRATES_ID", "VISA",
  "DEGREE_CERT", "PROFESSIONAL_CERT", "POLICY_ACK", "NDA", "PAYSLIP",
  "TAX_FORM", "TRAINING_CERT", "PROBATION_LETTER", "CONFIRMATION_LETTER",
  "TERMINATION_LETTER", "OTHER",
]);

const docRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // List documents — employees see their own, HR sees all
  app.get("/", async (req) => {
    const session = await req.requireAuth();
    const qs = z.object({
      empId: z.string().optional(),
      category: DocumentCategoryEnum.optional(),
      status: z.string().optional(),
      limit: z.coerce.number().int().min(1).max(200).default(50),
      offset: z.coerce.number().int().min(0).default(0),
    }).parse(req.query);

    const isPrivileged = session.roles.some((r) => r === "ADMIN" || r === "HR");
    const where: Record<string, unknown> = { deletedAt: null };

    if (qs.empId) {
      if (qs.empId !== session.sub && !isPrivileged) {
        throw new ForbiddenError("You can only view your own documents");
      }
      where.empId = qs.empId;
    } else if (!isPrivileged) {
      where.empId = session.sub;
    }

    if (qs.category) where.category = qs.category;
    if (qs.status) where.status = qs.status;

    const [items, total] = await Promise.all([
      app.prisma.document.findMany({
        where, take: qs.limit, skip: qs.offset,
        orderBy: { createdAt: "desc" },
        include: { signatures: true },
      }),
      app.prisma.document.count({ where }),
    ]);
    return { items, total };
  });

  // Get one
  app.get("/:id", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const doc = await app.prisma.document.findUnique({
      where: { id },
      include: { signatures: { include: { signer: { select: { id: true, name: true, email: true } } } } },
    });
    if (!doc) throw new NotFoundError("Document");

    const isPrivileged = session.roles.some((r) => r === "ADMIN" || r === "HR");
    if (doc.empId && doc.empId !== session.sub && !isPrivileged) {
      throw new ForbiddenError("You do not have access to this document");
    }
    return doc;
  });

  // Upload (create metadata; in prod the file would be uploaded separately to S3)
  app.post("/", async (req) => {
    const session = await req.requireAuth();
    const body = z.object({
      empId: z.string().optional(),
      category: DocumentCategoryEnum,
      title: z.string().min(1),
      description: z.string().optional(),
      fileUrl: z.string().url(),
      fileName: z.string().optional(),
      mimeType: z.string().optional(),
      sizeBytes: z.number().int().min(0).optional(),
      effectiveDate: z.coerce.date().optional(),
      expiresAt: z.coerce.date().optional(),
      isConfidential: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
      requireSignature: z.boolean().default(false),
    }).parse(req.body);

    const isPrivileged = session.roles.some((r) => r === "ADMIN" || r === "HR");
    if (body.empId && body.empId !== session.sub && !isPrivileged) {
      throw new ForbiddenError("Only HR/Admin can upload on behalf of others");
    }

    const doc = await app.prisma.document.create({
      data: {
        empId: body.empId ?? null,
        category: body.category,
        title: body.title,
        description: body.description,
        fileUrl: body.fileUrl,
        fileName: body.fileName,
        mimeType: body.mimeType,
        sizeBytes: body.sizeBytes,
        effectiveDate: body.effectiveDate,
        expiresAt: body.expiresAt,
        isConfidential: body.isConfidential,
        tags: body.tags,
        uploadedBy: session.sub,
        status: body.requireSignature ? "AWAITING_SIGNATURE" : "PENDING",
      },
    });

    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "document.upload", target: doc.id, targetType: "Document",
      metadata: { category: body.category, empId: body.empId },
    });

    if (body.requireSignature && body.empId) {
      await notify(app.prisma, {
        empId: body.empId,
        category: "DOCUMENT",
        title: "Document awaiting your signature",
        body: body.title,
        url: `/documents/${doc.id}`,
      });
    }

    return doc;
  });

  // E-sign a document
  app.post("/:id/sign", async (req) => {
    const session = await req.requireAuth();
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      method: z.enum(["TYPED", "DRAWN", "DOCUSIGN", "MICROSOFT"]).default("TYPED"),
      signatureBlob: z.string().optional(),  // typed name or base64 image
      reference: z.string().optional(),
    }).parse(req.body);

    const doc = await app.prisma.document.findUnique({ where: { id } });
    if (!doc) throw new NotFoundError("Document");
    if (doc.status === "SIGNED") throw new ConflictError("Document already signed");
    if (doc.status === "REVOKED" || doc.status === "EXPIRED") {
      throw new ConflictError(`Cannot sign a ${doc.status.toLowerCase()} document`);
    }

    const existing = await app.prisma.documentSignature.findUnique({
      where: { documentId_signerEmpId: { documentId: id, signerEmpId: session.sub } },
    });
    if (existing) throw new ConflictError("You have already signed this document");

    // Compute hash of document URL + timestamp as a proof artefact
    const hash = crypto.createHash("sha256")
      .update(`${doc.fileUrl}|${id}|${new Date().toISOString()}`)
      .digest("hex");

    const sig = await app.prisma.documentSignature.create({
      data: {
        documentId: id,
        signerEmpId: session.sub,
        signedAt: new Date(),
        method: body.method,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"] ?? null,
        documentHashAtSigning: hash,
        signatureBlob: body.signatureBlob,
        reference: body.reference,
      },
    });

    // If this doc is for one employee and they've now signed, mark SIGNED
    if (doc.empId === session.sub) {
      await app.prisma.document.update({
        where: { id },
        data: { status: "SIGNED" },
      });
    }

    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "document.sign", target: id, targetType: "Document",
      metadata: { method: body.method, hash },
    });

    return sig;
  });

  // Revoke
  app.post("/:id/revoke", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({ reason: z.string().optional() }).parse(req.body);
    const doc = await app.prisma.document.update({
      where: { id },
      data: { status: "REVOKED", reviewedBy: session.sub, reviewedAt: new Date() },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "document.revoke", target: id, targetType: "Document",
      note: body.reason,
    });
    return doc;
  });

  // Soft delete
  app.delete("/:id", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    await app.prisma.document.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "document.delete", target: id, targetType: "Document",
    });
    return { ok: true };
  });
};

export default docRoutes;
