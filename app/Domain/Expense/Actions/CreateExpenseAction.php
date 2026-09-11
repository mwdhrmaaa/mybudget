<?php

namespace App\Domain\Expense\Actions;

use App\Domain\Expense\DataTransferObjects\ExpensePayloadDto;
use App\Models\Expense;

final class CreateExpenseAction
{
    public function execute(ExpensePayloadDto $dto): Expense
    {
        return Expense::create($dto->toArray());
    }
}
