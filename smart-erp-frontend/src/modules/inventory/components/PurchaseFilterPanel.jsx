import React from 'react';
import SupplierSelector from './SupplierSelector';
import WarehouseSelector from './WarehouseSelector';
import './styles/PurchaseFilterPanel.css';

export default function PurchaseFilterPanel({ list }) {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    list.setPage(0);
    list.loadPurchases();
  };

  const statusOptions = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'RECEIVED', label: 'Received' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-4 mb-6 text-left">
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Search Invoice/Supplier</label>
          <input type="text" placeholder="Search..." value={list.search} onChange={(e) => list.setSearch(e.target.value)} className="w-full px-3 py-1.5 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Voucher Status</label>
          <select value={list.status} onChange={(e) => list.setStatus(e.target.value)} className="w-full px-3 py-1.5 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none cursor-pointer">
            <option value="">All Statuses</option>
            {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div><SupplierSelector value={list.supplierId} onChange={(s) => list.setSupplierId(s ? s.id : '')} /></div>
        <div><WarehouseSelector value={list.warehouseId} onChange={list.setWarehouseId} label="Warehouse" /></div>
        <div>
          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">From Date</label>
          <input type="date" value={list.fromDate} onChange={(e) => list.setFromDate(e.target.value)} className="w-full px-3 py-1.5 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">To Date</label>
          <input type="date" value={list.toDate} onChange={(e) => list.setToDate(e.target.value)} className="w-full px-3 py-1.5 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none" />
        </div>
        <div className="flex gap-2 col-span-full justify-end">
          <button type="button" onClick={list.resetFilters} className="px-3 py-1.5 bg-[var(--bg-body)] border border-[var(--border-color)] rounded text-xs font-semibold text-[var(--text-muted)] hover:border-[var(--text-primary)] transition-all cursor-pointer">Reset</button>
          <button type="submit" className="px-4 py-1.5 bg-[var(--color-primary)] hover:opacity-90 rounded text-xs font-semibold text-white transition-all cursor-pointer">Apply Filter</button>
        </div>
      </form>
    </div>
  );
}
