<?php

namespace App\Http\Controllers\Public\Expense;

use App\Domain\Analytics\Actions\GetDashboardAnalyticsAction;
use App\Domain\Expense\Actions\CreateExpenseAction;
use App\Domain\Expense\Actions\DeleteExpenseAction;
use App\Domain\Expense\Actions\GetExpenseListAction;
use App\Domain\Expense\Actions\UpdateExpenseAction;
use App\Domain\Expense\DataTransferObjects\ExpenseFilterDto;
use App\Domain\Expense\DataTransferObjects\ExpensePayloadDto;
use App\Http\Controllers\Controller;
use App\Http\Requests\Expense\StoreExpenseRequest;
use App\Http\Requests\Expense\UpdateExpenseRequest;
use App\Models\Expense;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

final class ExpenseController extends Controller
{
    public function __construct(
        private readonly GetExpenseListAction $getExpenseList,
        private readonly CreateExpenseAction $createExpense,
        private readonly UpdateExpenseAction $updateExpense,
        private readonly DeleteExpenseAction $deleteExpense,
        private readonly GetDashboardAnalyticsAction $getAnalytics
    ) {}

    public function index(Request $request): View
    {
        $filter = ExpenseFilterDto::fromRequest($request->query());
        $expenses = $this->getExpenseList->execute($filter);
        $analytics = $this->getAnalytics->execute();
        $categories = Expense::select('category')->distinct()->pluck('category');

        return view('public.expense.index', compact('expenses', 'analytics', 'categories', 'filter'));
    }

    public function create(): View
    {
        return view('public.expense.create');
    }

    public function store(StoreExpenseRequest $request): RedirectResponse
    {
        $dto = ExpensePayloadDto::fromArray($request->validated());
        $this->createExpense->execute($dto);

        return redirect()
            ->route('public.expense.index')
            ->with('success', 'Transaksi pengeluaran berhasil disimpan.');
    }

    public function edit(Expense $expense): View
    {
        return view('public.expense.edit', compact('expense'));
    }

    public function update(UpdateExpenseRequest $request, Expense $expense): RedirectResponse
    {
        $dto = ExpensePayloadDto::fromArray($request->validated());
        $this->updateExpense->execute($expense, $dto);

        return redirect()
            ->route('public.expense.index')
            ->with('success', 'Transaksi pengeluaran berhasil diperbarui.');
    }

    public function destroy(Expense $expense): RedirectResponse
    {
        $this->deleteExpense->execute($expense);

        return redirect()
            ->route('public.expense.index')
            ->with('success', 'Transaksi pengeluaran berhasil dihapus.');
    }
}
