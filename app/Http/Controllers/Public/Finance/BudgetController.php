<?php

namespace App\Http\Controllers\Public\Finance;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class BudgetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $budgets = Budget::orderBy('start_date', 'desc')->get();

        // Calculate remaining balance for each budget
        foreach ($budgets as $budget) {
            $startDate = Carbon::parse($budget->start_date);
            $endDate = $budget->end_date ? Carbon::parse($budget->end_date) : null;

            if (!$endDate) {
                // Determine end date based on period if not set
                switch ($budget->period) {
                    case 'daily':
                        $endDate = $startDate->copy()->endOfDay();
                        break;
                    case 'weekly':
                        $endDate = $startDate->copy()->endOfWeek();
                        break;
                    case 'monthly':
                        $endDate = $startDate->copy()->endOfMonth();
                        break;
                    case 'yearly':
                        $endDate = $startDate->copy()->endOfYear();
                        break;
                    default:
                         $endDate = $startDate->copy()->addYears(100); // Indefinite?
                }
            }

            $totalExpenses = Expense::whereBetween('expense_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
                ->sum('amount');

            $budget->remaining_balance = $budget->amount - $totalExpenses;
            $budget->total_expenses = $totalExpenses;
        }

        return view('public.finance.budget.index', compact('budgets'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('public.finance.budget.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'period' => 'required|in:daily,weekly,monthly,yearly',
            'start_date' => 'required|date',
            'description' => 'nullable|string|max:255',
        ]);

        // Auto calculate end_date ideally, or leave null to be dynamic based on period start?
        // Let's set end_date based on period for clarity in DB if desired, or handle dynamically.
        // For now, let's keep end_date nullable in DB but maybe populate it? 
        // Or better, logic in index handles "current period" check. 
        // User asked for "options for time, from day to year".
        
        // Let's start simple.
        Budget::create($validated);

        return redirect()->route('public.finance.budget.index')->with('success', 'Budget created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Budget $budget)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Budget $budget)
    {
        return view('public.finance.budget.edit', compact('budget'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Budget $budget)
    {
         $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'period' => 'required|in:daily,weekly,monthly,yearly',
            'start_date' => 'required|date',
            'description' => 'nullable|string|max:255',
        ]);

        $budget->update($validated);

        return redirect()->route('public.finance.budget.index')->with('success', 'Budget updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Budget $budget)
    {
        $budget->delete();
        return redirect()->route('public.finance.budget.index')->with('success', 'Budget deleted successfully.');
    }
}
