import { store } from "../store/storage.js";

export function resolveBudgetEndDate(startDateStr, period) {
    const start = new Date(startDateStr);
    if (isNaN(start.getTime())) return startDateStr;

    const end = new Date(start);
    if (period === "daily") {
        return end.toISOString().split("T")[0];
    } else if (period === "weekly") {
        end.setDate(end.getDate() + 6);
        return end.toISOString().split("T")[0];
    } else if (period === "monthly") {
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        return end.toISOString().split("T")[0];
    } else if (period === "yearly") {
        end.setFullYear(end.getFullYear() + 1);
        end.setDate(0);
        return end.toISOString().split("T")[0];
    }
    return end.toISOString().split("T")[0];
}

export function calculateBudgetUsage(budget, allExpenses) {
    const startDate = budget.startDate;
    const endDate = budget.endDate || resolveBudgetEndDate(startDate, budget.period);

    const usage = allExpenses
        .filter(exp => exp.expenseDate >= startDate && exp.expenseDate <= endDate)
        .reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);

    const amount = parseFloat(budget.amount) || 0;
    const remainingBalance = amount - usage;
    const percentUsed = amount > 0 ? Math.min(100, Math.round((usage / amount) * 100 * 10) / 10) : 0;
    const isOver = usage > amount;

    let healthStatus = "safe";
    if (isOver) healthStatus = "danger";
    else if (percentUsed >= 80) healthStatus = "warning";

    return {
        ...budget,
        resolvedEndDate: endDate,
        usage,
        remainingBalance,
        percentUsed,
        isOver,
        healthStatus
    };
}

export function calculateAllBudgets(budgets, allExpenses) {
    return budgets.map(b => calculateBudgetUsage(b, allExpenses));
}

export function addBudget(payload) {
    const list = store.getBudgets();
    const endDate = payload.endDate || resolveBudgetEndDate(payload.startDate, payload.period);
    const newBudget = {
        id: "bud-" + Date.now(),
        amount: Math.abs(parseFloat(payload.amount)),
        period: payload.period,
        startDate: payload.startDate,
        endDate: endDate,
        description: payload.description ? payload.description.trim() : ""
    };
    list.unshift(newBudget);
    store.saveBudgets(list);
    return newBudget;
}

export function updateBudget(id, payload) {
    const list = store.getBudgets();
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return null;

    const endDate = payload.endDate || resolveBudgetEndDate(payload.startDate, payload.period);
    list[idx] = {
        ...list[idx],
        amount: Math.abs(parseFloat(payload.amount)),
        period: payload.period,
        startDate: payload.startDate,
        endDate: endDate,
        description: payload.description ? payload.description.trim() : ""
    };
    store.saveBudgets(list);
    return list[idx];
}

export function deleteBudget(id) {
    const list = store.getBudgets();
    const item = list.find(entry => entry.id === id);
    if (!item) return null;
    const remaining = list.filter(entry => entry.id !== id);
    store.saveBudgets(remaining);
    return item;
}

export function restoreBudget(budget) {
    if (!budget || !budget.id) return;
    const list = store.getBudgets();
    if (list.some(entry => entry.id === budget.id)) return;
    list.unshift(budget);
    store.saveBudgets(list);
}
