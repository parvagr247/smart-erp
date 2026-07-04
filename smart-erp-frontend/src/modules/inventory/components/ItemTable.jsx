import React from 'react';
import './styles/ItemTable.css';

export default function ItemTable({ items, onNavigate, onDelete }) {
  return (
    <div className="overflow-x-auto text-left">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
            <th className="py-3 px-4 font-semibold">SKU</th>
            <th className="py-3 px-4 font-semibold">Item Name</th>
            <th className="py-3 px-4 font-semibold">Brand</th>
            <th className="py-3 px-4 font-semibold">Warehouse</th>
            <th className="py-3 px-4 font-semibold text-right">Available Qty</th>
            <th className="py-3 px-4 font-semibold text-right">Reorder Lvl</th>
            <th className="py-3 px-4 font-semibold text-center">Status</th>
            <th className="py-3 px-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? <tr><td colSpan="8" className="py-8 text-center text-slate-400">No matching stock items found.</td></tr> :
            items.map(item => {
              const isLow = parseFloat(item.openingQuantity) <= parseFloat(item.reorderLevel);
              const isOut = parseFloat(item.openingQuantity) <= 0;
              return (
                <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300"><div>{item.sku}</div><div className="text-xs text-slate-400">{item.code}</div></td>
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-100 cursor-pointer hover:underline" onClick={() => onNavigate(`/inventory/items/${item.id}`)}>{item.name}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{item.brandName || '-'}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{item.warehouseName || '-'}</td>
                  <td className="py-3 px-4 text-right"><span className={`font-semibold ${isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-800 dark:text-slate-100'}`}>{item.openingQuantity} {item.primaryUnitCode}</span></td>
                  <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">{item.reorderLevel}</td>
                  <td className="py-3 px-4 text-center"><span className={`px-2 py-0.5 rounded text-xs font-semibold ${item.status === 'ACTIVE' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400'}`}>{item.status}</span></td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button onClick={() => onNavigate(`/inventory/items/${item.id}/edit`)} className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer">Edit</button>
                    <button onClick={() => onDelete(item.id)} className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer">Delete</button>
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
}
