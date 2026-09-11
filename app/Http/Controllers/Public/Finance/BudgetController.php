<?php

namespace App\Http\Controllers\Public\Finance;

use App\Domain\Budget\Actions\CalculateBudgetUsageAction;
use App\Domain\Budget\Actions\CreateBudgetAction;
use App\Domain\Budget\Actions\DeleteBudgetAction;
use App\Domain\Budget\Actions\UpdateBudgetAction;
use App\Domain\Budget\DataTransferObjects\BudgetPayloadDto;
use App\Http\Controllers\Controller;
use App\Http\Requests\Budget\StoreBudgetRequest;
use App\Http\Requests\Budget\UpdateBudgetRequest;
use App\Models\Budget;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

final class BudgetController extends Controller
{
    public function __construct(
        private readonly CalculateBudgetUsageAction $calculateUsage,
        private readonly CreateBudgetAction $createBudget,
        private readonly UpdateBudgetAction $updateBudget,
        private readonly DeleteBudgetAction $deleteBudget
    ) {}

    public function index(): View
    {
        $rawBudgets = Budget::orderBy('start_date', 'desc')->get();
        $budgets = $this->calculateUsage->execute($rawBudgets);

        return view('public.finance.budget.index', compact('budgets'));
    }

    public function create(): View
    {
        return view('public.finance.budget.create');
    }

    public function store(StoreBudgetRequest $request): RedirectResponse
    {
        $dto = BudgetPayloadDto::fromArray($request->validated());
        $this->createBudget->execute($dto);

        return redirect()
            ->route('public.finance.budget.index')
            ->with('success', 'Rencana anggaran berhasil ditambahkan.');
    }

    public function edit(Budget $budget): View
    {
        return view('public.finance.budget.edit', compact('budget'));
    }

    public function update(UpdateBudgetRequest $request, Budget $budget): RedirectResponse
    {
        $dto = BudgetPayloadDto::fromArray($request->validated());
        $this->updateBudget->execute($budget, $dto);

        return redirect()
            ->route('public.finance.budget.index')
            ->with('success', 'Rencana anggaran berhasil diperbarui.');
    }

    public function destroy(Budget $budget): RedirectResponse
    {
        $this->deleteBudget->execute($budget);

        return redirect()
            ->route('public.finance.budget.index')
            ->with('success', 'Rencana anggaran berhasil dihapus.');
    }
}
