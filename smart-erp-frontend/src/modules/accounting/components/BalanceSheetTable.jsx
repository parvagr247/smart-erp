import React from 'react';
import './styles/BalanceSheetTable.css';

export default function BalanceSheetTable({ reportData }) {
  const assetsTotal = reportData.totalAssets || 0;
  const equityTotal = reportData.totalLiabilitiesAndEquity || 0;

  return (
    <div>
      <div className="bs-header-panel">
        <h2 className="bs-title">Corporate Balance Sheet</h2>
        <span className="bs-subtitle">Statement of Financial Position</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="bs-section-title"><span>Capital Assets</span><span>₹{assetsTotal.toFixed(2)}</span></h3>
          <ul className="bs-ul">
            {reportData.assetRows?.map((row, idx) => (
              <li key={idx} className="bs-li"><span>{row.name}</span><span className="bs-value">₹{row.amount?.toFixed(2)}</span></li>
            ))}
            {(!reportData.assetRows || reportData.assetRows.length === 0) && <li className="bs-empty">No asset postings found.</li>}
          </ul>
        </div>
        <div>
          <h3 className="bs-section-title"><span>Liabilities & Equity</span></h3>
          <ul className="bs-ul">
            {reportData.liabilityRows?.map((row, idx) => (
              <li key={idx} className="bs-li"><span>{row.name}</span><span className="bs-value">₹{row.amount?.toFixed(2)}</span></li>
            ))}
            <li className="bs-li-retained"><span>Retained Net Profit / Reserves</span><span>₹{reportData.netProfit?.toFixed(2)}</span></li>
            <li className="bs-li-total"><span>Total Liabilities & Equity</span><span>₹{equityTotal.toFixed(2)}</span></li>
          </ul>
        </div>
      </div>
      <div className="bs-balance-banner">
        <div className="flex items-center gap-2"><span className="bs-indicator"></span><span>Balanced equation: Assets (₹{assetsTotal.toFixed(2)})</span></div>
        <span>= Liabilities + Equity (₹{equityTotal.toFixed(2)})</span>
      </div>
    </div>
  );
}
