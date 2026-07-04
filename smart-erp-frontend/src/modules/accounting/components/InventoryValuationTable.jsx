import React from 'react';
import './styles/InventoryValuationTable.css';

export default function InventoryValuationTable({ reportData }) {
  return (
    <div>
      <div className="mb-6 pb-4 border-b border-neutral-100 flex justify-between items-end">
        <h2 className="text-xl font-bold text-neutral-900">Stock Assets Valuation</h2>
        <span className="text-xs text-neutral-400">Total Inventory Asset: ₹{reportData.totalValue?.toFixed(2)}</span>
      </div>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-neutral-600 font-semibold bg-neutral-50">
            <th className="py-3 px-4">Item Details</th>
            <th className="py-3 px-4">SKU / Code</th>
            <th className="py-3 px-4 text-right">On Hand Stock</th>
            <th className="py-3 px-4 text-right">Average Cost (₹)</th>
            <th className="py-3 px-4 text-right">Net Value (₹)</th>
          </tr>
        </thead>
        <tbody>
          {reportData.rows?.map((row, idx) => (
            <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50">
              <td className="py-3 px-4 font-medium text-neutral-900">{row.name}</td>
              <td className="py-3 px-4 text-neutral-500 font-mono text-xs">{row.sku}</td>
              <td className="py-3 px-4 text-right font-medium text-neutral-800">{row.currentStock}</td>
              <td className="py-3 px-4 text-right text-neutral-700">₹{row.averageCost?.toFixed(2)}</td>
              <td className="py-3 px-4 text-right text-neutral-950 font-bold">₹{row.valuation?.toFixed(2)}</td>
            </tr>
          ))}
          {(!reportData.rows || reportData.rows.length === 0) && (
            <tr>
              <td colSpan={5} className="py-8 text-center text-neutral-400 text-xs">No active stock items onboarded.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
