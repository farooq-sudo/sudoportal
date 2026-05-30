// ────────────────────────────────────────────────────────────────────────────
//  src/routes/holidays.routes.ts
//  Public-holiday calendar. Drives leave-day calculations and the "next
//  holiday" widget on Employee dashboard.
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";

const holidayRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get("/", async (req) => {
    await req.requireAuth();
    const qs = z.object({
      country: z.string().optional(),
      year: z.coerce.number().int().optional(),
      from: z.coerce.date().optional(),
      to: z.coerce.date().optional(),
      category: z.string().optional(),
      religion: z.string().optional(),
    }).parse(req.query);

    const where: Record<string, unknown> = {};
    if (qs.country) where.country = qs.country;
    if (qs.category) where.category = qs.category;
    if (qs.religion) {
      where.OR = [{ religion: null }, { religion: qs.religion }];
    }
    if (qs.from || qs.to) {
      where.date = { gte: qs.from, lte: qs.to };
    } else if (qs.year) {
      const start = new Date(qs.year, 0, 1);
      const end = new Date(qs.year, 11, 31, 23, 59, 59);
      where.date = { gte: start, lte: end };
    }

    const items = await app.prisma.holiday.findMany({
      where, orderBy: { date: "asc" },
    });
    return { items };
  });

  app.get("/next", async (req) => {
    await req.requireAuth();
    const qs = z.object({
      country: z.string().default("AE"),
      religion: z.string().optional(),
    }).parse(req.query);

    const where: Record<string, unknown> = {
      country: qs.country,
      date: { gte: new Date() },
    };
    if (qs.religion) {
      where.OR = [{ religion: null }, { religion: qs.religion }];
    }
    const next = await app.prisma.holiday.findFirst({
      where, orderBy: { date: "asc" },
    });
    return next;
  });

  app.post("/", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const body = z.object({
      name: z.string(),
      nameAr: z.string().optional(),
      date: z.coerce.date(),
      endDate: z.coerce.date().optional(),
      country: z.string().min(2).max(2),
      region: z.string().optional(),
      religion: z.string().optional(),
      category: z.enum(["PUBLIC", "RELIGIOUS", "NATIONAL", "OBSERVANCE"]),
      isPaid: z.boolean().default(true),
      isObservance: z.boolean().default(false),
      recurring: z.boolean().default(true),
      notes: z.string().optional(),
    }).parse(req.body);

    const h = await app.prisma.holiday.create({ data: body });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "holiday.create", target: h.id, targetType: "Holiday",
      category: "hr",
      metadata: { name: body.name, date: body.date.toISOString(), country: body.country },
    });
    return h;
  });

  app.patch("/:id", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      name: z.string().optional(),
      nameAr: z.string().optional(),
      date: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      isPaid: z.boolean().optional(),
      notes: z.string().optional(),
    }).parse(req.body);
    const h = await app.prisma.holiday.update({ where: { id }, data: body });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "holiday.update", target: id, targetType: "Holiday",
    });
    return h;
  });

  app.delete("/:id", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const { id } = z.object({ id: z.string() }).parse(req.params);
    await app.prisma.holiday.delete({ where: { id } });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "holiday.delete", target: id, targetType: "Holiday",
    });
    return { ok: true };
  });

  // Bulk import — paste a year's worth of country holidays
  app.post("/import", async (req) => {
    const session = await req.requireRole("ADMIN", "HR");
    const body = z.object({
      country: z.string(),
      holidays: z.array(z.object({
        name: z.string(),
        nameAr: z.string().optional(),
        date: z.coerce.date(),
        endDate: z.coerce.date().optional(),
        category: z.enum(["PUBLIC", "RELIGIOUS", "NATIONAL", "OBSERVANCE"]),
        religion: z.string().optional(),
        isPaid: z.boolean().default(true),
      })),
    }).parse(req.body);

    let created = 0;
    let skipped = 0;
    for (const h of body.holidays) {
      try {
        await app.prisma.holiday.create({
          data: { country: body.country, ...h },
        });
        created++;
      } catch {
        skipped++;     // duplicate (unique constraint hit)
      }
    }
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "holiday.import", target: body.country, targetType: "Holiday",
      metadata: { created, skipped, year: new Date().getFullYear() },
    });
    return { created, skipped, total: body.holidays.length };
  });
};

export default holidayRoutes;
