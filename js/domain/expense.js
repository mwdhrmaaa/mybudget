import { store } from "../store/storage.js";

export function getFilteredExpenses(filters = {}) {
    const { category, startDate, endDate, search } = filters;
    let list = store.getExpenses();

    if (category) {
        list = list.filter(item => item.category === category);
    }
    if (startDate) {
        list = list.filter(item => item.expenseDate >= startDate);
    }
    if (endDate) {
        list = list.filter(item => item.expenseDate <= endDate);
    }
    if (search) {
        const query = search.toLowerCase();
        list = list.filter(item => 
            (item.description && item.description.toLowerCase().includes(query)) ||
            (item.category && item.category.toLowerCase().includes(query))
        );
    }

    return list.sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate));
}

export function addExpense(payload) {
    const list = store.getExpenses();
    const newExpense = {
        id: "exp-" + Date.now(),
        amount: Math.abs(parseFloat(payload.amount)),
        description: payload.description.trim(),
        category: payload.category.trim(),
        expenseDate: payload.expenseDate,
        createdAt: new Date().toISOString()
    };
    list.unshift(newExpense);
    store.saveExpenses(list);
    return newExpense;
}

export function updateExpense(id, payload) {
    const list = store.getExpenses();
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return null;

    list[idx] = {
        ...list[idx],
        amount: Math.abs(parseFloat(payload.amount)),
        description: payload.description.trim(),
        category: payload.category.trim(),
        expenseDate: payload.expenseDate
    };
    store.saveExpenses(list);
    return list[idx];
}

export function deleteExpense(id) {
    const list = store.getExpenses().filter(item => item.id !== id);
    store.saveExpenses(list);
}
