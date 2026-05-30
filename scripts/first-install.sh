#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  scripts/first-install.sh
# ─────────────────────────────────────────────────────────────────────────────
#  Run this ONCE after cloning the repo for the first time on a fresh server.
#  It bootstraps the database from scratch:
#
#    1. Verifies .env exists and has DATABASE_URL
#    2. Installs all npm dependencies
#    3. Generates the Prisma client
#    4. Creates the initial database migration (only if it doesn't exist yet)
#    5. Applies migrations to the live DB
#    6. Seeds demo data
#
#  Subsequent installs/redeploys should use scripts/setup.sh instead, which
#  expects migrations to already be committed to the repo.
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

cd "$(dirname "$0")/.."

echo "━━━ SUDO Portal · First Install ━━━"

# ── Step 1: env check
if [ ! -f .env ]; then
  echo "❌ .env not found. Copy .env.example to .env first and fill in values."
  exit 1
fi

if ! grep -q "^DATABASE_URL=" .env; then
  echo "❌ DATABASE_URL not set in .env"
  exit 1
fi

# ── Step 2: deps
echo "→ Installing npm dependencies..."
npm install --silent

# ── Step 3: prisma client
echo "→ Generating Prisma client..."
cd apps/api
npx prisma generate

# ── Step 4: initial migration (only if missing)
MIGRATION_DIR=prisma/migrations
if [ ! -d "$MIGRATION_DIR" ] || [ -z "$(ls -A "$MIGRATION_DIR" 2>/dev/null)" ]; then
  echo "→ No migrations found. Creating initial migration from schema..."
  npx prisma migrate dev --name init --skip-seed
  echo ""
  echo "  ⚠️  An initial migration was created at: $MIGRATION_DIR/<timestamp>_init/"
  echo "      COMMIT this directory to git. Future installs will use it directly."
  echo ""
else
  echo "→ Migrations already present. Applying to database..."
  npx prisma migrate deploy
fi

# ── Step 5: seed demo data
echo "→ Seeding demo data..."
cd ../..
npm run db:seed

echo ""
echo "✅ First install complete. Start the API with: docker compose up -d"
echo "   Then verify: curl http://localhost:3000/api/v1/health"
