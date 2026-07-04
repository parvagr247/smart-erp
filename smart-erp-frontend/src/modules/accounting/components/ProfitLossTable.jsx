import React from 'react';
import './styles/ProfitLossTable.css';

export default function ProfitLossTable({ reportData }) {
  return (
    <div>
      <div className="mb-6 pb-4 border-b border-neutral-100 flex justify-between items-end">
        <h2 className="text-xl font-bold text-neutral-900">Profit & Loss Account</h2>
        <span className="text-xs text-neutral-400">Statement of Revenue & Cost</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Revenue / Income */}
        <div>
          <h3 className="font-bold text-neutral-800 border-b pb-2 mb-3 flex justify-between bg-neutral-50 p-2 rounded">
            <span>1. Revenue / Income</span>
            <span>₹{reportData.totalIncome?.toFixed(2)}</span>
          </h3>
          <ul className="divide-y divide-neutral-100 text-sm">
            {reportData.incomeRows?.map((row, idx) => (
              <li key={idx} className="py-2.5 flex justify-between text-neutral-700">
                <span>{row.name}</span>
                <span className="font-medium text-neutral-950">₹{row.amount?.toFixed(2)}</span>
              </li>
            ))}
            {(!reportData.incomeRows || reportData.incomeRows.length === 0) && (
              <li className="py-4 text-center text-neutral-400 text-xs">No income entries found.</li>
            )}
          </ul>
        </div>

        {/* Expenses */}
        <div>
          <h3 className="font-bold text-neutral-800 border-b pb-2 mb-3 flex justify-between bg-neutral-50 p-2 rounded">
            <span>2. Operating Expenses</span>
            <span>₹{reportData.totalExpense?.toFixed(2)}</span>
          </h3>
          <ul className="divide-y divide-neutral-100 text-sm">
            {reportData.expenseRows?.map((row, idx) => (
              <li key={idx} className="py-2.5 flex justify-between text-neutral-700">
                <span>{row.name}</span>
                <span className="font-medium text-neutral-950">₹{row.amount?.toFixed(2)}</span>
              </li>
            ))}
            {(!reportData.expenseRows || reportData.expenseRows.length === 0) && (
              <li className="py-4 text-center text-neutral-400 text-xs">No expense entries found.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-8 border-t-2 border-neutral-300 pt-6 flex flex-col items-end gap-2 text-right">
        <div className="text-sm font-semibold text-neutral-500">Gross Margin Valuation: <span className="text-neutral-800">₹{reportData.grossProfit?.toFixed(2)}</span></div>
        <div className="text-xl font-bold bg-neutral-100 p-4 rounded-xl border border-neutral-200 mt-2">
          Net P&L Result: <span className={reportData.netProfit >= 0 ? "text-emerald-600" : "text-rose-600"}>
            {reportData.netProfit >= 0 ? '+' : ''}₹{reportData.netProfit?.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
