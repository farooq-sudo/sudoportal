// ────────────────────────────────────────────────────────────────────────────
//  src/routes/webhooks.routes.ts
//  - Outbound endpoint registry (CRUD, admin-only)
//  - Inbound webhook receiver (verify HMAC, route to a handler)
//  - Delivery log (read-only, admin)
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";
import { verifyInboundSignature } from "../services/webhook.service.js";
import { NotFoundError, UnauthorizedError } from "../utils/errors.js";

const webhookRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // ── Outbound endpoint registry ───────────────────────────────────────
  app.get("/endpoints", async (req) => {
    await req.requireRole("ADMIN");
    return app.prisma.webhookEndpoint.findMany({ orderBy: { createdAt: "desc" } });
  });

  app.post("/endpoints", async (req) => {
    const session = await req.requireRole("ADMIN");
    const body = z
      .object({
        name: z.string().min(1),
        url: z.string().url(),
        secret: z.string().min(16),
        events: z.array(z.string()).min(1),
        active: z.boolean().default(true),
      })
      .parse(req.body);
    const created = await app.prisma.webhookEndpoint.create({ data: body });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "webhook.endpoint.create",
      target: created.id,
      metadata: { url: body.url, events: body.events },
    });
    return created;
  });

  app.delete("/endpoints/:id", async (req) => {
    const session = await req.requireRole("ADMIN");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    await app.prisma.webhookEndpoint.delete({ where: { id } });
    await audit(app.prisma, {
      actorId: session.sub,
      actorName: session.name,
      action: "webhook.endpoint.delete",
      target: id,
    });
    return { deleted: true };
  });

  // ── Delivery log ─────────────────────────────────────────────────────
  app.get("/deliveries", async (req) => {
    await req.requireRole("ADMIN");
    const qs = z
      .object({
        endpointId: z.string().optional(),
        status: z.string().optional(),
        limit: z.coerce.number().int().min(1).max(500).default(100),
      })
      .parse(req.query);
    const where: Record<string, unknown> = {};
    if (qs.endpointId) where.endpointId = qs.endpointId;
    if (qs.status) where.status = qs.status;
    return app.prisma.webhookDelivery.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: qs.limit,
    });
  });

  // ── Inbound webhook receiver ─────────────────────────────────────────
  // Sources like ODOO POST here with an X-SUDO-Signature header. We verify
  // HMAC, then route to a handler keyed on :source. Adding a new source =
  // adding a case below — no auth required since signature IS the auth.
  app.post("/inbound/:source", async (req, reply) => {
    const { source } = z.object({ source: z.string() }).parse(req.params);
    const sigHeader = req.headers["x-sudo-signature"];
    const sigStr = Array.isArray(sigHeader) ? sigHeader[0] : sigHeader;
    const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    if (!verifyInboundSignature(rawBody, sigStr)) {
      throw new UnauthorizedError("Invalid webhook signature");
    }
    await audit(app.prisma, {
      actorId: null,
      actorName: `webhook:${source}`,
      action: "webhook.inbound",
      target: source,
      metadata: { headers: req.headers, body: req.body as Record<string, unknown> },
    });
    // TODO: route into a per-source handler. For now we just ACK and store
    // the event so it's not lost.
    return reply.code(202).send({ received: true, source });
  });
};

export default webhookRoutes;
