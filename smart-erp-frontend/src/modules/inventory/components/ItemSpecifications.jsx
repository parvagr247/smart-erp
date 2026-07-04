import React from 'react';
import './styles/ItemSpecifications.css';

export default function ItemSpecifications({ item }) {
  const specs = [
    { label: 'Alias / Common Name', value: item.alias || 'None' },
    { label: 'Brand', value: item.brandName || 'Unassigned' },
    { label: 'Manufacturer', value: item.manufacturerName || 'Unassigned' },
    { label: 'Stock Group', value: item.stockGroupName || 'General' },
    { label: 'Primary Unit', value: item.primaryUnitCode },
    { label: 'Secondary Unit', value: item.secondaryUnitCode || 'None' },
    { label: 'Weight', value: `${item.weight} KG` },
    { label: 'Dimensions (L x W x H)', value: item.dimensions || 'Unspecified' }
  ];

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 text-left">
      <h2 className="text-md font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2">Item Specifications</h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        {specs.map((s, idx) => (
          <div key={idx}>
            <span className="text-slate-400 text-xs font-semibold uppercase">{s.label}</span>
            <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>
      {item.description && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
          <span className="text-slate-400 text-xs font-semibold uppercase">Product Description</span>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{item.description}</p>
        </div>
      )}
    </div>
  );
}
