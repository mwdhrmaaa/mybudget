export function formatCurrency(amount) {
    return "Rp " + Math.round(amount || 0).toLocaleString("id-ID");
}

export function renderMetrics(containerEl, analytics) {
    if (!containerEl) return;

    containerEl.innerHTML = `
        <div class="glass-panel" style="padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span style="color: var(--text-muted); font-size: 0.8125rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Saldo Bersih</span>
                <i data-lucide="wallet" style="width: 18px; height: 18px; color: var(--accent-brand);"></i>
            </div>
            <div style="font-size: 1.625rem; font-weight: 800; letter-spacing: -0.02em; color: ${analytics.netBalance >= 0 ? '#34d399' : '#f87171'};">
                ${formatCurrency(analytics.netBalance)}
            </div>
            <div style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 0.35rem;">
                Arus kas bersih akumulatif
            </div>
        </div>

        <div class="glass-panel" style="padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span style="color: var(--text-muted); font-size: 0.8125rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Total Pemasukan</span>
                <i data-lucide="arrow-down-left" style="width: 18px; height: 18px; color: #34d399;"></i>
            </div>
            <div style="font-size: 1.625rem; font-weight: 800; letter-spacing: -0.02em; color: #34d399;">
                ${formatCurrency(analytics.totalIncome)}
            </div>
            <div style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 0.35rem;">
                Bulan ini: ${formatCurrency(analytics.thisMonthIncome)}
            </div>
        </div>

        <div class="glass-panel" style="padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span style="color: var(--text-muted); font-size: 0.8125rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Total Pengeluaran</span>
                <i data-lucide="arrow-up-right" style="width: 18px; height: 18px; color: #f87171;"></i>
            </div>
            <div style="font-size: 1.625rem; font-weight: 800; letter-spacing: -0.02em; color: #f87171;">
                ${formatCurrency(analytics.totalExpenses)}
            </div>
            <div style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 0.35rem;">
                Bulan ini: ${formatCurrency(analytics.thisMonthExpenses)}
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
