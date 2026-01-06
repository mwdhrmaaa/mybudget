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
        return view('public.expense.index', compact('expenses'));
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
