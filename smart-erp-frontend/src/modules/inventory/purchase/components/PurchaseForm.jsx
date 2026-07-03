import React from 'react';
import usePurchaseForm from '../hooks/usePurchaseForm';
import SupplierSelector from './SupplierSelector';
import WarehouseSelector from './WarehouseSelector';
import PurchaseItemTable from './PurchaseItemTable';
import PurchaseTotals from './PurchaseTotals';

export default function PurchaseForm({
  initialData,
  onSave,
  onCancel,
  companyState = '',
  disabled
}) {
  const form = usePurchaseForm({ initialData, onSave, companyState, disabled });

  return (
    <div className="space-y-6 text-left">
      {form.hasDraftAvailable && (
        <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 p-4 rounded-lg flex items-center justify-between text-sm text-[var(--text-primary)]">
          <div>
            <span className="font-semibold">Unsaved Draft Found!</span> You have a previously autosaved purchase draft.
          </div>
          <div className="flex gap-2">
            <button
              onClick={form.restoreDraft}
              className="px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-semibold rounded hover:opacity-90"
            >
              Restore Draft
            </button>
            <button
              onClick={form.discardDraft}
              className="px-3 py-1 bg-[var(--bg-body)] border border-[var(--border-color)] text-xs font-semibold rounded text-[var(--text-muted)]"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* Header Fields Section */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <SupplierSelector
            value={form.supplier ? form.supplier.id : ''}
            onChange={form.setSupplier}
            disabled={disabled}
          />

          <WarehouseSelector
            value={form.warehouseId}
            onChange={form.setWarehouseId}
            disabled={disabled}
          />

          <div className="w-full">
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">
              Purchase Date *
            </label>
            <input
              type="date"
              value={form.purchaseDate}
              onChange={(e) => form.setPurchaseDate(e.target.value)}
              disabled={disabled}
              className="w-full px-3 py-2 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div className="w-full">
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => form.setDueDate(e.target.value)}
              disabled={disabled}
              className="w-full px-3 py-2 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div className="w-full">
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">
              Payment Terms
            </label>
            <input
              type="text"
              placeholder="e.g. Net 30, COD"
              value={form.paymentTerms}
              onChange={(e) => form.setPaymentTerms(e.target.value)}
              disabled={disabled}
              className="w-full px-3 py-2 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div className="w-full flex items-center pt-6">
            <label className="flex items-center cursor-pointer text-sm text-[var(--text-primary)]">
              <input
                type="checkbox"
                checked={form.isTaxInclusive}
                onChange={(e) => form.setIsTaxInclusive(e.target.checked)}
                disabled={disabled}
                className="mr-2 h-4 w-4 accent-[var(--color-primary)] rounded border-[var(--border-color)]"
              />
              Tax Inclusive Pricing
            </label>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <PurchaseItemTable
        items={form.lines}
        onChange={form.setLines}
        isIntraState={form.isIntraState}
        isTaxInclusive={form.isTaxInclusive}
        disabled={disabled}
      />

      {/* Totals Section & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">
              Notes / Terms
            </label>
            <textarea
              rows="3"
              placeholder="Add terms, remarks or instructions..."
              value={form.notes}
              onChange={(e) => form.setNotes(e.target.value)}
              disabled={disabled}
              className="w-full px-3 py-2 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">
              Attachments (URLs)
            </label>
            <input
              type="text"
              placeholder="Comma-separated attachment paths..."
              value={form.attachments}
              onChange={(e) => form.setAttachments(e.target.value)}
              disabled={disabled}
              className="w-full px-3 py-2 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none"
            />
          </div>
        </div>

        <PurchaseTotals
          items={form.lines}
          invoiceDiscount={form.invoiceDiscount}
          onChangeInvoiceDiscount={form.setInvoiceDiscount}
          isIntraState={form.isIntraState}
          disabled={disabled}
        />
      </div>

      {/* Action Buttons */}
      {!disabled && (
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-[var(--bg-body)] border border-[var(--border-color)] hover:border-[var(--text-muted)] text-sm font-semibold rounded-md text-[var(--text-primary)] transition-all"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={() => form.submitForm('DRAFT')}
            className="px-4 py-2 bg-[var(--bg-card)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-sm font-semibold rounded-md text-[var(--text-primary)] transition-all"
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={() => form.submitForm('APPROVED')}
            className="px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 text-sm font-semibold rounded-md text-white transition-all flex items-center gap-1.5"
          >
            Save & Approve <kbd className="text-[10px] opacity-75 font-normal px-1 py-0.5 bg-black/10 rounded">Alt+S</kbd>
          </button>
        </div>
      )}
    </div>
  );
}
