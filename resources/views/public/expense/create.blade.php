@extends('layouts.public')

@section('content')
<div class="animate-fade-in" style="max-width: 600px; margin: 0 auto;">
    <div style="margin-bottom: 2rem;">
        <a href="{{ route('public.expense.index') }}" style="color: var(--text-muted); text-decoration: none; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; font-size: 0.875rem;">
            ← Back to Dashboard
        </a>
        <h1 style="font-size: 2rem; font-weight: 700;">Add New Expense</h1>
        <p style="color: var(--text-muted);">Log your spending details below.</p>
    </div>

    <div class="glass-card">
        <form action="{{ route('public.expense.store') }}" method="POST">
            @csrf
            
            <div style="margin-bottom: 1.5rem;">
                <label for="amount" style="display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.875rem; color: var(--text-muted);">Amount (IDR)</label>
                <input type="number" name="amount" id="amount" required placeholder="0" 
                    style="width: 100%; padding: 0.75rem 1rem; border-radius: 0.75rem; background: rgba(15, 23, 42, 0.5); border: 1px solid var(--glass-border); color: white; outline: none; transition: border-color 0.3s ease; font-size: 1.25rem; font-weight: 600;"
                    onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--glass-border)'">
            </div>

            <div style="margin-bottom: 1.5rem;">
                <label for="description" style="display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.875rem; color: var(--text-muted);">Description</label>
                <input type="text" name="description" id="description" required placeholder="What did you spend on?" 
                    style="width: 100%; padding: 0.75rem 1rem; border-radius: 0.75rem; background: rgba(15, 23, 42, 0.5); border: 1px solid var(--glass-border); color: white; outline: none; transition: border-color 0.3s ease;"
                    onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--glass-border)'">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
                <div>
                    <label for="category" style="display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.875rem; color: var(--text-muted);">Category</label>
                    <select name="category" id="category" required 
                        style="width: 100%; padding: 0.75rem 1rem; border-radius: 0.75rem; background: rgba(15, 23, 42, 0.5); border: 1px solid var(--glass-border); color: white; outline: none; transition: border-color 0.3s ease; appearance: none;"
                        onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--glass-border)'">
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label for="expense_date" style="display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.875rem; color: var(--text-muted);">Date</label>
                    <input type="date" name="expense_date" id="expense_date" required value="{{ date('Y-m-d') }}"
                        style="width: 100%; padding: 0.75rem 1rem; border-radius: 0.75rem; background: rgba(15, 23, 42, 0.5); border: 1px solid var(--glass-border); color: white; outline: none; transition: border-color 0.3s ease;"
                        onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--glass-border)'">
                </div>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%;">Save Expense</button>
        </form>
    </div>
</div>
@endsection
