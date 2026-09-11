import { modal } from "./modal.js";

/**
 * Expense and Income Transaction Modal Form Renderer
 */
export function openExpenseModal(existingExpense = null, { categories = [], onSubmit } = {}) {
    const isEdit = !!existingExpense;
    const defaultDate = isEdit ? existingExpense.expenseDate : new Date().toISOString().split("T")[0];
    const defaultType = isEdit ? (existingExpense.type || "expense") : "expense";

    const categoryOptions = categories.map(cat => 
        `<option value="${cat}" ${isEdit && existingExpense.category === cat ? 'selected' : ''}>${cat}</option>`
    ).join("");

    const formHtml = `
        <form id="expenseForm" style="display:flex; flex-direction:column; gap:1.25rem;">
            <div class="form-group">
                <label class="form-label">Tipe Transaksi</label>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
                    <label style="display:flex; align-items:center; justify-content:center; gap:0.5rem; padding:0.6rem 1rem; background:var(--bg-surface-elevated); border:1.5px solid var(--border-card); border-radius:var(--radius-md); cursor:pointer; font-weight:600; font-size:0.875rem;">
                        <input type="radio" name="formExpType" value="expense" ${defaultType === 'expense' ? 'checked' : ''} style="accent-color:var(--status-danger);">
                        <span style="color:#f87171;">Pengeluaran</span>
                    </label>
                    <label style="display:flex; align-items:center; justify-content:center; gap:0.5rem; padding:0.6rem 1rem; background:var(--bg-surface-elevated); border:1.5px solid var(--border-card); border-radius:var(--radius-md); cursor:pointer; font-weight:600; font-size:0.875rem;">
                        <input type="radio" name="formExpType" value="income" ${defaultType === 'income' ? 'checked' : ''} style="accent-color:var(--status-safe);">
                        <span style="color:#34d399;">Pemasukan</span>
                    </label>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label" id="amountFieldLabel">Nominal (Rp)</label>
                <input type="number" step="0.01" id="formExpAmount" class="form-input" value="${isEdit ? existingExpense.amount : ''}" placeholder="0" required autofocus>
            </div>
            <div class="form-group">
                <label class="form-label">Kategori</label>
                <select id="formExpCategory" class="form-select" required>
                    <option value="">Pilih Kategori...</option>
                    ${categoryOptions}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Keterangan</label>
                <input type="text" id="formExpDesc" class="form-input" value="${isEdit ? existingExpense.description : ''}" placeholder="Contoh: Gaji Bulanan / Belanja Supermarket" required>
            </div>
            <div class="form-group">
                <label class="form-label">Tanggal Transaksi</label>
                <input type="date" id="formExpDate" class="form-input" value="${defaultDate}" required>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:0.75rem;">
                <button type="button" class="btn btn-ghost" id="cancelModalBtn">Batal</button>
                <button type="submit" class="btn btn-primary">${isEdit ? 'Simpan Perubahan' : 'Catat Transaksi'}</button>
            </div>
        </form>
    `;

    modal.open(isEdit ? "Ubah Catatan Transaksi" : "Catat Transaksi Baru", formHtml);

    document.getElementById("cancelModalBtn")?.addEventListener("click", () => modal.close());
    
    document.getElementById("expenseForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const selectedTypeEl = document.querySelector('input[name="formExpType"]:checked');
        const payload = {
            type: selectedTypeEl ? selectedTypeEl.value : "expense",
            amount: document.getElementById("formExpAmount").value,
            category: document.getElementById("formExpCategory").value,
            description: document.getElementById("formExpDesc").value,
            expenseDate: document.getElementById("formExpDate").value
        };

        if (onSubmit) onSubmit(payload, isEdit, existingExpense);
        modal.close();
    });
}
