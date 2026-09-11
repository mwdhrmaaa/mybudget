import { formatCurrency } from "./metrics.js";
import { deleteExpense } from "../domain/expense.js";
import { toast } from "./toast.js";

let sortConfig = { field: "expenseDate", dir: "desc" };

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

    const sortedExpenses = [...expenses].sort((a, b) => {
        let valA = a[sortConfig.field];
        let valB = b[sortConfig.field];
        if (sortConfig.field === "amount") {
            valA = Number(valA) || 0;
            valB = Number(valB) || 0;
        } else if (typeof valA === "string") {
            valA = valA.toLowerCase();
            valB = (valB || "").toLowerCase();
        }
        if (valA < valB) return sortConfig.dir === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.dir === "asc" ? 1 : -1;
        return 0;
    });

    const renderSortIcon = (field) => {
        if (sortConfig.field !== field) return "";
        return sortConfig.dir === "asc"
            ? `<i data-lucide="chevron-up" class="sort-icon"></i>`
            : `<i data-lucide="chevron-down" class="sort-icon"></i>`;
    };

    const rows = sortedExpenses.map(exp => {
        const isIncome = exp.type === "income";
        const amountDisplay = (isIncome ? "+ " : "- ") + formatCurrency(exp.amount);
        const amountColor = isIncome ? "#34d399" : "#f4f4f6";
        const badgeStyle = isIncome
            ? "background: rgba(16, 185, 129, 0.12); color: #34d399; border: 1.5px solid rgba(16, 185, 129, 0.35); border-radius: 9999px;"
            : "background: rgba(59, 130, 246, 0.1); color: #60a5fa; border: 1.5px solid rgba(59, 130, 246, 0.35); border-radius: 9999px;";

        return `
        <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.04); transition: var(--transition-smooth);" onmouseover="this.style.background='rgba(255, 255, 255, 0.02)'" onmouseout="this.style.background='transparent'">
            <td style="padding: 1rem; white-space: nowrap; color: var(--text-secondary);">
                ${new Date(exp.expenseDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
            </td>
            <td style="padding: 1rem; white-space: nowrap;">
                <span class="badge" style="${badgeStyle}">
                    <i data-lucide="${isIncome ? 'arrow-down-left' : 'tag'}" style="width: 12px; height: 12px;"></i>
                    ${exp.category}
                </span>
            </td>
            <td style="padding: 1rem; font-weight: 500; color: var(--text-primary);">
                ${exp.description}
            </td>
            <td style="padding: 1rem; text-align: right; font-weight: 700; color: ${amountColor}; white-space: nowrap;">
                ${amountDisplay}
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
    `;
    }).join("");

    containerEl.innerHTML = `
        <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
                <thead>
                    <tr style="border-bottom: 1px solid var(--border-subtle); color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
                        <th class="sortable-th" data-sort="expenseDate" style="padding: 0.75rem 1rem;">Tanggal ${renderSortIcon("expenseDate")}</th>
                        <th class="sortable-th" data-sort="category" style="padding: 0.75rem 1rem;">Kategori ${renderSortIcon("category")}</th>
                        <th class="sortable-th" data-sort="description" style="padding: 0.75rem 1rem;">Keterangan ${renderSortIcon("description")}</th>
                        <th class="sortable-th" data-sort="amount" style="padding: 0.75rem 1rem; text-align: right;">Nominal ${renderSortIcon("amount")}</th>
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
    containerEl.querySelectorAll(".sortable-th").forEach(th => {
        th.addEventListener("click", () => {
            const field = th.getAttribute("data-sort");
            if (sortConfig.field === field) {
                sortConfig.dir = sortConfig.dir === "asc" ? "desc" : "asc";
            } else {
                sortConfig.field = field;
                sortConfig.dir = field === "amount" ? "desc" : "asc";
            }
            renderExpenseTable(containerEl, expenses, onEdit);
        });
    });

    containerEl.querySelectorAll(".btn-del-exp").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            const deleted = deleteExpense(id);
            if (deleted) {
                toast.showDeleteToast(deleted);
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
