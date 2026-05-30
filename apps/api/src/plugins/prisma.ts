// ────────────────────────────────────────────────────────────────────────────
//  src/plugins/prisma.ts
//  Registers a single PrismaClient on the Fastify app. The `fastify-plugin`
//  wrapper escapes encapsulation so app.prisma is visible everywhere.
// ────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from "@prisma/client";
import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prismaPlugin: FastifyPluginAsync = async (app: FastifyInstance) => {
  const prisma = new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? [
            { emit: "event", level: "warn" },
            { emit: "event", level: "error" },
          ]
        : [{ emit: "event", level: "error" }],
  });

  // Surface Prisma warnings/errors through the app logger.
  // Prisma's $on typings are loose with emit:'event'; cast through unknown.
  const prismaWithEvents = prisma as unknown as {
    $on: (e: string, cb: (ev: { message: string }) => void) => void;
  };
  prismaWithEvents.$on("warn", (e) => app.log.warn({ prisma: e }, "Prisma warning"));
  prismaWithEvents.$on("error", (e) => app.log.error({ prisma: e }, "Prisma error"));

  await prisma.$connect();

  app.decorate("prisma", prisma);
  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
};

export default fp(prismaPlugin, { name: "sudo-prisma" });
