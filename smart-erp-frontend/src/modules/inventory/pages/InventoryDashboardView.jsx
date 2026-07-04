import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventoryDashboardViewData } from './services/InventoryDashboardViewService';
import './styles/InventoryDashboardView.css';

export default function InventoryDashboardView() {
  const navigate = useNavigate();
  const { summary, loading, recentItems } = useInventoryDashboardViewData();

  if (loading) return <div className="p-6 text-center text-slate-400"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>Loading inventory overview...</div>;

  const kpis = [
    { label: 'Total Items', val: summary.totalItems, cls: 'kpi-card text-slate-500 text-slate-800 dark:text-slate-100' },
    { label: 'Warehouses', val: summary.totalWarehouses, cls: 'kpi-card text-slate-500 text-slate-800 dark:text-slate-100' },
    { label: 'Brands', val: summary.totalBrands, cls: 'kpi-card text-slate-500 text-slate-800 dark:text-slate-100' },
    { label: 'Low Stock Items', val: summary.lowStockCount, cls: 'kpi-card-low-stock text-amber-700 dark:text-amber-400 text-amber-800 dark:text-amber-300' },
    { label: 'Out Of Stock', val: summary.outOfStockCount, cls: 'kpi-card-out-of-stock text-rose-700 dark:text-rose-400 text-rose-800 dark:text-rose-300' }
  ];

  const shortcuts = [
    { label: 'Items List', url: '/inventory/stock-items' }, { label: 'Warehouses', url: '/inventory/warehouses' },
    { label: 'Brands', url: '/inventory/brands' }, { label: 'Categories', url: '/inventory/categories' },
    { label: 'Manufacturers', url: '/inventory/manufacturers' }, { label: 'Units', url: '/inventory/units' },
    { label: 'Taxes', url: '/inventory/tax-categories', isTax: true }
  ];

  return (
    <div className="inventory-dashboard-container">
      <div className="flex justify-between items-center text-left">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Inventory Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Real-time status of stocks, warehouses, and tax categories.</p>
        </div>
        <button onClick={() => navigate('/inventory/stock-items/create')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm shadow transition-colors cursor-pointer">+ Create Stock Item</button>
      </div>
      <div className="kpi-grid">
        {kpis.map((k, idx) => (
          <div key={idx} className={k.cls.split(' ')[0]}>
            <span className={`text-xs font-semibold uppercase tracking-wider ${k.cls.split(' ').slice(1, 3).join(' ')}`}>{k.label}</span>
            <span className={`text-3xl font-bold mt-2 ${k.cls.split(' ').slice(3).join(' ')}`}>{k.val}</span>
          </div>
        ))}
      </div>
      <div className="quick-links-grid">
        {shortcuts.map((s, idx) => <button key={idx} onClick={() => navigate(s.url)} className={`quick-link-btn ${s.isTax ? 'col-span-2 sm:col-span-1' : ''}`}><div className="text-sm font-medium text-slate-700 dark:text-slate-300">{s.label}</div></button>)}
      </div>
      <div className="recent-items-panel">
        <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">Recently Added Stock Items</h3>
        <div className="overflow-x-auto">
          <table className="recent-items-table">
            <thead className="recent-items-thead">
              <tr>{['Item Code', 'Name', 'Brand', 'Unit', 'Available Qty'].map(h => <th key={h} className="py-3 px-4">{h}</th>)}</tr>
            </thead>
            <tbody>
              {recentItems.length === 0 ? <tr><td colSpan="5" className="py-4 text-center text-slate-400">No stock items configured yet.</td></tr> :
                recentItems.map(item => (
                  <tr key={item.id} className="recent-items-tr" onClick={() => navigate(`/inventory/stock-items/${item.id}`)}>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{item.code}</td>
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4">{item.brandName || '-'}</td>
                    <td className="py-3 px-4">{item.unitCode || '-'}</td>
                    <td className="py-3 px-4 font-medium">{item.availableQty || 0}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
