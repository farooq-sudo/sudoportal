// ────────────────────────────────────────────────────────────────────────────
//  src/utils/errors.ts
//  Typed application errors. Fastify's @fastify/sensible converts these to
//  the right HTTP status codes automatically.
// ────────────────────────────────────────────────────────────────────────────

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode: number, code: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = "AppError";
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, "bad_request", details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, "unauthorized");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have access to this resource") {
    super(message, 403, "forbidden");
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, "not_found");
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 409, "conflict", details);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(service: string, reason?: string) {
    super(
      reason ? `${service} unavailable: ${reason}` : `${service} unavailable`,
      503,
      "service_unavailable"
    );
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, reason: string) {
    super(`${service}: ${reason}`, 502, "external_service_error", { service });
  }
}
