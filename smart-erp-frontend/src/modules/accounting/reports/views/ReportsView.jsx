import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Download, Printer, Search, Calendar, Filter, 
  Scale, TrendingUp, Layers, DollarSign, Package, FileText, Percent 
} from 'lucide-react';
import { 
  fetchTrialBalance, fetchProfitLoss, fetchBalanceSheet, fetchCashBankBook,
  fetchOutstanding, fetchInventoryValuation, fetchStockRegister, fetchGstSummary,
  fetchLedgersList
} from '../services/accounting.service';
import axiosClient from '@shared/api/axios-client';
import { useNavigate } from 'react-router-dom';

export default function ReportsView() {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');
  
  // Filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedLedgerId, setSelectedLedgerId] = useState('');
  const [ledgers, setLedgers] = useState([]);
  const [partnerType, setPartnerType] = useState('CUSTOMER');

  // Load ledgers for Cash/Bank Book dropdown
  useEffect(() => {
    if (selectedReport === 'cash-bank') {
      const loadLedgers = async () => {
        try {
          const res = await fetchLedgersList();
          if (res.success) {
            const list = res.data.content || res.data || [];
            setLedgers(list);
            if (list.length > 0) setSelectedLedgerId(list[0].id);
          }
        } catch (err) {
          console.error('Failed to load ledgers', err);
        }
      };
      loadLedgers();
    }
  }, [selectedReport]);

  const loadReportData = async () => {
    setLoading(true);
    setError('');
    setReportData(null);
    try {
      let res;
      const params = { startDate, endDate };

      switch (selectedReport) {
        case 'trial-balance':
          res = await fetchTrialBalance();
          break;
        case 'profit-loss':
          res = await fetchProfitLoss(params);
          break;
        case 'balance-sheet':
          res = await fetchBalanceSheet({ date: endDate });
          break;
        case 'cash-bank':
          if (!selectedLedgerId) {
            setError('Please select a ledger.');
            setLoading(false);
            return;
          }
          res = await fetchCashBankBook({ ledgerId: selectedLedgerId, startDate, endDate });
          break;
        case 'outstanding':
          res = await fetchOutstanding({ partnerType });
          break;
        case 'inventory-valuation':
          res = await fetchInventoryValuation();
          break;
        case 'stock-register':
          res = await fetchStockRegister(params);
          break;
        case 'gst-summary':
          res = await fetchGstSummary(params);
          break;
        default:
          break;
      }
      if (res && res.success) {
        setReportData(res.data);
      } else {
        setError('Failed to fetch report data.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred while loading report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedReport) {
      loadReportData();
    }
  }, [selectedReport, selectedLedgerId, partnerType]);

  const handleExportCsv = async () => {
    if (!selectedReport) return;
    try {
      const reportKey = selectedReport === 'cash-bank' ? 'cash-bank-book' : selectedReport;
      const response = await axiosClient.get(`/reports/${reportKey}/csv`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedReport}_report.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to export CSV', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const reportsList = [
    { key: 'trial-balance', title: 'Trial Balance', desc: 'Summary of all debit & credit ledger accounts.', icon: <Scale className="text-primary w-6 h-6" /> },
    { key: 'profit-loss', title: 'Profit & Loss Statement', desc: 'Income, operating expense, and net profit statement.', icon: <TrendingUp className="text-emerald-500 w-6 h-6" /> },
    { key: 'balance-sheet', title: 'Balance Sheet', desc: 'Statement of assets, liabilities, and equity capital.', icon: <Layers className="text-blue-500 w-6 h-6" /> },
    { key: 'cash-bank', title: 'Cash & Bank Book', desc: 'Ledger transactions affecting cash and bank accounts.', icon: <DollarSign className="text-amber-500 w-6 h-6" /> },
    { key: 'outstanding', title: 'Outstanding Statement', desc: 'Outstanding balances from customers or suppliers.', icon: <FileText className="text-purple-500 w-6 h-6" /> },
    { key: 'inventory-valuation', title: 'Inventory Valuation', desc: 'Value of current inventory holding based on average cost.', icon: <Package className="text-indigo-500 w-6 h-6" /> },
    { key: 'stock-register', title: 'Stock Register', desc: 'Detailed inwards, outwards, and closing stock logs.', icon: <Package className="text-orange-500 w-6 h-6" /> },
    { key: 'gst-summary', title: 'GST Summary Statement', desc: 'Summary of input tax credit offsets and output tax payables.', icon: <Percent className="text-rose-500 w-6 h-6" /> },
  ];

  if (!selectedReport) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Financial Reports & Statements</h1>
          <p className="text-neutral-500 mt-2">Generate, view, print, and export live corporate accounting and inventory reports.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportsList.map((rep) => (
            <div 
              key={rep.key}
              onClick={() => setSelectedReport(rep.key)}
              className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-md cursor-pointer transition duration-200 hover:border-neutral-300 flex flex-col justify-between"
            >
              <div>
                <div className="p-3 bg-neutral-50 rounded-lg w-fit mb-4">
                  {rep.icon}
                </div>
                <h3 className="text-lg font-semibold text-neutral-800">{rep.title}</h3>
                <p className="text-sm text-neutral-500 mt-2">{rep.desc}</p>
              </div>
              <div className="mt-4 text-xs font-semibold text-primary flex items-center gap-1">
                Generate Statement &rarr;
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentReport = reportsList.find(r => r.key === selectedReport);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setSelectedReport(null); setReportData(null); }}
            className="p-2 hover:bg-neutral-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{currentReport.title}</h1>
            <p className="text-sm text-neutral-500">{currentReport.desc}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-neutral-50 transition shadow-sm"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
          <button 
            onClick={handleExportCsv}
            className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-neutral-50 transition shadow-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter controls */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 mb-6 shadow-sm flex flex-wrap gap-4 items-end">
        {selectedReport === 'cash-bank' && (
          <div className="flex flex-col gap-1.5 w-64">
            <label className="text-xs font-semibold text-neutral-700">Select Cash/Bank Account</label>
            <select 
              value={selectedLedgerId}
              onChange={(e) => setSelectedLedgerId(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg bg-white text-sm"
            >
              {ledgers.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
        )}

        {selectedReport === 'outstanding' && (
          <div className="flex flex-col gap-1.5 w-48">
            <label className="text-xs font-semibold text-neutral-700">Partner Type</label>
            <select 
              value={partnerType}
              onChange={(e) => setPartnerType(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg bg-white text-sm"
            >
              <option value="CUSTOMER">Customer Outstandings</option>
              <option value="SUPPLIER">Supplier Outstandings</option>
            </select>
          </div>
        )}

        {['profit-loss', 'balance-sheet', 'cash-bank', 'stock-register', 'gst-summary'].includes(selectedReport) && (
          <>
            <div className="flex flex-col gap-1.5 w-44">
              <label className="text-xs font-semibold text-neutral-700">From Date</label>
              <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-neutral-300 rounded-lg text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5 w-44">
              <label className="text-xs font-semibold text-neutral-700">To Date</label>
              <input 
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-neutral-300 rounded-lg text-sm"
              />
            </div>
          </>
        )}

        <button 
          onClick={loadReportData}
          className="px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-sm transition"
        >
          <Filter className="w-4 h-4" /> Filter / Refresh
        </button>
      </div>

      {/* Report view pane */}
      <div id="print-area" className="bg-white border border-neutral-200 rounded-xl p-8 shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 border-4 border-neutral-200 border-t-neutral-800 rounded-full animate-spin"></div>
            <p className="text-sm text-neutral-500 font-medium">Generating financial statement...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        ) : !reportData ? (
          <div className="text-center text-neutral-500 py-16 text-sm">
            No data generated. Adjust filters and try again.
          </div>
        ) : (
          <div>
            {/* Trial Balance Table */}
            {selectedReport === 'trial-balance' && (
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
            )}

            {/* Profit & Loss Table */}
            {selectedReport === 'profit-loss' && (
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
            )}

            {/* Balance Sheet Table */}
            {selectedReport === 'balance-sheet' && (
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
            )}

            {/* Cash/Bank Book Table */}
            {selectedReport === 'cash-bank' && (
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
            )}

            {/* Outstanding Statements Table */}
            {selectedReport === 'outstanding' && (
              <div>
                <div className="mb-6 pb-4 border-b border-neutral-100 flex justify-between items-end">
                  <h2 className="text-xl font-bold text-neutral-900">{partnerType} Ledger Outstandings</h2>
                  <span className="text-xs text-neutral-400">Total: ₹{reportData.totalOutstanding?.toFixed(2)}</span>
                </div>
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-600 font-semibold bg-neutral-50">
                      <th className="py-3 px-4">Partner Name</th>
                      <th className="py-3 px-4">Contact Info</th>
                      <th className="py-3 px-4 text-right">Outstanding Balance (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.rows?.map((row, idx) => (
                      <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-3 px-4 font-medium text-neutral-900">{row.partnerName}</td>
                        <td className="py-3 px-4 text-neutral-500 text-xs">
                          <div>Phone: {row.phone}</div>
                          <div>Email: {row.email}</div>
                        </td>
                        <td className="py-3 px-4 text-right text-rose-600 font-bold">₹{row.outstandingAmount?.toFixed(2)}</td>
                      </tr>
                    ))}
                    {(!reportData.rows || reportData.rows.length === 0) && (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-neutral-400 text-xs">No outstanding balances found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Inventory Valuation Table */}
            {selectedReport === 'inventory-valuation' && (
              <div>
                <div className="mb-6 pb-4 border-b border-neutral-100 flex justify-between items-end">
                  <h2 className="text-xl font-bold text-neutral-900">Stock Assets Valuation</h2>
                  <span className="text-xs text-neutral-400">Total Inventory Asset: ₹{reportData.totalValue?.toFixed(2)}</span>
                </div>
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-600 font-semibold bg-neutral-50">
                      <th className="py-3 px-4">Item Details</th>
                      <th className="py-3 px-4">SKU / Code</th>
                      <th className="py-3 px-4 text-right">On Hand Stock</th>
                      <th className="py-3 px-4 text-right">Average Cost (₹)</th>
                      <th className="py-3 px-4 text-right">Net Value (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.rows?.map((row, idx) => (
                      <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-3 px-4 font-medium text-neutral-900">{row.name}</td>
                        <td className="py-3 px-4 text-neutral-500 font-mono text-xs">{row.sku}</td>
                        <td className="py-3 px-4 text-right font-medium text-neutral-800">{row.currentStock}</td>
                        <td className="py-3 px-4 text-right text-neutral-700">₹{row.averageCost?.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right text-neutral-950 font-bold">₹{row.valuation?.toFixed(2)}</td>
                      </tr>
                    ))}
                    {(!reportData.rows || reportData.rows.length === 0) && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-neutral-400 text-xs">No active stock items onboarded.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Stock Register Table */}
            {selectedReport === 'stock-register' && (
              <div>
                <div className="mb-6 pb-4 border-b border-neutral-100 flex justify-between items-end">
                  <h2 className="text-xl font-bold text-neutral-900">Inventory Stock Register</h2>
                  <span className="text-xs text-neutral-400">Live Item Movement Logs</span>
                </div>
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-600 font-semibold bg-neutral-50">
                      <th className="py-3 px-4">Item Name</th>
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4 text-right">Opening Qty</th>
                      <th className="py-3 px-4 text-right">Total Inwards</th>
                      <th className="py-3 px-4 text-right">Total Outwards</th>
                      <th className="py-3 px-4 text-right font-bold text-neutral-900">Closing Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.rows?.map((row, idx) => (
                      <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-3 px-4 font-medium text-neutral-900">{row.name}</td>
                        <td className="py-3 px-4 text-neutral-500 font-mono text-xs">{row.sku}</td>
                        <td className="py-3 px-4 text-right">{row.openingQuantity}</td>
                        <td className="py-3 px-4 text-right text-emerald-600 font-medium">+{row.inwardQuantity}</td>
                        <td className="py-3 px-4 text-right text-rose-600 font-medium">-{row.outwardQuantity}</td>
                        <td className="py-3 px-4 text-right font-bold text-neutral-950">{row.closingQuantity}</td>
                      </tr>
                    ))}
                    {(!reportData.rows || reportData.rows.length === 0) && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-neutral-400 text-xs">No item movement recorded.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* GST Summary Table */}
            {selectedReport === 'gst-summary' && (
              <div>
                <div className="mb-6 pb-4 border-b border-neutral-100 flex justify-between items-end">
                  <h2 className="text-xl font-bold text-neutral-900">GST Duty Tax Summary</h2>
                  <span className="text-xs text-neutral-400">Offset Account Statement</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Inputs */}
                  <div>
                    <h3 className="font-bold text-emerald-600 border-b pb-2 mb-3 bg-emerald-50 p-2 rounded">
                      Input Tax Credit (ITC)
                    </h3>
                    <ul className="divide-y divide-neutral-100 text-sm">
                      <li className="py-2.5 flex justify-between">
                        <span>CGST Input Tax</span>
                        <span className="font-medium text-neutral-900">₹{reportData.inputCgst?.toFixed(2)}</span>
                      </li>
                      <li className="py-2.5 flex justify-between">
                        <span>SGST Input Tax</span>
                        <span className="font-medium text-neutral-900">₹{reportData.inputSgst?.toFixed(2)}</span>
                      </li>
                      <li className="py-2.5 flex justify-between">
                        <span>IGST Input Tax</span>
                        <span className="font-medium text-neutral-900">₹{reportData.inputIgst?.toFixed(2)}</span>
                      </li>
                      <li className="py-3 flex justify-between font-bold border-t border-neutral-200">
                        <span>Total Input Credit</span>
                        <span>₹{reportData.totalInputTax?.toFixed(2)}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Outputs */}
                  <div>
                    <h3 className="font-bold text-rose-600 border-b pb-2 mb-3 bg-rose-50 p-2 rounded">
                      Output Tax Liability
                    </h3>
                    <ul className="divide-y divide-neutral-100 text-sm">
                      <li className="py-2.5 flex justify-between">
                        <span>CGST Output Tax</span>
                        <span className="font-medium text-neutral-900">₹{reportData.outputCgst?.toFixed(2)}</span>
                      </li>
                      <li className="py-2.5 flex justify-between">
                        <span>SGST Output Tax</span>
                        <span className="font-medium text-neutral-900">₹{reportData.outputSgst?.toFixed(2)}</span>
                      </li>
                      <li className="py-2.5 flex justify-between">
                        <span>IGST Output Tax</span>
                        <span className="font-medium text-neutral-900">₹{reportData.outputIgst?.toFixed(2)}</span>
                      </li>
                      <li className="py-3 flex justify-between font-bold border-t border-neutral-200">
                        <span>Total Output Liability</span>
                        <span>₹{reportData.totalOutputTax?.toFixed(2)}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 border-t border-neutral-200 pt-6 flex flex-col items-end gap-2 text-right">
                  <div className="text-sm text-neutral-500 font-semibold">
                    Net GST Payable Result:
                  </div>
                  <div className="text-xl font-bold bg-neutral-100 p-4 rounded-xl border border-neutral-200 mt-2">
                    {reportData.netTotalPayable >= 0 ? 'Tax Payable: ' : 'Net Credit Carryforward: '}
                    <span className={reportData.netTotalPayable >= 0 ? "text-rose-600" : "text-emerald-600"}>
                      ₹{Math.abs(reportData.netTotalPayable)?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
