import { DEFAULT_EXPENSES, DEFAULT_BUDGETS } from "./default_data.js";

const EXPENSE_KEY = "mybudget_expenses_v2";
const BUDGET_KEY = "mybudget_budgets_v2";
const MODE_KEY = "mybudget_view_mode_v2";


// Memory storage fallback for Node.js test environment
const memoryStore = {};
const storageEngine = typeof localStorage !== "undefined" ? localStorage : {
    getItem: (key) => memoryStore[key] || null,
    setItem: (key, val) => { memoryStore[key] = String(val); },
    removeItem: (key) => { delete memoryStore[key]; }
};

class StorageStore {
    constructor() {
        this.listeners = [];
        this.init();
    }

    init() {
        if (!storageEngine.getItem(EXPENSE_KEY)) {
            storageEngine.setItem(EXPENSE_KEY, JSON.stringify(DEFAULT_EXPENSES));
        }
        if (!storageEngine.getItem(BUDGET_KEY)) {
            storageEngine.setItem(BUDGET_KEY, JSON.stringify(DEFAULT_BUDGETS));
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
            return JSON.parse(storageEngine.getItem(EXPENSE_KEY) || "[]");
        } catch {
            return [];
        }
    }

    saveExpenses(expenses) {
        storageEngine.setItem(EXPENSE_KEY, JSON.stringify(expenses));
        this.notify();
    }

    getBudgets() {
        try {
            return JSON.parse(storageEngine.getItem(BUDGET_KEY) || "[]");
        } catch {
            return [];
        }
    }

    saveBudgets(budgets) {
        storageEngine.setItem(BUDGET_KEY, JSON.stringify(budgets));
        this.notify();
    }

    getViewMode() {
        return storageEngine.getItem(MODE_KEY) || "pro";
    }

    saveViewMode(mode) {
        storageEngine.setItem(MODE_KEY, mode);
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
        storageEngine.setItem(EXPENSE_KEY, JSON.stringify(DEFAULT_EXPENSES));
        storageEngine.setItem(BUDGET_KEY, JSON.stringify(DEFAULT_BUDGETS));
        this.notify();
    }
}

export const store = new StorageStore();
