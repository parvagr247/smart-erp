import React from 'react';
import './styles/TrialBalanceTable.css';

export default function TrialBalanceTable({ reportData }) {
  return (
    <div>
      <div className="trial-header-panel">
        <h2 className="trial-title">Trial Balance Sheet</h2>
        <span className="trial-subtitle">Live Statement</span>
      </div>
      <table className="trial-table">
        <thead>
          <tr className="trial-thead-tr">
            <th className="py-3 px-4">Ledger Account</th>
            <th className="py-3 px-4">Group Category</th>
            <th className="py-3 px-4 text-right">Debit Balance (₹)</th>
            <th className="py-3 px-4 text-right">Credit Balance (₹)</th>
          </tr>
        </thead>
        <tbody>
          {reportData.rows?.map((row, idx) => (
            <tr key={idx} className="trial-tr">
              <td className="trial-cell-ledger">{row.ledgerName}</td>
              <td className="trial-cell-group">{row.groupName}</td>
              <td className="trial-cell-amount">{row.debitAmount > 0 ? row.debitAmount.toFixed(2) : '-'}</td>
              <td className="trial-cell-amount">{row.creditAmount > 0 ? row.creditAmount.toFixed(2) : '-'}</td>
            </tr>
          ))}
          <tr className="trial-total-tr">
            <td className="py-4 px-4" colSpan={2}>Grand Total</td>
            <td className="trial-total-cell">₹{reportData.totalDebit?.toFixed(2)}</td>
            <td className="trial-total-cell">₹{reportData.totalCredit?.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
