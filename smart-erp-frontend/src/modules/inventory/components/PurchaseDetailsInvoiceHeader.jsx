import React from 'react';
import './styles/PurchaseDetailsInvoiceHeader.css';

export default function PurchaseDetailsInvoiceHeader({ activeCompany, purchase }) {
  return (
    <div className="flex justify-between items-start border-b border-[var(--border-color)] pb-6 mb-6 text-left">
      <div>
        <h2 className="text-lg font-bold text-[var(--color-primary)]">{activeCompany ? activeCompany.name : 'SmartERP Corporation'}</h2>
        <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm leading-relaxed">
          {activeCompany ? activeCompany.address : 'HQ Office Block, Business Plaza'}
          <br />
          GSTIN: {activeCompany ? activeCompany.gstNumber : 'N/A'} | State: {activeCompany ? activeCompany.state : 'N/A'}
        </p>
      </div>
      <div className="text-right">
        <h3 className="text-xl font-bold uppercase text-[var(--text-muted)] tracking-wider">Purchase Invoice</h3>
        <p className="text-sm font-semibold text-[var(--text-primary)] mt-1">Invoice No: {purchase.purchaseNumber}</p>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Date: {new Date(purchase.purchaseDate).toLocaleDateString('en-IN')}
          {purchase.dueDate && <> | Due: {new Date(purchase.dueDate).toLocaleDateString('en-IN')}</>}
        </p>
      </div>
    </div>
  );
}
