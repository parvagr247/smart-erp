import React from 'react';
import './styles/BalanceSheetTable.css';

export default function BalanceSheetTable({ reportData }) {
  return (
    <div>
      <div className="mb-6 pb-4 border-b border-neutral-100 flex justify-between items-end">
        <h2 className="text-xl font-bold text-neutral-900">Corporate Balance Sheet</h2>
        <span className="text-xs text-neutral-400">Statement of Financial Position</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Assets */}
        <div>
          <h3 className="font-bold text-neutral-800 border-b pb-2 mb-3 flex justify-between bg-neutral-50 p-2 rounded">
            <span>Capital Assets</span>
            <span>₹{reportData.totalAssets?.toFixed(2)}</span>
          </h3>
          <ul className="divide-y divide-neutral-100 text-sm">
            {reportData.assetRows?.map((row, idx) => (
              <li key={idx} className="py-2.5 flex justify-between text-neutral-700">
                <span>{row.name}</span>
                <span className="font-medium text-neutral-950">₹{row.amount?.toFixed(2)}</span>
              </li>
            ))}
            {(!reportData.assetRows || reportData.assetRows.length === 0) && (
              <li className="py-4 text-center text-neutral-400 text-xs">No asset postings found.</li>
            )}
          </ul>
        </div>

        {/* Liabilities & Equity */}
        <div>
          <h3 className="font-bold text-neutral-800 border-b pb-2 mb-3 bg-neutral-50 p-2 rounded">
            Liabilities & Capital Reserve
          </h3>
          <ul className="divide-y divide-neutral-100 text-sm">
            {reportData.liabilityRows?.map((row, idx) => (
              <li key={idx} className="py-2.5 flex justify-between text-neutral-700">
                <span>{row.name}</span>
                <span className="font-medium text-neutral-950">₹{row.amount?.toFixed(2)}</span>
              </li>
            ))}
            <li className="py-2.5 flex justify-between text-emerald-600 font-semibold bg-emerald-50 px-2 rounded mt-1">
              <span>Retained Net Profit / Reserves</span>
              <span>₹{reportData.netProfit?.toFixed(2)}</span>
            </li>
            <li className="py-4 flex justify-between font-bold text-neutral-950 border-t border-neutral-300">
              <span>Total Liabilities & Equity</span>
              <span>₹{reportData.totalLiabilitiesAndEquity?.toFixed(2)}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-6 flex justify-between items-center text-sm font-bold bg-neutral-50 p-4 rounded-xl border border-neutral-200">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
          <span>Accounting Balanced equation: Assets (₹{reportData.totalAssets?.toFixed(2)})</span>
        </div>
        <span>= Liabilities + Equity (₹{reportData.totalLiabilitiesAndEquity?.toFixed(2)})</span>
      </div>
    </div>
  );
}
