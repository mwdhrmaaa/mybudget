# MyBudget - Enterprise Daily Expense & Budget Telemetry Platform

> Production-grade personal finance tracking, budget telemetry, and expense analytics built on Laravel 12 with Semantic Atomic Architecture.

---

## Architecture Overview

MyBudget is architected using **Semantic Atomic Architecture** and **Single Responsibility Files (SRF)**, avoiding monolithic god-controllers:

- **Domain-Sliced Layer**:
  - `App\Domain\Expense`: Atomic actions (`CreateExpenseAction`, `UpdateExpenseAction`, `DeleteExpenseAction`, `GetExpenseListAction`) and co-located DTOs (`ExpensePayloadDto`, `ExpenseFilterDto`).
  - `App\Domain\Budget`: Centralized calculation action (`CalculateBudgetUsageAction`) preventing logic duplication, accompanied by CRUD actions and DTOs.
  - `App\Domain\Analytics`: Dashboard aggregation action (`GetDashboardAnalyticsAction`) powering Chart.js telemetry.
- **Form Request Isolation**:
  - Dedicated validation contracts (`StoreExpenseRequest`, `UpdateExpenseRequest`, `StoreBudgetRequest`, `UpdateBudgetRequest`).
- **UI/UX Benchmark**:
  - Linear and Raycast dark theme (`#090a0d`, `#111318`), responsive grid, sub-pixel typography, Lucide SVG icons, zero raw emojis.
- **Container Trifecta**:
  - Dockerized PHP 8.2-FPM, Nginx reverse proxy, and MariaDB container services with healthchecks.

---

## Core Features

- **Full Lifecycle Expense Management**: Record, view, filter, edit, and delete transactions with full pagination.
- **Dynamic Search & Filtering**: Filter by category, custom date range, and keyword instant lookup.
- **Financial Telemetry Dashboard**:
  - Total historical spending, current month aggregate, and daily spending counters.
  - Category breakdown with donut distribution chart.
  - 14-day spending trajectory line chart.
- **Periodic Budget Tracking**:
  - Daily, weekly, monthly, and yearly budget envelope controls.
  - Automated quota consumption tracking with health status flags (`Safe`, `Warning`, `Over Budget`).

---

## Single-Enter Shell Orchestration

Initialize and start the entire production environment with a single command:

```bash
# Initial complete deployment (environment setup, docker build, migrations, cache warmup)
bash deploy.sh

# Zero-downtime redeployment
bash redeploy.sh

# Automated test runner
bash runtest.sh
```

---

## Manual Installation & Local Development

1. **Clone repository**:
   ```bash
   git clone -b devv https://github.com/mwdhrmaaa/mybudget.git
   cd mybudget
   ```

2. **Install dependencies**:
   ```bash
   composer install --optimize-autoloader
   npm install && npm run build
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database migration**:
   ```bash
   php artisan migrate
   ```

5. **Start server**:
   ```bash
   php artisan serve
   ```

---

## Automated Test Coverage

Execute the complete feature test suite:

```bash
php artisan test
```

Test suites cover:
- `ExpenseDomainTest`: Dashboard rendering, full CRUD lifecycle, category filtering.
- `BudgetDomainTest`: Budget rendering, dynamic usage calculation, envelope limits.

---

## License

Open-source software licensed under the [MIT License](LICENSE).
