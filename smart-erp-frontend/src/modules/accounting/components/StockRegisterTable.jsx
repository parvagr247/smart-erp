import React from 'react';
import './styles/StockRegisterTable.css';

export default function StockRegisterTable({ reportData }) {
  return (
    <div>
      <div className="sr-header-panel">
        <h2 className="sr-title">Inventory Stock Register</h2>
        <span className="sr-subtitle">Live Item Movement Logs</span>
      </div>
      <table className="sr-table">
        <thead>
          <tr className="sr-thead-tr">
            <th className="py-3 px-4">Item Name</th>
            <th className="py-3 px-4">SKU</th>
            <th className="py-3 px-4 text-right">Opening Qty</th>
            <th className="py-3 px-4 text-right">Total Inwards</th>
            <th className="py-3 px-4 text-right">Total Outwards</th>
            <th className="py-3 px-4 text-right font-bold">Closing Stock</th>
          </tr>
        </thead>
        <tbody>
          {reportData.rows?.map((row, idx) => (
            <tr key={idx} className="sr-tr">
              <td className="sr-cell-name">{row.name}</td>
              <td className="sr-cell-sku">{row.sku}</td>
              <td className="sr-cell-qty">{row.openingQuantity}</td>
              <td className="sr-cell-inward">+{row.inwardQuantity}</td>
              <td className="sr-cell-outward">-{row.outwardQuantity}</td>
              <td className="sr-cell-closing">{row.closingQuantity}</td>
            </tr>
          ))}
          {(!reportData.rows || reportData.rows.length === 0) && (
            <tr><td colSpan={6} className="sr-empty">No item movement recorded.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
