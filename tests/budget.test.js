import { test } from "node:test";
import assert from "node:assert";
import { resolveBudgetEndDate, calculateBudgetUsage } from "../js/domain/budget.js";

test("resolveBudgetEndDate calculates correct end dates for periods", () => {
    assert.strictEqual(resolveBudgetEndDate("2026-05-01", "daily"), "2026-05-01");
    assert.strictEqual(resolveBudgetEndDate("2026-05-01", "weekly"), "2026-05-07");
    assert.strictEqual(resolveBudgetEndDate("2026-05-01", "monthly"), "2026-05-31");
});

test("calculateBudgetUsage computes remaining, percentage and status accurately", () => {
    const budget = {
        id: "bud-1",
        amount: 1000000,
        period: "monthly",
        startDate: "2026-05-01",
        endDate: "2026-05-31",
        description: "Test Monthly"
    };

    const expenses = [
        { amount: 300000, expenseDate: "2026-05-10" },
        { amount: 200000, expenseDate: "2026-05-15" },
        { amount: 500000, expenseDate: "2026-06-01" } // Outside window
    ];

    const result = calculateBudgetUsage(budget, expenses);

    assert.strictEqual(result.usage, 500000);
    assert.strictEqual(result.remainingBalance, 500000);
    assert.strictEqual(result.percentUsed, 50);
    assert.strictEqual(result.isOver, false);
    assert.strictEqual(result.healthStatus, "safe");
});

test("calculateBudgetUsage detects over budget properly", () => {
    const budget = {
        id: "bud-2",
        amount: 100000,
        period: "daily",
        startDate: "2026-05-10",
        endDate: "2026-05-10"
    };

    const expenses = [
        { amount: 120000, expenseDate: "2026-05-10" }
    ];

    const result = calculateBudgetUsage(budget, expenses);

    assert.strictEqual(result.usage, 120000);
    assert.strictEqual(result.remainingBalance, -20000);
    assert.strictEqual(result.percentUsed, 100);
    assert.strictEqual(result.isOver, true);
    assert.strictEqual(result.healthStatus, "danger");
});
