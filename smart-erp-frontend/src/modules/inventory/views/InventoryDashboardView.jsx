import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../services/inventory.service';

export default function InventoryDashboardView() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    totalItems: 0,
    totalWarehouses: 0,
    totalBrands: 0,
    lowStockCount: 0,
    outOfStockCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const sumRes = await inventoryService.getSummary();
      if (sumRes.success && sumRes.data) {
        setSummary(sumRes.data);
      }

      const itemsRes = await inventoryService.getItems({ page: 0, size: 5 });
      if (itemsRes.success && itemsRes.data) {
        setRecentItems(itemsRes.data.content || []);
      }
    } catch (e) {
      console.error("Error loading inventory dashboard", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        Loading inventory overview...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Inventory Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Real-time status of stocks, warehouses, and tax categories.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/inventory/items/create')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm shadow transition-colors"
          >
            + Create Stock Item
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Items</span>
          <span className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">{summary.totalItems}</span>
        </div>
        <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Warehouses</span>
          <span className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">{summary.totalWarehouses}</span>
        </div>
        <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Brands</span>
          <span className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">{summary.totalBrands}</span>
        </div>
        <div className="p-5 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/50 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Low Stock Items</span>
          <span className="text-3xl font-bold text-amber-800 dark:text-amber-300 mt-2">{summary.lowStockCount}</span>
        </div>
        <div className="p-5 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-900/50 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">Out Of Stock</span>
          <span className="text-3xl font-bold text-rose-800 dark:text-rose-300 mt-2">{summary.outOfStockCount}</span>
        </div>
      </div>

      {/* Navigation Quick Links Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <button onClick={() => navigate('/inventory/items')} className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-center border border-slate-200 dark:border-slate-700 transition">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Items List</div>
        </button>
        <button onClick={() => navigate('/inventory/warehouses')} className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-center border border-slate-200 dark:border-slate-700 transition">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Warehouses</div>
        </button>
        <button onClick={() => navigate('/inventory/brands')} className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-center border border-slate-200 dark:border-slate-700 transition">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Brands</div>
        </button>
        <button onClick={() => navigate('/inventory/manufacturers')} className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-center border border-slate-200 dark:border-slate-700 transition">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Manufacturers</div>
        </button>
        <button onClick={() => navigate('/inventory/categories')} className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-center border border-slate-200 dark:border-slate-700 transition">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Categories</div>
        </button>
        <button onClick={() => navigate('/inventory/units')} className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-center border border-slate-200 dark:border-slate-700 transition">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Units</div>
        </button>
        <button onClick={() => navigate('/inventory/tax-categories')} className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-center border border-slate-200 dark:border-slate-700 transition">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Taxes & HSN</div>
        </button>
      </div>

      {/* Recent Items Panel */}
      <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Recently Added Stock Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                <th className="py-3 px-4 font-semibold">SKU / Code</th>
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Stock Group</th>
                <th className="py-3 px-4 font-semibold">Warehouse</th>
                <th className="py-3 px-4 font-semibold text-right">Qty</th>
                <th className="py-3 px-4 font-semibold text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {recentItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">No stock items added yet. Click Create Stock Item above.</td>
                </tr>
              ) : (
                recentItems.map(item => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer" onClick={() => navigate(`/inventory/items/${item.id}`)}>
                    <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                      <div>{item.sku}</div>
                      <div className="text-xs text-slate-400">{item.code}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-800 dark:text-slate-200">{item.name}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{item.stockGroupName || 'General'}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{item.warehouseName || 'Unassigned'}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-800 dark:text-slate-100">{item.openingQuantity} {item.primaryUnitCode}</td>
                    <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">₹{item.openingValue.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
