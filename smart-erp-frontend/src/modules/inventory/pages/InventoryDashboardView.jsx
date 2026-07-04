import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventoryDashboardViewData } from './services/InventoryDashboardViewService';
import './styles/InventoryDashboardView.css';

export default function InventoryDashboardView() {
  const navigate = useNavigate();
  const { summary, loading, recentItems } = useInventoryDashboardViewData();

  if (loading) return <div className="p-6 text-center text-slate-400"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>Loading inventory...</div>;

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
        <div className="kpi-card"><span>Total Items</span><span className="text-3xl font-bold mt-2">{summary.totalItems}</span></div>
        <div className="kpi-card"><span>Warehouses</span><span className="text-3xl font-bold mt-2">{summary.totalWarehouses}</span></div>
        <div className="kpi-card"><span>Brands</span><span className="text-3xl font-bold mt-2">{summary.totalBrands}</span></div>
        <div className="kpi-card"><span>Inventory Value</span><span className="text-3xl font-bold mt-2">₹{summary.totalInventoryValue.toLocaleString()}</span></div>
        <div className="kpi-card-low-stock"><span>Low Stock</span><span className="text-3xl font-bold mt-2">{summary.lowStockCount}</span></div>
        <div className="kpi-card-out-of-stock"><span>Out Of Stock</span><span className="text-3xl font-bold mt-2">{summary.outOfStockCount}</span></div>
      </div>

      <div className="quick-links-grid">
        {['Items List', 'Warehouses', 'Brands', 'Categories', 'Manufacturers', 'Units'].map((l, i) => (
          <button key={i} onClick={() => navigate(`/inventory/${l.toLowerCase().replace('list', 'stock-items').replace(' ', '-')}`)} className="quick-link-btn">{l}</button>
        ))}
        <button onClick={() => navigate('/inventory/tax-categories')} className="quick-link-btn col-span-2 sm:col-span-1">Taxes</button>
      </div>

      <div className="recent-items-panel text-left">
        <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">Recently Added Stock Items</h3>
        <div className="overflow-x-auto">
          <table className="recent-items-table">
            <thead className="recent-items-thead">
              <tr>{['Code', 'Name', 'Brand', 'Unit', 'Qty'].map(h => <th key={h} className="py-3 px-4">{h}</th>)}</tr>
            </thead>
            <tbody>
              {recentItems.length === 0 ? <tr><td colSpan="5" className="py-4 text-center text-slate-400">No stock items.</td></tr> :
                recentItems.map(item => (
                  <tr key={item.id} className="recent-items-tr" onClick={() => navigate(`/inventory/stock-items/${item.id}`)}>
                    <td className="py-3 px-4 font-semibold">{item.code}</td>
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
