/**
 * Linear-style Keyboard Shortcuts Controller
 * Accelerates personal finance telemetry with ergonomic single-key actions.
 */

export function initKeyboardShortcuts({
    onNewTransaction,
    onToggleMode,
    onFocusSearch,
    onCloseModal,
    onShowHelp,
    onToggleSidebar
} = {}) {
    if (typeof window === "undefined") return;

    window.addEventListener("keydown", (e) => {
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
        const isInput = activeTag === "input" || activeTag === "textarea" || activeTag === "select";

        if (e.key === "Escape") {
            if (onCloseModal) onCloseModal();
            return;
        }

        if (isInput) return;

        const key = e.key.toLowerCase();

        if (key === "c" || key === "n") {
            e.preventDefault();
            if (onNewTransaction) onNewTransaction();
        } else if (key === "/") {
            e.preventDefault();
            if (onFocusSearch) onFocusSearch();
        } else if (key === "s") {
            e.preventDefault();
            if (onToggleMode) onToggleMode();
        } else if (key === "[" || key === "b") {
            e.preventDefault();
            if (onToggleSidebar) onToggleSidebar();
        } else if (e.key === "?" || (e.shiftKey && e.key === "/")) {
            e.preventDefault();
            if (onShowHelp) onShowHelp();
        }
    });
}
