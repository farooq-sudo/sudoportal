#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# scripts/seed-staging.sh — wipe + reseed for a staging environment.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

# Bail if not staging
if ! grep -q "^NODE_ENV=staging" .env 2>/dev/null && ! grep -q "^NODE_ENV=development" .env 2>/dev/null; then
  echo "✗ Refusing to run: NODE_ENV must be 'staging' or 'development' in .env"
  echo "  (this script DROPS ALL DATA)"
  exit 1
fi

# Confirmation prompt unless --force
if [[ "${1:-}" != "--force" ]]; then
  read -r -p "This will WIPE ALL DATA in the staging DB. Type 'WIPE' to confirm: " CONFIRM
  if [[ "$CONFIRM" != "WIPE" ]]; then
    echo "Aborted."
    exit 0
  fi
fi

echo "→ Setting ALLOW_DESTRUCTIVE_SEED=true for this run"
docker compose exec -T -e ALLOW_DESTRUCTIVE_SEED=true api npm run db:seed:reset

echo "✓ Staging DB reseeded with fresh demo data."
