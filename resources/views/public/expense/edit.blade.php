@extends('layouts.public')

@section('content')
<div style="max-width: 600px; margin: 0 auto;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
        <div>
            <h1 style="font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em;">Ubah Catatan Transaksi</h1>
            <p style="color: var(--text-secondary); font-size: 0.875rem;">Perbarui rincian transaksi pengeluaran #{{ $expense->id }}.</p>
        </div>
        <a href="{{ route('public.expense.index') }}" class="btn btn-ghost" style="padding: 0.45rem 0.85rem;">
            <i data-lucide="arrow-left" style="width: 16px; height: 16px;"></i>
            <span>Kembali</span>
        </a>
    </div>

    <div class="glass-panel" style="padding: 2rem;">
        <form method="POST" action="{{ route('public.expense.update', $expense->id) }}" style="display: flex; flex-direction: column; gap: 1.25rem;">
            @csrf
            @method('PUT')

            <!-- Nominal -->
            <div>
                <label style="display: block; font-size: 0.8125rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.04em;">Nominal Pengeluaran (Rp)</label>
                <div style="position: relative;">
                    <span style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-weight: 700;">Rp</span>
                    <input type="number" step="0.01" name="amount" value="{{ old('amount', $expense->amount) }}" required
                        style="width: 100%; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.75rem 1rem 0.75rem 3rem; color: #ffffff; font-size: 1.25rem; font-weight: 700; outline: none;">
                </div>
            </div>

            <!-- Kategori -->
            <div>
                <label style="display: block; font-size: 0.8125rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.04em;">Kategori</label>
                <select name="category" required
                    style="width: 100%; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.75rem 1rem; color: var(--text-primary); font-size: 0.9rem; outline: none;">
                    @php
                        $opts = ['Makanan & Minuman', 'Transportasi', 'Belanja & Logistik', 'Tagihan & Utilitas', 'Hiburan & Hobi', 'Kesehatan', 'Pendidikan & Buku', 'Investasi & Tabungan', 'Lainnya'];
                    @endphp
                    @foreach($opts as $opt)
                        <option value="{{ $opt }}" {{ old('category', $expense->category) === $opt ? 'selected' : '' }}>{{ $opt }}</option>
                    @endforeach
                </select>
            </div>

            <!-- Keterangan -->
            <div>
                <label style="display: block; font-size: 0.8125rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.04em;">Keterangan</label>
                <input type="text" name="description" value="{{ old('description', $expense->description) }}" required
                    style="width: 100%; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.75rem 1rem; color: var(--text-primary); font-size: 0.9rem; outline: none;">
            </div>

            <!-- Tanggal Transaksi -->
            <div>
                <label style="display: block; font-size: 0.8125rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.04em;">Tanggal Transaksi</label>
                <input type="date" name="expense_date" value="{{ old('expense_date', \Carbon\Carbon::parse($expense->expense_date)->format('Y-m-d')) }}" required
                    style="width: 100%; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.75rem 1rem; color: var(--text-primary); font-size: 0.9rem; outline: none;">
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem;">
                <a href="{{ route('public.expense.index') }}" class="btn btn-ghost">Batal</a>
                <button type="submit" class="btn btn-primary" style="padding: 0.75rem 1.75rem;">
                    <i data-lucide="check" style="width: 16px; height: 16px;"></i>
                    <span>Simpan Perubahan</span>
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
