import { test } from "node:test";
import assert from "node:assert";
import { store } from "../js/store/storage.js";

test("store.importData validates JSON structure and imports successfully", () => {
    store.resetDefaults();

    const validPayload = JSON.stringify({
        version: "2.0",
        expenses: [
            { id: "imp-1", amount: 125000, description: "Imported Expense", category: "Belanja & Logistik", expenseDate: "2026-09-12" }
        ],
        budgets: [
            { id: "imp-b1", amount: 1000000, period: "monthly", startDate: "2026-09-01", description: "Imported Budget" }
        ]
    });

    const result = store.importData(validPayload);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.countExpenses, 1);
    assert.strictEqual(result.countBudgets, 1);

    const expenses = store.getExpenses();
    assert.strictEqual(expenses.length, 1);
    assert.strictEqual(expenses[0].id, "imp-1");

    const budgets = store.getBudgets();
    assert.strictEqual(budgets.length, 1);
    assert.strictEqual(budgets[0].id, "imp-b1");
});

test("store.importData rejects corrupted or invalid JSON structures", () => {
    const invalidResult = store.importData("corrupted json string");
    assert.strictEqual(invalidResult.success, false);

    const emptyObjResult = store.importData(JSON.stringify({ notAValidKey: true }));
    assert.strictEqual(emptyObjResult.success, false);
});
