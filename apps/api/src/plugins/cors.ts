// ────────────────────────────────────────────────────────────────────────────
//  src/plugins/cors.ts
//  Registers @fastify/cors with the origins configured via CORS_ORIGINS.
//  In development, if CORS_ORIGINS is empty we allow * to keep things easy.
// ────────────────────────────────────────────────────────────────────────────

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import cors from "@fastify/cors";
import { config } from "../config.js";

const corsPlugin: FastifyPluginAsync = async (app: FastifyInstance) => {
  const origins = config.corsOriginsList;
  await app.register(cors, {
    origin:
      origins.length === 0
        ? config.isProduction
          ? false  // production with no list = block all (you'll know quickly)
          : true   // dev with no list = reflect any origin
        : origins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });
};

export default fp(corsPlugin, { name: "sudo-cors" });
