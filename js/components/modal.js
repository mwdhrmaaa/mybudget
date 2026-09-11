class ModalManager {
    constructor() {
        this.overlay = document.getElementById("globalModal");
        this.titleEl = document.getElementById("modalTitle");
        this.bodyEl = document.getElementById("modalBody");
        this.closeBtn = document.getElementById("modalCloseBtn");

        if (this.closeBtn) {
            this.closeBtn.addEventListener("click", () => this.close());
        }
        if (this.overlay) {
            this.overlay.addEventListener("click", (e) => {
                if (e.target === this.overlay) this.close();
            });
        }
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.isOpen()) this.close();
        });
    }

    open(title, contentHtml) {
        if (!this.overlay) return;
        this.titleEl.textContent = title;
        this.bodyEl.innerHTML = contentHtml;
        this.overlay.classList.add("active");
        if (window.lucide) window.lucide.createIcons();
    }

    close() {
        if (!this.overlay) return;
        this.overlay.classList.remove("active");
        this.bodyEl.innerHTML = "";
    }

    isOpen() {
        return this.overlay && this.overlay.classList.contains("active");
    }
}

export const modal = new ModalManager();
