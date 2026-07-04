import React from 'react';
import { usePurchaseFormViewData } from './services/PurchaseFormService';
import PurchaseFormDraftNotice from './PurchaseFormDraftNotice';
import PurchaseFormHeaderFields from './PurchaseFormHeaderFields';
import PurchaseItemTable from './PurchaseItemTable';
import PurchaseFormNotes from './PurchaseFormNotes';
import PurchaseTotals from './PurchaseTotals';
import './styles/PurchaseForm.css';

export default function PurchaseForm(props) {
  const { onCancel, disabled, loading = false } = props;
  const form = usePurchaseFormViewData(props);

  const handleCancel = () => {
    if (form.hasChanges) {
      if (!confirm("You have unsaved changes. Are you sure you want to discard them?")) {
        return;
      }
    }
    onCancel();
  };

  return (
    <div className="space-y-6 text-left">
      <PurchaseFormDraftNotice form={form} />
      <PurchaseFormHeaderFields form={form} disabled={disabled || loading} />
      <PurchaseItemTable items={form.lines} onChange={form.setLines} isIntraState={form.isIntraState} isTaxInclusive={form.isTaxInclusive} disabled={disabled || loading} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <PurchaseFormNotes form={form} disabled={disabled || loading} />
        <PurchaseTotals items={form.lines} invoiceDiscount={form.invoiceDiscount} onChangeInvoiceDiscount={form.setInvoiceDiscount} isIntraState={form.isIntraState} disabled={disabled || loading} />
      </div>
      {!disabled && (
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
          <button type="button" onClick={handleCancel} disabled={loading} className="px-4 py-2 bg-[var(--bg-body)] border border-[var(--border-color)] hover:border-[var(--text-muted)] text-sm font-semibold rounded-md text-[var(--text-primary)] transition-all cursor-pointer disabled:opacity-50">Cancel</button>
          <button type="button" onClick={() => form.submitForm('DRAFT')} disabled={loading} className="px-4 py-2 bg-[var(--bg-card)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-sm font-semibold rounded-md text-[var(--text-primary)] transition-all cursor-pointer disabled:opacity-50">{loading ? 'Saving...' : 'Save as Draft'}</button>
          <button type="button" onClick={() => form.submitForm('APPROVED')} disabled={loading} className="px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 text-sm font-semibold rounded-md text-white transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50">{loading ? 'Saving...' : <>Save & Approve <kbd className="text-[10px] opacity-75 font-normal px-1 py-0.5 bg-black/10 rounded">Alt+S</kbd></>}</button>
        </div>
      )}
    </div>
  );
}
