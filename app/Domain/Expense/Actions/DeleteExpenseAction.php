<?php

namespace App\Domain\Expense\Actions;

use App\Models\Expense;

final class DeleteExpenseAction
{
    public function execute(Expense $expense): bool
    {
        return (bool) $expense->delete();
    }
}
