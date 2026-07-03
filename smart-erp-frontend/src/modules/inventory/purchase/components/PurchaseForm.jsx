import React, { useState, useEffect } from 'react';
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
  const [supplier, setSupplier] = useState(null);
  const [warehouseId, setWarehouseId] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [isTaxInclusive, setIsTaxInclusive] = useState(false);
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState('');
  const [lines, setLines] = useState([
    {
      stockItemId: '',
      stockItemName: '',
      sku: '',
      quantity: 1,
      rate: 0,
      discount: 0,
      taxPercentage: 0,
      taxAmount: 0,
      totalAmount: 0,
      warehouseId: '',
      batchNumber: ''
    }
  ]);

  const [hasChanges, setHasChanges] = useState(false);

  // Initialize values
  useEffect(() => {
    if (initialData) {
      setSupplier(initialData.supplier || { id: initialData.supplierId, name: initialData.supplierName });
      setWarehouseId(initialData.warehouseId || '');
      setPurchaseDate(initialData.purchaseDate || new Date().toISOString().split('T')[0]);
      setDueDate(initialData.dueDate || '');
      setPaymentTerms(initialData.paymentTerms || '');
      setIsTaxInclusive(initialData.isTaxInclusive || false);
      setInvoiceDiscount(initialData.discountAmount || 0);
      setNotes(initialData.notes || '');
      setAttachments(initialData.attachments || '');
      if (initialData.lineItems && initialData.lineItems.length > 0) {
        setLines(initialData.lineItems);
      }
    }
  }, [initialData]);

  // Determine if it's intra-state or inter-state GST split
  const isIntraState = () => {
    if (!supplier) return true;
    const suppState = supplier.state || (supplier.addresses && supplier.addresses.length > 0 ? supplier.addresses[0].state : '') || '';
    const cleanComp = companyState.trim().toLowerCase();
    const cleanSupp = suppState.trim().toLowerCase();
    return cleanComp === '' || cleanSupp === '' || cleanComp === cleanSupp;
  };

  // Auto-save draft functionality (only for new entries)
  useEffect(() => {
    if (initialData || disabled) return;

    const autoSaveTimer = setInterval(() => {
      if (hasChanges) {
        const draft = {
          supplier,
          warehouseId,
          purchaseDate,
          dueDate,
          paymentTerms,
          isTaxInclusive,
          invoiceDiscount,
          notes,
          attachments,
          lines
        };
        localStorage.setItem('smarterp_purchase_draft', JSON.stringify(draft));
        console.log('Purchase draft autosaved.');
      }
    }, 10000); // 10 seconds

    return () => clearInterval(autoSaveTimer);
  }, [supplier, warehouseId, purchaseDate, dueDate, paymentTerms, isTaxInclusive, invoiceDiscount, notes, attachments, lines, hasChanges, initialData, disabled]);

  // Unsaved changes browser prompt
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges && !disabled) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges, disabled]);

  // Keyboard shortcut listener: Alt+S to save/submit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (!disabled) handleSubmit('APPROVED');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [supplier, warehouseId, purchaseDate, dueDate, paymentTerms, isTaxInclusive, invoiceDiscount, notes, attachments, lines, disabled]);

  const restoreDraft = () => {
    const raw = localStorage.getItem('smarterp_purchase_draft');
    if (raw) {
      try {
        const draft = JSON.parse(raw);
        setSupplier(draft.supplier);
        setWarehouseId(draft.warehouseId);
        setPurchaseDate(draft.purchaseDate);
        setDueDate(draft.dueDate);
        setPaymentTerms(draft.paymentTerms);
        setIsTaxInclusive(draft.isTaxInclusive);
        setInvoiceDiscount(draft.invoiceDiscount);
        setNotes(draft.notes);
        setAttachments(draft.attachments);
        setLines(draft.lines);
        setHasChanges(true);
        localStorage.removeItem('smarterp_purchase_draft');
      } catch (err) {
        console.error('Failed to restore draft', err);
      }
    }
  };

  const hasDraftAvailable = !initialData && localStorage.getItem('smarterp_purchase_draft');

  const handleSubmit = (status) => {
    if (!supplier) {
      alert('Please select a supplier.');
      return;
    }
    if (!warehouseId) {
      alert('Please select a warehouse.');
      return;
    }
    const invalidLines = lines.some(l => !l.stockItemId || l.quantity <= 0 || l.rate <= 0);
    if (invalidLines) {
      alert('Please make sure all items are selected and have positive quantities and rates.');
      return;
    }

    setHasChanges(false);
    localStorage.removeItem('smarterp_purchase_draft');

    onSave({
      supplierId: supplier.id,
      warehouseId,
      purchaseDate,
      dueDate: dueDate || null,
      paymentTerms,
      isTaxInclusive,
      invoiceDiscountAmount: parseFloat(invoiceDiscount) || 0,
      notes,
      attachments,
      status,
      lineItems: lines.map(l => ({
        stockItemId: l.stockItemId,
        quantity: parseFloat(l.quantity),
        rate: parseFloat(l.rate),
        discount: parseFloat(l.discount) || 0,
        warehouseId: l.warehouseId || warehouseId,
        batchNumber: l.batchNumber || null
      }))
    });
  };

  return (
    <div className="space-y-6 text-left">
      {hasDraftAvailable && (
        <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 p-4 rounded-lg flex items-center justify-between text-sm text-[var(--text-primary)]">
          <div>
            <span className="font-semibold">Unsaved Draft Found!</span> You have a previously autosaved purchase draft.
          </div>
          <div className="flex gap-2">
            <button
              onClick={restoreDraft}
              className="px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-semibold rounded hover:opacity-90"
            >
              Restore Draft
            </button>
            <button
              onClick={() => localStorage.removeItem('smarterp_purchase_draft')}
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
            value={supplier ? supplier.id : ''}
            onChange={(val) => { setSupplier(val); setHasChanges(true); }}
            disabled={disabled}
          />

          <WarehouseSelector
            value={warehouseId}
            onChange={(val) => { setWarehouseId(val); setHasChanges(true); }}
            disabled={disabled}
          />

          <div className="w-full">
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">
              Purchase Date *
            </label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => { setPurchaseDate(e.target.value); setHasChanges(true); }}
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
              value={dueDate}
              onChange={(e) => { setDueDate(e.target.value); setHasChanges(true); }}
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
              value={paymentTerms}
              onChange={(e) => { setPaymentTerms(e.target.value); setHasChanges(true); }}
              disabled={disabled}
              className="w-full px-3 py-2 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div className="w-full flex items-center pt-6">
            <label className="flex items-center cursor-pointer text-sm text-[var(--text-primary)]">
              <input
                type="checkbox"
                checked={isTaxInclusive}
                onChange={(e) => { setIsTaxInclusive(e.target.checked); setHasChanges(true); }}
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
        items={lines}
        onChange={(val) => { setLines(val); setHasChanges(true); }}
        isIntraState={isIntraState()}
        isTaxInclusive={isTaxInclusive}
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
              value={notes}
              onChange={(e) => { setNotes(e.target.value); setHasChanges(true); }}
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
              value={attachments}
              onChange={(e) => { setAttachments(e.target.value); setHasChanges(true); }}
              disabled={disabled}
              className="w-full px-3 py-2 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none"
            />
          </div>
        </div>

        <PurchaseTotals
          items={lines}
          invoiceDiscount={invoiceDiscount}
          onChangeInvoiceDiscount={(val) => { setInvoiceDiscount(val); setHasChanges(true); }}
          isIntraState={isIntraState()}
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
            onClick={() => handleSubmit('DRAFT')}
            className="px-4 py-2 bg-[var(--bg-card)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-sm font-semibold rounded-md text-[var(--text-primary)] transition-all"
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('APPROVED')}
            className="px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 text-sm font-semibold rounded-md text-white transition-all flex items-center gap-1.5"
          >
            Save & Approve <kbd className="text-[10px] opacity-75 font-normal px-1 py-0.5 bg-black/10 rounded">Alt+S</kbd>
          </button>
        </div>
      )}
    </div>
  );
}
