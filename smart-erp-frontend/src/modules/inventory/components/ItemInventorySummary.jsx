import React from 'react';
import './styles/ItemInventorySummary.css';

export default function ItemInventorySummary({ item }) {
  const balances = [
    { label: 'Available Quantity', value: `${item.openingQuantity} ${item.primaryUnitCode}`, primary: true },
    { label: 'Warehouse location', value: item.warehouseName || 'Unassigned' },
    { label: 'Stock Value', value: `₹${item.openingValue.toLocaleString()}` },
    { label: 'Reorder Alert Trigger', value: `${item.reorderLevel} ${item.primaryUnitCode}`, borderTop: true },
    { label: 'Reorder Quantity', value: `${item.reorderQuantity} ${item.primaryUnitCode}` },
    { label: 'Minimum Stock Limit', value: `${item.minimumStock} ${item.primaryUnitCode}` },
    { label: 'Maximum Stock Limit', value: `${item.maximumStock} ${item.primaryUnitCode}` }
  ];

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 text-left">
      <h2 className="text-md font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2">Inventory Summary</h2>
      <div className="space-y-3 text-sm">
        {balances.map((b, idx) => (
          <div key={idx} className={`flex justify-between ${b.borderTop ? 'border-t border-slate-100 dark:border-slate-700 pt-2' : ''}`}>
            <span className="text-slate-500">{b.label}</span>
            <span className={b.primary ? 'font-bold text-indigo-600' : 'font-semibold text-slate-700 dark:text-slate-300'}>{b.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
