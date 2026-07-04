import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '@shared/api/axios-client';
import { 
  fetchTrialBalance, fetchProfitLoss, fetchBalanceSheet, fetchCashBankBook,
  fetchOutstanding, fetchInventoryValuation, fetchStockRegister, fetchGstSummary,
  fetchLedgersList
} from '@modules/accounting/accounting.service';

export const reportsList = [
  { key: 'trial-balance', title: 'Trial Balance', desc: 'Summary of all debit & credit ledger accounts.', iconType: 'trial-balance' },
  { key: 'profit-loss', title: 'Profit & Loss Statement', desc: 'Income, operating expense, and net profit statement.', iconType: 'profit-loss' },
  { key: 'balance-sheet', title: 'Balance Sheet', desc: 'Statement of assets, liabilities, and equity capital.', iconType: 'balance-sheet' },
  { key: 'cash-bank', title: 'Cash & Bank Book', desc: 'Ledger transactions affecting cash and bank accounts.', iconType: 'cash-bank' },
  { key: 'outstanding', title: 'Outstanding Statement', desc: 'Outstanding balances from customers or suppliers.', iconType: 'outstanding' },
  { key: 'inventory-valuation', title: 'Inventory Valuation', desc: 'Value of current inventory holding based on average cost.', iconType: 'inventory-valuation' },
  { key: 'stock-register', title: 'Stock Register', desc: 'Detailed inwards, outwards, and closing stock logs.', iconType: 'stock-register' },
  { key: 'gst-summary', title: 'GST Summary Statement', desc: 'Summary of input tax credit offsets and output tax payables.', iconType: 'gst-summary' },
];

export function useReportsViewData() {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedLedgerId, setSelectedLedgerId] = useState('');
  const [ledgers, setLedgers] = useState([]);
  const [partnerType, setPartnerType] = useState('CUSTOMER');

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

  return {
    navigate,
    selectedReport,
    setSelectedReport,
    loading,
    reportData,
    setReportData,
    error,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedLedgerId,
    setSelectedLedgerId,
    ledgers,
    partnerType,
    setPartnerType,
    loadReportData,
    handleExportCsv,
    handlePrint
  };
}

