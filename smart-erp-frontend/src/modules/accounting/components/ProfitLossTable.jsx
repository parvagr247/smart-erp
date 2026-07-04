import React from 'react';
import ProfitLossSection from './ProfitLossSection';
import './styles/ProfitLossTable.css';

export default function ProfitLossTable({ reportData }) {
  return (
    <div>
      <div className="pl-header-panel">
        <h2 className="pl-title">Profit & Loss Account</h2>
        <span className="pl-subtitle">Statement of Revenue & Cost</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProfitLossSection title="1. Revenue / Income" rows={reportData.incomeRows} total={reportData.totalIncome} emptyText="No income entries found." />
        <ProfitLossSection title="2. Operating Expenses" rows={reportData.expenseRows} total={reportData.totalExpense} emptyText="No expense entries found." />
      </div>
      <div className="pl-results-panel">
        <div className="pl-margin-valuation">Gross Margin Valuation: <span className="pl-margin-value">₹{reportData.grossProfit?.toFixed(2)}</span></div>
        <div className="pl-net-result">
          Net P&L Result:{' '}
          <span className={reportData.netProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
            {reportData.netProfit >= 0 ? '+' : ''}₹{reportData.netProfit?.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
