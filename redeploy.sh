#!/usr/bin/env bash
set -euo pipefail

# ═══════════════════════════════════════════════════════════════════
# MyBudget - Zero-Friction Zero-Downtime Redeployment Bundle
# ═══════════════════════════════════════════════════════════════════

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$APP_DIR"

ACTIVE_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

echo "==================================================================="
echo "[*] Starting MyBudget Redeployment on branch: $ACTIVE_BRANCH"
echo "==================================================================="

echo "[*] Pulling latest commits from remote origin..."
git pull origin "$ACTIVE_BRANCH"

echo "[*] Stopping running containers..."
docker compose down

echo "[*] Executing deployment pipeline..."
bash "$APP_DIR/deploy.sh"

echo "[OK] Redeployment finished."
