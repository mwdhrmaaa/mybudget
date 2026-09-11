<?php

use App\Http\Controllers\Public\Expense\ExpenseController;
use App\Http\Controllers\Public\Finance\BudgetController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('public.expense.index');
});

// Scope: Public
Route::prefix('public')->name('public.')->group(function () {
    // Domain: Expense (Full CRUD & Analytics)
    Route::resource('expense', ExpenseController::class);

    // Domain: Finance/Budget (Full CRUD & Monitoring)
    Route::prefix('finance')->name('finance.')->group(function () {
        Route::resource('budget', BudgetController::class);
    });
});
