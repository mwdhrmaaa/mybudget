/**
 * CSV Exporter Module for MyBudget Transactions
 * Generates RFC 4180 compliant CSV representations for personal finance telemetry.
 */

export function generateTransactionsCSV(expenses = []) {
    const headers = ["ID", "Tanggal", "Tipe", "Kategori", "Keterangan", "Nominal (IDR)"];
    
    const rows = expenses.map(item => {
        const id = `"${String(item.id || '').replace(/"/g, '""')}"`;
        const date = `"${String(item.expenseDate || '').replace(/"/g, '""')}"`;
        const type = `"${item.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}"`;
        const category = `"${String(item.category || '').replace(/"/g, '""')}"`;
        const desc = `"${String(item.description || '').replace(/"/g, '""')}"`;
        const amount = Math.round(Number(item.amount) || 0);

        return [id, date, type, category, desc, amount].join(",");
    });

    return [headers.join(","), ...rows].join("\r\n");
}

export function downloadTransactionsCSV(expenses = [], filename) {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const csvContent = "\uFEFF" + generateTransactionsCSV(expenses); // UTF-8 BOM for Excel compatibility
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const defaultFilename = `mybudget_transaksi_${new Date().toISOString().split("T")[0]}.csv`;
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || defaultFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
