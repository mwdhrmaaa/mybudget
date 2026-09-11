<?php

namespace App\Domain\Expense\Actions;

use App\Domain\Expense\DataTransferObjects\ExpenseFilterDto;
use App\Models\Expense;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class GetExpenseListAction
{
    public function execute(ExpenseFilterDto $filter): LengthAwarePaginator
    {
        $query = Expense::query();

        if ($filter->category) {
            $query->where('category', $filter->category);
        }

        if ($filter->startDate && $filter->endDate) {
            $query->whereBetween('expense_date', [$filter->startDate, $filter->endDate]);
        } elseif ($filter->startDate) {
            $query->where('expense_date', '>=', $filter->startDate);
        } elseif ($filter->endDate) {
            $query->where('expense_date', '<=', $filter->endDate);
        }

        if ($filter->search) {
            $query->where('description', 'like', '%' . $filter->search . '%');
        }

        return $query->orderBy('expense_date', 'desc')
            ->orderBy('id', 'desc')
            ->paginate($filter->perPage)
            ->withQueryString();
    }
}
