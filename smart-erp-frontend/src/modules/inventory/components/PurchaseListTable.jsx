import React from 'react';
import { Link } from 'react-router-dom';
import PurchaseStatusBadge from './PurchaseStatusBadge';
import './styles/PurchaseListTable.css';

export default function PurchaseListTable({ list }) {
  if (list.loading) return <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-8 text-center text-sm text-[var(--text-muted)] animate-pulse">Loading registry...</div>;
  if (list.purchases.length === 0) return <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-8 text-center text-sm text-[var(--text-muted)]">No purchase vouchers recorded matching the filters.</div>;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg overflow-hidden shadow-sm text-left">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-color)] text-xs text-[var(--text-muted)] font-semibold uppercase bg-[var(--bg-body)]">
              <th className="py-3 px-4">Purchase No.</th>
              <th className="py-3 px-4">Voucher Date</th>
              <th className="py-3 px-4">Supplier</th>
              <th className="py-3 px-4">Warehouse</th>
              <th className="py-3 px-4">Voucher Status</th>
              <th className="py-3 px-4 text-right">Grand Total (₹)</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)] text-sm text-[var(--text-primary)]">
            {list.purchases.map((p) => (
              <tr key={p.id} className="hover:bg-[var(--bg-body)] transition-colors">
                <td className="py-3.5 px-4 font-semibold text-[var(--color-primary)]"><Link to={`/purchase/${p.id}`}>{p.purchaseNumber}</Link></td>
                <td className="py-3.5 px-4">{new Date(p.purchaseDate).toLocaleDateString('en-IN')}</td>
                <td className="py-3.5 px-4 font-medium">{p.supplierName}</td>
                <td className="py-3.5 px-4">{p.warehouseName}</td>
                <td className="py-3.5 px-4"><PurchaseStatusBadge status={p.status} /></td>
                <td className="py-3.5 px-4 text-right font-bold">₹{p.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td className="py-3.5 px-4 text-center"><Link to={`/purchase/${p.id}`} className="px-2.5 py-1 bg-[var(--bg-body)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-xs font-semibold rounded text-[var(--text-primary)] transition-all">View Details</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {list.totalPages > 1 && (
        <div className="flex justify-between items-center p-4 border-t border-[var(--border-color)] bg-[var(--bg-body)] text-xs text-[var(--text-muted)]">
          <div>Showing {list.page * 10 + 1} to {Math.min((list.page + 1) * 10, list.totalElements)} of {list.totalElements} entries</div>
          <div className="flex gap-2">
            <button disabled={list.page === 0} onClick={() => list.setPage(list.page - 1)} className="px-3 py-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded disabled:opacity-50 text-[var(--text-primary)] cursor-pointer">Previous</button>
            <span className="self-center">Page {list.page + 1} of {list.totalPages}</span>
            <button disabled={list.page === list.totalPages - 1} onClick={() => list.setPage(list.page + 1)} className="px-3 py-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded disabled:opacity-50 text-[var(--text-primary)] cursor-pointer">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
