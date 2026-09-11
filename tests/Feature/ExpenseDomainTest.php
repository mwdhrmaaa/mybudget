<?php

namespace Tests\Feature;

use App\Models\Expense;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExpenseDomainTest extends TestCase
{
    use RefreshDatabase;

    public function test_expense_dashboard_can_be_rendered(): void
    {
        Expense::create([
            'amount' => 50000,
            'description' => 'Makan Siang',
            'category' => 'Makanan & Minuman',
            'expense_date' => now()->format('Y-m-d'),
        ]);

        $response = $this->get(route('public.expense.index'));

        $response->assertStatus(200);
        $response->assertSee('Telemetry Finansial');
        $response->assertSee('Makan Siang');
    }

    public function test_expense_can_be_created(): void
    {
        $payload = [
            'amount' => 75000,
            'description' => 'Bensin Pertamax',
            'category' => 'Transportasi',
            'expense_date' => now()->format('Y-m-d'),
        ];

        $response = $this->post(route('public.expense.store'), $payload);

        $response->assertRedirect(route('public.expense.index'));
        $this->assertDatabaseHas('expenses', [
            'description' => 'Bensin Pertamax',
            'category' => 'Transportasi',
        ]);
    }

    public function test_expense_can_be_updated(): void
    {
        $expense = Expense::create([
            'amount' => 20000,
            'description' => 'Kopi',
            'category' => 'Makanan & Minuman',
            'expense_date' => now()->format('Y-m-d'),
        ]);

        $payload = [
            'amount' => 35000,
            'description' => 'Kopi Latte Spesial',
            'category' => 'Makanan & Minuman',
            'expense_date' => now()->format('Y-m-d'),
        ];

        $response = $this->put(route('public.expense.update', $expense->id), $payload);

        $response->assertRedirect(route('public.expense.index'));
        $this->assertDatabaseHas('expenses', [
            'id' => $expense->id,
            'amount' => 35000,
            'description' => 'Kopi Latte Spesial',
        ]);
    }

    public function test_expense_can_be_deleted(): void
    {
        $expense = Expense::create([
            'amount' => 10000,
            'description' => 'Parkir',
            'category' => 'Transportasi',
            'expense_date' => now()->format('Y-m-d'),
        ]);

        $response = $this->delete(route('public.expense.destroy', $expense->id));

        $response->assertRedirect(route('public.expense.index'));
        $this->assertDatabaseMissing('expenses', ['id' => $expense->id]);
    }

    public function test_expense_can_be_filtered(): void
    {
        Expense::create([
            'amount' => 50000,
            'description' => 'Belanja Sayur',
            'category' => 'Makanan & Minuman',
            'expense_date' => now()->format('Y-m-d'),
        ]);
        Expense::create([
            'amount' => 150000,
            'description' => 'Buku Pemrograman',
            'category' => 'Pendidikan & Buku',
            'expense_date' => now()->format('Y-m-d'),
        ]);

        $response = $this->get(route('public.expense.index', ['category' => 'Pendidikan & Buku']));

        $response->assertStatus(200);
        $response->assertSee('Buku Pemrograman');
        $response->assertDontSee('Belanja Sayur');
    }
}
