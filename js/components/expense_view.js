import { formatCurrency } from "./metrics.js";
import { deleteExpense } from "../domain/expense.js";

export function renderExpenseTable(containerEl, expenses, onEdit) {
    if (!containerEl) return;

    if (expenses.length === 0) {
        containerEl.innerHTML = `
            <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
                <i data-lucide="inbox" style="width: 40px; height: 40px; margin-bottom: 0.75rem; opacity: 0.4;"></i>
                <p style="font-size: 0.95rem; font-weight: 500;">Belum ada catatan transaksi yang sesuai dengan kriteria filter.</p>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
    }

    const rows = expenses.map(exp => `
        <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.04); transition: var(--transition-smooth);" onmouseover="this.style.background='rgba(255, 255, 255, 0.02)'" onmouseout="this.style.background='transparent'">
            <td style="padding: 1rem; white-space: nowrap; color: var(--text-secondary);">
                ${new Date(exp.expenseDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
            </td>
            <td style="padding: 1rem; white-space: nowrap;">
                <span class="badge" style="background: rgba(59, 130, 246, 0.1); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.2);">
                    ${exp.category}
                </span>
            </td>
            <td style="padding: 1rem; font-weight: 500; color: var(--text-primary);">
                ${exp.description}
            </td>
            <td style="padding: 1rem; text-align: right; font-weight: 700; color: #ffffff; white-space: nowrap;">
                ${formatCurrency(exp.amount)}
            </td>
            <td style="padding: 1rem; text-align: right; white-space: nowrap;">
                <div style="display: inline-flex; gap: 0.4rem; justify-content: flex-end;">
                    <button class="btn btn-ghost btn-edit-exp" data-id="${exp.id}" style="padding: 0.35rem 0.6rem;" title="Edit Transaksi">
                        <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
                    </button>
                    <button class="btn btn-danger-ghost btn-del-exp" data-id="${exp.id}" style="padding: 0.35rem 0.6rem;" title="Hapus Transaksi">
                        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join("");

    containerEl.innerHTML = `
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
                    ${rows}
                </tbody>
            </table>
        </div>
    `;

    // Event listeners
    containerEl.querySelectorAll(".btn-del-exp").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            if (confirm("Hapus catatan pengeluaran ini secara permanen?")) {
                deleteExpense(id);
            }
        });
    });

    containerEl.querySelectorAll(".btn-edit-exp").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            const target = expenses.find(e => e.id === id);
            if (target && onEdit) onEdit(target);
        });
    });

    if (window.lucide) window.lucide.createIcons();
}
