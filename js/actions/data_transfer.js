import { store } from "../store/storage.js";
import { downloadTransactionsCSV } from "../domain/csv_export.js";

/**
 * Data Transfer Action Orchestrator
 * Manages JSON export/import and CSV spreadsheet downloads.
 */
export function setupDataTransfer({
    getFilteredExpenses,
    onRestoreSuccess,
    onRestoreError
} = {}) {
    if (typeof document === "undefined") return;

    // JSON Export
    const exportDataBtn = document.getElementById("exportDataBtn");
    exportDataBtn?.addEventListener("click", () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(store.exportData());
        const a = document.createElement("a");
        a.href = dataStr;
        a.download = `mybudget_backup_${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    });

    // JSON Restore
    const importDataBtn = document.getElementById("importDataBtn");
    const importFileInput = document.getElementById("importFileInput");

    importDataBtn?.addEventListener("click", () => {
        importFileInput?.click();
    });

    importFileInput?.addEventListener("change", (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result;
            const res = store.importData(content);
            if (res.success) {
                if (onRestoreSuccess) onRestoreSuccess(res);
            } else {
                if (onRestoreError) onRestoreError(res.error);
            }
            importFileInput.value = "";
        };
        reader.readAsText(file);
    });

    // CSV Export
    const exportCsvBtn = document.getElementById("exportCsvBtn");
    exportCsvBtn?.addEventListener("click", () => {
        const records = getFilteredExpenses ? getFilteredExpenses() : store.getExpenses();
        downloadTransactionsCSV(records);
    });
}
