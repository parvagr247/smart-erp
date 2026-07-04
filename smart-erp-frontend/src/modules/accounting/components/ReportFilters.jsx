import React from 'react';
import { Filter } from 'lucide-react';
import './styles/ReportFilters.css';

export default function ReportFilters({
  selectedReport, selectedLedgerId, setSelectedLedgerId, ledgers,
  partnerType, setPartnerType, startDate, setStartDate, endDate, setEndDate, onLoad
}) {
  return (
    <div className="report-filter-bar">
      {selectedReport === 'cash-bank' && (
        <div className="report-filter-group w-64 text-left">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Select Cash/Bank Account</label>
          <select value={selectedLedgerId} onChange={e => setSelectedLedgerId(e.target.value)} className="report-filter-select">
            {ledgers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>
      )}
      {selectedReport === 'outstanding' && (
        <div className="report-filter-group w-48 text-left">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Partner Type</label>
          <select value={partnerType} onChange={e => setPartnerType(e.target.value)} className="report-filter-select">
            <option value="CUSTOMER">Customer Outstandings</option>
            <option value="SUPPLIER">Supplier Outstandings</option>
          </select>
        </div>
      )}
      {['profit-loss', 'balance-sheet', 'cash-bank', 'stock-register', 'gst-summary'].includes(selectedReport) && (
        <>
          <div className="report-filter-group w-44 text-left">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">From Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="report-filter-input" />
          </div>
          <div className="report-filter-group w-44 text-left">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">To Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="report-filter-input" />
          </div>
        </>
      )}
      <button onClick={onLoad} className="report-btn-primary"><Filter className="w-4 h-4" /> Filter / Refresh</button>
    </div>
  );
}
