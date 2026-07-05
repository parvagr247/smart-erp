import React, { useState, useEffect } from 'react';
import axiosClient from '@shared/api/axios-client';
import { X, Calendar, ArrowUpRight, ArrowDownLeft, RefreshCw, FileText } from 'lucide-react';

export default function StockLedgerModal({ isOpen, onClose, item }) {
  const [loading, setLoading] = useState(false);
  const [ledger, setLedger] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && item?.id) {
      fetchLedger();
    }
  }, [isOpen, item]);

  const fetchLedger = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosClient.get(`/inventory/transactions/item/${item.id}`);
      if (response.data?.success) {
        setLedger(response.data.data || []);
      } else {
        setError('Failed to load transaction history.');
      }
    } catch (err) {
      setError('Failed to fetch ledger from server.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <div className="text-left">
            <h3 className="font-heading font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <FileText className="text-indigo-500" size={18} />
              Stock Item Ledger: {item.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              SKU: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{item.sku}</span> | 
              Code: <span className="font-mono text-slate-700 dark:text-slate-300">{item.code}</span>
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center text-slate-400 animate-pulse flex flex-col items-center justify-center gap-3">
              <RefreshCw size={24} className="animate-spin text-indigo-500" />
              <span>Fetching ledger data from server...</span>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-rose-500 text-sm bg-rose-500/10 border border-rose-500/20 rounded-xl">
              {error}
            </div>
          ) : ledger.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No transactions or movements recorded for this stock item.
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Voucher / Ref</th>
                    <th className="py-3 px-4">Warehouse</th>
                    <th className="py-3 px-4 text-right">Quantity</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                  {ledger.map((tx) => {
                    const isQtyPositive = parseFloat(tx.quantity) > 0;
                    const isTransfer = tx.transactionType.includes('TRANSFER');

                    let typeBg = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
                    let typeIcon = <ArrowUpRight size={12} />;
                    if (isTransfer) {
                      typeBg = 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
                      typeIcon = <RefreshCw size={12} />;
                    } else if (!isQtyPositive) {
                      typeBg = 'bg-rose-500/10 text-rose-600 dark:text-rose-400';
                      typeIcon = <ArrowDownLeft size={12} />;
                    }

                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-3 px-4 whitespace-nowrap text-slate-500 flex items-center gap-1.5">
                          <Calendar size={12} className="text-slate-400" />
                          {new Date(tx.transactionDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${typeBg}`}>
                            {typeIcon}
                            {tx.transactionType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-mono font-bold text-slate-800 dark:text-slate-200">
                          {tx.referenceNumber}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{tx.warehouseName}</span>
                          {tx.targetWarehouseName && (
                            <span className="text-[10px] text-slate-400 block font-normal mt-0.5">
                              → to {tx.targetWarehouseName}
                            </span>
                          )}
                        </td>
                        <td className={`py-3 px-4 text-right font-mono font-bold whitespace-nowrap ${isQtyPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isQtyPositive ? '+' : ''}{tx.quantity} {item.primaryUnitCode}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                          {tx.performedBy || 'System'}
                        </td>
                        <td className="py-3 px-4 text-slate-500 max-w-[200px] truncate" title={tx.notes}>
                          {tx.notes || '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl cursor-pointer transition-colors"
          >
            Close Ledger
          </button>
        </div>

      </div>
    </div>
  );
}
