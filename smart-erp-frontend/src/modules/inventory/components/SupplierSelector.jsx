import React from 'react';
import { useSupplierSelectorData } from './services/SupplierSelectorService';
import './styles/SupplierSelector.css';

export default function SupplierSelector({ value, onChange, disabled }) {
  const { partners, loading } = useSupplierSelectorData(value);

  return (
    <div className="w-full text-left">
      <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Supplier *</label>
      <select 
        value={value || ''} 
        onChange={(e) => {
          const selectedId = e.target.value;
          const found = partners.find(p => p.id === selectedId);
          if (onChange) {
            onChange(found || { id: '' });
          }
        }} 
        disabled={disabled || loading} 
        className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded p-2 text-xs text-[var(--text-primary)] focus:outline-none cursor-pointer focus:border-[var(--primary)] h-10"
      >
        {loading && <option value="">Loading suppliers...</option>}
        {!loading && partners.length === 0 && <option value="">No suppliers found</option>}
        {!loading && <option value="">-- Select Supplier... --</option>}
        {!loading && partners.map((p) => {
          let label = p.name;
          if (p.code) {
            label += ` (${p.code})`;
          }
          if (p.gstNumber) {
            label += ` - GSTIN: ${p.gstNumber}`;
          }
          return (
            <option key={p.id} value={p.id}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
