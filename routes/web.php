<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Public\Expense\ExpenseController;

Route::get('/', function () {
    return redirect()->route('public.expense.index');
});

// GROUP 1: PUBLIC SCOPE
Route::prefix('public')->name('public.')->group(function () {

    // DOMAIN: EXPENSE
    Route::prefix('expense')->name('expense.')->group(function () {
        Route::get('/', [ExpenseController::class, 'index'])->name('index');
        Route::get('/create', [ExpenseController::class, 'create'])->name('create');
        Route::post('/', [ExpenseController::class, 'store'])->name('store');
    });

});
