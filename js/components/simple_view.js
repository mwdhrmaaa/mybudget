import { formatCurrency } from "./metrics.js";
import { addExpense, deleteExpense } from "../domain/expense.js";
import { toast } from "./toast.js";

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
        <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 680px; margin: 0 auto; width: 100%;">
            
            <!-- Glance Summary Strip -->
            <div class="glass-panel" style="padding: 1rem 1.25rem; display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; text-align: center;">
                <div>
                    <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;">Hari Ini</div>
                    <div style="font-size: 1.15rem; font-weight: 700; color: #a855f7; margin-top: 0.15rem;">${formatCurrency(todayAmount)}</div>
                </div>
                <div style="border-left: 1px solid var(--border-subtle); border-right: 1px solid var(--border-subtle);">
                    <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;">Bulan Ini</div>
                    <div style="font-size: 1.15rem; font-weight: 700; color: #38bdf8; margin-top: 0.15rem;">${formatCurrency(monthAmount)}</div>
                </div>
                <div>
                    <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;">Sisa Pagu</div>
                    <div style="font-size: 1.15rem; font-weight: 700; color: var(--status-safe); margin-top: 0.15rem;">${budgetText}</div>
                </div>
            </div>

            <!-- Quick Add Bar -->
            <div class="glass-panel" style="padding: 1rem 1.25rem;">
                <div style="font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.4rem;">
                    <i data-lucide="zap" style="width: 13px; height: 13px; color: var(--status-warning);"></i>
                    <span>Catat Cepat</span>
                </div>
                <form id="simpleQuickAddForm" style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    <select id="quickType" class="form-select" style="width: 95px; flex-shrink: 0;">
                        <option value="expense">Keluar</option>
                        <option value="income">Masuk</option>
                    </select>
                    <div style="position: relative; flex: 1; min-width: 120px;">
                        <span style="position: absolute; left: 0.65rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 0.8rem; font-weight: 600;">Rp</span>
                        <input type="number" step="0.01" id="quickAmount" placeholder="Nominal" required class="form-input" style="padding-left: 2.1rem; font-weight: 600;">
                    </div>
                    <input type="text" id="quickDesc" placeholder="Keterangan..." required class="form-input" style="flex: 1.5; min-width: 160px;">
                    <select id="quickCategory" class="form-select" style="flex: 1; min-width: 130px;">
                        <option value="Makanan & Minuman">Makanan</option>
                        <option value="Transportasi">Transportasi</option>
                        <option value="Belanja & Logistik">Belanja</option>
                        <option value="Tagihan & Utilitas">Tagihan</option>
                        <option value="Hiburan & Hobi">Hiburan</option>
                        <option value="Kesehatan">Kesehatan</option>
                        <option value="Investasi & Tabungan">Investasi</option>
                        <option value="Lainnya">Lainnya</option>
                    </select>
                    <button type="submit" class="btn btn-primary">
                        <i data-lucide="plus" style="width: 13px; height: 13px;"></i>
                        <span>Simpan</span>
                    </button>
                </form>
                <div id="quickAmountPreview" class="amount-live-preview"></div>
            </div>

            <!-- Recent Compact List -->
            <div class="glass-panel" style="padding: 1rem 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                    <span style="font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.04em;">Transaksi Terkini</span>
                    <span style="font-size: 0.72rem; color: var(--text-muted);">${recentExpenses.length} catatan terakhir</span>
                </div>

                ${recentExpenses.length === 0 ? `
                    <div style="text-align: center; padding: 1.5rem 1rem; color: var(--text-muted); font-size: 0.8125rem;">
                        Belum ada catatan transaksi.
                    </div>
                ` : `
                    <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                        ${recentExpenses.map(exp => {
                            const isIncome = exp.type === "income";
                            const iconName = isIncome ? "arrow-down-left" : "tag";
                            const iconBg = isIncome ? "rgba(16, 185, 129, 0.08)" : "rgba(59, 130, 246, 0.08)";
                            const iconColor = isIncome ? "#34d399" : "#60a5fa";
                            const amountText = (isIncome ? "+ " : "- ") + formatCurrency(exp.amount);
                            const amountColor = isIncome ? "#34d399" : "#f8f9fa";

                            return `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.55rem 0.85rem; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--border-card); transition: var(--transition-smooth);" onmouseover="this.style.borderColor='var(--border-card-hover)'" onmouseout="this.style.borderColor='var(--border-card)'">
                                <div style="display: flex; align-items: center; gap: 0.65rem; overflow: hidden;">
                                    <div style="width: 28px; height: 28px; border-radius: var(--radius-sm); background: ${iconBg}; color: ${iconColor}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                        <i data-lucide="${iconName}" style="width: 13px; height: 13px;"></i>
                                    </div>
                                    <div style="overflow: hidden;">
                                        <div style="font-size: 0.8125rem; font-weight: 500; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${exp.description}</div>
                                        <div style="font-size: 0.72rem; color: var(--text-muted);">${exp.category} &bull; ${new Date(exp.expenseDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</div>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.65rem; flex-shrink: 0;">
                                    <div style="font-size: 0.875rem; font-weight: 600; color: ${amountColor};">${amountText}</div>
                                    <button class="btn btn-ghost btn-simple-del" data-id="${exp.id}" style="padding: 0.2rem 0.4rem; color: var(--text-muted);" title="Hapus">
                                        <i data-lucide="x" style="width: 13px; height: 13px;"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                        }).join("")}
                    </div>
                `}
            </div>
        </div>
    `;

    // Bind Quick Add
    const quickAmount = document.getElementById("quickAmount");
    const quickPreview = document.getElementById("quickAmountPreview");
    quickAmount?.addEventListener("input", () => {
        const val = parseFloat(quickAmount.value);
        if (!isNaN(val) && val > 0 && quickPreview) {
            quickPreview.textContent = formatCurrency(val);
            quickPreview.classList.add("active");
        } else if (quickPreview) {
            quickPreview.textContent = "";
            quickPreview.classList.remove("active");
        }
    });

    document.getElementById("simpleQuickAddForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const type = document.getElementById("quickType").value;
        const amt = document.getElementById("quickAmount").value;
        const desc = document.getElementById("quickDesc").value;
        const cat = document.getElementById("quickCategory").value;
        if (!amt || !desc) return;

        addExpense({
            type,
            amount: amt,
            description: desc,
            category: cat,
            expenseDate: new Date().toISOString().split("T")[0]
        });
        document.getElementById("quickAmount").value = "";
        document.getElementById("quickDesc").value = "";
        if (quickPreview) {
            quickPreview.textContent = "";
            quickPreview.classList.remove("active");
        }
    });

    // Bind Deletes
    containerEl.querySelectorAll(".btn-simple-del").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            const deleted = deleteExpense(id);
            if (deleted) {
                toast.showDeleteToast(deleted);
            }
        });
    });

    if (window.lucide) window.lucide.createIcons();
}
