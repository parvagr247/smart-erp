import React from 'react';

export default function DayBookTable({ reportData }) {
  return (
    <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-light)] shadow-xs text-left max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-base font-bold text-[var(--text-primary)] tracking-wide">Day Book Journal</h2>
        <span className="text-xs text-[var(--text-muted)]">Daily Double Entry Voucher Log</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[var(--border-color)] text-neutral-500 font-semibold uppercase">
              <th className="py-2.5 px-2">Voucher No</th>
              <th className="py-2.5 px-2">Voucher Type</th>
              <th className="py-2.5 px-2">Ledger Name</th>
              <th className="py-2.5 px-2 text-right">Debit (₹)</th>
              <th className="py-2.5 px-2 text-right">Credit (₹)</th>
              <th className="py-2.5 px-2">Narration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {reportData.rows && reportData.rows.length > 0 ? (
              reportData.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                  <td className="py-2 px-2 font-mono font-medium text-neutral-700 dark:text-neutral-300">{row.voucherNumber}</td>
                  <td className="py-2 px-2 text-neutral-500">{row.voucherType}</td>
                  <td className="py-2 px-2 text-neutral-900 dark:text-neutral-100 font-medium">{row.ledgerName}</td>
                  <td className="py-2 px-2 text-right font-medium text-emerald-600 dark:text-emerald-400">
                    {row.debitAmount > 0 ? `₹${row.debitAmount.toFixed(2)}` : '-'}
                  </td>
                  <td className="py-2 px-2 text-right font-medium text-indigo-600 dark:text-indigo-400">
                    {row.creditAmount > 0 ? `₹${row.creditAmount.toFixed(2)}` : '-'}
                  </td>
                  <td className="py-2 px-2 text-neutral-500 italic max-w-xs truncate" title={row.narration}>{row.narration || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-neutral-500">No journal lines found for this date.</td>
              </tr>
            )}
          </tbody>
          {reportData.rows && reportData.rows.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-[var(--border-color)] font-bold text-neutral-900 dark:text-neutral-100">
                <td colSpan="3" className="py-3 px-2 text-right">Total:</td>
                <td className="py-3 px-2 text-right text-emerald-600 dark:text-emerald-400">₹{reportData.totalDebit?.toFixed(2)}</td>
                <td className="py-3 px-2 text-right text-indigo-600 dark:text-indigo-400">₹{reportData.totalCredit?.toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
