#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$APP_DIR"

echo "==================================================================="
echo "[*] Running MyBudget Automated Feature & Unit Test Suite"
echo "==================================================================="

if command -v docker >/dev/null 2>&1 && [ "$(docker inspect -f '{{.State.Running}}' mybudget_app 2>/dev/null)" == "true" ]; then
    echo "[*] Executing tests inside Docker app container..."
    docker compose exec -T app php artisan test
else
    echo "[*] Executing tests locally..."
    php artisan test
fi

echo "[OK] Test suite execution complete."
