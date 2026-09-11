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

test("calculateDashboardAnalytics computes income and net balance accurately", () => {
    const records = [
        { id: "1", type: "income", amount: 5000000, category: "Investasi & Tabungan", expenseDate: "2026-05-01" },
        { id: "2", type: "expense", amount: 1500000, category: "Belanja & Logistik", expenseDate: "2026-05-02" },
        { id: "3", type: "expense", amount: 500000, category: "Makanan & Minuman", expenseDate: "2026-05-03" }
    ];

    const analytics = calculateDashboardAnalytics(records, []);

    assert.strictEqual(analytics.totalIncome, 5000000);
    assert.strictEqual(analytics.totalExpenses, 2000000);
    assert.strictEqual(analytics.netBalance, 3000000);
    assert.strictEqual(analytics.categoryBreakdown.length, 2, "Income must be excluded from expense category breakdown");
});
