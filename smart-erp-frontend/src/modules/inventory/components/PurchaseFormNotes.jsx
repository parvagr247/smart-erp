import React from 'react';
import './styles/PurchaseFormNotes.css';

export default function PurchaseFormNotes({ form, disabled }) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-5 space-y-4 text-left">
      <div>
        <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Notes / Terms</label>
        <textarea rows="3" placeholder="Add terms, remarks or instructions..." value={form.notes} onChange={(e) => form.setNotes(e.target.value)} disabled={disabled} className="w-full px-3 py-2 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Attachments (URLs)</label>
        <input type="text" placeholder="Comma-separated attachment paths..." value={form.attachments} onChange={(e) => form.setAttachments(e.target.value)} disabled={disabled} className="w-full px-3 py-2 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none" />
      </div>
    </div>
  );
}
