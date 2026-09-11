import { store } from "./store/storage.js";
import { getFilteredExpenses, addExpense, updateExpense } from "./domain/expense.js";
import { calculateAllBudgets, addBudget, updateBudget } from "./domain/budget.js";
import { calculateDashboardAnalytics } from "./domain/analytics.js";
import { renderMetrics } from "./components/metrics.js";
import { updateCharts } from "./components/charts.js";
import { renderExpenseTable } from "./components/expense_view.js";
import { renderBudgetCards } from "./components/budget_view.js";
import { renderSimpleView } from "./components/simple_view.js";
import { modal } from "./components/modal.js";

const CATEGORIES = [
    "Makanan & Minuman", "Transportasi", "Belanja & Logistik", 
    "Tagihan & Utilitas", "Hiburan & Hobi", "Kesehatan", 
    "Pendidikan & Buku", "Investasi & Tabungan", "Lainnya"
];

class App {
    constructor() {
        this.viewMode = store.getViewMode(); // "complex" | "simple"
        this.currentTab = "dashboard";
        this.filters = { category: "", startDate: "", endDate: "", search: "" };
        this.initDOMElements();
        this.bindEvents();
        this.populateCategoryOptions();
        this.applyViewModeUI();
        this.render();

        store.subscribe(() => this.render());
    }

    initDOMElements() {
        this.modeToggleBtn = document.getElementById("modeToggleBtn");
        this.modeToggleLabel = document.getElementById("modeToggleLabel");
        this.modeToggleIcon = document.getElementById("modeToggleIcon");
        this.headerNavLinks = document.getElementById("headerNavLinks");

        this.tabDashboardBtn = document.getElementById("tabDashboardBtn");
        this.tabBudgetsBtn = document.getElementById("tabBudgetsBtn");
        this.dashboardSection = document.getElementById("dashboardSection");
        this.budgetsSection = document.getElementById("budgetsSection");
        this.simpleSection = document.getElementById("simpleSection");

        this.metricsContainer = document.getElementById("metricsContainer");
        this.expenseTableContainer = document.getElementById("expenseTableContainer");
        this.budgetListContainer = document.getElementById("budgetListContainer");
        this.filterCountLabel = document.getElementById("filterCountLabel");
        this.filterCategory = document.getElementById("filterCategory");
        this.filterSearch = document.getElementById("filterSearch");
        this.filterStartDate = document.getElementById("filterStartDate");
        this.filterEndDate = document.getElementById("filterEndDate");
    }

    populateCategoryOptions() {
        if (!this.filterCategory) return;
        CATEGORIES.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat;
            opt.textContent = cat;
            this.filterCategory.appendChild(opt);
        });
    }

    bindEvents() {
        // Mode toggle button
        this.modeToggleBtn?.addEventListener("click", () => {
            this.viewMode = this.viewMode === "complex" ? "simple" : "complex";
            store.saveViewMode(this.viewMode);
            this.applyViewModeUI();
            this.render();
        });

        // Tab switching
        this.tabDashboardBtn?.addEventListener("click", () => this.switchTab("dashboard"));
        this.tabBudgetsBtn?.addEventListener("click", () => this.switchTab("budgets"));
        document.getElementById("openAddBudgetFromDashBtn")?.addEventListener("click", () => this.switchTab("budgets"));

        // Add buttons
        document.getElementById("openAddExpenseBtn")?.addEventListener("click", () => this.openExpenseForm());
        document.getElementById("openAddBudgetBtn")?.addEventListener("click", () => this.openBudgetForm());

        // Backup download
        document.getElementById("exportDataBtn")?.addEventListener("click", () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(store.exportData());
            const a = document.createElement("a");
            a.setAttribute("href", dataStr);
            a.setAttribute("download", `mybudget_backup_${new Date().toISOString().split('T')[0]}.json`);
            document.body.appendChild(a);
            a.click();
            a.remove();
        });

        // Filter events
        const applyFilters = () => {
            this.filters.category = this.filterCategory.value;
            this.filters.search = this.filterSearch.value;
            this.filters.startDate = this.filterStartDate.value;
            this.filters.endDate = this.filterEndDate.value;
            this.renderExpenses();
        };

        this.filterCategory?.addEventListener("change", applyFilters);
        this.filterSearch?.addEventListener("input", applyFilters);
        this.filterStartDate?.addEventListener("change", applyFilters);
        this.filterEndDate?.addEventListener("change", applyFilters);
        document.getElementById("resetFilterBtn")?.addEventListener("click", () => {
            this.filterCategory.value = "";
            this.filterSearch.value = "";
            this.filterStartDate.value = "";
            this.filterEndDate.value = "";
            applyFilters();
        });
    }

    applyViewModeUI() {
        if (this.viewMode === "simple") {
            this.modeToggleLabel.textContent = "Complex Mode";
            this.modeToggleBtn.title = "Switch to Complex Mode (Full Analytics & Telemetry)";
            this.modeToggleBtn.classList.add("btn-primary");
            this.modeToggleBtn.classList.remove("btn-ghost");
            this.headerNavLinks.style.display = "none";
            this.dashboardSection.style.display = "none";
            this.budgetsSection.style.display = "none";
            this.simpleSection.style.display = "flex";
        } else {
            this.modeToggleLabel.textContent = "Simple Mode";
            this.modeToggleBtn.title = "Switch to Simple Mode (Distraction-Free Logger)";
            this.modeToggleBtn.classList.remove("btn-primary");
            this.modeToggleBtn.classList.add("btn-ghost");
            this.headerNavLinks.style.display = "flex";
            this.simpleSection.style.display = "none";
            this.switchTab(this.currentTab);
        }
        if (window.lucide) window.lucide.createIcons();
    }

    switchTab(tabName) {
        if (this.viewMode === "simple") return;

        this.currentTab = tabName;
        if (tabName === "dashboard") {
            this.dashboardSection.style.display = "flex";
            this.budgetsSection.style.display = "none";
            this.tabDashboardBtn?.classList.add("active");
            this.tabBudgetsBtn?.classList.remove("active");
        } else {
            this.dashboardSection.style.display = "none";
            this.budgetsSection.style.display = "flex";
            this.tabDashboardBtn?.classList.remove("active");
            this.tabBudgetsBtn?.classList.add("active");
        }
        if (window.lucide) window.lucide.createIcons();
    }

    render() {
        const allExpenses = store.getExpenses();
        const allBudgets = store.getBudgets();

        if (this.viewMode === "simple") {
            renderSimpleView(this.simpleSection, allExpenses, allBudgets, (exp) => this.openExpenseForm(exp));
        } else {
            const analytics = calculateDashboardAnalytics(allExpenses, allBudgets);
            renderMetrics(this.metricsContainer, analytics);
            updateCharts(analytics.dailyTrend, analytics.categoryBreakdown);
            this.renderExpenses();
            this.renderBudgets();
        }

        if (window.lucide) window.lucide.createIcons();
    }

    renderExpenses() {
        const filtered = getFilteredExpenses(this.filters);
        if (this.filterCountLabel) {
            this.filterCountLabel.textContent = `Menampilkan ${filtered.length} catatan transaksi`;
        }
        renderExpenseTable(this.expenseTableContainer, filtered, (exp) => this.openExpenseForm(exp));
    }

    renderBudgets() {
        const allBudgets = store.getBudgets();
        const allExpenses = store.getExpenses();
        const enriched = calculateAllBudgets(allBudgets, allExpenses);
        renderBudgetCards(this.budgetListContainer, enriched, (b) => this.openBudgetForm(b));
    }

    openExpenseForm(existingExpense = null) {
        const isEdit = !!existingExpense;
        const defaultDate = isEdit ? existingExpense.expenseDate : new Date().toISOString().split("T")[0];
        const categoryOptions = CATEGORIES.map(cat => 
            `<option value="${cat}" ${isEdit && existingExpense.category === cat ? 'selected' : ''}>${cat}</option>`
        ).join("");

        const formHtml = `
            <form id="expenseForm" style="display:flex; flex-direction:column; gap:1.25rem;">
                <div class="form-group">
                    <label class="form-label">Nominal Pengeluaran (Rp)</label>
                    <input type="number" step="0.01" id="formExpAmount" class="form-input" value="${isEdit ? existingExpense.amount : ''}" placeholder="0" required autofocus>
                </div>
                <div class="form-group">
                    <label class="form-label">Kategori</label>
                    <select id="formExpCategory" class="form-select" required>
                        <option value="">Pilih Kategori...</option>
                        ${categoryOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Keterangan</label>
                    <input type="text" id="formExpDesc" class="form-input" value="${isEdit ? existingExpense.description : ''}" placeholder="Contoh: Makan Siang Nasi Padang" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Tanggal Transaksi</label>
                    <input type="date" id="formExpDate" class="form-input" value="${defaultDate}" required>
                </div>
                <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:0.75rem;">
                    <button type="button" class="btn btn-ghost" id="cancelModalBtn">Batal</button>
                    <button type="submit" class="btn btn-primary">${isEdit ? 'Simpan Perubahan' : 'Catat Transaksi'}</button>
                </div>
            </form>
        `;

        modal.open(isEdit ? "Ubah Catatan Transaksi" : "Catat Transaksi Baru", formHtml);

        document.getElementById("cancelModalBtn")?.addEventListener("click", () => modal.close());
        document.getElementById("expenseForm")?.addEventListener("submit", (e) => {
            e.preventDefault();
            const payload = {
                amount: document.getElementById("formExpAmount").value,
                category: document.getElementById("formExpCategory").value,
                description: document.getElementById("formExpDesc").value,
                expenseDate: document.getElementById("formExpDate").value
            };
            if (isEdit) {
                updateExpense(existingExpense.id, payload);
            } else {
                addExpense(payload);
            }
            modal.close();
        });
    }

    openBudgetForm(existingBudget = null) {
        const isEdit = !!existingBudget;
        const defaultDate = isEdit ? existingBudget.startDate : new Date().toISOString().split("T")[0];

        const formHtml = `
            <form id="budgetForm" style="display:flex; flex-direction:column; gap:1.25rem;">
                <div class="form-group">
                    <label class="form-label">Nominal Pagu Anggaran (Rp)</label>
                    <input type="number" step="0.01" id="formBudAmount" class="form-input" value="${isEdit ? existingBudget.amount : ''}" placeholder="0" required autofocus>
                </div>
                <div class="form-group">
                    <label class="form-label">Periode Anggaran</label>
                    <select id="formBudPeriod" class="form-select" required>
                        <option value="daily" ${isEdit && existingBudget.period === 'daily' ? 'selected' : ''}>Harian (Daily)</option>
                        <option value="weekly" ${isEdit && existingBudget.period === 'weekly' ? 'selected' : ''}>Mingguan (Weekly)</option>
                        <option value="monthly" ${!isEdit || existingBudget.period === 'monthly' ? 'selected' : ''}>Bulanan (Monthly)</option>
                        <option value="yearly" ${isEdit && existingBudget.period === 'yearly' ? 'selected' : ''}>Tahunan (Yearly)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Tanggal Mulai</label>
                    <input type="date" id="formBudStartDate" class="form-input" value="${defaultDate}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Keterangan / Label Pagu (Opsional)</label>
                    <input type="text" id="formBudDesc" class="form-input" value="${isEdit ? existingBudget.description : ''}" placeholder="Contoh: Belanja Operasional">
                </div>
                <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:0.75rem;">
                    <button type="button" class="btn btn-ghost" id="cancelModalBtn">Batal</button>
                    <button type="submit" class="btn btn-primary">${isEdit ? 'Simpan Anggaran' : 'Buat Anggaran'}</button>
                </div>
            </form>
        `;

        modal.open(isEdit ? "Ubah Target Anggaran" : "Buat Target Anggaran", formHtml);

        document.getElementById("cancelModalBtn")?.addEventListener("click", () => modal.close());
        document.getElementById("budgetForm")?.addEventListener("submit", (e) => {
            e.preventDefault();
            const payload = {
                amount: document.getElementById("formBudAmount").value,
                period: document.getElementById("formBudPeriod").value,
                startDate: document.getElementById("formBudStartDate").value,
                description: document.getElementById("formBudDesc").value
            };
            if (isEdit) {
                updateBudget(existingBudget.id, payload);
            } else {
                addBudget(payload);
            }
            modal.close();
        });
    }
}

window.addEventListener("DOMContentLoaded", () => {
    new App();
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js").catch(() => {});
    }
});
