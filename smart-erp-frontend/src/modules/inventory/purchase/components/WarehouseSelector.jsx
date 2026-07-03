import React, { useState, useEffect } from 'react';
import { inventoryService } from '../../services/inventory.service';

export default function WarehouseSelector({ value, onChange, disabled, label = 'Primary Warehouse *' }) {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadWarehouses = async () => {
      setLoading(true);
      try {
        const res = await inventoryService.getWarehouses();
        if (res.success && res.data) {
          setWarehouses(res.data);
          // If no value selected, auto-select the first warehouse if available
          if (!value && res.data.length > 0 && onChange) {
            onChange(res.data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load warehouses', err);
      } finally {
        setLoading(false);
      }
    };
    loadWarehouses();
  }, [value, onChange]);

  return (
    <div className="w-full text-left">
      <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">
        {label}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={disabled || loading}
        className="w-full px-3 py-2 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)] disabled:opacity-60 transition-colors"
      >
        {loading && <option value="">Loading warehouses...</option>}
        {!loading && warehouses.length === 0 && <option value="">No warehouses found</option>}
        {!loading && warehouses.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name} ({w.code})
          </option>
        ))}
      </select>
    </div>
  );
}
