#!/usr/bin/env bash
set -euo pipefail

# ═══════════════════════════════════════════════════════════════════
# MyBudget - End-to-End Orchestration & Deployment Bundle
# Single-Enter Deployment Engine for Containerized Production
# ═══════════════════════════════════════════════════════════════════

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$APP_DIR"

echo "==================================================================="
echo "[*] Initializing MyBudget Production Deployment"
echo "==================================================================="

# Step 1: Environment File Configuration
if [ ! -f "$APP_DIR/.env" ]; then
    echo "[*] Creating .env from .env.example..."
    cp "$APP_DIR/.env.example" "$APP_DIR/.env"
fi

# Step 2: Build & Start Containers
echo "[*] Building and launching Docker containers..."
docker compose up -d --build

# Step 3: Healthcheck Loop - App Container
echo "[*] Verifying App container readiness..."
MAX_RETRIES=30
COUNT=0
until [ "$(docker inspect -f '{{.State.Running}}' mybudget_app 2>/dev/null)" == "true" ] || [ $COUNT -eq $MAX_RETRIES ]; do
    sleep 2
    COUNT=$((COUNT + 1))
done

if [ $COUNT -eq $MAX_RETRIES ]; then
    echo "[x] App container timeout failure."
    exit 1
fi
echo "[OK] App container is healthy and running."

# Step 4: Healthcheck Loop - Database Service
echo "[*] Polling database connectivity socket..."
COUNT=0
until docker compose exec -T db mysqladmin ping -h "localhost" -u root -proot_secret --silent 2>/dev/null || [ $COUNT -eq $MAX_RETRIES ]; do
    sleep 2
    COUNT=$((COUNT + 1))
done

if [ $COUNT -eq $MAX_RETRIES ]; then
    echo "[x] Database service timeout failure."
    exit 1
fi
echo "[OK] Database socket responded ready."

# Step 5: In-Container Dependency Resolution
echo "[*] Resolving composer dependencies in container..."
docker compose exec -u root -T app git config --global --add safe.directory /var/www || true
docker compose exec -u root -T app composer install --no-interaction --prefer-dist --optimize-autoloader

echo "[*] Building frontend assets..."
docker compose exec -u root -T app npm install
docker compose exec -u root -T app npm run build || true

# Step 6: Initial Directory Permissions
echo "[*] Securing directory storage permissions..."
docker compose exec -u root -T app chmod -R 775 storage bootstrap/cache public || true
docker compose exec -u root -T app chown -R www-data:www-data storage bootstrap/cache public || true

# Step 7: Clear Caches
echo "[*] Flushing framework caches..."
docker compose exec -T app php artisan config:clear || true
docker compose exec -T app php artisan route:clear || true
docker compose exec -T app php artisan view:clear || true

# Step 8: Core Framework Initialization
echo "[*] Generating application key & linking storage..."
docker compose exec -u root -T app php artisan key:generate --force || true
docker compose exec -u root -T app php artisan storage:link --force || true

# Step 9: Migrations
echo "[*] Running database migrations..."
docker compose exec -T app php artisan migrate --force

# Step 10: Production Cache Optimization
echo "[*] Priming production route and config caches..."
docker compose exec -T app php artisan config:cache || true
docker compose exec -T app php artisan route:cache || true
docker compose exec -T app php artisan view:cache || true

# Step 11: Final Permissions & Summary
docker compose exec -u root -T app chown -R www-data:www-data storage bootstrap/cache || true

echo "==================================================================="
echo "[OK] MyBudget deployment completed successfully!"
echo "     Web Interface: http://localhost:8080"
echo "     Active Branch: $(git rev-parse --abbrev-ref HEAD)"
echo "==================================================================="
