@extends('layouts.public')

@section('content')
<div class="animate-fade-in">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div>
            <h1 style="font-size: 2rem; font-weight: 700;">Expense Tracker</h1>
            <p style="color: var(--text-muted);">Manage your daily spending efficiently.</p>
        </div>
        <a href="{{ route('public.expense.create') }}" class="btn btn-primary">
            <span>+ Add Expense</span>
        </a>
    </div>

    <!-- Summary Section -->
    <div class="glass-card" style="margin-bottom: 2rem; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(192, 132, 252, 0.1) 100%);">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
            <div>
                <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.5rem;">Total Expenses</p>
                <h3 style="font-size: 1.5rem; color: var(--text-main);">Rp {{ number_format($expenses->sum('amount'), 0, ',', '.') }}</h3>
            </div>
            <div>
                <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.5rem;">Transaction Count</p>
                <h3 style="font-size: 1.5rem; color: var(--text-main);">{{ $expenses->count() }}</h3>
            </div>
        </div>
    </div>

    <!-- Transactions List -->
    <div class="glass-card">
        <h2 style="font-size: 1.25rem; margin-bottom: 1.5rem;">Recent Transactions</h2>
        
        @forelse($expenses as $expense)
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--glass-border);">
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <div style="width: 48px; height: 48px; border-radius: 1rem; background: rgba(255, 255, 255, 0.05); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                        @if(strtolower($expense->category) == 'food') 🍔 
                        @elseif(strtolower($expense->category) == 'transport') 🚗
                        @elseif(strtolower($expense->category) == 'entertainment') 🎬
                        @elseif(strtolower($expense->category) == 'shopping') 🛍️
                        @else 💸 @endif
                    </div>
                    <div>
                        <h4 style="font-weight: 600;">{{ $expense->description }}</h4>
                        <p style="font-size: 0.75rem; color: var(--text-muted);">{{ \Carbon\Carbon::parse($expense->expense_date)->format('M d, Y') }} • {{ $expense->category }}</p>
                    </div>
                </div>
                <div style="text-align: right;">
                    <p style="font-weight: 700; color: var(--accent-red);">- Rp {{ number_format($expense->amount, 0, ',', '.') }}</p>
                </div>
            </div>
        @empty
            <div style="text-align: center; padding: 3rem 0;">
                <p style="color: var(--text-muted);">No expenses recorded yet. Start tracking your budget!</p>
            </div>
        @endforelse
    </div>
</div>
@endsection
