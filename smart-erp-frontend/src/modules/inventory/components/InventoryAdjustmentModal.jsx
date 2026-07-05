import React, { useState, useEffect } from 'react';
import axiosClient from '@shared/api/axios-client';
import { X, Save, AlertCircle, RefreshCw } from 'lucide-react';

export default function InventoryAdjustmentModal({ isOpen, onClose, item, onSaveSuccess }) {
  const [type, setType] = useState('ADJUSTMENT'); // ADJUSTMENT, TRANSFER_OUT
  const [subType, setSubType] = useState('MANUAL_CORRECTION'); // DAMAGED, LOST, FOUND, MANUAL_CORRECTION
  const [warehouseId, setWarehouseId] = useState('');
  const [targetWarehouseId, setTargetWarehouseId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [rate, setRate] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [transactionDate, setTransactionDate] = useState(() => new Date().toISOString().substring(0, 10));
  
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchWarehouses();
      // Generate reference number
      const randStr = Math.random().toString(36).substring(2, 8).toUpperCase();
      setReferenceNumber(`ADJ-${new Date().getFullYear()}-${randStr}`);
      
      // Reset input fields
      setWarehouseId(item?.warehouseId || '');
      setTargetWarehouseId('');
      setQuantity('');
      setRate(item?.priceLists?.find(p => p.priceType === 'PURCHASE')?.price || '');
      setType('ADJUSTMENT');
      setSubType('MANUAL_CORRECTION');
      setNotes('');
      setError('');
    }
  }, [isOpen, item]);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/inventory/lookup/warehouses');
      if (response.data?.success) {
        setWarehouses(response.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load warehouses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!warehouseId) {
      setError('Source warehouse is required.');
      return;
    }

    if (type === 'TRANSFER_OUT' && !targetWarehouseId) {
      setError('Destination warehouse is required for transfers.');
      return;
    }

    if (type === 'TRANSFER_OUT' && warehouseId === targetWarehouseId) {
      setError('Source and Destination warehouses cannot be the same.');
      return;
    }

    const qtyVal = parseFloat(quantity);
    if (isNaN(qtyVal) || qtyVal <= 0) {
      setError('Quantity must be a positive number.');
      return;
    }

    // Process adjustments signs
    // Damaged, Lost, and Manual reductions should have negative quantity internally
    let finalQty = qtyVal;
    if (type === 'ADJUSTMENT' && (subType === 'DAMAGED' || subType === 'LOST' || subType === 'MANUAL_REDUCTION')) {
      finalQty = -qtyVal;
    }

    setSubmitting(true);
    try {
      const payload = {
        stockItemId: item.id,
        warehouseId,
        targetWarehouseId: type === 'TRANSFER_OUT' ? targetWarehouseId : null,
        transactionType: type,
        quantity: Math.abs(finalQty), // The API takes positive quantities and determines sign based on type. Wait, let's verify: 
        // In InventoryTransactionServiceImpl.java:
        //   TRANSFER_OUT becomes negative, GOODS_ISSUE becomes negative.
        //   ADJUSTMENT is passed directly, so we can pass positive or negative for ADJUSTMENT!
        // So for ADJUSTMENT, pass finalQty (could be negative). For TRANSFER_OUT, pass positive qty.
        quantity: type === 'TRANSFER_OUT' ? qtyVal : finalQty,
        rate: parseFloat(rate) || 0,
        referenceNumber,
        transactionDate,
        notes: type === 'TRANSFER_OUT' ? `Transfer: ${notes}` : `Adjustment (${subType.replace('_', ' ')}): ${notes}`
      };

      const response = await axiosClient.post('/inventory/transactions', payload);
      if (response.data?.success) {
        if (onSaveSuccess) onSaveSuccess();
        onClose();
      } else {
        setError(response.data?.message || 'Failed to record transaction.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error occurred while recording transaction.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <div className="text-left">
            <h3 className="font-heading font-bold text-slate-800 dark:text-slate-100">
              Adjust / Transfer Stock
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Item: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{item.name}</span>
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 text-left text-xs">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl flex items-start gap-2">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Selector: Adjustment vs Transfer */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Action Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('ADJUSTMENT')}
                  className={`py-2 px-3 rounded-lg border text-center font-bold transition-all cursor-pointer ${
                    type === 'ADJUSTMENT' 
                      ? 'border-indigo-600 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 dark:border-indigo-500' 
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  🛠️ Stock Adjustment
                </button>
                <button
                  type="button"
                  onClick={() => setType('TRANSFER_OUT')}
                  className={`py-2 px-3 rounded-lg border text-center font-bold transition-all cursor-pointer ${
                    type === 'TRANSFER_OUT' 
                      ? 'border-indigo-600 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 dark:border-indigo-500' 
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  🚀 Warehouse Transfer
                </button>
              </div>
            </div>

            {/* Sub-type selection (Adjustment reason) */}
            {type === 'ADJUSTMENT' && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Adjustment Reason</label>
                <select 
                  value={subType} 
                  onChange={(e) => setSubType(e.target.value)} 
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
                >
                  <option value="MANUAL_CORRECTION">Correction (Positive / Inward)</option>
                  <option value="MANUAL_REDUCTION">Correction (Negative / Outward)</option>
                  <option value="DAMAGED">Damaged Goods (Reduces stock)</option>
                  <option value="LOST">Lost Items (Reduces stock)</option>
                  <option value="FOUND">Found Items (Increases stock)</option>
                </select>
              </div>
            )}

            {/* Warehouse fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  {type === 'TRANSFER_OUT' ? 'Source Warehouse *' : 'Warehouse *'}
                </label>
                <select
                  value={warehouseId}
                  onChange={(e) => setWarehouseId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
                  required
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>

              {type === 'TRANSFER_OUT' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Destination Warehouse *</label>
                  <select
                    value={targetWarehouseId}
                    onChange={(e) => setTargetWarehouseId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
                    required
                  >
                    <option value="">Select Warehouse</option>
                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Quantity, Valuation rate, ref number */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Quantity *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Valuation Rate (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Voucher / Reference *</label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none font-mono"
                  required
                />
              </div>
            </div>

            {/* Transaction Date & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Date</label>
                <input
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Remarks / Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Reason for adjustment or transfer details"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <RefreshCw size={12} className="animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Save size={12} />
                  <span>Post Transaction</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
