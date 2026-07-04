import React from 'react';
import { useWarehouseSelectorData } from './services/WarehouseSelectorService';
import './styles/WarehouseSelector.css';

export default function WarehouseSelector({ value, onChange, disabled, label = 'Primary Warehouse *' }) {
  const { warehouses, loading } = useWarehouseSelectorData(value, onChange);

  return (
    <div className="w-full text-left">
      <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">{label}</label>
      <select value={value || ''} onChange={(e) => onChange && onChange(e.target.value)} disabled={disabled || loading} className="warehouse-selector-select">
        {loading && <option value="">Loading warehouses...</option>}
        {!loading && warehouses.length === 0 && <option value="">No warehouses found</option>}
        {!loading && warehouses.map((w) => <option key={w.id} value={w.id}>{w.name} ({w.code})</option>)}
      </select>
    </div>
  );
}
