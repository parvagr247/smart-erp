import React from 'react';
import ActionButton from '@shared/components/ActionButton';
import { Printer, Trash2, CheckCircle2, Edit } from 'lucide-react';
import StatusBadge from '@shared/components/StatusBadge';

export default function SalesDetailsSection({
  sale,
  setMode,
  handleEdit,
  handleStatusChange,
  handleDelete
}) {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-light)] p-6 rounded-xl space-y-6 text-left">
      <div className="flex justify-between items-center border-b border-[var(--border-light)] pb-4">
        <div>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">Invoice Details</span>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mt-1">{sale.salesNumber}</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setMode('LIST')} className="px-4 py-2 border border-[var(--border-light)] rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-input)]">Back</button>
          <button onClick={() => window.print()} className="px-3 py-2 border border-[var(--border-light)] rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-input)] flex items-center gap-1.5"><Printer size={14} /> Print</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-[var(--text-secondary)]">
        <div>
          <span className="block text-xs uppercase font-bold text-[var(--text-muted)] mb-1">Customer Info</span>
          <span className="block font-semibold text-[var(--text-primary)]">{sale.customerName}</span>
          <span className="block text-xs">{sale.customerCode}</span>
        </div>
        <div>
          <span className="block text-xs uppercase font-bold text-[var(--text-muted)] mb-1">Date & Terms</span>
          <span className="block">Date: <span className="font-semibold text-[var(--text-primary)]">{sale.salesDate}</span></span>
          <span className="block">Due: <span className="font-semibold text-[var(--text-primary)]">{sale.dueDate || 'COD'}</span></span>
        </div>
        <div>
          <span className="block text-xs uppercase font-bold text-[var(--text-muted)] mb-1">Status</span>
          <StatusBadge status={sale.status} />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 uppercase tracking-wider">Items Breakdown</h3>
        <div className="border border-[var(--border-light)] rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-[var(--border-light)] text-left">
            <thead className="bg-[var(--bg-input)] text-xs font-bold text-[var(--text-secondary)] uppercase">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3 text-right">Qty</th>
                <th className="px-4 py-3 text-right">Rate</th>
                <th className="px-4 py-3 text-right">Discount</th>
                <th className="px-4 py-3 text-right">Tax %</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)] text-sm text-[var(--text-secondary)]">
              {sale.lineItems?.map((l, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{l.stockItemName}</td>
                  <td className="px-4 py-3 text-right">{l.quantity}</td>
                  <td className="px-4 py-3 text-right">₹{l.rate?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">₹{l.discount?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">{l.taxPercentage}%</td>
                  <td className="px-4 py-3 text-right font-medium text-[var(--text-primary)]">₹{l.totalAmount?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[var(--border-light)] pt-6">
        <div>
          <span className="block text-xs uppercase font-bold text-[var(--text-muted)] mb-2">Remarks</span>
          <p className="text-sm p-4 bg-[var(--bg-input)] rounded-lg text-[var(--text-secondary)] border border-[var(--border-light)] min-h-[80px]">{sale.notes || 'No remarks recorded.'}</p>
        </div>
        <div className="space-y-3 text-right text-sm text-[var(--text-secondary)]">
          <div className="flex justify-between"><span>Subtotal:</span><span className="font-semibold text-[var(--text-primary)]">₹{sale.subTotal?.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Tax Amount:</span><span className="font-semibold text-[var(--text-primary)]">₹{sale.taxAmount?.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Voucher Discount:</span><span className="font-semibold text-[var(--text-primary)]">₹{sale.discountAmount?.toFixed(2)}</span></div>
          <div className="flex justify-between border-t border-[var(--border-light)] pt-3 text-base font-bold text-[var(--text-primary)]">
            <span>Net Amount:</span>
            <span className="text-xl text-indigo-600 dark:text-indigo-400 font-bold">₹{sale.netAmount?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {sale.status === 'DRAFT' && (
        <div className="flex justify-end gap-3 border-t border-[var(--border-light)] pt-6">
          <ActionButton label="Delete Draft" variant="danger" icon={<Trash2 size={14} />} onClick={() => handleDelete(sale.id)} />
          <ActionButton label="Edit Invoice" variant="secondary" icon={<Edit size={14} />} onClick={() => handleEdit(sale)} />
          <ActionButton label="Approve & Post" variant="primary" icon={<CheckCircle2 size={14} />} onClick={() => handleStatusChange(sale.id, 'APPROVED')} />
        </div>
      )}
    </div>
  );
}
