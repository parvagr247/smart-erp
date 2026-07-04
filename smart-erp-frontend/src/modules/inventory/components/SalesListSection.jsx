import React from 'react';
import ActionButton from '@shared/components/ActionButton';
import { Eye, CheckCircle2, XCircle } from 'lucide-react';
import StatusBadge from '@shared/components/StatusBadge';

export default function SalesListSection({ sales, stats, handleCreate, handleDetails, handleStatusChange }) {
  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Sales Vouchers</h1>
          <p className="text-sm text-[var(--text-secondary)]">Manage tax invoices and billing accounts.</p>
        </div>
        <button onClick={handleCreate} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow">+ New Invoice</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border-light)] shadow-sm">
          <span className="text-xs text-[var(--text-secondary)] font-semibold uppercase">Total Sales Invoices</span>
          <h2 className="text-3xl font-bold mt-2 text-[var(--text-primary)]">{stats.salesCount}</h2>
        </div>
        <div className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border-light)] shadow-sm">
          <span className="text-xs text-[var(--text-secondary)] font-semibold uppercase">Total Sales Revenue</span>
          <h2 className="text-3xl font-bold mt-2 text-indigo-600 dark:text-indigo-400">₹{(stats.totalSalesValue || 0).toLocaleString()}</h2>
        </div>
      </div>

      <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-light)] overflow-hidden">
        <table className="min-w-full divide-y divide-[var(--border-light)] text-left">
          <thead className="bg-[var(--bg-input)]">
            <tr>
              {['Invoice No.', 'Customer', 'Date', 'Amount', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-light)] text-sm text-[var(--text-secondary)]">
            {sales.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-[var(--text-muted)]">No sales invoices found.</td></tr>
            ) : (
              sales.map(s => (
                <tr key={s.id} className="hover:bg-[var(--bg-input)]/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-[var(--text-primary)]">{s.salesNumber}</td>
                  <td className="px-6 py-4">{s.customerName}</td>
                  <td className="px-6 py-4">{s.salesDate}</td>
                  <td className="px-6 py-4 font-medium text-[var(--text-primary)]">₹{s.netAmount?.toFixed(2)}</td>
                  <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                  <td className="px-6 py-4 flex gap-2">
                    <ActionButton label="View" variant="secondary" icon={<Eye size={12} />} onClick={() => handleDetails(s.id)} />
                    {s.status === 'DRAFT' && (
                      <>
                        <ActionButton label="Post" variant="primary" icon={<CheckCircle2 size={12} />} onClick={() => handleStatusChange(s.id, 'APPROVED')} />
                        <ActionButton label="Cancel" variant="danger" icon={<XCircle size={12} />} onClick={() => handleStatusChange(s.id, 'CANCELLED')} />
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
