<?php

namespace App\Domain\Budget\DataTransferObjects;

final readonly class BudgetPayloadDto
{
    public function __construct(
        public float $amount,
        public string $period,
        public string $startDate,
        public ?string $endDate = null,
        public ?string $description = null
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            amount: (float) $data['amount'],
            period: trim((string) $data['period']),
            startDate: (string) $data['start_date'],
            endDate: !empty($data['end_date']) ? (string) $data['end_date'] : null,
            description: !empty($data['description']) ? trim((string) $data['description']) : null
        );
    }

    public function toArray(): array
    {
        return [
            'amount' => $this->amount,
            'period' => $this->period,
            'start_date' => $this->startDate,
            'end_date' => $this->endDate,
            'description' => $this->description,
        ];
    }
}
