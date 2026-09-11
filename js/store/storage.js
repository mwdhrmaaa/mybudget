import { DEFAULT_EXPENSES, DEFAULT_BUDGETS } from "./default_data.js";

const EXPENSE_KEY = "mybudget_expenses_v2";
const BUDGET_KEY = "mybudget_budgets_v2";

class StorageStore {
    constructor() {
        this.listeners = [];
        this.init();
    }

    init() {
        if (!localStorage.getItem(EXPENSE_KEY)) {
            localStorage.setItem(EXPENSE_KEY, JSON.stringify(DEFAULT_EXPENSES));
        }
        if (!localStorage.getItem(BUDGET_KEY)) {
            localStorage.setItem(BUDGET_KEY, JSON.stringify(DEFAULT_BUDGETS));
        }
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    notify() {
        this.listeners.forEach(cb => cb());
    }

    getExpenses() {
        try {
            return JSON.parse(localStorage.getItem(EXPENSE_KEY) || "[]");
        } catch {
            return [];
        }
    }

    saveExpenses(expenses) {
        localStorage.setItem(EXPENSE_KEY, JSON.stringify(expenses));
        this.notify();
    }

    getBudgets() {
        try {
            return JSON.parse(localStorage.getItem(BUDGET_KEY) || "[]");
        } catch {
            return [];
        }
    }

    saveBudgets(budgets) {
        localStorage.setItem(BUDGET_KEY, JSON.stringify(budgets));
        this.notify();
    }

    exportData() {
        return JSON.stringify({
            version: "2.0",
            exportedAt: new Date().toISOString(),
            expenses: this.getExpenses(),
            budgets: this.getBudgets()
        }, null, 2);
    }

    importData(jsonString) {
        const parsed = JSON.parse(jsonString);
        if (Array.isArray(parsed.expenses)) {
            this.saveExpenses(parsed.expenses);
        }
        if (Array.isArray(parsed.budgets)) {
            this.saveBudgets(parsed.budgets);
        }
    }

    resetDefaults() {
        localStorage.setItem(EXPENSE_KEY, JSON.stringify(DEFAULT_EXPENSES));
        localStorage.setItem(BUDGET_KEY, JSON.stringify(DEFAULT_BUDGETS));
        this.notify();
    }
}

export const store = new StorageStore();
