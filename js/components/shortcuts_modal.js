import { modal } from "./modal.js";

/**
 * Keyboard Shortcuts Cheat Sheet Modal Component
 */
export function openShortcutsModal() {
    const content = `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 0.25rem;">
                Gunakan pintasan keyboard untuk navigasi dan aksi cepat tanpa mouse:
            </p>
            <div style="display: grid; grid-template-columns: 1fr; gap: 0.6rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0.85rem; background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                    <span style="font-size: 0.85rem; color: var(--text-primary);">Catat Transaksi Baru</span>
                    <kbd style="padding: 0.2rem 0.5rem; background: var(--bg-surface); border: 1px solid var(--border-card); border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 700; color: var(--accent-brand);">C / N</kbd>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0.85rem; background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                    <span style="font-size: 0.85rem; color: var(--text-primary);">Fokus Kolom Pencarian</span>
                    <kbd style="padding: 0.2rem 0.5rem; background: var(--bg-surface); border: 1px solid var(--border-card); border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 700; color: var(--accent-brand);">/</kbd>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0.85rem; background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                    <span style="font-size: 0.85rem; color: var(--text-primary);">Ganti Mode Tampilan (Complex / Simple)</span>
                    <kbd style="padding: 0.2rem 0.5rem; background: var(--bg-surface); border: 1px solid var(--border-card); border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 700; color: var(--accent-brand);">S</kbd>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0.85rem; background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                    <span style="font-size: 0.85rem; color: var(--text-primary);">Buka/Tutup Slide bar (Sidebar)</span>
                    <kbd style="padding: 0.2rem 0.5rem; background: var(--bg-surface); border: 1px solid var(--border-card); border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 700; color: var(--accent-brand);">[ / B</kbd>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0.85rem; background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                    <span style="font-size: 0.85rem; color: var(--text-primary);">Buka Panduan Pintasan</span>
                    <kbd style="padding: 0.2rem 0.5rem; background: var(--bg-surface); border: 1px solid var(--border-card); border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 700; color: var(--accent-brand);">?</kbd>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0.85rem; background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                    <span style="font-size: 0.85rem; color: var(--text-primary);">Tutup Modal Aktif</span>
                    <kbd style="padding: 0.2rem 0.5rem; background: var(--bg-surface); border: 1px solid var(--border-card); border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 700; color: var(--accent-brand);">Esc</kbd>
                </div>
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: 0.5rem;">
                <button class="btn btn-ghost" id="closeShortcutModalBtn" style="padding: 0.45rem 1rem;">Tutup</button>
            </div>
        </div>
    `;
    modal.open("Pintasan Keyboard", content);
    document.getElementById("closeShortcutModalBtn")?.addEventListener("click", () => modal.close());
    if (window.lucide) window.lucide.createIcons();
}
