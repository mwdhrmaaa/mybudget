<?php

namespace App\Domain\Budget\Actions;

use App\Models\Budget;

final class DeleteBudgetAction
{
    public function execute(Budget $budget): bool
    {
        return (bool) $budget->delete();
    }
}
