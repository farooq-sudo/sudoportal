// ────────────────────────────────────────────────────────────────────────────
//  src/routes/profile.routes.ts
//  EmployeeProfile (PII) read/update. Mounted under /employees in routes index.
//  Endpoints:
//    GET    /profile/:empId
//    PATCH  /profile/:empId
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { audit } from "../services/audit.service.js";
import { ForbiddenError } from "../utils/errors.js";

const profileRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get("/:empId", async (req) => {
    const session = await req.requireAuth();
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const isSelf = session.sub === empId;
    const isPriv = session.roles.some((r) => r === "ADMIN" || r === "HR");
    if (!isSelf && !isPriv) throw new ForbiddenError();
    const profile = await app.prisma.employeeProfile.findUnique({ where: { empId } });
    return profile ?? null;
  });

  app.patch("/:empId", async (req) => {
    const session = await req.requireAuth();
    const { empId } = z.object({ empId: z.string() }).parse(req.params);
    const isSelf = session.sub === empId;
    const isPriv = session.roles.some((r) => r === "ADMIN" || r === "HR");
    if (!isSelf && !isPriv) throw new ForbiddenError();

    // Some fields are "locked" — only HR can edit. Mirror prototype's rules.
    const HR_ONLY = new Set([
      "fullNameLegal", "fullNameAr", "dateOfBirth", "gender", "nationality",
      "passportNumber", "passportExpiry", "emiratesId", "emiratesIdExpiry",
      "visaNumber", "visaType", "visaExpiry", "visaSponsorEntity",
      "workPermitNumber", "workPermitExpiry",
    ]);

    const body = z.object({
      fullNameLegal: z.string().optional(),
      fullNameAr: z.string().optional(),
      dateOfBirth: z.coerce.date().optional(),
      gender: z.enum(["MALE", "FEMALE", "UNDISCLOSED"]).optional(),
      nationality: z.string().optional(),
      secondNationality: z.string().optional(),
      maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "PREFER_NOT_TO_SAY"]).optional(),
      religion: z.string().optional(),
      languages: z.array(z.string()).optional(),
      bloodType: z.string().optional(),
      personalEmail: z.string().email().optional(),
      personalPhone: z.string().optional(),
      alternatePhone: z.string().optional(),
      addressLine1: z.string().optional(),
      addressLine2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
      emergencyContactName: z.string().optional(),
      emergencyContactRelation: z.string().optional(),
      emergencyContactPhone: z.string().optional(),
      emergencyContactEmail: z.string().email().optional(),
      passportNumber: z.string().optional(),
      passportExpiry: z.coerce.date().optional(),
      passportCountry: z.string().optional(),
      emiratesId: z.string().optional(),
      emiratesIdExpiry: z.coerce.date().optional(),
      visaNumber: z.string().optional(),
      visaType: z.string().optional(),
      visaExpiry: z.coerce.date().optional(),
      visaSponsorEntity: z.string().optional(),
      workPermitNumber: z.string().optional(),
      workPermitExpiry: z.coerce.date().optional(),
      drivingLicenseNumber: z.string().optional(),
      drivingLicenseExpiry: z.coerce.date().optional(),
      highestEducation: z.string().optional(),
      university: z.string().optional(),
      graduationYear: z.number().int().optional(),
      notes: z.string().optional(),
    }).parse(req.body);

    // Self can't touch HR-only fields
    if (isSelf && !isPriv) {
      for (const k of Object.keys(body)) {
        if (HR_ONLY.has(k)) {
          throw new ForbiddenError(
            `Field "${k}" can only be updated by HR. Submit a profile-edit Request instead.`
          );
        }
      }
    }

    const updated = await app.prisma.employeeProfile.upsert({
      where: { empId },
      create: { empId, ...body },
      update: body,
    });
    await audit(app.prisma, {
      actorId: session.sub, actorName: session.name,
      action: "profile.update", target: empId, targetType: "Employee",
      category: "hr",
      metadata: { fields: Object.keys(body) },
    });
    return updated;
  });
};

export default profileRoutes;
