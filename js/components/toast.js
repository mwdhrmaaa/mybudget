import { restoreExpense } from "../domain/expense.js";
import { restoreBudget } from "../domain/budget.js";

/**
 * Floating Undo Toast Manager with Multi-Item Stacking
 * Supports multiple rapid deletions by stacking independent notifications.
 * Each toast provides its own 5-second countdown and Undo trigger.
 */
class ToastManager {
    constructor() {
        this.container = null;
        this.activeToasts = new Map();
        this.maxVisible = 5;
    }

    init() {
        if (typeof document === "undefined") return;
        let container = document.getElementById("toastContainer");
        if (!container) {
            container = document.createElement("div");
            container.id = "toastContainer";
            container.className = "toast-container";
            document.body.appendChild(container);
        }
        this.container = container;
    }

    _spawnUndoToast({ badge, desc, amount, onUndo, duration = 5000 }) {
        if (typeof document === "undefined") return;
        this.init();

        if (this.activeToasts.size >= this.maxVisible) {
            const oldestId = this.activeToasts.keys().next().value;
            this.dismissToast(oldestId);
        }

        const toastId = "toast-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7);

        const formattedAmount = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(amount || 0);

        const card = document.createElement("div");
        card.className = "toast-card";
        card.id = toastId;
        card.innerHTML = `
            <div class="toast-body">
                <span class="toast-badge">${badge}</span>
                <span class="toast-meta" title="${desc}">
                    ${desc} &bull; <span class="toast-amount">${formattedAmount}</span>
                </span>
            </div>
            <div class="toast-actions">
                <button type="button" class="btn-toast-undo" title="Urungkan penghapusan">
                    <i data-lucide="rotate-ccw" style="width: 13px; height: 13px;"></i>
                    <span>Undo</span>
                </button>
                <button type="button" class="btn-toast-close" title="Tutup">
                    <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                </button>
            </div>
            <div class="toast-progress-bar" style="animation-duration: ${duration}ms;"></div>
        `;

        this.container.appendChild(card);

        const undoBtn = card.querySelector(".btn-toast-undo");
        if (undoBtn) {
            undoBtn.addEventListener("click", () => {
                if (onUndo) onUndo();
                this.dismissToast(toastId);
            });
        }

        const closeBtn = card.querySelector(".btn-toast-close");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                this.dismissToast(toastId);
            });
        }

        const timeoutId = setTimeout(() => {
            this.dismissToast(toastId);
        }, duration);

        this.activeToasts.set(toastId, { card, timeoutId });

        requestAnimationFrame(() => {
            card.classList.add("show");
        });

        if (window.lucide) window.lucide.createIcons();
    }

    showDeleteToast(expense, duration = 5000) {
        if (!expense) return;
        this._spawnUndoToast({
            badge: "Catatan Dihapus",
            desc: expense.description || "Catatan transaksi",
            amount: expense.amount || 0,
            onUndo: () => restoreExpense(expense),
            duration
        });
    }

    showBudgetDeleteToast(budget, duration = 5000) {
        if (!budget) return;
        this._spawnUndoToast({
            badge: "Anggaran Dihapus",
            desc: budget.description || `Anggaran ${budget.period}`,
            amount: budget.amount || 0,
            onUndo: () => restoreBudget(budget),
            duration
        });
    }

    dismissToast(toastId) {
        const entry = this.activeToasts.get(toastId);
        if (!entry) return;

        if (entry.timeoutId) {
            clearTimeout(entry.timeoutId);
        }

        entry.card.classList.remove("show");
        entry.card.classList.add("dismissing");

        setTimeout(() => {
            entry.card.remove();
            this.activeToasts.delete(toastId);
        }, 250);
    }
}

export const toast = new ToastManager();
