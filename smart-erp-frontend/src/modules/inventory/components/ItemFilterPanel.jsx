import React from 'react';
import './styles/ItemFilterPanel.css';

export default function ItemFilterPanel({
  search, setSearch, selectedWarehouse, setSelectedWarehouse, selectedBrand, setSelectedBrand,
  selectedStatus, setSelectedStatus, warehouses, brands, onSearchSubmit, setPage
}) {
  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 items-center">
      <form onSubmit={onSearchSubmit} className="w-full md:w-1/3 flex gap-2">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none" placeholder="Search by Name, SKU, Code..." />
        <button type="submit" className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-lg text-sm transition cursor-pointer">Search</button>
      </form>
      <div className="w-full md:w-auto flex flex-wrap gap-3 ml-auto text-left">
        <select value={selectedWarehouse} onChange={(e) => { setSelectedWarehouse(e.target.value); setPage(0); }} className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm cursor-pointer">
          <option value="">All Warehouses</option>
          {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
        <select value={selectedBrand} onChange={(e) => { setSelectedBrand(e.target.value); setPage(0); }} className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm cursor-pointer">
          <option value="">All Brands</option>
          {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setPage(0); }} className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm cursor-pointer">
          <option value="">All Stock Status</option>
          <option value="LOW_STOCK">Low Stock Warning</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
      </div>
    </div>
  );
}
