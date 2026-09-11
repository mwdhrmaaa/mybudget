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
import { toast } from "./components/toast.js";
import { openExpenseModal } from "./components/expense_modal_form.js";
import { openBudgetModal } from "./components/budget_modal_form.js";
import { setupDataTransfer } from "./actions/data_transfer.js";
import { initKeyboardShortcuts } from "./controllers/shortcuts.js";

const CATEGORIES = [
    "Makanan & Minuman", "Transportasi", "Belanja & Logistik", 
    "Tagihan & Utilitas", "Hiburan & Hobi", "Kesehatan", 
    "Pendidikan & Buku", "Investasi & Tabungan", "Lainnya"
];

class App {
    constructor() {
        this.viewMode = store.getViewMode();
        this.currentTab = "dashboard";
        this.filters = { category: "", startDate: "", endDate: "", search: "", type: "all" };
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
        this.filterType = document.getElementById("filterType");
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
        this.modeToggleBtn?.addEventListener("click", () => this.toggleViewMode());
        this.tabDashboardBtn?.addEventListener("click", () => this.switchTab("dashboard"));
        this.tabBudgetsBtn?.addEventListener("click", () => this.switchTab("budgets"));
        document.getElementById("openAddBudgetFromDashBtn")?.addEventListener("click", () => this.switchTab("budgets"));
        document.getElementById("openAddExpenseBtn")?.addEventListener("click", () => this.openExpenseForm());
        document.getElementById("openAddBudgetBtn")?.addEventListener("click", () => this.openBudgetForm());

        const applyFilters = () => {
            this.filters.type = this.filterType?.value || "all";
            this.filters.category = this.filterCategory?.value || "";
            this.filters.search = this.filterSearch?.value || "";
            this.filters.startDate = this.filterStartDate?.value || "";
            this.filters.endDate = this.filterEndDate?.value || "";
            this.renderExpenses();
        };

        this.filterType?.addEventListener("change", applyFilters);
        this.filterCategory?.addEventListener("change", applyFilters);
        this.filterSearch?.addEventListener("input", applyFilters);
        this.filterStartDate?.addEventListener("change", applyFilters);
        this.filterEndDate?.addEventListener("change", applyFilters);
        
        document.getElementById("resetFilterBtn")?.addEventListener("click", () => {
            if (this.filterType) this.filterType.value = "all";
            if (this.filterCategory) this.filterCategory.value = "";
            if (this.filterSearch) this.filterSearch.value = "";
            if (this.filterStartDate) this.filterStartDate.value = "";
            if (this.filterEndDate) this.filterEndDate.value = "";
            applyFilters();
        });

        setupDataTransfer({
            getFilteredExpenses: () => getFilteredExpenses(this.filters),
            onRestoreSuccess: (res) => toast.showNoticeToast("Data Dipulihkan", `${res.countExpenses} transaksi dan ${res.countBudgets} anggaran berhasil dimuat.`),
            onRestoreError: (err) => toast.showNoticeToast("Gagal Restore", err, true)
        });

        initKeyboardShortcuts({
            onNewTransaction: () => this.openExpenseForm(),
            onToggleMode: () => this.toggleViewMode(),
            onFocusSearch: () => this.filterSearch?.focus(),
            onCloseModal: () => modal.close()
        });
    }

    toggleViewMode() {
        this.viewMode = this.viewMode === "complex" ? "simple" : "complex";
        store.saveViewMode(this.viewMode);
        this.applyViewModeUI();
        this.render();
    }

    applyViewModeUI() {
        const isSimple = this.viewMode === "simple";
        if (this.modeToggleLabel) this.modeToggleLabel.textContent = isSimple ? "Complex Mode" : "Simple Mode";
        this.modeToggleBtn?.classList.toggle("btn-primary", isSimple);
        this.modeToggleBtn?.classList.toggle("btn-ghost", !isSimple);
        if (this.headerNavLinks) this.headerNavLinks.style.display = isSimple ? "none" : "flex";
        if (this.dashboardSection) this.dashboardSection.style.display = isSimple ? "none" : (this.currentTab === "dashboard" ? "flex" : "none");
        if (this.budgetsSection) this.budgetsSection.style.display = isSimple ? "none" : (this.currentTab === "budgets" ? "flex" : "none");
        if (this.simpleSection) this.simpleSection.style.display = isSimple ? "flex" : "none";
        if (!isSimple) this.switchTab(this.currentTab);
        if (window.lucide) window.lucide.createIcons();
    }

    switchTab(tabName) {
        if (this.viewMode === "simple") return;
        this.currentTab = tabName;
        const isDash = tabName === "dashboard";
        if (this.dashboardSection) this.dashboardSection.style.display = isDash ? "flex" : "none";
        if (this.budgetsSection) this.budgetsSection.style.display = isDash ? "none" : "flex";
        this.tabDashboardBtn?.classList.toggle("active", isDash);
        this.tabBudgetsBtn?.classList.toggle("active", !isDash);
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
        const enriched = calculateAllBudgets(store.getBudgets(), store.getExpenses());
        renderBudgetCards(this.budgetListContainer, enriched, (b) => this.openBudgetForm(b));
    }

    openExpenseForm(existingExpense = null) {
        openExpenseModal(existingExpense, {
            categories: CATEGORIES,
            onSubmit: (payload, isEdit, target) => {
                if (isEdit) updateExpense(target.id, payload);
                else addExpense(payload);
            }
        });
    }

    openBudgetForm(existingBudget = null) {
        openBudgetModal(existingBudget, {
            onSubmit: (payload, isEdit, target) => {
                if (isEdit) updateBudget(target.id, payload);
                else addBudget(payload);
            }
        });
    }
}

window.addEventListener("DOMContentLoaded", () => {
    new App();
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js").catch(() => {});
    }
});
