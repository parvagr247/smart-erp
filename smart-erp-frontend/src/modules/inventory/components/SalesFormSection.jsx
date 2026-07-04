import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import StockItemSelector from './StockItemSelector';

export default function SalesFormSection({
  mode,
  customers,
  warehouses,
  items,
  customerId,
  setCustomerId,
  warehouseId,
  setWarehouseId,
  salesDate,
  setSalesDate,
  dueDate,
  setDueDate,
  paymentTerms,
  setPaymentTerms,
  isTaxInclusive,
  setIsTaxInclusive,
  invoiceDiscount,
  setInvoiceDiscount,
  notes,
  setNotes,
  lines,
  updateLine,
  addLine,
  removeLine,
  totals,
  setMode,
  submitForm
}) {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-light)] p-6 rounded-xl space-y-6 text-left">
      <div className="flex justify-between items-center border-b border-[var(--border-light)] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {mode === 'EDIT' ? 'Edit Sales Invoice' : 'New Sales Invoice'}
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">Enter invoicing parameters and line items.</p>
        </div>
        <button onClick={() => setMode('LIST')} className="px-4 py-2 border border-[var(--border-light)] rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-input)]">Back</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">Customer</label>
          <select value={customerId} onChange={e => setCustomerId(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-lg p-2.5 text-sm text-[var(--text-primary)] focus:border-indigo-500 focus:outline-none">
            <option value="">-- Select Customer --</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">Warehouse</label>
          <select value={warehouseId} onChange={e => setWarehouseId(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-lg p-2.5 text-sm text-[var(--text-primary)] focus:border-indigo-500 focus:outline-none">
            <option value="">-- Select Warehouse --</option>
            {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">Invoice Date</label>
          <input type="date" value={salesDate} onChange={e => setSalesDate(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-lg p-2.5 text-sm text-[var(--text-primary)] focus:outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">Due Date</label>
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-lg p-2.5 text-sm text-[var(--text-primary)] focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">Payment Terms</label>
          <input type="text" placeholder="e.g. Net 30, COD" value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-lg p-2.5 text-sm text-[var(--text-primary)] focus:outline-none" />
        </div>
        <div className="flex items-center mt-6">
          <input type="checkbox" id="taxInc" checked={isTaxInclusive} onChange={e => setIsTaxInclusive(e.target.checked)} className="h-4 w-4 text-indigo-600 border-[var(--border-light)] rounded" />
          <label htmlFor="taxInc" className="ml-2 text-sm font-semibold text-[var(--text-primary)]">Prices are Tax Inclusive</label>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 uppercase tracking-wider">Line Items</h3>
        <div className="overflow-x-auto border border-[var(--border-light)] rounded-lg">
          <table className="min-w-full divide-y divide-[var(--border-light)]">
            <thead className="bg-[var(--bg-input)]">
              <tr>
                {['Item', 'Qty', 'Rate', 'Discount', 'Tax %', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {lines.map((line, idx) => (
                <tr key={idx}>
                  <td className="p-2 w-[320px]">
                    <StockItemSelector 
                      value={line.stockItemId} 
                      items={items}
                      onChange={item => {
                        const gstRate = item.taxCategory ? item.taxCategory.gstRate : 0;
                        const sellingPrice = item.priceLists?.find(p => p.priceType === 'RETAIL')?.price 
                          || (item.openingValue && item.openingQuantity ? parseFloat((item.openingValue / item.openingQuantity).toFixed(2)) : 0);
                        updateLine(idx, {
                          stockItemId: item.id,
                          taxPercentage: gstRate,
                          rate: sellingPrice
                        });
                      }} 
                    />
                  </td>
                  <td className="p-2 w-24">
                    <input type="number" min="1" value={line.quantity} onChange={e => updateLine(idx, 'quantity', e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded p-2 text-sm text-[var(--text-primary)] text-right focus:outline-none" />
                  </td>
                  <td className="p-2 w-32">
                    <input type="number" min="0" value={line.rate} onChange={e => updateLine(idx, 'rate', e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded p-2 text-sm text-[var(--text-primary)] text-right focus:outline-none" />
                  </td>
                  <td className="p-2 w-28">
                    <input type="number" min="0" value={line.discount} onChange={e => updateLine(idx, 'discount', e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded p-2 text-sm text-[var(--text-primary)] text-right focus:outline-none" />
                  </td>
                  <td className="p-2 w-24">
                    <input type="number" min="0" value={line.taxPercentage} onChange={e => updateLine(idx, 'taxPercentage', e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded p-2 text-sm text-[var(--text-primary)] text-right focus:outline-none" />
                  </td>
                  <td className="p-2 text-center w-16">
                    <button onClick={() => removeLine(idx)} className="text-rose-500 hover:text-rose-700 p-1.5">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={addLine} className="mt-3 flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
          <Plus size={16} /> Add Line Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[var(--border-light)] pt-6">
        <div>
          <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">Remarks / Notes</label>
          <textarea rows="4" placeholder="Terms and conditions, shipping notes..." value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-lg p-2.5 text-sm text-[var(--text-primary)] focus:outline-none" />
        </div>
        <div className="space-y-3 text-right text-sm text-[var(--text-secondary)]">
          <div className="flex justify-between"><span>Subtotal:</span><span className="font-semibold text-[var(--text-primary)]">₹{totals.subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Tax Amount:</span><span className="font-semibold text-[var(--text-primary)]">₹{totals.totalTax.toFixed(2)}</span></div>
          <div className="flex justify-between items-center py-2">
            <span>Invoice Discount:</span>
            <input type="number" min="0" value={invoiceDiscount} onChange={e => setInvoiceDiscount(e.target.value)} className="w-32 bg-[var(--bg-input)] border border-[var(--border-light)] rounded p-1 text-sm text-[var(--text-primary)] text-right focus:outline-none" />
          </div>
          <div className="flex justify-between border-t border-[var(--border-light)] pt-3 text-base font-bold text-[var(--text-primary)]">
            <span>Grand Total:</span>
            <span className="text-xl text-indigo-600 dark:text-indigo-400 font-bold">₹{totals.netAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-[var(--border-light)] pt-6">
        <button onClick={() => setMode('LIST')} className="px-4 py-2 border border-[var(--border-light)] rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-input)]">Cancel</button>
        <button onClick={() => submitForm('DRAFT')} className="px-4 py-2 bg-[var(--bg-input)] hover:bg-[var(--border-light)] text-[var(--text-primary)] font-semibold rounded-lg text-sm">Save Draft</button>
        <button onClick={() => submitForm('APPROVED')} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm shadow">Post Invoice</button>
      </div>
    </div>
  );
}
