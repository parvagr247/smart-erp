import React from 'react';
import { usePurchaseTotalsData } from './services/PurchaseTotalsService';
import './styles/PurchaseTotals.css';

export default function PurchaseTotals({ items, invoiceDiscount, onChangeInvoiceDiscount, isIntraState, disabled }) {
  const { gross, totalDiscount, cgstTotal, sgstTotal, igstTotal, taxTotal, extraDisc, roundOff, grandTotal } = usePurchaseTotalsData(items, invoiceDiscount, isIntraState);

  return (
    <div className="w-full max-w-md ml-auto bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-5 mt-4 text-sm text-[var(--text-primary)] text-left">
      <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase mb-3 border-b border-[var(--border-color)] pb-2">Summary & Totals</h3>
      <div className="space-y-2">
        <div className="flex justify-between"><span className="text-[var(--text-muted)]">Subtotal (Gross)</span><span className="font-semibold">₹{gross.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
        {totalDiscount > 0 && <div className="flex justify-between text-red-500"><span>Item Discounts</span><span>- ₹{totalDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>}
        <div className="flex justify-between items-center py-1">
          <span className="text-[var(--text-muted)]">Invoice Extra Discount</span>
          {disabled ? <span className="font-semibold text-red-500">- ₹{extraDisc.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span> :
            <input type="number" min="0" step="0.01" value={invoiceDiscount || ''} onChange={(e) => onChangeInvoiceDiscount && onChangeInvoiceDiscount(e.target.value)} className="w-24 px-2 py-0.5 text-right bg-[var(--bg-body)] border border-[var(--border-color)] rounded text-xs text-[var(--text-primary)]" placeholder="0.00" />
          }
        </div>
        <div className="border-t border-[var(--border-color)] my-2"></div>
        {isIntraState ? (
          <>
            <div className="flex justify-between text-xs text-[var(--text-muted)]"><span>Total CGST</span><span>₹{cgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
            <div className="flex justify-between text-xs text-[var(--text-muted)]"><span>Total SGST</span><span>₹{sgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
          </>
        ) : (
          <div className="flex justify-between text-xs text-[var(--text-muted)]"><span>Total IGST</span><span>₹{igstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
        )}
        <div className="flex justify-between"><span className="text-[var(--text-muted)]">Duties & Taxes Total</span><span className="font-semibold">₹{taxTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
        <div className="flex justify-between text-xs text-[var(--text-muted)]"><span>Round Off</span><span>{roundOff >= 0 ? '+' : ''}₹{roundOff.toFixed(2)}</span></div>
        <div className="border-t border-[var(--border-color)] my-2"></div>
        <div className="flex justify-between text-lg font-bold text-[var(--color-primary)]"><span>Grand Total</span><span>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
      </div>
    </div>
  );
}
