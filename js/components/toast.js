import { restoreExpense } from "../domain/expense.js";

/**
 * Floating Undo Toast Manager
 * Displays a non-intrusive floating notification when an expense record is deleted.
 * Provides a 5-second window with an Undo button to restore the deleted record.
 */
class ToastManager {
    constructor() {
        this.container = null;
        this.card = null;
        this.timeoutId = null;
        this.currentExpense = null;
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

        // Clear any active dismiss timer
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        this.currentExpense = expense;

        const formattedAmount = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(expense.amount || 0);

        const desc = expense.description || "Catatan transaksi";

        this.container.innerHTML = `
            <div class="toast-card" id="activeToastCard">
                <div class="toast-body">
                    <span class="toast-badge">Catatan Dihapus</span>
                    <span class="toast-meta" title="${desc}">
                        ${desc} &bull; <span class="toast-amount">${formattedAmount}</span>
                    </span>
                </div>
                <div class="toast-actions">
                    <button type="button" class="btn-toast-undo" id="btnToastUndo" title="Urungkan penghapusan">
                        <i data-lucide="rotate-ccw" style="width: 13px; height: 13px;"></i>
                        <span>Undo</span>
                    </button>
                    <button type="button" class="btn-toast-close" id="btnToastClose" title="Tutup">
                        <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                    </button>
                </div>
                <div class="toast-progress-bar" style="animation-duration: ${duration}ms;"></div>
            </div>
        `;

        this.card = document.getElementById("activeToastCard");

        // Trigger reflow for CSS animation
        requestAnimationFrame(() => {
            if (this.card) this.card.classList.add("show");
        });

        if (window.lucide) window.lucide.createIcons();

        // Bind Undo Action
        const undoBtn = document.getElementById("btnToastUndo");
        if (undoBtn) {
            undoBtn.addEventListener("click", () => {
                if (this.currentExpense) {
                    restoreExpense(this.currentExpense);
                    this.currentExpense = null;
                }
                this.hide();
            });
        }

        // Bind Close Action
        const closeBtn = document.getElementById("btnToastClose");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                this.hide();
            });
        }

        // Set 5-second auto-dismiss
        this.timeoutId = setTimeout(() => {
            this.hide();
        }, duration);
    }

    hide() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        if (this.card) {
            this.card.classList.remove("show");
            setTimeout(() => {
                if (this.card && !this.card.classList.contains("show")) {
                    this.container.innerHTML = "";
                    this.card = null;
                }
            }, 250);
        }
    }
}

export const toast = new ToastManager();
