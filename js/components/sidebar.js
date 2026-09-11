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

    const closeSidebar = () => {
        sidebar?.classList.remove("open");
        backdrop?.classList.remove("active");
    };

    const toggleSidebar = () => {
        if (isMobile()) {
            const isOpen = sidebar?.classList.toggle("open");
            backdrop?.classList.toggle("active", isOpen);
        } else {
            sidebar?.classList.toggle("collapsed");
        }
    };

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
    const modeTitle = document.getElementById("sidebarModeTitle");
    const modeDesc = document.getElementById("sidebarModeDesc");
    const modeBadge = document.getElementById("sidebarModeBadge");
    const modeIcon = document.getElementById("sidebarModeIcon");

    const isDash = currentTab === "dashboard";
    tabDash?.classList.toggle("active", isDash);
    tabBudgets?.classList.toggle("active", !isDash);

    const isSimple = viewMode === "simple";
    if (modeTitle) modeTitle.textContent = isSimple ? "Simple Mode" : "Complex Mode";
    if (modeDesc) modeDesc.textContent = isSimple ? "Fokus ringkas satu layar" : "Telemetri arus kas & grafik";

    if (modeBadge) {
        modeBadge.textContent = isSimple ? "Simple" : "Complex";
        modeBadge.style.color = isSimple ? "#34d399" : "#60a5fa";
        modeBadge.style.borderColor = isSimple ? "rgba(16, 185, 129, 0.35)" : "rgba(59, 130, 246, 0.35)";
        modeBadge.style.background = isSimple ? "rgba(16, 185, 129, 0.12)" : "rgba(59, 130, 246, 0.12)";
    }

    if (modeIcon) {
        modeIcon.setAttribute("data-lucide", isSimple ? "maximize-2" : "minimize-2");
    }

    if (window.lucide) window.lucide.createIcons();
}
