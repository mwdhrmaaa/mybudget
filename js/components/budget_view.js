import { formatCurrency } from "./metrics.js";
import { deleteBudget } from "../domain/budget.js";
import { toast } from "./toast.js";

export function renderBudgetCards(containerEl, enrichedBudgets, onEdit) {
    if (!containerEl) return;

    if (enrichedBudgets.length === 0) {
        containerEl.innerHTML = `
            <div class="glass-panel" style="text-align: center; padding: 3rem 1.5rem; color: var(--text-muted); grid-column: 1 / -1;">
                <i data-lucide="pie-chart" style="width: 44px; height: 44px; margin-bottom: 0.75rem; opacity: 0.35;"></i>
                <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.35rem;">Belum Ada Rencana Anggaran</h3>
                <p style="font-size: 0.85rem;">Buat target batas pagu pengeluaran untuk menjaga stabilitas finansial.</p>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
    }

    containerEl.innerHTML = enrichedBudgets.map(budget => {
        let badgeHtml = `<span class="badge badge-safe"><i data-lucide="check" style="width: 12px; height: 12px;"></i> Aman (${budget.percentUsed}%)</span>`;
        let barColor = "var(--status-safe)";

        if (budget.healthStatus === "danger") {
            badgeHtml = `<span class="badge badge-danger"><i data-lucide="alert-circle" style="width: 12px; height: 12px;"></i> Over Budget</span>`;
            barColor = "var(--status-danger)";
        } else if (budget.healthStatus === "warning") {
            badgeHtml = `<span class="badge badge-warning"><i data-lucide="alert-triangle" style="width: 12px; height: 12px;"></i> Waspada (${budget.percentUsed}%)</span>`;
            barColor = "var(--status-warning)";
        }

        return `
            <div class="glass-panel" style="padding: 1.15rem; display: flex; flex-direction: column; justify-content: space-between; gap: 1rem;">
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                        <div>
                            <span class="badge" style="background: rgba(59, 130, 246, 0.08); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.2); text-transform: uppercase; margin-bottom: 0.35rem;">
                                ${budget.period}
                            </span>
                            <h3 style="font-size: 1rem; font-weight: 600; color: var(--text-primary);">
                                ${budget.description || "Anggaran " + budget.period}
                            </h3>
                        </div>
                        ${badgeHtml}
                    </div>

                    <div style="margin: 0.85rem 0 0.5rem;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 0.35rem; color: var(--text-secondary);">
                            <span>Terpakai: <strong>${formatCurrency(budget.usage)}</strong></span>
                            <span>Pagu: <strong>${formatCurrency(budget.amount)}</strong></span>
                        </div>
                        <div style="width: 100%; height: 5px; background: rgba(255, 255, 255, 0.06); border-radius: 9999px; overflow: hidden;">
                            <div style="height: 100%; width: ${Math.min(100, budget.percentUsed)}%; background: ${barColor}; border-radius: 9999px; transition: width 0.4s ease;"></div>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--border-card); font-size: 0.8125rem; margin-top: 0.75rem;">
                        <span style="color: var(--text-secondary);">Sisa Kuota:</span>
                        <span style="font-weight: 600; color: ${budget.remainingBalance < 0 ? '#f87171' : '#34d399'};">
                            ${formatCurrency(budget.remainingBalance)}
                        </span>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 0.75rem; font-size: 0.75rem; color: var(--text-muted);">
                    <div>
                        Mulai: ${new Date(budget.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                    <div style="display: inline-flex; gap: 0.25rem;">
                        <button class="btn btn-ghost btn-edit-bud" data-id="${budget.id}" style="padding: 0.25rem 0.45rem;" title="Edit Anggaran">
                            <i data-lucide="edit-3" style="width: 13px; height: 13px;"></i>
                        </button>
                        <button class="btn btn-danger-ghost btn-del-bud" data-id="${budget.id}" style="padding: 0.25rem 0.45rem;" title="Hapus Anggaran">
                            <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    containerEl.querySelectorAll(".btn-del-bud").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            const deleted = deleteBudget(id);
            if (deleted) {
                toast.showBudgetDeleteToast(deleted);
            }
        });
    });

    containerEl.querySelectorAll(".btn-edit-bud").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            const target = enrichedBudgets.find(b => b.id === id);
            if (target && onEdit) onEdit(target);
        });
    });

    if (window.lucide) window.lucide.createIcons();
}
