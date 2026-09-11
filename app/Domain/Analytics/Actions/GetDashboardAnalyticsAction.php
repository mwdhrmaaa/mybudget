<?php

namespace App\Domain\Analytics\Actions;

use App\Domain\Analytics\DataTransferObjects\AnalyticsSummaryDto;
use App\Domain\Budget\Actions\CalculateBudgetUsageAction;
use App\Models\Budget;
use App\Models\Expense;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

final class GetDashboardAnalyticsAction
{
    public function __construct(
        private readonly CalculateBudgetUsageAction $calculateBudgetUsage
    ) {}

    public function execute(): AnalyticsSummaryDto
    {
        $now = Carbon::now();
        $todayStr = $now->format('Y-m-d');
        $startOfMonth = $now->copy()->startOfMonth()->format('Y-m-d');
        $endOfMonth = $now->copy()->endOfMonth()->format('Y-m-d');

        $totalExpenses = (float) Expense::sum('amount');
        $thisMonthExpenses = (float) Expense::whereBetween('expense_date', [$startOfMonth, $endOfMonth])->sum('amount');
        $todayExpenses = (float) Expense::where('expense_date', $todayStr)->sum('amount');

        // Category breakdown
        $categories = Expense::select('category', DB::raw('SUM(amount) as total_amount'), DB::raw('COUNT(*) as count'))
            ->groupBy('category')
            ->orderByDesc('total_amount')
            ->get();

        $categoryBreakdown = [];
        $topCategory = ['name' => 'None', 'amount' => 0.0, 'percentage' => 0.0];

        foreach ($categories as $idx => $cat) {
            $amount = (float) $cat->total_amount;
            $percentage = $totalExpenses > 0 ? round(($amount / $totalExpenses) * 100, 1) : 0.0;
            $data = [
                'category' => $cat->category,
                'total' => $amount,
                'count' => (int) $cat->count,
                'percentage' => $percentage,
            ];
            $categoryBreakdown[] = $data;

            if ($idx === 0) {
                $topCategory = [
                    'name' => $cat->category,
                    'amount' => $amount,
                    'percentage' => $percentage,
                ];
            }
        }

        // Daily trend (Last 14 days)
        $dailyTrend = [];
        $trendStart = $now->copy()->subDays(13)->startOfDay();
        $rawDaily = Expense::select('expense_date', DB::raw('SUM(amount) as total_amount'))
            ->where('expense_date', '>=', $trendStart->format('Y-m-d'))
            ->groupBy('expense_date')
            ->pluck('total_amount', 'expense_date')
            ->toArray();

        for ($i = 0; $i < 14; $i++) {
            $day = $trendStart->copy()->addDays($i)->format('Y-m-d');
            $dailyTrend[] = [
                'date' => $day,
                'label' => Carbon::parse($day)->format('d M'),
                'amount' => isset($rawDaily[$day]) ? (float) $rawDaily[$day] : 0.0,
            ];
        }

        // Budget Health
        $budgets = Budget::orderBy('start_date', 'desc')->get();
        $enrichedBudgets = $this->calculateBudgetUsage->execute($budgets);
        $totalAllocated = $enrichedBudgets->sum('amount');
        $totalConsumed = $enrichedBudgets->sum('usage');
        $overallHealth = $totalAllocated > 0 ? min(100.0, round(($totalConsumed / $totalAllocated) * 100, 1)) : 0.0;

        $budgetHealth = [
            'total_allocated' => $totalAllocated,
            'total_consumed' => $totalConsumed,
            'overall_percent' => $overallHealth,
            'status' => $overallHealth > 100 ? 'danger' : ($overallHealth >= 80 ? 'warning' : 'safe'),
            'active_count' => $budgets->count(),
        ];

        return new AnalyticsSummaryDto(
            totalExpenses: $totalExpenses,
            thisMonthExpenses: $thisMonthExpenses,
            todayExpenses: $todayExpenses,
            topCategory: $topCategory,
            categoryBreakdown: $categoryBreakdown,
            dailyTrend: $dailyTrend,
            budgetHealth: $budgetHealth
        );
    }
}
