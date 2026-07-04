import React from 'react';
import './styles/CashBankTable.css';

export default function CashBankTable({ reportData, navigate }) {
  return (
    <div>
      <div className="mb-6 pb-4 border-b border-neutral-100 flex justify-between items-end">
        <h2 className="text-xl font-bold text-neutral-900">Cash / Bank Ledger Statement</h2>
        <span className="text-xs text-neutral-400">Account: {reportData.ledgerName}</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-neutral-50 border p-4 rounded-xl">
          <div className="text-xs text-neutral-500 font-semibold">Opening Balance</div>
          <div className="text-lg font-bold text-neutral-800 mt-1">₹{reportData.openingBalance?.toFixed(2)}</div>
        </div>
        <div className="bg-neutral-50 border p-4 rounded-xl">
          <div className="text-xs text-neutral-500 font-semibold">Closing Balance</div>
          <div className="text-lg font-bold text-neutral-800 mt-1">₹{reportData.closingBalance?.toFixed(2)}</div>
        </div>
      </div>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-neutral-600 font-semibold bg-neutral-50">
            <th className="py-3 px-4">Date</th>
            <th className="py-3 px-4">Transaction / Voucher</th>
            <th className="py-3 px-4">Particulars (Opposite Acc)</th>
            <th className="py-3 px-4 text-right">Debit (₹)</th>
            <th className="py-3 px-4 text-right">Credit (₹)</th>
          </tr>
        </thead>
        <tbody>
          {reportData.lines?.map((line, idx) => (
            <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50">
              <td className="py-3 px-4">{line.date}</td>
              <td 
                onClick={() => navigate(`/accounting/vouchers/${line.transactionId}`)}
                className="py-3 px-4 font-mono text-xs text-indigo-600 hover:underline cursor-pointer"
              >
                {line.voucherNumber}
              </td>
              <td className="py-3 px-4">
                <div className="font-semibold text-neutral-950">{line.oppositeLedgerName}</div>
                <div className="text-xs text-neutral-400 mt-0.5">{line.narration}</div>
              </td>
              <td className="py-3 px-4 text-right text-emerald-600 font-medium">
                {line.debitAmount > 0 ? `+₹${line.debitAmount.toFixed(2)}` : '-'}
              </td>
              <td className="py-3 px-4 text-right text-rose-600 font-medium">
                {line.creditAmount > 0 ? `-₹${line.creditAmount.toFixed(2)}` : '-'}
              </td>
            </tr>
          ))}
          {(!reportData.lines || reportData.lines.length === 0) && (
            <tr>
              <td colSpan={5} className="py-8 text-center text-neutral-400 text-xs">
                No transactions found for the filtered date range.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
