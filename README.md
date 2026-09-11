# MyBudget - Client-Side Financial Telemetry & Expense Analytics

> Production-grade, zero-runtime personal finance telemetry, periodic budget controller, and expense analytics built with pure HTML5, CSS3, and Modular ESM JavaScript.

---

## Architecture Overview

MyBudget has been completely refactored from bloated server stacks into a **Semantic Atomic Architecture** with **Zero Server Dependencies**:

- **Layer Decomposition**:
  - `css/`: Split into atomic stylesheets (`theme.css` for Linear dark tokens, `layout.css` for grid & navigation, `components.css` for cards, tables, badges, modals, and micro-interactions).
  - `js/store/`: `storage.js` reactive LocalStorage engine with state subscriptions, auto-backup export/import, and Node.js headless memory fallback.
  - `js/domain/`: Pure business logic (`expense.js`, `budget.js`, `analytics.js`) strictly decoupled from UI rendering.
  - `js/components/`: Atomic UI component renderers (`metrics.js`, `charts.js`, `modal.js`, `expense_view.js`, `budget_view.js`) adhering to the ~150-line soft cap.
  - `js/app.js`: Clean single-responsibility application bootstrap orchestrator.
- **Craftsmanship & UX Standard**:
  - Linear/Raycast neutral dark palette (`#090a0d`, `#111318`, `#171a23`).
  - Professional Lucide SVG icons, sub-pixel typography tracking, interactive micro-states.
  - Zero raw emojis, zero em dashes.
- **Offline PWA Capabilities**:
  - Pre-caching Service Worker (`sw.js`) and Web Application Manifest (`manifest.json`) for zero-latency standalone execution.

---

## Core Capabilities

- **Transaction Lifecycle (Full CRUD)**:
  - Add, edit, delete, and inspect transactions with automatic currency formatting (`Rp`).
- **Dynamic Instant Filtering**:
  - Filter transactions dynamically by category, keyword search, and custom date range with zero page reload.
- **Telemetry Visualizer (Chart.js)**:
  - 14-day spending trajectory line chart.
  - Donut chart category distribution breakdown.
- **Periodic Budget Controls**:
  - Set daily, weekly, monthly, or yearly budget envelopes.
  - Real-time percentage consumption tracking and health status flags (`Aman`, `Waspada`, `Over Budget`).
- **Data Sovereignty & Portability**:
  - One-click JSON backup export and import functionality.

---

## Single-Enter Deployment & Execution

Run with one enter using the shell bundle:

```bash
# Production deployment via static Nginx Docker container or local HTTP server
bash deploy.sh

# Zero-downtime redeployment
bash redeploy.sh

# Automated test runner (Node.js native test runner)
bash runtest.sh
```

Alternatively, open `index.html` directly in any modern browser without any installation required.

---

## Automated Test Coverage

Execute the headless domain logic test suite:

```bash
node --test tests/**/*.test.js
```

Test suites verify:
- Budget period date resolution and multi-tier usage health calculations.
- Dashboard analytics aggregation, category percentages, and daily trajectories.

---

## License

Open-source software licensed under the [MIT License](LICENSE).
