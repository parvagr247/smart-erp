import React from 'react';
import './styles/CashBankTable.css';

export default function CashBankTable({ reportData, navigate }) {
  return (
    <div>
      <div className="cb-header-panel">
        <h2 className="cb-title">Cash / Bank Ledger Statement</h2>
        <span className="cb-subtitle">Account: {reportData.ledgerName}</span>
      </div>
      <div className="cb-stat-grid">
        <div className="cb-stat-card"><div className="cb-stat-label">Opening Balance</div><div className="cb-stat-value">₹{reportData.openingBalance?.toFixed(2)}</div></div>
        <div className="cb-stat-card"><div className="cb-stat-label">Closing Balance</div><div className="cb-stat-value">₹{reportData.closingBalance?.toFixed(2)}</div></div>
      </div>
      <table className="cb-table">
        <thead>
          <tr className="cb-thead-tr">
            <th className="py-3 px-4">Date</th>
            <th className="py-3 px-4">Transaction / Voucher</th>
            <th className="py-3 px-4">Particulars (Opposite Acc)</th>
            <th className="py-3 px-4 text-right">Debit (₹)</th>
            <th className="py-3 px-4 text-right">Credit (₹)</th>
          </tr>
        </thead>
        <tbody>
          {reportData.lines?.map((line, idx) => (
            <tr key={idx} className="cb-tr">
              <td className="cb-cell-date">{line.date}</td>
              <td onClick={() => navigate(`/accounting/vouchers/${line.transactionId}`)} className="cb-cell-voucher">{line.voucherNumber}</td>
              <td className="cb-cell-particulars">
                <div className="cb-ledger-name">{line.oppositeLedgerName}</div>
                <div className="cb-narration">{line.narration}</div>
              </td>
              <td className="cb-cell-debit">{line.debitAmount > 0 ? `+₹${line.debitAmount.toFixed(2)}` : '-'}</td>
              <td className="cb-cell-credit">{line.creditAmount > 0 ? `-₹${line.creditAmount.toFixed(2)}` : '-'}</td>
            </tr>
          ))}
          {(!reportData.lines || reportData.lines.length === 0) && (
            <tr><td colSpan={5} className="cb-empty">No transactions found for the filtered date range.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
