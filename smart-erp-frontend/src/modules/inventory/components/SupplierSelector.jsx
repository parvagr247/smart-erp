import React, { useState } from 'react';
import { useSupplierSelectorData } from './services/SupplierSelectorService';
import './styles/SupplierSelector.css';

export default function SupplierSelector({ value, onChange, disabled }) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { partners, loading, selectedPartner } = useSupplierSelectorData(search, value);

  return (
    <div className="relative w-full text-left">
      <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Supplier *</label>
      {disabled ? <div className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-md text-sm text-[var(--text-primary)]">{selectedPartner ? selectedPartner.name : 'No Supplier Selected'}</div> :
        <>
          <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-3 py-2 bg-[var(--bg-body)] border border-[var(--border-color)] hover:border-[var(--text-muted)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none transition-colors cursor-pointer">
            <span>{selectedPartner ? selectedPartner.name : 'Select Supplier...'}</span>
            <span className="text-[var(--text-muted)] text-xs">▼</span>
          </button>
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-md shadow-lg max-h-60 overflow-y-auto">
              <div className="p-2 border-b border-[var(--border-color)]">
                <input type="text" placeholder="Search suppliers..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full px-3 py-1.5 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)]" autoFocus />
              </div>
              {loading && <div className="p-3 text-xs text-[var(--text-muted)] text-center">Loading...</div>}
              {!loading && partners.length === 0 && <div className="p-3 text-xs text-[var(--text-muted)] text-center">No suppliers found</div>}
              {!loading && partners.map((p) => (
                <button key={p.id} type="button" onClick={() => { onChange(p); setIsOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-[var(--bg-body)] text-sm text-[var(--text-primary)] transition-colors border-b border-[var(--border-color)] last:border-b-0 cursor-pointer">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Code: {p.code} | GSTIN: {p.gstNumber || 'N/A'}</div>
                </button>
              ))}
            </div>
          )}
        </>
      }
    </div>
  );
}
