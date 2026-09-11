<?php

namespace App\Domain\Expense\Actions;

use App\Domain\Expense\DataTransferObjects\ExpensePayloadDto;
use App\Models\Expense;

final class UpdateExpenseAction
{
    public function execute(Expense $expense, ExpensePayloadDto $dto): Expense
    {
        $expense->update($dto->toArray());
        return $expense->refresh();
    }
}
