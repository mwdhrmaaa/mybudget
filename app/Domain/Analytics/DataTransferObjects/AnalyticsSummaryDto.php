<?php

namespace App\Domain\Analytics\DataTransferObjects;

final readonly class AnalyticsSummaryDto
{
    public function __construct(
        public float $totalExpenses,
        public float $thisMonthExpenses,
        public float $todayExpenses,
        public array $topCategory,
        public array $categoryBreakdown,
        public array $dailyTrend,
        public array $budgetHealth
    ) {}
}
