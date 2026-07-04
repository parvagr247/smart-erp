import React from 'react';
import SupplierSelector from './SupplierSelector';
import WarehouseSelector from './WarehouseSelector';
import './styles/PurchaseFormHeaderFields.css';

export default function PurchaseFormHeaderFields({ form, disabled }) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-5 text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SupplierSelector value={form.supplier ? form.supplier.id : ''} onChange={form.setSupplier} disabled={disabled} />
        <WarehouseSelector value={form.warehouseId} onChange={form.setWarehouseId} disabled={disabled} />
        <div>
          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Purchase Date *</label>
          <input type="date" value={form.purchaseDate} onChange={(e) => form.setPurchaseDate(e.target.value)} disabled={disabled} className="w-full px-3 py-2 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Due Date</label>
          <input type="date" value={form.dueDate} onChange={(e) => form.setDueDate(e.target.value)} disabled={disabled} className="w-full px-3 py-2 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Payment Terms</label>
          <input type="text" placeholder="e.g. Net 30, COD" value={form.paymentTerms} onChange={(e) => form.setPaymentTerms(e.target.value)} disabled={disabled} className="w-full px-3 py-2 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none" />
        </div>
        <div className="flex items-center pt-6">
          <label className="flex items-center cursor-pointer text-sm text-[var(--text-primary)]">
            <input type="checkbox" checked={form.isTaxInclusive} onChange={(e) => form.setIsTaxInclusive(e.target.checked)} disabled={disabled} className="mr-2 h-4 w-4 accent-[var(--color-primary)] rounded border-[var(--border-color)]" />
            Tax Inclusive Pricing
          </label>
        </div>
      </div>
    </div>
  );
}
