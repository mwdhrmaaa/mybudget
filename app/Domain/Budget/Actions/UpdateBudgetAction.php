<?php

namespace App\Domain\Budget\Actions;

use App\Domain\Budget\DataTransferObjects\BudgetPayloadDto;
use App\Models\Budget;

final class UpdateBudgetAction
{
    public function execute(Budget $budget, BudgetPayloadDto $dto): Budget
    {
        $budget->update($dto->toArray());
        return $budget->refresh();
    }
}
