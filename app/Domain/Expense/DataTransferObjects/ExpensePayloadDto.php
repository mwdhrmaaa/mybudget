<?php

namespace App\Domain\Expense\DataTransferObjects;

final readonly class ExpensePayloadDto
{
    public function __construct(
        public float $amount,
        public string $description,
        public string $category,
        public string $expenseDate
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            amount: (float) $data['amount'],
            description: trim((string) $data['description']),
            category: trim((string) $data['category']),
            expenseDate: (string) $data['expense_date']
        );
    }

    public function toArray(): array
    {
        return [
            'amount' => $this->amount,
            'description' => $this->description,
            'category' => $this->category,
            'expense_date' => $this->expenseDate,
        ];
    }
}
