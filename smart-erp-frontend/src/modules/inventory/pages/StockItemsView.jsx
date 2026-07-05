import React, { useState } from 'react';
import { useStockItemsViewData } from './services/StockItemsViewService';
import ItemFilterPanel from '../components/ItemFilterPanel';
import ItemTable from '../components/ItemTable';
import InventoryAdjustmentModal from '../components/InventoryAdjustmentModal';
import './styles/StockItemsView.css';

export default function StockItemsView() {
  const { navigate, loading, items, handleDelete, totalPages, page, setPage, fetchItems, ...filterState } = useStockItemsViewData();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAdjOpen, setIsAdjOpen] = useState(false);

  const handleAdjustClick = (item) => {
    setSelectedItem(item);
    setIsAdjOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Stock Item Registry</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage products, opening balance details, and pricing lists.</p>
        </div>
        <button onClick={() => navigate('/inventory/stock-items/create')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition cursor-pointer">+ Add Stock Item</button>
      </div>
      <ItemFilterPanel {...filterState} />
      <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        {loading ? <div className="py-8 text-center text-slate-400 animate-pulse">Loading registry entries...</div> : <ItemTable items={items} onNavigate={navigate} onDelete={handleDelete} onAdjust={handleAdjustClick} />}
        {totalPages > 1 && (
          <div className="flex justify-end gap-2 mt-4">
            <button disabled={page === 0} onClick={() => setPage(page - 1)} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-xs font-semibold rounded transition disabled:opacity-50 cursor-pointer">Previous</button>
            <span className="text-xs text-slate-500 dark:text-slate-400 py-1 px-2">Page {page + 1} of {totalPages}</span>
            <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-xs font-semibold rounded transition disabled:opacity-50 cursor-pointer">Next</button>
          </div>
        )}
      </div>

      <InventoryAdjustmentModal
        isOpen={isAdjOpen}
        onClose={() => setIsAdjOpen(false)}
        item={selectedItem}
        onSaveSuccess={fetchItems}
      />
    </div>
  );
}
