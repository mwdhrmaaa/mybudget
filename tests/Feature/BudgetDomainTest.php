<?php

namespace Tests\Feature;

use App\Models\Budget;
use App\Models\Expense;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BudgetDomainTest extends TestCase
{
    use RefreshDatabase;

    public function test_budget_index_renders_and_computes_usage(): void
    {
        $budget = Budget::create([
            'amount' => 1000000,
            'period' => 'monthly',
            'start_date' => now()->startOfMonth()->format('Y-m-d'),
            'description' => 'Pagu Bulanan Operasional',
        ]);

        Expense::create([
            'amount' => 300000,
            'description' => 'Tagihan Internet',
            'category' => 'Tagihan & Utilitas',
            'expense_date' => now()->format('Y-m-d'),
        ]);

        $response = $this->get(route('public.finance.budget.index'));

        $response->assertStatus(200);
        $response->assertSee('Pagu Bulanan Operasional');
        $response->assertSee('1.000.000');
    }

    public function test_budget_can_be_created(): void
    {
        $payload = [
            'amount' => 500000,
            'period' => 'weekly',
            'start_date' => now()->format('Y-m-d'),
            'description' => 'Pagu Mingguan',
        ];

        $response = $this->post(route('public.finance.budget.store'), $payload);

        $response->assertRedirect(route('public.finance.budget.index'));
        $this->assertDatabaseHas('budgets', [
            'description' => 'Pagu Mingguan',
            'period' => 'weekly',
        ]);
    }

    public function test_budget_can_be_updated(): void
    {
        $budget = Budget::create([
            'amount' => 200000,
            'period' => 'weekly',
            'start_date' => now()->format('Y-m-d'),
            'description' => 'Pagu Awal',
        ]);

        $payload = [
            'amount' => 450000,
            'period' => 'weekly',
            'start_date' => now()->format('Y-m-d'),
            'description' => 'Pagu Diperbesar',
        ];

        $response = $this->put(route('public.finance.budget.update', $budget->id), $payload);

        $response->assertRedirect(route('public.finance.budget.index'));
        $this->assertDatabaseHas('budgets', [
            'id' => $budget->id,
            'amount' => 450000,
            'description' => 'Pagu Diperbesar',
        ]);
    }

    public function test_budget_can_be_deleted(): void
    {
        $budget = Budget::create([
            'amount' => 100000,
            'period' => 'daily',
            'start_date' => now()->format('Y-m-d'),
        ]);

        $response = $this->delete(route('public.finance.budget.destroy', $budget->id));

        $response->assertRedirect(route('public.finance.budget.index'));
        $this->assertDatabaseMissing('budgets', ['id' => $budget->id]);
    }
}
