import React from 'react';
import './styles/ItemDetailsHeader.css';

export default function ItemDetailsHeader({ item, onEdit, onDelete, onAdjust, onViewLedger }) {
  return (
    <div className="flex justify-between items-center text-left">
      <div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Stock Item Profile</span>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{item.name}</h1>
        <p className="text-sm text-slate-400 mt-1">SKU: {item.sku} | Code: {item.code}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={onViewLedger} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-lg text-sm transition cursor-pointer">📊 View Ledger</button>
        <button onClick={onAdjust} className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-sm hover:bg-slate-50 transition cursor-pointer">🛠️ Adjust / Transfer</button>
        <button onClick={onEdit} className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-sm hover:bg-slate-50 transition cursor-pointer">Edit Item</button>
        <button onClick={onDelete} className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold rounded-lg text-sm transition cursor-pointer">Delete</button>
      </div>
    </div>
  );
}
