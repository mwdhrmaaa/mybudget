@extends('layouts.public')

@section('content')
<div class="animate-fade-in">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div>
            <h1 style="font-size: 2rem; font-weight: 700;">Budget Plans</h1>
            <p style="color: var(--text-muted);">Manage your financial capitals and limits.</p>
        </div>
        <a href="{{ route('public.finance.budget.create') }}" class="btn btn-primary">
            <span>+ Set New Budget</span>
        </a>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
        @forelse($budgets as $budget)
            @php
                $percentage = $budget->amount > 0 ? ($budget->total_expenses / $budget->amount) * 100 : 0;
                $percentage = min($percentage, 100);
                $statusColor = $percentage < 50 ? 'var(--accent-green)' : ($percentage < 85 ? '#fbbf24' : 'var(--accent-red)');
            @endphp
            <div class="glass-card" style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <h3 style="font-size: 1.25rem; font-weight: 600;">{{ ucfirst($budget->period) }} Budget</h3>
                        <p style="color: var(--text-muted); font-size: 0.875rem;">{{ $budget->description }}</p>
                    </div>
                    <div style="text-align: right;">
                         <span style="font-size: 0.75rem; background: rgba(255,255,255,0.1); padding: 0.25rem 0.5rem; border-radius: 1rem;">
                            {{ \Carbon\Carbon::parse($budget->start_date)->format('M d, Y') }}
                        </span>
                    </div>
                </div>

                <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.5rem; color: var(--text-muted);">
                        <span>Spent: Rp {{ number_format($budget->total_expenses, 0, ',', '.') }}</span>
                        <span>Limit: Rp {{ number_format($budget->amount, 0, ',', '.') }}</span>
                    </div>
                    <!-- Progress Bar -->
                    <div style="height: 8px; width: 100%; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; width: {{ $percentage }}%; background: {{ $statusColor }}; transition: width 0.5s ease;"></div>
                    </div>
                </div>

                <div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <p style="font-size: 0.75rem; color: var(--text-muted);">Remaining</p>
                        <p style="font-size: 1.25rem; font-weight: 700; color: {{ $statusColor }};">
                            Rp {{ number_format($budget->remaining_balance, 0, ',', '.') }}
                        </p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                         <a href="{{ route('public.finance.budget.edit', $budget) }}" class="btn btn-outline" style="padding: 0.5rem; border-radius: 0.5rem;">
                            ✏️
                        </a>
                        <form action="{{ route('public.finance.budget.destroy', $budget) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this budget?');" style="display: inline;">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-outline" style="padding: 0.5rem; border-radius: 0.5rem; color: var(--accent-red); border-color: rgba(239, 68, 68, 0.3);">
                                🗑️
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        @empty
            <div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <p style="color: var(--text-muted); margin-bottom: 1rem;">You haven't set any budgets yet.</p>
                <a href="{{ route('public.finance.budget.create') }}" class="btn btn-primary">Create Your First Budget</a>
            </div>
        @endforelse
    </div>
</div>
@endsection
