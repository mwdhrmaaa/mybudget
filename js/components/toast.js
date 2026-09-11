import { restoreExpense } from "../domain/expense.js";

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

    showDeleteToast(expense, duration = 5000) {
        if (typeof document === "undefined" || !expense) return;
        this.init();

        // If stack exceeds maximum visible, smoothly dismiss the oldest
        if (this.activeToasts.size >= this.maxVisible) {
            const oldestId = this.activeToasts.keys().next().value;
            this.dismissToast(oldestId);
        }

        const toastId = "toast-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7);

        const formattedAmount = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(expense.amount || 0);

        const desc = expense.description || "Catatan transaksi";

        const card = document.createElement("div");
        card.className = "toast-card";
        card.id = toastId;
        card.innerHTML = `
            <div class="toast-body">
                <span class="toast-badge">Catatan Dihapus</span>
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

        // Bind Undo Action
        const undoBtn = card.querySelector(".btn-toast-undo");
        if (undoBtn) {
            undoBtn.addEventListener("click", () => {
                restoreExpense(expense);
                this.dismissToast(toastId);
            });
        }

        // Bind Close Action
        const closeBtn = card.querySelector(".btn-toast-close");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                this.dismissToast(toastId);
            });
        }

        // Set 5-second auto-dismiss for this specific toast
        const timeoutId = setTimeout(() => {
            this.dismissToast(toastId);
        }, duration);

        this.activeToasts.set(toastId, { card, timeoutId, expense });

        // Trigger entrance animation
        requestAnimationFrame(() => {
            card.classList.add("show");
        });

        if (window.lucide) window.lucide.createIcons();
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
