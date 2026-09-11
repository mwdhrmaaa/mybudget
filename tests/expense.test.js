import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { store } from "../js/store/storage.js";
import { addExpense, deleteExpense, restoreExpense } from "../js/domain/expense.js";

test("deleteExpense removes expense and returns the deleted record", () => {
    store.resetDefaults();
    const created = addExpense({
        amount: 50000,
        description: "Test Expense For Deletion",
        category: "Makanan & Minuman",
        expenseDate: "2026-09-11"
    });

    const deleted = deleteExpense(created.id);
    assert.ok(deleted, "Deleted item must be returned");
    assert.equal(deleted.id, created.id);
    assert.equal(deleted.description, "Test Expense For Deletion");

    const currentExpenses = store.getExpenses();
    assert.equal(currentExpenses.some(e => e.id === created.id), false, "Item must not exist in store");
});

test("restoreExpense restores deleted record back into store", () => {
    store.resetDefaults();
    const created = addExpense({
        amount: 75000,
        description: "Undo Target Expense",
        category: "Transportasi",
        expenseDate: "2026-09-11"
    });

    const deleted = deleteExpense(created.id);
    assert.ok(deleted);

    // Restore item
    restoreExpense(deleted);

    const expensesAfterRestore = store.getExpenses();
    const found = expensesAfterRestore.find(e => e.id === created.id);
    assert.ok(found, "Restored expense must exist in store");
    assert.equal(found.amount, 75000);
    assert.equal(found.description, "Undo Target Expense");
});
