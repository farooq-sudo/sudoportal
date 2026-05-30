// ────────────────────────────────────────────────────────────────────────────
//  src/plugins/auth.ts
//  Wraps @fastify/jwt so every protected route can call:
//    const session = await req.requireAuth();           // any logged-in user
//    const session = await req.requireRole("HR");       // role-gated
//
//  Token shape (issued by /auth/callback after Entra exchange):
//    {
//      sub:   <Employee.id>     // e.g. "E004"
//      email: <string>
//      name:  <string>
//      roles: Role[]            // ["HR", "EMPLOYEE"]
//      iat, exp
//    }
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import { config } from "../config.js";
import { ForbiddenError, UnauthorizedError } from "../utils/errors.js";

export type SudoRole = "ADMIN" | "HR" | "PM" | "TL" | "EMPLOYEE" | "FINANCE" | "RECRUITER" | "AUDITOR";

export interface SudoSession {
  sub: string;          // Employee.id
  email: string;
  name: string;
  roles: SudoRole[];
  entraObjectId?: string;
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: SudoSession;
    user: SudoSession;
  }
}

declare module "fastify" {
  interface FastifyInstance {
    issueSession: (s: SudoSession) => string;
  }
  interface FastifyRequest {
    requireAuth(): Promise<SudoSession>;
    requireRole(...allowed: SudoRole[]): Promise<SudoSession>;
  }
}

const authPlugin: FastifyPluginAsync = async (app: FastifyInstance) => {
  await app.register(jwt, {
    secret: config.JWT_SECRET,
    sign: { expiresIn: config.JWT_EXPIRES_IN },
  });

  app.decorate("issueSession", (s: SudoSession) => app.jwt.sign(s));

  // Use addHook-friendly bound functions; arrow funcs in decorateRequest
  // share state across requests, so we use named functions that read `this`.
  app.decorateRequest("requireAuth", async function requireAuth(this: FastifyRequest) {
    try {
      await this.jwtVerify();
    } catch {
      throw new UnauthorizedError("Invalid or expired token");
    }
    return this.user as SudoSession;
  });

  app.decorateRequest(
    "requireRole",
    async function requireRole(this: FastifyRequest, ...allowed: SudoRole[]) {
      const session = await this.requireAuth();
      if (!session.roles.some((r) => allowed.includes(r))) {
        throw new ForbiddenError(
          `Requires one of: ${allowed.join(", ")}. You have: ${
            session.roles.join(", ") || "(none)"
          }`
        );
      }
      return session;
    }
  );
};

export default fp(authPlugin, { name: "sudo-auth" });
