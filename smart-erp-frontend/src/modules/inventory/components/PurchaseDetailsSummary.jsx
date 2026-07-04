import React from 'react';
import './styles/PurchaseDetailsSummary.css';

export default function PurchaseDetailsSummary({ purchase, isIntraState }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-6 border-t border-[var(--border-color)] text-left">
      <div className="text-xs text-[var(--text-muted)] space-y-2">
        <h5 className="font-bold uppercase text-[var(--text-muted)]">Notes / Remarks</h5>
        <p className="leading-relaxed bg-[var(--bg-body)] p-3 rounded-md border border-[var(--border-color)]">
          {purchase.notes || 'No remarks added to this purchase voucher.'}
        </p>
        {purchase.attachments && (
          <div className="pt-2">
            <span className="font-semibold block mb-1">Attachments:</span>
            <span className="text-[var(--color-primary)] truncate block">{purchase.attachments}</span>
          </div>
        )}
      </div>
      <div className="space-y-2 text-sm text-[var(--text-primary)] max-w-sm ml-auto w-full">
        <div className="flex justify-between">
          <span className="text-[var(--text-muted)]">Voucher Subtotal</span>
          <span>₹{(purchase.grossAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        {purchase.discountAmount > 0 && (
          <div className="flex justify-between text-red-500">
            <span>Extra Discounts</span>
            <span>- ₹{purchase.discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        )}
        <div className="border-t border-[var(--border-color)] my-1"></div>
        {isIntraState ? (
          <>
            <div className="flex justify-between text-xs text-[var(--text-muted)]">
              <span>CGST Input Tax</span>
              <span>₹{(purchase.cgst || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-xs text-[var(--text-muted)]">
              <span>SGST Input Tax</span>
              <span>₹{(purchase.sgst || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </>
        ) : (
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>IGST Input Tax</span>
            <span>₹{(purchase.igst || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        )}
        {purchase.cess > 0 && (
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>CESS Input Tax</span>
            <span>₹{purchase.cess.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        )}
        <div className="flex justify-between text-xs text-[var(--text-muted)]">
          <span>Round Off</span>
          <span>₹{(purchase.roundOff || 0).toFixed(2)}</span>
        </div>
        <div className="border-t border-[var(--border-color)] my-1"></div>
        <div className="flex justify-between text-base font-bold text-[var(--color-primary)]">
          <span>Voucher Grand Total</span>
          <span>₹{(purchase.grandTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}
