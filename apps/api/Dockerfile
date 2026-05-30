# ── SUDO Portal API ────────────────────────────────────────────────────────
# Multi-stage build. Stage 1 installs deps + generates Prisma client.
# Stage 2 copies only what's needed for runtime.
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl   # required by Prisma binaries

# ── Dependency layer ────────────────────────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json* ./
COPY apps/api/package.json ./apps/api/
RUN npm install --workspaces --include-workspace-root

# ── Prisma client + build ──────────────────────────────────────────────────
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate --schema apps/api/prisma/schema.prisma
# Don't build TypeScript here — dev mode uses tsx. Production deploys
# will run `npm run build` separately.

# ── Final runtime image (used by `docker compose up`) ──────────────────────
FROM base AS runtime
COPY --from=build /app /app
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev", "--workspace", "apps/api"]
