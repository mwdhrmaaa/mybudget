@extends('layouts.public')

@section('content')
<div style="display: flex; flex-direction: column; gap: 2rem;">

    <!-- Top Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
        <div>
            <h1 style="font-size: 1.75rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 0.25rem;">Rencana Anggaran</h1>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">Tetapkan target pagu pengeluaran berkala untuk menjaga stabilitas arus kas.</p>
        </div>
        <div style="display: flex; gap: 0.75rem;">
            <a href="{{ route('public.expense.index') }}" class="btn btn-ghost">
                <i data-lucide="arrow-left" style="width: 16px; height: 16px;"></i>
                <span>Kembali ke Dashboard</span>
            </a>
            <a href="{{ route('public.finance.budget.create') }}" class="btn btn-primary">
                <i data-lucide="plus" style="width: 16px; height: 16px;"></i>
                <span>Buat Anggaran Baru</span>
            </a>
        </div>
    </div>

    @if($budgets->isEmpty())
        <div class="glass-panel" style="text-align: center; padding: 4rem 1.5rem; color: var(--text-muted);">
            <i data-lucide="pie-chart" style="width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.35;"></i>
            <h2 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">Belum Ada Rencana Anggaran</h2>
            <p style="font-size: 0.9rem; max-width: 400px; margin: 0 auto 1.5rem;">Buat batas pagu pengeluaran harian, mingguan, atau bulanan pertama Anda untuk memantau sisa limit dana secara otomatis.</p>
            <a href="{{ route('public.finance.budget.create') }}" class="btn btn-primary">
                <i data-lucide="plus" style="width: 16px; height: 16px;"></i>
                <span>Buat Anggaran Sekarang</span>
            </a>
        </div>
    @else
        <!-- Budget Cards Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.25rem;">
            @foreach($budgets as $budget)
                <div class="glass-panel" style="padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; gap: 1.25rem;">
                    <div>
                        <!-- Header Card -->
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                            <div>
                                <span class="badge" style="background: rgba(59, 130, 246, 0.1); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.2); text-transform: uppercase; margin-bottom: 0.5rem;">
                                    {{ $budget->period }}
                                </span>
                                <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary);">
                                    {{ $budget->description ?: 'Anggaran ' . ucfirst($budget->period) }}
                                </h3>
                            </div>

                            <!-- Health Status Badge -->
                            @if($budget->health_status === 'danger')
                                <span class="badge badge-danger">
                                    <i data-lucide="alert-circle" style="width: 12px; height: 12px;"></i>
                                    Over Budget
                                </span>
                            @elseif($budget->health_status === 'warning')
                                <span class="badge badge-warning">
                                    <i data-lucide="alert-triangle" style="width: 12px; height: 12px;"></i>
                                    Waspada ({{ $budget->percent_used }}%)
                                </span>
                            @else
                                <span class="badge badge-safe">
                                    <i data-lucide="check" style="width: 12px; height: 12px;"></i>
                                    Aman ({{ $budget->percent_used }}%)
                                </span>
                            @endif
                        </div>

                        <!-- Progress Bar Component -->
                        <div style="margin: 1.25rem 0 0.75rem;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.45rem; color: var(--text-secondary);">
                                <span>Terpakai: <strong>Rp {{ number_format($budget->usage, 0, ',', '.') }}</strong></span>
                                <span>Pagu: <strong>Rp {{ number_format($budget->amount, 0, ',', '.') }}</strong></span>
                            </div>
                            <div style="width: 100%; height: 8px; background: rgba(255, 255, 255, 0.06); border-radius: 9999px; overflow: hidden;">
                                @php
                                    $barColor = $budget->health_status === 'danger' ? 'var(--status-danger)' : ($budget->health_status === 'warning' ? 'var(--status-warning)' : 'var(--status-safe)');
                                @endphp
                                <div style="height: 100%; width: {{ min(100, $budget->percent_used) }}%; background: {{ $barColor }}; border-radius: 9999px; transition: width 0.5s ease;"></div>
                            </div>
                        </div>

                        <!-- Remaining Balance Info -->
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: var(--bg-surface); border-radius: var(--radius-md); font-size: 0.85rem; margin-top: 1rem;">
                            <span style="color: var(--text-secondary);">Sisa Kuota:</span>
                            <span style="font-weight: 700; color: {{ $budget->remaining_balance < 0 ? '#f87171' : '#34d399' }};">
                                Rp {{ number_format($budget->remaining_balance, 0, ',', '.') }}
                            </span>
                        </div>
                    </div>

                    <!-- Footer Details & Actions -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 1rem; font-size: 0.8rem; color: var(--text-muted);">
                        <div>
                            Mulai: {{ \Carbon\Carbon::parse($budget->start_date)->format('d M Y') }}
                        </div>
                        <div style="display: inline-flex; gap: 0.4rem;">
                            <a href="{{ route('public.finance.budget.edit', $budget->id) }}" class="btn btn-ghost" style="padding: 0.35rem 0.6rem;" title="Edit Anggaran">
                                <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
                            </a>
                            <form method="POST" action="{{ route('public.finance.budget.destroy', $budget->id) }}" onsubmit="return confirm('Hapus rencana anggaran ini?');" style="display: inline;">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger-ghost" style="padding: 0.35rem 0.6rem;" title="Hapus Anggaran">
                                    <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    @endif

</div>
@endsection
