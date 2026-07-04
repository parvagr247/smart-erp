import React from 'react';
import './styles/PurchaseFormDraftNotice.css';

export default function PurchaseFormDraftNotice({ form }) {
  if (!form.hasDraftAvailable) return null;
  return (
    <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 p-4 rounded-lg flex items-center justify-between text-sm text-[var(--text-primary)] text-left">
      <div><span className="font-semibold">Unsaved Draft Found!</span> You have a previously autosaved purchase draft.</div>
      <div className="flex gap-2">
        <button onClick={form.restoreDraft} className="px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-semibold rounded hover:opacity-90 cursor-pointer">Restore Draft</button>
        <button onClick={form.discardDraft} className="px-3 py-1 bg-[var(--bg-body)] border border-[var(--border-color)] text-xs font-semibold rounded text-[var(--text-muted)] cursor-pointer">Discard</button>
      </div>
    </div>
  );
}
