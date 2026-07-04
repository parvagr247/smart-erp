import React from 'react';
import './styles/InventoryValuationTable.css';

export default function InventoryValuationTable({ reportData }) {
  return (
    <div>
      <div className="iv-header-panel">
        <h2 className="iv-title">Stock Assets Valuation</h2>
        <span className="iv-total">Total Inventory Asset: ₹{reportData.totalValue?.toFixed(2)}</span>
      </div>
      <table className="iv-table">
        <thead>
          <tr className="iv-thead-tr">
            <th className="py-3 px-4">Item Details</th>
            <th className="py-3 px-4">SKU / Code</th>
            <th className="py-3 px-4 text-right">On Hand Stock</th>
            <th className="py-3 px-4 text-right">Average Cost (₹)</th>
            <th className="py-3 px-4 text-right">Net Value (₹)</th>
          </tr>
        </thead>
        <tbody>
          {reportData.rows?.map((row, idx) => (
            <tr key={idx} className="iv-tr">
              <td className="iv-cell-name">{row.name}</td>
              <td className="iv-cell-sku">{row.sku}</td>
              <td className="iv-cell-stock">{row.currentStock}</td>
              <td className="iv-cell-cost">₹{row.averageCost?.toFixed(2)}</td>
              <td className="iv-cell-value">₹{row.valuation?.toFixed(2)}</td>
            </tr>
          ))}
          {(!reportData.rows || reportData.rows.length === 0) && (
            <tr><td colSpan={5} className="iv-empty">No active stock items onboarded.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
