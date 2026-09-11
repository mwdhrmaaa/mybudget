<?php

namespace App\Domain\Budget\Actions;

use App\Domain\Budget\DataTransferObjects\BudgetPayloadDto;
use App\Models\Budget;

final class CreateBudgetAction
{
    public function execute(BudgetPayloadDto $dto): Budget
    {
        return Budget::create($dto->toArray());
    }
}
