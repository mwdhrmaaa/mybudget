<?php

namespace App\Domain\Budget\Actions;

use App\Models\Budget;
use App\Models\Expense;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

final class CalculateBudgetUsageAction
{
    /**
     * Calculates usage, remaining balance, percentage and health status for a budget or list of budgets.
     *
     * @param Collection<int, Budget>|Budget $budgets
     * @return Collection<int, Budget>|Budget
     */
    public function execute(Collection|Budget $budgets): Collection|Budget
    {
        if ($budgets instanceof Budget) {
            return $this->enrichSingleBudget($budgets);
        }

        return $budgets->map(fn (Budget $b) => $this->enrichSingleBudget($b));
    }

    private function enrichSingleBudget(Budget $budget): Budget
    {
        $startDate = Carbon::parse($budget->start_date)->startOfDay();
        $endDate = $budget->end_date
            ? Carbon::parse($budget->end_date)->endOfDay()
            : $this->resolveEndDate($startDate, $budget->period);

        $usage = (float) Expense::whereBetween('expense_date', [
            $startDate->format('Y-m-d'),
            $endDate->format('Y-m-d')
        ])->sum('amount');

        $remaining = max(0.0, $budget->amount - $usage);
        $percentUsed = $budget->amount > 0 ? min(100.0, round(($usage / $budget->amount) * 100, 1)) : 0.0;
        $isOverBudget = $usage > $budget->amount;

        $budget->computed_start_date = $startDate;
        $budget->computed_end_date = $endDate;
        $budget->usage = $usage;
        $budget->remaining = $remaining;
        $budget->remaining_balance = $budget->amount - $usage;
        $budget->percent_used = $percentUsed;
        $budget->is_over_budget = $isOverBudget;
        $budget->health_status = $isOverBudget ? 'danger' : ($percentUsed >= 80 ? 'warning' : 'safe');

        return $budget;
    }

    private function resolveEndDate(Carbon $startDate, string $period): Carbon
    {
        return match ($period) {
            'daily' => $startDate->copy()->endOfDay(),
            'weekly' => $startDate->copy()->endOfWeek(),
            'monthly' => $startDate->copy()->endOfMonth(),
            'yearly' => $startDate->copy()->endOfYear(),
            default => $startDate->copy()->addYears(10)->endOfDay(),
        };
    }
}
