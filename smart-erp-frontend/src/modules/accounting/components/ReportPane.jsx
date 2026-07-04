import React from 'react';
import TrialBalanceTable from './TrialBalanceTable';
import ProfitLossTable from './ProfitLossTable';
import BalanceSheetTable from './BalanceSheetTable';
import CashBankTable from './CashBankTable';
import OutstandingTable from './OutstandingTable';
import InventoryValuationTable from './InventoryValuationTable';
import StockRegisterTable from './StockRegisterTable';
import GstSummaryTable from './GstSummaryTable';
import './styles/ReportPane.css';

export default function ReportPane({ selectedReport, loading, error, reportData, partnerType, navigate }) {
  return (
    <div id="print-area" className="report-print-pane">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-10 h-10 border-4 border-neutral-200 border-t-neutral-800 rounded-full animate-spin"></div>
          <p className="text-sm text-neutral-500 font-medium">Generating statement...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-200">{error}</div>
      ) : !reportData ? (
        <div className="text-center text-neutral-500 py-16 text-sm">No data generated. Adjust filters and try again.</div>
      ) : (
        <div>
          {selectedReport === 'trial-balance' && <TrialBalanceTable reportData={reportData} />}
          {selectedReport === 'profit-loss' && <ProfitLossTable reportData={reportData} />}
          {selectedReport === 'balance-sheet' && <BalanceSheetTable reportData={reportData} />}
          {selectedReport === 'cash-bank' && <CashBankTable reportData={reportData} navigate={navigate} />}
          {selectedReport === 'outstanding' && <OutstandingTable reportData={reportData} partnerType={partnerType} />}
          {selectedReport === 'inventory-valuation' && <InventoryValuationTable reportData={reportData} />}
          {selectedReport === 'stock-register' && <StockRegisterTable reportData={reportData} />}
          {selectedReport === 'gst-summary' && <GstSummaryTable reportData={reportData} />}
        </div>
      )}
    </div>
  );
}
