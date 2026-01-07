<?php

namespace App\Http\Controllers\Public\Expense;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Expense;

class ExpenseController extends Controller
{
    public function index()
    {
        $expenses = Expense::orderBy('expense_date', 'desc')->get();
        
        // Fetch active budgets
        $budgets = \App\Models\Budget::orderBy('start_date', 'desc')->get();
        // Calculate remaining for display (simplified logic, ideally shared)
        foreach ($budgets as $budget) {
            $startDate = \Carbon\Carbon::parse($budget->start_date);
             // Logic to determine end date - duplicating for now as it's small, refrain from over-engineering
             if ($budget->period == 'daily') $endDate = $startDate->copy()->endOfDay();
             elseif ($budget->period == 'weekly') $endDate = $startDate->copy()->endOfWeek();
             elseif ($budget->period == 'monthly') $endDate = $startDate->copy()->endOfMonth();
             elseif ($budget->period == 'yearly') $endDate = $startDate->copy()->endOfYear();
             else $endDate = $startDate->copy()->addYears(100);

            $usage = Expense::whereBetween('expense_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])->sum('amount');
            $budget->remaining = $budget->amount - $usage;
            $budget->usage = $usage;
        }

        return view('public.expense.index', compact('expenses', 'budgets'));
    }

    public function create()
    {
        return view('public.expense.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'expense_date' => 'required|date',
        ]);

        Expense::create($validated);

        return redirect()->route('public.expense.index')->with('success', 'Expense added successfully!');
    }
}
