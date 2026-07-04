import React from 'react';
import './styles/PurchaseDetailsLineItems.css';

export default function PurchaseDetailsLineItems({ purchase, isIntraState }) {
  return (
    <div className="overflow-x-auto mb-6 text-left">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--border-color)] text-xs text-[var(--text-muted)] font-semibold uppercase">
            <th className="py-2.5 px-1">Item Description</th>
            <th className="py-2.5 px-1 w-[100px] text-right">Quantity</th>
            <th className="py-2.5 px-1 w-[120px] text-right">Rate</th>
            <th className="py-2.5 px-1 w-[100px] text-right">Discount</th>
            <th className="py-2.5 px-1 w-[120px] text-right">GST Rate</th>
            <th className="py-2.5 px-1 w-[150px] text-right">Tax Split</th>
            <th className="py-2.5 px-1 w-[150px] text-right">Line Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)] text-sm text-[var(--text-primary)]">
          {purchase.lineItems.map((line, idx) => (
            <tr key={idx}>
              <td className="py-3 px-1">
                <div className="font-semibold">{line.stockItemName}</div>
                <div className="text-[10px] text-[var(--text-muted)]">SKU: {line.sku} {line.batchNumber && `| Batch: ${line.batchNumber}`}</div>
              </td>
              <td className="py-3 px-1 text-right font-medium">{line.quantity}</td>
              <td className="py-3 px-1 text-right">₹{line.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              <td className="py-3 px-1 text-right text-red-500">{line.discount > 0 ? `-₹${line.discount.toLocaleString('en-IN')}` : '-'}</td>
              <td className="py-3 px-1 text-right">{line.taxPercentage}%</td>
              <td className="py-3 px-1 text-right text-xs text-[var(--text-muted)] leading-tight">
                {line.taxAmount > 0 ? (
                  isIntraState ? (
                    <>
                      CGST ({(line.taxPercentage / 2)}%): ₹{(line.taxAmount / 2).toFixed(2)}
                      <br />
                      SGST ({(line.taxPercentage / 2)}%): ₹{(line.taxAmount / 2).toFixed(2)}
                    </>
                  ) : (
                    <>IGST ({line.taxPercentage}%): ₹{line.taxAmount.toFixed(2)}</>
                  )
                ) : '-'}
              </td>
              <td className="py-3 px-1 text-right font-semibold">₹{line.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
