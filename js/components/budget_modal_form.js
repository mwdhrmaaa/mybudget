import { modal } from "./modal.js";

/**
 * Budget Envelope Modal Form Renderer
 */
export function openBudgetModal(existingBudget = null, { onSubmit } = {}) {
    const isEdit = !!existingBudget;
    const defaultDate = isEdit ? existingBudget.startDate : new Date().toISOString().split("T")[0];

    const formHtml = `
        <form id="budgetForm" style="display:flex; flex-direction:column; gap:1.25rem;">
            <div class="form-group">
                <label class="form-label">Nominal Pagu Anggaran (Rp)</label>
                <input type="number" step="0.01" id="formBudAmount" class="form-input" value="${isEdit ? existingBudget.amount : ''}" placeholder="0" required autofocus>
            </div>
            <div class="form-group">
                <label class="form-label">Periode Anggaran</label>
                <select id="formBudPeriod" class="form-select" required>
                    <option value="daily" ${isEdit && existingBudget.period === 'daily' ? 'selected' : ''}>Harian (Daily)</option>
                    <option value="weekly" ${isEdit && existingBudget.period === 'weekly' ? 'selected' : ''}>Mingguan (Weekly)</option>
                    <option value="monthly" ${!isEdit || existingBudget.period === 'monthly' ? 'selected' : ''}>Bulanan (Monthly)</option>
                    <option value="yearly" ${isEdit && existingBudget.period === 'yearly' ? 'selected' : ''}>Tahunan (Yearly)</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Tanggal Mulai</label>
                <input type="date" id="formBudStartDate" class="form-input" value="${defaultDate}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Keterangan / Label Pagu (Opsional)</label>
                <input type="text" id="formBudDesc" class="form-input" value="${isEdit ? existingBudget.description : ''}" placeholder="Contoh: Belanja Operasional">
            </div>
            <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:0.75rem;">
                <button type="button" class="btn btn-ghost" id="cancelModalBtn">Batal</button>
                <button type="submit" class="btn btn-primary">${isEdit ? 'Simpan Anggaran' : 'Buat Anggaran'}</button>
            </div>
        </form>
    `;

    modal.open(isEdit ? "Ubah Target Anggaran" : "Buat Target Anggaran", formHtml);

    document.getElementById("cancelModalBtn")?.addEventListener("click", () => modal.close());

    document.getElementById("budgetForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const payload = {
            amount: document.getElementById("formBudAmount").value,
            period: document.getElementById("formBudPeriod").value,
            startDate: document.getElementById("formBudStartDate").value,
            description: document.getElementById("formBudDesc").value
        };

        if (onSubmit) onSubmit(payload, isEdit, existingBudget);
        modal.close();
    });
}
