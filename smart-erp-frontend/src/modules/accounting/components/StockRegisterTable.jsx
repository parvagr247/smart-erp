import React from 'react';
import './styles/StockRegisterTable.css';

export default function StockRegisterTable({ reportData }) {
  return (
    <div>
      <div className="mb-6 pb-4 border-b border-neutral-100 flex justify-between items-end">
        <h2 className="text-xl font-bold text-neutral-900">Inventory Stock Register</h2>
        <span className="text-xs text-neutral-400">Live Item Movement Logs</span>
      </div>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-neutral-600 font-semibold bg-neutral-50">
            <th className="py-3 px-4">Item Name</th>
            <th className="py-3 px-4">SKU</th>
            <th className="py-3 px-4 text-right">Opening Qty</th>
            <th className="py-3 px-4 text-right">Total Inwards</th>
            <th className="py-3 px-4 text-right">Total Outwards</th>
            <th className="py-3 px-4 text-right font-bold text-neutral-900">Closing Stock</th>
          </tr>
        </thead>
        <tbody>
          {reportData.rows?.map((row, idx) => (
            <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50">
              <td className="py-3 px-4 font-medium text-neutral-900">{row.name}</td>
              <td className="py-3 px-4 text-neutral-500 font-mono text-xs">{row.sku}</td>
              <td className="py-3 px-4 text-right">{row.openingQuantity}</td>
              <td className="py-3 px-4 text-right text-emerald-600 font-medium">+{row.inwardQuantity}</td>
              <td className="py-3 px-4 text-right text-rose-600 font-medium">-{row.outwardQuantity}</td>
              <td className="py-3 px-4 text-right font-bold text-neutral-950">{row.closingQuantity}</td>
            </tr>
          ))}
          {(!reportData.rows || reportData.rows.length === 0) && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-neutral-400 text-xs">No item movement recorded.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
