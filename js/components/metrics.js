export function formatCurrency(amount) {
    return "Rp " + Math.round(amount || 0).toLocaleString("id-ID");
}

export function renderMetrics(containerEl, analytics) {
    if (!containerEl) return;

    containerEl.innerHTML = `
        <div class="glass-panel" style="padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span style="color: var(--text-muted); font-size: 0.8125rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Total Pengeluaran</span>
                <i data-lucide="wallet" style="width: 18px; height: 18px; color: var(--accent-brand);"></i>
            </div>
            <div style="font-size: 1.625rem; font-weight: 800; letter-spacing: -0.02em;">
                ${formatCurrency(analytics.totalExpenses)}
            </div>
            <div style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 0.35rem;">
                Akumulasi seluruh transaksi
            </div>
        </div>

        <div class="glass-panel" style="padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span style="color: var(--text-muted); font-size: 0.8125rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Bulan Ini</span>
                <i data-lucide="calendar" style="width: 18px; height: 18px; color: #38bdf8;"></i>
            </div>
            <div style="font-size: 1.625rem; font-weight: 800; letter-spacing: -0.02em;">
                ${formatCurrency(analytics.thisMonthExpenses)}
            </div>
            <div style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 0.35rem;">
                Arus kas bulan berjalan
            </div>
        </div>

        <div class="glass-panel" style="padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span style="color: var(--text-muted); font-size: 0.8125rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Hari Ini</span>
                <i data-lucide="clock" style="width: 18px; height: 18px; color: #a855f7;"></i>
            </div>
            <div style="font-size: 1.625rem; font-weight: 800; letter-spacing: -0.02em;">
                ${formatCurrency(analytics.todayExpenses)}
            </div>
            <div style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 0.35rem;">
                Pengeluaran hari ini
            </div>
        </div>

        <div class="glass-panel" style="padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span style="color: var(--text-muted); font-size: 0.8125rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Top Kategori</span>
                <i data-lucide="trending-up" style="width: 18px; height: 18px; color: var(--status-warning);"></i>
            </div>
            <div style="font-size: 1.25rem; font-weight: 800; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${analytics.topCategory.category}
            </div>
            <div style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 0.35rem;">
                ${formatCurrency(analytics.topCategory.total)} (${analytics.topCategory.percentage}%)
            </div>
        </div>
    `;

    if (window.lucide) window.lucide.createIcons();
}
