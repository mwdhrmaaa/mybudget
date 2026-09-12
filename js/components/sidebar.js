/**
 * Left Slide Bar / Sidebar Component
 * Manages drawer sliding, tab switching, and view mode toggling.
 */

export function initSidebar({ onTabChange, onModeToggle, onAddExpense, onShowHelp } = {}) {
    const sidebar = document.getElementById("appSidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    const toggleBtn = document.getElementById("sidebarToggleBtn");
    const closeBtn = document.getElementById("sidebarCloseBtn");
    const tabDash = document.getElementById("sidebarTabDashboardBtn");
    const tabBudgets = document.getElementById("sidebarTabBudgetsBtn");
    const modeBtn = document.getElementById("sidebarModeToggleBtn");
    const addExpBtn = document.getElementById("sidebarAddExpenseBtn");
    const shortcutsBtn = document.getElementById("sidebarShortcutsBtn");

    const isMobile = () => window.innerWidth <= 860;
    const headerBrand = document.getElementById("headerBrandLogo");

    const updateBrandVisibility = () => {
        const isMob = isMobile();
        const isHidden = isMob
            ? !!sidebar?.classList.contains("open")
            : !sidebar?.classList.contains("collapsed");

        if (headerBrand) {
            if (headerBrand.style.display) headerBrand.style.display = "";
            headerBrand.classList.toggle("hidden-brand", isHidden);
        }
        if (toggleBtn) {
            if (toggleBtn.style.display) toggleBtn.style.display = "";
            toggleBtn.classList.toggle("hidden-toggle", isHidden);
        }
    };

    const closeSidebar = () => {
        if (isMobile()) {
            sidebar?.classList.remove("open");
            backdrop?.classList.remove("active");
        } else {
            sidebar?.classList.add("collapsed");
        }
        updateBrandVisibility();
    };

    const toggleSidebar = () => {
        if (isMobile()) {
            const isOpen = sidebar?.classList.toggle("open");
            backdrop?.classList.toggle("active", isOpen);
        } else {
            sidebar?.classList.toggle("collapsed");
        }
        updateBrandVisibility();
    };

    updateBrandVisibility();
    window.addEventListener("resize", updateBrandVisibility);

    toggleBtn?.addEventListener("click", toggleSidebar);
    closeBtn?.addEventListener("click", closeSidebar);
    backdrop?.addEventListener("click", closeSidebar);

    tabDash?.addEventListener("click", () => {
        if (onTabChange) onTabChange("dashboard");
        if (isMobile()) closeSidebar();
    });

    tabBudgets?.addEventListener("click", () => {
        if (onTabChange) onTabChange("budgets");
        if (isMobile()) closeSidebar();
    });

    modeBtn?.addEventListener("click", () => {
        if (onModeToggle) onModeToggle();
    });

    addExpBtn?.addEventListener("click", () => {
        if (onAddExpense) onAddExpense();
        if (isMobile()) closeSidebar();
    });

    shortcutsBtn?.addEventListener("click", () => {
        if (onShowHelp) onShowHelp();
        if (isMobile()) closeSidebar();
    });
}

export function updateSidebarState({ currentTab = "dashboard", viewMode = "complex" } = {}) {
    const tabDash = document.getElementById("sidebarTabDashboardBtn");
    const tabBudgets = document.getElementById("sidebarTabBudgetsBtn");
    const modeBtn = document.getElementById("sidebarModeToggleBtn");
    const modeLabel = document.getElementById("sidebarModeLabel");
    const modeIcon = document.getElementById("sidebarModeIcon");

    const isDash = currentTab === "dashboard";
    tabDash?.classList.toggle("active", isDash);
    tabBudgets?.classList.toggle("active", !isDash);

    const isSimple = viewMode === "simple";
    if (modeLabel) modeLabel.textContent = isSimple ? "Simple" : "Complex";
    modeBtn?.classList.toggle("simple", isSimple);

    if (modeIcon) {
        modeIcon.setAttribute("data-lucide", isSimple ? "maximize-2" : "minimize-2");
    }

    if (window.lucide) window.lucide.createIcons();
}
