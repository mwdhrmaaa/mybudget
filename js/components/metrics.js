export function formatCurrency(amount) {
    return "Rp " + Math.round(amount || 0).toLocaleString("id-ID");
}

export function renderMetrics(containerEl, analytics) {
    if (!containerEl) return;

    containerEl.innerHTML = `
        <div class="glass-panel" style="padding: 1rem 1.15rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="color: var(--text-muted); font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;">Saldo Bersih</span>
                <i data-lucide="wallet" style="width: 14px; height: 14px; color: var(--accent-brand); opacity: 0.85;"></i>
            </div>
            <div style="font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em; color: ${analytics.netBalance >= 0 ? '#34d399' : '#f87171'};">
                ${formatCurrency(analytics.netBalance)}
            </div>
            <div style="color: var(--text-muted); font-size: 0.75rem; margin-top: 0.25rem;">
                Total akumulatif
            </div>
        </div>

        <div class="glass-panel" style="padding: 1rem 1.15rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="color: var(--text-muted); font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;">Total Pemasukan</span>
                <i data-lucide="arrow-down-left" style="width: 14px; height: 14px; color: #34d399; opacity: 0.85;"></i>
            </div>
            <div style="font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em; color: #34d399;">
                ${formatCurrency(analytics.totalIncome)}
            </div>
            <div style="color: var(--text-muted); font-size: 0.75rem; margin-top: 0.25rem;">
                Bulan ini: ${formatCurrency(analytics.thisMonthIncome)}
            </div>
        </div>

        <div class="glass-panel" style="padding: 1rem 1.15rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="color: var(--text-muted); font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;">Total Pengeluaran</span>
                <i data-lucide="arrow-up-right" style="width: 14px; height: 14px; color: #f87171; opacity: 0.85;"></i>
            </div>
            <div style="font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em; color: #f87171;">
                ${formatCurrency(analytics.totalExpenses)}
            </div>
            <div style="color: var(--text-muted); font-size: 0.75rem; margin-top: 0.25rem;">
                Bulan ini: ${formatCurrency(analytics.thisMonthExpenses)}
            </div>
        </div>

        <div class="glass-panel" style="padding: 1rem 1.15rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="color: var(--text-muted); font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;">Top Kategori</span>
                <i data-lucide="trending-up" style="width: 14px; height: 14px; color: var(--status-warning); opacity: 0.85;"></i>
            </div>
            <div style="font-size: 1.15rem; font-weight: 700; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${analytics.topCategory.category}
            </div>
            <div style="color: var(--text-muted); font-size: 0.75rem; margin-top: 0.25rem;">
                ${formatCurrency(analytics.topCategory.total)} (${analytics.topCategory.percentage}%)
            </div>
        </div>
    `;

    if (window.lucide) window.lucide.createIcons();
}
