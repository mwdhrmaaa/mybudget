import { calculateAllBudgets } from "./budget.js";

export function calculateDashboardAnalytics(expenses = [], budgets = []) {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const startOfMonthStr = new Date(currentYear, currentMonth, 1).toISOString().split("T")[0];
    const endOfMonthStr = new Date(currentYear, currentMonth + 1, 0).toISOString().split("T")[0];

    const expensesOnly = expenses.filter(e => e.type !== "income");
    const incomeOnly = expenses.filter(e => e.type === "income");

    const totalExpenses = expensesOnly.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const totalIncome = incomeOnly.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const netBalance = totalIncome - totalExpenses;

    const thisMonthExpenses = expensesOnly
        .filter(e => e.expenseDate >= startOfMonthStr && e.expenseDate <= endOfMonthStr)
        .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const thisMonthIncome = incomeOnly
        .filter(e => e.expenseDate >= startOfMonthStr && e.expenseDate <= endOfMonthStr)
        .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const thisMonthNet = thisMonthIncome - thisMonthExpenses;

    const todayExpenses = expensesOnly
        .filter(e => e.expenseDate === todayStr)
        .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const todayIncome = incomeOnly
        .filter(e => e.expenseDate === todayStr)
        .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

    // Category Breakdown (based on expenses)
    const catMap = {};
    expensesOnly.forEach(e => {
        const cat = e.category || "Lainnya";
        const amt = parseFloat(e.amount) || 0;
        if (!catMap[cat]) catMap[cat] = { total: 0, count: 0 };
        catMap[cat].total += amt;
        catMap[cat].count += 1;
    });

    const categoryBreakdown = Object.keys(catMap).map(category => {
        const total = catMap[category].total;
        const percentage = totalExpenses > 0 ? Math.round((total / totalExpenses) * 1000) / 10 : 0;
        return { category, total, count: catMap[category].count, percentage };
    }).sort((a, b) => b.total - a.total);

    const topCategory = categoryBreakdown.length > 0 
        ? categoryBreakdown[0] 
        : { category: "None", total: 0, percentage: 0 };

    // 14-Day Trajectory
    const dailyTrend = [];
    for (let i = 13; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        const dayAmount = expensesOnly
            .filter(e => e.expenseDate === dateStr)
            .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

        dailyTrend.push({
            date: dateStr,
            label: d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
            amount: dayAmount
        });
    }

    // Budget Utilization Summary
    const enrichedBudgets = calculateAllBudgets(budgets, expensesOnly);
    const totalAllocated = enrichedBudgets.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
    const totalConsumed = enrichedBudgets.reduce((sum, b) => sum + (b.usage || 0), 0);
    const overallPercent = totalAllocated > 0 ? Math.min(100, Math.round((totalConsumed / totalAllocated) * 1000) / 10) : 0;

    return {
        totalExpenses,
        totalIncome,
        netBalance,
        thisMonthExpenses,
        thisMonthIncome,
        thisMonthNet,
        todayExpenses,
        todayIncome,
        topCategory,
        categoryBreakdown,
        dailyTrend,
        budgetHealth: {
            totalAllocated,
            totalConsumed,
            overallPercent,
            status: overallPercent > 100 ? "danger" : (overallPercent >= 80 ? "warning" : "safe"),
            activeCount: budgets.length
        }
    };
}
