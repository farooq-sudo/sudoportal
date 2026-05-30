#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# scripts/setup.sh — first-time install on a fresh server.
# Idempotent: safe to re-run.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

echo "→ SUDO Portal Backend — setup"
echo "  repo: $REPO_ROOT"

# 1. Sanity check: Docker present
if ! command -v docker >/dev/null 2>&1; then
  echo "✗ Docker not found. Install Docker first:"
  echo "  curl -fsSL https://get.docker.com | sudo sh"
  exit 1
fi
if ! docker compose version >/dev/null 2>&1; then
  echo "✗ Docker Compose plugin not found. Install with:"
  echo "  sudo apt-get install docker-compose-plugin"
  exit 1
fi

# 2. .env
if [[ ! -f .env ]]; then
  echo "→ creating .env from .env.example"
  cp .env.example .env
  echo "  ⚠ edit .env and set ENTRA_* before going to production"
fi

# 3. Validate critical env vars
if ! grep -q "^JWT_SECRET=.\{32,\}" .env 2>/dev/null || grep -q "^JWT_SECRET=CHANGE_ME" .env; then
  echo "→ generating a fresh JWT_SECRET"
  NEW_SECRET=$(openssl rand -hex 64)
  if grep -q "^JWT_SECRET=" .env; then
    sed -i.bak "s|^JWT_SECRET=.*|JWT_SECRET=${NEW_SECRET}|" .env
  else
    echo "JWT_SECRET=${NEW_SECRET}" >> .env
  fi
  rm -f .env.bak
fi

# 4. Bring up containers
echo "→ starting Postgres + API (this may take a minute the first time)"
docker compose up -d --build

# 5. Wait for DB
echo -n "→ waiting for Postgres to be ready"
for i in $(seq 1 30); do
  if docker compose exec -T db pg_isready -U sudo >/dev/null 2>&1; then
    echo " ✓"
    break
  fi
  echo -n "."
  sleep 1
done

# 6. Migrate
echo "→ running database migrations"
docker compose exec -T api npm run db:migrate:deploy

# 7. Seed
echo "→ seeding demo data (89 employees, 7 teams, KPIs, etc.)"
docker compose exec -T api npm run db:seed

# 8. Verify
echo "→ verifying API"
if curl -sf http://localhost:3000/api/v1/health >/dev/null; then
  echo "✓ API responding at http://localhost:3000/api/v1/health"
else
  echo "✗ API not responding — check 'docker compose logs api'"
  exit 1
fi

echo ""
echo "─────────────────────────────────────────────────────────────"
echo "✓ Setup complete."
echo ""
echo "  API:       http://localhost:3000/api/v1/health"
echo "  Adminer:   http://localhost:8081  (server: db, user: sudo, pass: sudo)"
echo "  Logs:      docker compose logs -f api"
echo ""
echo "  Next:"
echo "    1. Edit .env and configure ENTRA_* for M365 login."
echo "    2. Wire the HTML portals to fetch from this API."
echo "─────────────────────────────────────────────────────────────"
