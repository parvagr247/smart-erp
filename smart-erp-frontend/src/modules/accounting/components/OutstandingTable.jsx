import React from 'react';
import './styles/OutstandingTable.css';

export default function OutstandingTable({ reportData, partnerType }) {
  return (
    <div>
      <div className="outstanding-header-panel">
        <h2 className="outstanding-title">{partnerType} Ledger Outstandings</h2>
        <span className="outstanding-total">Total: ₹{reportData.totalOutstanding?.toFixed(2)}</span>
      </div>
      <table className="outstanding-table">
        <thead>
          <tr className="outstanding-thead-tr">
            <th className="py-3 px-4">Partner Name</th>
            <th className="py-3 px-4">Contact Info</th>
            <th className="py-3 px-4 text-right">Outstanding Balance (₹)</th>
          </tr>
        </thead>
        <tbody>
          {reportData.rows?.map((row, idx) => (
            <tr key={idx} className="outstanding-tr">
              <td className="outstanding-cell-partner">{row.partnerName}</td>
              <td className="outstanding-cell-contact">
                <div>Phone: {row.phone}</div>
                <div>Email: {row.email}</div>
              </td>
              <td className="outstanding-cell-amount">₹{row.outstandingAmount?.toFixed(2)}</td>
            </tr>
          ))}
          {(!reportData.rows || reportData.rows.length === 0) && (
            <tr>
              <td colSpan={3} className="outstanding-empty">No outstanding balances found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
