import { test } from "node:test";
import assert from "node:assert";
import { calculateDashboardAnalytics } from "../js/domain/analytics.js";

test("calculateDashboardAnalytics aggregates categories and trends correctly", () => {
    const expenses = [
        { id: "1", amount: 50000, category: "Makanan & Minuman", expenseDate: "2026-05-01" },
        { id: "2", amount: 50000, category: "Makanan & Minuman", expenseDate: "2026-05-02" },
        { id: "3", amount: 100000, category: "Transportasi", expenseDate: "2026-05-03" }
    ];

    const budgets = [
        { id: "b1", amount: 500000, period: "monthly", startDate: "2026-05-01", endDate: "2026-05-31" }
    ];

    const analytics = calculateDashboardAnalytics(expenses, budgets);

    assert.strictEqual(analytics.totalExpenses, 200000);
    assert.strictEqual(analytics.topCategory.category, "Makanan & Minuman");
    assert.strictEqual(analytics.topCategory.total, 100000);
    assert.strictEqual(analytics.topCategory.percentage, 50);
    assert.strictEqual(analytics.categoryBreakdown.length, 2);
    assert.strictEqual(analytics.dailyTrend.length, 14);
});
