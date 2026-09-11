@extends('layouts.public')

@section('content')
<div style="max-width: 600px; margin: 0 auto;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
        <div>
            <h1 style="font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em;">Buat Target Anggaran</h1>
            <p style="color: var(--text-secondary); font-size: 0.875rem;">Tetapkan pagu pengeluaran berkala untuk kontrol finansial.</p>
        </div>
        <a href="{{ route('public.finance.budget.index') }}" class="btn btn-ghost" style="padding: 0.45rem 0.85rem;">
            <i data-lucide="arrow-left" style="width: 16px; height: 16px;"></i>
            <span>Kembali</span>
        </a>
    </div>

    <div class="glass-panel" style="padding: 2rem;">
        <form method="POST" action="{{ route('public.finance.budget.store') }}" style="display: flex; flex-direction: column; gap: 1.25rem;">
            @csrf

            <!-- Nominal Pagu -->
            <div>
                <label style="display: block; font-size: 0.8125rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.04em;">Nominal Pagu Anggaran (Rp)</label>
                <div style="position: relative;">
                    <span style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-weight: 700;">Rp</span>
                    <input type="number" step="0.01" name="amount" value="{{ old('amount') }}" placeholder="0" required
                        style="width: 100%; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.75rem 1rem 0.75rem 3rem; color: #ffffff; font-size: 1.25rem; font-weight: 700; outline: none;">
                </div>
            </div>

            <!-- Periode -->
            <div>
                <label style="display: block; font-size: 0.8125rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.04em;">Periode Anggaran</label>
                <select name="period" required
                    style="width: 100%; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.75rem 1rem; color: var(--text-primary); font-size: 0.9rem; outline: none;">
                    <option value="daily" {{ old('period') === 'daily' ? 'selected' : '' }}>Harian (Daily)</option>
                    <option value="weekly" {{ old('period') === 'weekly' ? 'selected' : '' }}>Mingguan (Weekly)</option>
                    <option value="monthly" {{ old('period', 'monthly') === 'monthly' ? 'selected' : '' }}>Bulanan (Monthly)</option>
                    <option value="yearly" {{ old('period') === 'yearly' ? 'selected' : '' }}>Tahunan (Yearly)</option>
                </select>
            </div>

            <!-- Tanggal Mulai -->
            <div>
                <label style="display: block; font-size: 0.8125rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.04em;">Tanggal Mulai</label>
                <input type="date" name="start_date" value="{{ old('start_date', date('Y-m-d')) }}" required
                    style="width: 100%; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.75rem 1rem; color: var(--text-primary); font-size: 0.9rem; outline: none;">
            </div>

            <!-- Deskripsi / Nama -->
            <div>
                <label style="display: block; font-size: 0.8125rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.04em;">Keterangan / Label Anggaran (Opsional)</label>
                <input type="text" name="description" value="{{ old('description') }}" placeholder="Contoh: Belanja Operasional & Makan"
                    style="width: 100%; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.75rem 1rem; color: var(--text-primary); font-size: 0.9rem; outline: none;">
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem;">
                <a href="{{ route('public.finance.budget.index') }}" class="btn btn-ghost">Batal</a>
                <button type="submit" class="btn btn-primary" style="padding: 0.75rem 1.75rem;">
                    <i data-lucide="check" style="width: 16px; height: 16px;"></i>
                    <span>Simpan Anggaran</span>
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
