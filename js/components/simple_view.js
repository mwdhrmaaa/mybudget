import { formatCurrency } from "./metrics.js";
import { addExpense, deleteExpense } from "../domain/expense.js";

export function renderSimpleView(containerEl, expenses = [], budgets = [], onEdit) {
    if (!containerEl) return;

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

    const todayAmount = expenses
        .filter(e => e.expenseDate === todayStr)
        .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

    const monthAmount = expenses
        .filter(e => e.expenseDate >= thisMonthStart && e.expenseDate <= thisMonthEnd)
        .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

    const mainBudget = budgets.length > 0 ? budgets[0] : null;
    let budgetText = "Belum Diset";
    let budgetSub = "Klik Set Anggaran";

    if (mainBudget) {
        const remaining = Math.max(0, mainBudget.amount - monthAmount);
        budgetText = formatCurrency(remaining);
        budgetSub = `Pagu: ${formatCurrency(mainBudget.amount)}`;
    }

    const recentExpenses = expenses.slice(0, 8);

    containerEl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 720px; margin: 0 auto; width: 100%;">
            
            <!-- Glance Summary Strip -->
            <div class="glass-panel" style="padding: 1.25rem 1.5rem; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center;">
                <div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Hari Ini</div>
                    <div style="font-size: 1.35rem; font-weight: 800; color: #a855f7; margin-top: 0.2rem;">${formatCurrency(todayAmount)}</div>
                </div>
                <div style="border-left: 1px solid var(--border-subtle); border-right: 1px solid var(--border-subtle);">
                    <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Bulan Ini</div>
                    <div style="font-size: 1.35rem; font-weight: 800; color: #38bdf8; margin-top: 0.2rem;">${formatCurrency(monthAmount)}</div>
                </div>
                <div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Sisa Pagu</div>
                    <div style="font-size: 1.35rem; font-weight: 800; color: var(--status-safe); margin-top: 0.2rem;">${budgetText}</div>
                </div>
            </div>

            <!-- Quick Add Bar -->
            <div class="glass-panel" style="padding: 1.25rem 1.5rem;">
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i data-lucide="zap" style="width: 14px; height: 14px; color: var(--status-warning);"></i>
                    <span>Catat Cepat (Instant Log)</span>
                </div>
                <form id="simpleQuickAddForm" style="display: flex; flex-wrap: wrap; gap: 0.6rem;">
                    <div style="position: relative; flex: 1; min-width: 130px;">
                        <span style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 0.85rem; font-weight: 700;">Rp</span>
                        <input type="number" step="0.01" id="quickAmount" placeholder="Nominal" required class="form-input" style="padding-left: 2.25rem; font-weight: 700;">
                    </div>
                    <input type="text" id="quickDesc" placeholder="Keterangan..." required class="form-input" style="flex: 1.5; min-width: 180px;">
                    <select id="quickCategory" class="form-select" style="flex: 1; min-width: 140px;">
                        <option value="Makanan & Minuman">Makanan</option>
                        <option value="Transportasi">Transportasi</option>
                        <option value="Belanja & Logistik">Belanja</option>
                        <option value="Tagihan & Utilitas">Tagihan</option>
                        <option value="Hiburan & Hobi">Hiburan</option>
                        <option value="Kesehatan">Kesehatan</option>
                        <option value="Lainnya">Lainnya</option>
                    </select>
                    <button type="submit" class="btn btn-primary" style="padding: 0.5rem 1rem;">
                        <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
                        <span>Simpan</span>
                    </button>
                </form>
            </div>

            <!-- Recent Compact List -->
            <div class="glass-panel" style="padding: 1.25rem 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Transaksi Terkini</span>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${recentExpenses.length} catatan terakhir</span>
                </div>

                ${recentExpenses.length === 0 ? `
                    <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted); font-size: 0.85rem;">
                        Belum ada catatan pengeluaran.
                    </div>
                ` : `
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        ${recentExpenses.map(exp => `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); transition: var(--transition-smooth);" onmouseover="this.style.borderColor='var(--border-highlight)'" onmouseout="this.style.borderColor='var(--border-subtle)'">
                                <div style="display: flex; align-items: center; gap: 0.75rem; overflow: hidden;">
                                    <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(59, 130, 246, 0.1); color: #60a5fa; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                        <i data-lucide="tag" style="width: 14px; height: 14px;"></i>
                                    </div>
                                    <div style="overflow: hidden;">
                                        <div style="font-size: 0.875rem; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${exp.description}</div>
                                        <div style="font-size: 0.75rem; color: var(--text-muted);">${exp.category} &bull; ${new Date(exp.expenseDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</div>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0;">
                                    <div style="font-size: 0.95rem; font-weight: 700; color: #ffffff;">${formatCurrency(exp.amount)}</div>
                                    <button class="btn btn-ghost btn-simple-del" data-id="${exp.id}" style="padding: 0.25rem 0.5rem; color: var(--text-muted);" title="Hapus">
                                        <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                                    </button>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                `}
            </div>

        </div>
    `;

    // Bind Quick Add
    document.getElementById("simpleQuickAddForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const amt = document.getElementById("quickAmount").value;
        const desc = document.getElementById("quickDesc").value;
        const cat = document.getElementById("quickCategory").value;
        if (!amt || !desc) return;

        addExpense({
            amount: amt,
            description: desc,
            category: cat,
            expenseDate: new Date().toISOString().split("T")[0]
        });
    });

    // Bind Deletes
    containerEl.querySelectorAll(".btn-simple-del").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            if (confirm("Hapus catatan ini?")) {
                deleteExpense(id);
            }
        });
    });

    if (window.lucide) window.lucide.createIcons();
}
