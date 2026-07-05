import React from 'react';
import './styles/ItemInventorySummary.css';

export default function ItemInventorySummary({ item }) {
  const currentQty = item.currentQuantity !== undefined ? item.currentQuantity : item.openingQuantity;
  const avgCost = item.averageCost || 0;
  const reorder = item.reorderLevel || 0;
  const isLow = currentQty <= reorder;
  const isOut = currentQty <= 0;
  
  const statusText = isOut ? '🔴 OUT OF STOCK' : (isLow ? '⚠️ LOW STOCK' : '🟢 IN STOCK');
  const stockVal = currentQty * avgCost;

  const balances = [
    { label: 'Available Stock', value: `${currentQty} ${item.primaryUnitCode}`, primary: true },
    { label: 'Reserved Stock', value: `0 ${item.primaryUnitCode} (Future)` },
    { label: 'Incoming Stock', value: `0 ${item.primaryUnitCode} (Future)` },
    { label: 'Stock Valuation (Avg Cost)', value: `₹${avgCost.toFixed(2)}` },
    { label: 'Total Stock Value', value: `₹${stockVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { label: 'Stock Status', value: statusText, borderTop: true },
    { label: 'Reorder Level Limit', value: `${reorder} ${item.primaryUnitCode}` },
    { label: 'Last Purchase Date', value: item.lastPurchaseDate ? new Date(item.lastPurchaseDate).toLocaleDateString() : 'No Purchases Logged' },
    { label: 'Last Sales Date', value: item.lastSalesDate ? new Date(item.lastSalesDate).toLocaleDateString() : 'No Sales Logged' }
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
