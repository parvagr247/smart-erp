import React from 'react';
import './styles/PurchaseDetailsAddresses.css';

export default function PurchaseDetailsAddresses({ purchase }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-[var(--border-color)] pb-6 mb-6 text-left">
      <div>
        <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase mb-2">Supplier (From)</h4>
        <div className="text-sm font-semibold text-[var(--text-primary)]">{purchase.supplierName}</div>
        <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">Payment Terms: {purchase.paymentTerms || 'N/A'}</p>
      </div>
      <div>
        <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase mb-2">Delivery Warehouse (Ship To)</h4>
        <div className="text-sm font-semibold text-[var(--text-primary)]">{purchase.warehouseName}</div>
        <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">Standard receiving warehouse for line items.</p>
      </div>
    </div>
  );
}
