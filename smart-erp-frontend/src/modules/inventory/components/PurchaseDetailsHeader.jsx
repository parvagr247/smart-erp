import React from 'react';
import { Link } from 'react-router-dom';
import PurchaseStatusBadge from '../components/PurchaseStatusBadge';
import './styles/PurchaseDetailsHeader.css';

export default function PurchaseDetailsHeader({ id, purchase, details, navigate }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[var(--border-color)] pb-4 print:hidden text-left">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Purchase Invoice: {purchase.purchaseNumber}</h1>
          <PurchaseStatusBadge status={purchase.status} />
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-1">Recorded by {purchase.createdBy} on {new Date(purchase.purchaseDate).toLocaleDateString('en-IN')}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={details.printInvoice} className="px-3 py-1.5 bg-[var(--bg-card)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-xs font-semibold rounded text-[var(--text-primary)] transition-all cursor-pointer">🖨️ Print Invoice</button>
        {purchase.status === 'DRAFT' && (
          <>
            <Link to={`/purchase/edit/${id}`} className="px-3 py-1.5 bg-[var(--bg-body)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-xs font-semibold rounded text-[var(--text-primary)] transition-all">✏️ Edit Draft</Link>
            <button onClick={() => details.handleStatusTransition('APPROVED')} disabled={details.updating} className="px-3 py-1.5 bg-[var(--color-primary)] hover:opacity-90 text-xs font-semibold rounded text-white transition-all disabled:opacity-50 cursor-pointer">✔️ Approve & Post</button>
            <button onClick={details.deleteDraft} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-xs font-semibold rounded text-white transition-all cursor-pointer">🗑️ Delete Draft</button>
          </>
        )}
        {purchase.status === 'APPROVED' && (
          <>
            <button onClick={() => details.handleStatusTransition('RECEIVED')} disabled={details.updating} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold rounded text-white transition-all disabled:opacity-50 cursor-pointer">📦 Mark as Received</button>
            <button onClick={() => details.handleStatusTransition('CANCELLED')} disabled={details.updating} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-xs font-semibold rounded text-white transition-all disabled:opacity-50 cursor-pointer">❌ Cancel Voucher</button>
          </>
        )}
        {purchase.status === 'RECEIVED' && (
          <button onClick={() => details.handleStatusTransition('COMPLETED')} disabled={details.updating} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-xs font-semibold rounded text-white transition-all disabled:opacity-50 cursor-pointer">🏁 Complete Transaction</button>
        )}
      </div>
    </div>
  );
}
