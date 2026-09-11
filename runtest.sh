#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$APP_DIR"

echo "==================================================================="
echo "[*] Running MyBudget Automated Domain & Analytics Test Suite"
echo "==================================================================="

if command -v node >/dev/null 2>&1; then
    node --test tests/**/*.test.js
    echo "[OK] All test suites passed."
else
    echo "[x] Node.js is required to execute the test suite."
    exit 1
fi
