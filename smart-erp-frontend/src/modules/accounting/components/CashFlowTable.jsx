import React from 'react';

export default function CashFlowTable({ reportData }) {
  const renderRows = (title, rows, total) => (
    <div className="mb-6">
      <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 border-b border-[var(--border-color)] pb-1">{title}</h3>
      <table className="w-full text-xs">
        <tbody>
          {rows && rows.length > 0 ? (
            rows.map((row, idx) => (
              <tr key={idx} className="border-b border-[var(--border-color)]/30">
                <td className="py-2 text-neutral-800 dark:text-neutral-200">{row.name}</td>
                <td className={`py-2 text-right font-medium ${row.amount >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                  ₹{row.amount.toFixed(2)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="py-2 text-neutral-400 italic">No transactions under this activity.</td>
            </tr>
          )}
          <tr className="font-bold text-neutral-900 dark:text-neutral-100 bg-neutral-50/50 dark:bg-neutral-950/20">
            <td className="py-2 px-2">Net {title}</td>
            <td className={`py-2 px-2 text-right ${total >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              ₹{total?.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-light)] shadow-xs text-left max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-base font-bold text-[var(--text-primary)] tracking-wide">Cash Flow Statement</h2>
        <span className="text-xs text-[var(--text-muted)]">Operating, Investing, and Financing Cash Logs</span>
      </div>
      
      {renderRows('Operating Activities', reportData.operatingRows, reportData.totalOperating)}
      {renderRows('Investing Activities', reportData.investingRows, reportData.totalInvesting)}
      {renderRows('Financing Activities', reportData.financingRows, reportData.totalFinancing)}

      <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg mt-6 space-y-2 border border-[var(--border-color)] text-xs">
        <div className="flex justify-between font-semibold">
          <span>Net Increase/Decrease in Cash & Cash Equivalents:</span>
          <span className={reportData.netIncrease >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
            ₹{reportData.netIncrease?.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
          <span>Cash & Cash Equivalents at Beginning of Period:</span>
          <span>₹{reportData.openingCash?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-sm text-neutral-900 dark:text-neutral-100 border-t border-[var(--border-color)] pt-2 mt-2">
          <span>Cash & Cash Equivalents at End of Period:</span>
          <span>₹{reportData.closingCash?.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
