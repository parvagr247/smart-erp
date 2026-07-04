import React from 'react';
import './styles/TrialBalanceTable.css';

export default function TrialBalanceTable({ reportData }) {
  return (
    <div>
      <div className="mb-6 pb-4 border-b border-neutral-100 flex justify-between items-end">
        <h2 className="text-xl font-bold text-neutral-900">Trial Balance Sheet</h2>
        <span className="text-xs text-neutral-400">Live Statement</span>
      </div>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-neutral-600 font-semibold bg-neutral-50">
            <th className="py-3 px-4">Ledger Account</th>
            <th className="py-3 px-4">Group Category</th>
            <th className="py-3 px-4 text-right">Debit Balance (₹)</th>
            <th className="py-3 px-4 text-right">Credit Balance (₹)</th>
          </tr>
        </thead>
        <tbody>
          {reportData.rows?.map((row, idx) => (
            <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50">
              <td className="py-3 px-4 font-medium text-neutral-900">{row.ledgerName}</td>
              <td className="py-3 px-4 text-neutral-500">{row.groupName}</td>
              <td className="py-3 px-4 text-right text-neutral-800">
                {row.debitAmount > 0 ? row.debitAmount.toFixed(2) : '-'}
              </td>
              <td className="py-3 px-4 text-right text-neutral-800">
                {row.creditAmount > 0 ? row.creditAmount.toFixed(2) : '-'}
              </td>
            </tr>
          ))}
          <tr className="bg-neutral-100 font-bold border-t-2 border-neutral-300">
            <td className="py-4 px-4" colSpan={2}>Grand Total</td>
            <td className="py-4 px-4 text-right text-neutral-900">₹{reportData.totalDebit?.toFixed(2)}</td>
            <td className="py-4 px-4 text-right text-neutral-900">₹{reportData.totalCredit?.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
