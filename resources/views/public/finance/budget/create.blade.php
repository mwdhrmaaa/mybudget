@extends('layouts.public')

@section('content')
<div class="animate-fade-in" style="max-width: 600px; margin: 0 auto;">
    <div style="margin-bottom: 2rem;">
        <a href="{{ route('public.finance.budget.index') }}" style="color: var(--text-muted); text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
            ← Back to Budgets
        </a>
        <h1 style="font-size: 2rem; font-weight: 700;">Set Budget Capital</h1>
        <p style="color: var(--text-muted);">Define your spending limits for a specific period.</p>
    </div>

    <div class="glass-card">
        <form action="{{ route('public.finance.budget.store') }}" method="POST">
            @csrf
            
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <!-- Amount -->
                <div>
                    <label for="amount" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Budget Amount (Rp)</label>
                    <input type="number" id="amount" name="amount" required min="0" step="0.01" 
                        style="width: 100%; padding: 0.75rem 1rem; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--glass-border); border-radius: 0.5rem; color: white; font-size: 1rem;"
                        placeholder="e.g. 5000000">
                </div>

                <!-- Period -->
                <div>
                    <label for="period" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Period</label>
                    <select id="period" name="period" required
                        style="width: 100%; padding: 0.75rem 1rem; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--glass-border); border-radius: 0.5rem; color: white; font-size: 1rem;">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly" selected>Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>

                <!-- Start Date -->
                <div>
                    <label for="start_date" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Start Date</label>
                    <input type="date" id="start_date" name="start_date" required value="{{ date('Y-m-d') }}"
                        style="width: 100%; padding: 0.75rem 1rem; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--glass-border); border-radius: 0.5rem; color: white; font-size: 1rem;">
                </div>

                <!-- Description -->
                <div>
                    <label for="description" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Description (Optional)</label>
                    <input type="text" id="description" name="description" 
                        style="width: 100%; padding: 0.75rem 1rem; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--glass-border); border-radius: 0.5rem; color: white; font-size: 1rem;"
                        placeholder="e.g. Living Expenses, Holiday Fund">
                </div>

                <div style="margin-top: 1rem;">
                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        Create Budget Plan
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>
@endsection
