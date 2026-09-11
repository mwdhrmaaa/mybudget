<?php

namespace App\Domain\Expense\DataTransferObjects;

final readonly class ExpenseFilterDto
{
    public function __construct(
        public ?string $category = null,
        public ?string $startDate = null,
        public ?string $endDate = null,
        public ?string $search = null,
        public int $perPage = 15
    ) {}

    public static function fromRequest(array $query): self
    {
        return new self(
            category: !empty($query['category']) ? trim((string) $query['category']) : null,
            startDate: !empty($query['start_date']) ? (string) $query['start_date'] : null,
            endDate: !empty($query['end_date']) ? (string) $query['end_date'] : null,
            search: !empty($query['search']) ? trim((string) $query['search']) : null,
            perPage: !empty($query['per_page']) ? max(5, min(100, (int) $query['per_page'])) : 15
        );
    }
}
