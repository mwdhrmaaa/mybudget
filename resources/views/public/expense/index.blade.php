@extends('layouts.public')

@section('content')
<div style="display: flex; flex-direction: column; gap: 2rem;">

    <!-- Top Hero / Telemetry Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
        <div>
            <h1 style="font-size: 1.75rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 0.25rem;">Telemetry Finansial</h1>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">Monitoring real-time arus kas, utilisasi anggaran, dan histori transaksi.</p>
        </div>
        <div style="display: flex; gap: 0.75rem;">
            <a href="{{ route('public.finance.budget.index') }}" class="btn btn-ghost">
                <i data-lucide="pie-chart" style="width: 16px; height: 16px;"></i>
                <span>Status Anggaran</span>
            </a>
            <a href="{{ route('public.expense.create') }}" class="btn btn-primary">
                <i data-lucide="plus" style="width: 16px; height: 16px;"></i>
                <span>Catat Pengeluaran</span>
            </a>
        </div>
    </div>

    <!-- Metrics Cards Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
        <!-- Card 1: Total Pengeluaran -->
        <div class="glass-panel" style="padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span style="color: var(--text-muted); font-size: 0.8125rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Total Pengeluaran</span>
                <i data-lucide="wallet" style="width: 18px; height: 18px; color: var(--accent-brand);"></i>
            </div>
            <div style="font-size: 1.625rem; font-weight: 800; letter-spacing: -0.02em;">
                Rp {{ number_format($analytics->totalExpenses, 0, ',', '.') }}
            </div>
            <div style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 0.35rem;">
                Akumulasi seluruh transaksi
            </div>
        </div>

        <!-- Card 2: Bulan Ini -->
        <div class="glass-panel" style="padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span style="color: var(--text-muted); font-size: 0.8125rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Bulan Ini</span>
                <i data-lucide="calendar" style="width: 18px; height: 18px; color: #38bdf8;"></i>
            </div>
            <div style="font-size: 1.625rem; font-weight: 800; letter-spacing: -0.02em;">
                Rp {{ number_format($analytics->thisMonthExpenses, 0, ',', '.') }}
            </div>
            <div style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 0.35rem;">
                Periode {{ now()->translatedFormat('F Y') }}
            </div>
        </div>

        <!-- Card 3: Hari Ini -->
        <div class="glass-panel" style="padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span style="color: var(--text-muted); font-size: 0.8125rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Hari Ini</span>
                <i data-lucide="clock" style="width: 18px; height: 18px; color: #a855f7;"></i>
            </div>
            <div style="font-size: 1.625rem; font-weight: 800; letter-spacing: -0.02em;">
                Rp {{ number_format($analytics->todayExpenses, 0, ',', '.') }}
            </div>
            <div style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 0.35rem;">
                {{ now()->translatedFormat('l, d M') }}
            </div>
        </div>

        <!-- Card 4: Top Kategori -->
        <div class="glass-panel" style="padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span style="color: var(--text-muted); font-size: 0.8125rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Top Kategori</span>
                <i data-lucide="trending-up" style="width: 18px; height: 18px; color: var(--status-warning);"></i>
            </div>
            <div style="font-size: 1.25rem; font-weight: 800; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                {{ $analytics->topCategory['name'] }}
            </div>
            <div style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 0.35rem;">
                Rp {{ number_format($analytics->topCategory['amount'], 0, ',', '.') }} ({{ $analytics->topCategory['percentage'] }}%)
            </div>
        </div>
    </div>

    <!-- Visual Charts Grid (Linear Dark UI) -->
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.25rem;">
        <!-- Left: 14-Day Trajectory -->
        <div class="glass-panel" style="padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                <div>
                    <h2 style="font-size: 1.05rem; font-weight: 700;">Tren Pengeluaran 14 Hari</h2>
                    <p style="color: var(--text-secondary); font-size: 0.8rem;">Aktivitas pengeluaran harian periode 2 pekan terakhir</p>
                </div>
            </div>
            <div style="height: 220px; width: 100%;">
                <canvas id="trendChart"></canvas>
            </div>
        </div>

        <!-- Right: Category Donut -->
        <div class="glass-panel" style="padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                <div>
                    <h2 style="font-size: 1.05rem; font-weight: 700;">Distribusi Kategori</h2>
                    <p style="color: var(--text-secondary); font-size: 0.8rem;">Proporsi alokasi dana</p>
                </div>
            </div>
            <div style="height: 220px; width: 100%; position: relative;">
                <canvas id="categoryChart"></canvas>
            </div>
        </div>
    </div>

    <!-- Transaction Section & Filters -->
    <div class="glass-panel" style="padding: 1.5rem;">
        <!-- Filter Toolbar -->
        <form method="GET" action="{{ route('public.expense.index') }}" style="display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-subtle);">
            <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center;">
                <!-- Search input -->
                <div style="position: relative;">
                    <input type="text" name="search" value="{{ $filter->search }}" placeholder="Cari keterangan..."
                        style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.5rem 0.85rem; color: var(--text-primary); font-size: 0.85rem; width: 200px; outline: none;">
                </div>

                <!-- Category select -->
                <select name="category" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.5rem 0.85rem; color: var(--text-primary); font-size: 0.85rem; outline: none;">
                    <option value="">Semua Kategori</option>
                    @foreach($categories as $cat)
                        <option value="{{ $cat }}" {{ $filter->category === $cat ? 'selected' : '' }}>{{ $cat }}</option>
                    @endforeach
                </select>

                <!-- Date Range -->
                <input type="date" name="start_date" value="{{ $filter->startDate }}" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.45rem 0.75rem; color: var(--text-primary); font-size: 0.85rem; outline: none;">
                <span style="color: var(--text-muted); font-size: 0.8rem;">s/d</span>
                <input type="date" name="end_date" value="{{ $filter->endDate }}" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.45rem 0.75rem; color: var(--text-primary); font-size: 0.85rem; outline: none;">

                <button type="submit" class="btn btn-ghost" style="padding: 0.45rem 0.9rem;">
                    <i data-lucide="filter" style="width: 14px; height: 14px;"></i>
                    <span>Terapkan</span>
                </button>

                @if($filter->search || $filter->category || $filter->startDate || $filter->endDate)
                    <a href="{{ route('public.expense.index') }}" class="btn btn-ghost" style="padding: 0.45rem 0.75rem; color: var(--text-muted);" title="Reset Filter">
                        <i data-lucide="rotate-ccw" style="width: 14px; height: 14px;"></i>
                    </a>
                @endif
            </div>

            <div style="color: var(--text-secondary); font-size: 0.85rem;">
                Menampilkan <strong>{{ $expenses->total() }}</strong> catatan transaksi
            </div>
        </form>

        <!-- Table Data -->
        @if($expenses->isEmpty())
            <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
                <i data-lucide="inbox" style="width: 40px; height: 40px; margin-bottom: 0.75rem; opacity: 0.4;"></i>
                <p style="font-size: 0.95rem; font-weight: 500;">Belum ada catatan transaksi yang sesuai dengan filter.</p>
                <a href="{{ route('public.expense.create') }}" class="btn btn-primary" style="margin-top: 1rem;">
                    <span>Tambah Transaksi Pertama</span>
                </a>
            </div>
        @else
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
                    <thead>
                        <tr style="border-bottom: 1px solid var(--border-subtle); color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
                            <th style="padding: 0.75rem 1rem;">Tanggal</th>
                            <th style="padding: 0.75rem 1rem;">Kategori</th>
                            <th style="padding: 0.75rem 1rem;">Keterangan</th>
                            <th style="padding: 0.75rem 1rem; text-align: right;">Nominal</th>
                            <th style="padding: 0.75rem 1rem; text-align: right;">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($expenses as $expense)
                            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.04); transition: var(--transition-smooth);" onmouseover="this.style.background='rgba(255, 255, 255, 0.02)'" onmouseout="this.style.background='transparent'">
                                <td style="padding: 1rem; white-space: nowrap; color: var(--text-secondary);">
                                    {{ \Carbon\Carbon::parse($expense->expense_date)->format('d M Y') }}
                                </td>
                                <td style="padding: 1rem; white-space: nowrap;">
                                    <span class="badge" style="background: rgba(59, 130, 246, 0.1); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.2);">
                                        {{ $expense->category }}
                                    </span>
                                </td>
                                <td style="padding: 1rem; font-weight: 500; color: var(--text-primary);">
                                    {{ $expense->description }}
                                </td>
                                <td style="padding: 1rem; text-align: right; font-weight: 700; color: #ffffff; white-space: nowrap;">
                                    Rp {{ number_format($expense->amount, 0, ',', '.') }}
                                </td>
                                <td style="padding: 1rem; text-align: right; white-space: nowrap;">
                                    <div style="display: inline-flex; gap: 0.4rem; justify-content: flex-end;">
                                        <a href="{{ route('public.expense.edit', $expense->id) }}" class="btn btn-ghost" style="padding: 0.35rem 0.6rem;" title="Edit Transaksi">
                                            <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
                                        </a>
                                        <form method="POST" action="{{ route('public.expense.destroy', $expense->id) }}" onsubmit="return confirm('Hapus catatan pengeluaran ini secara permanen?');" style="display: inline;">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-danger-ghost" style="padding: 0.35rem 0.6rem;" title="Hapus Transaksi">
                                                <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <!-- Pagination Bar -->
            <div style="margin-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: var(--text-secondary);">
                <div>
                    Halaman {{ $expenses->currentPage() }} dari {{ $expenses->lastPage() }}
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    @if($expenses->onFirstPage())
                        <span class="btn btn-ghost" style="opacity: 0.4; cursor: not-allowed; padding: 0.4rem 0.8rem;">Sebelumnya</span>
                    @else
                        <a href="{{ $expenses->previousPageUrl() }}" class="btn btn-ghost" style="padding: 0.4rem 0.8rem;">Sebelumnya</a>
                    @endif

                    @if($expenses->hasMorePages())
                        <a href="{{ $expenses->nextPageUrl() }}" class="btn btn-ghost" style="padding: 0.4rem 0.8rem;">Selanjutnya</a>
                    @else
                        <span class="btn btn-ghost" style="opacity: 0.4; cursor: not-allowed; padding: 0.4rem 0.8rem;">Selanjutnya</span>
                    @endif
                </div>
            </div>
        @endif
    </div>

</div>
@endsection

@section('scripts')
<script>
    const dailyTrendData = @json($analytics->dailyTrend);
    const categoryData = @json($analytics->categoryBreakdown);

    // 1. Line Trend Chart
    const trendCtx = document.getElementById('trendChart');
    if (trendCtx) {
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: dailyTrendData.map(item => item.label),
                datasets: [{
                    label: 'Pengeluaran (Rp)',
                    data: dailyTrendData.map(item => item.amount),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.35,
                    pointBackgroundColor: '#3b82f6',
                    pointRadius: 3,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Rp ' + context.parsed.y.toLocaleString('id-ID');
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.04)' },
                        ticks: { color: '#5e6272', font: { size: 10 } }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.04)' },
                        ticks: {
                            color: '#5e6272',
                            font: { size: 10 },
                            callback: function(value) {
                                if (value >= 1000000) return (value / 1000000) + 'jt';
                                if (value >= 1000) return (value / 1000) + 'rb';
                                return value;
                            }
                        }
                    }
                }
            }
        });
    }

    // 2. Category Donut Chart
    const catCtx = document.getElementById('categoryChart');
    if (catCtx && categoryData.length > 0) {
        const palette = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#64748b'];
        new Chart(catCtx, {
            type: 'doughnut',
            data: {
                labels: categoryData.map(item => item.category),
                datasets: [{
                    data: categoryData.map(item => item.total),
                    backgroundColor: palette.slice(0, categoryData.length),
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '72%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#9da1b2', font: { size: 10 }, boxWidth: 10, padding: 8 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ' Rp ' + context.parsed.toLocaleString('id-ID');
                            }
                        }
                    }
                }
            }
        });
    }
</script>
@endsection
