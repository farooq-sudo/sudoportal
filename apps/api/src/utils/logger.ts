// ────────────────────────────────────────────────────────────────────────────
//  src/utils/logger.ts
//  Fastify gives us a Pino logger via `app.log`. Use it in handlers via
//  `req.log` so requests are correlated by request-id. This module only
//  exports the *configuration* — the logger instance is created when
//  Fastify is constructed in server.ts.
// ────────────────────────────────────────────────────────────────────────────

import { config } from "../config.js";

export const loggerConfig = config.isProduction
  ? { level: config.LOG_LEVEL }
  : {
      level: config.LOG_LEVEL,
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          singleLine: false,
          ignore: "pid,hostname",
          translateTime: "HH:MM:ss.l",
        },
      },
    };
