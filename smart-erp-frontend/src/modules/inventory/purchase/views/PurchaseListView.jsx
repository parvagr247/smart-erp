import React from 'react';
import { Link } from 'react-router-dom';
import usePurchaseList from '../hooks/usePurchaseList';
import PurchaseStatusBadge from '../components/PurchaseStatusBadge';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import SupplierSelector from '../components/SupplierSelector';
import WarehouseSelector from '../components/WarehouseSelector';

export default function PurchaseListView() {
  const list = usePurchaseList();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    list.setPage(0);
    list.loadPurchases();
  };

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[var(--border-color)] pb-4 text-left">
        <PageHeader
          title="Purchase Vouchers Registry"
          subtitle="View and manage all purchase orders, draft vouchers, and posted supplier invoices."
        />
        <Link
          to="/purchase/create"
          className="px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 text-sm font-semibold rounded-md text-white transition-all self-start md:self-center"
        >
          + Record Purchase
        </Link>
      </div>

      {/* Filter panel */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-4 mb-6 text-left">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 items-end">
          <div className="w-full">
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">
              Search Invoice/Supplier
            </label>
            <input
              type="text"
              placeholder="Search..."
              value={list.search}
              onChange={(e) => list.setSearch(e.target.value)}
              className="w-full px-3 py-1.5 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div className="w-full">
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">
              Voucher Status
            </label>
            <select
              value={list.status}
              onChange={(e) => list.setStatus(e.target.value)}
              className="w-full px-3 py-1.5 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="APPROVED">Approved</option>
              <option value="RECEIVED">Received</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="w-full">
            <SupplierSelector
              value={list.supplierId}
              onChange={(s) => list.setSupplierId(s ? s.id : '')}
            />
          </div>

          <div className="w-full">
            <WarehouseSelector
              value={list.warehouseId}
              onChange={list.setWarehouseId}
              label="Warehouse"
            />
          </div>

          <div className="w-full">
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">
              From Date
            </label>
            <input
              type="date"
              value={list.fromDate}
              onChange={(e) => list.setFromDate(e.target.value)}
              className="w-full px-3 py-1.5 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div className="w-full">
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">
              To Date
            </label>
            <input
              type="date"
              value={list.toDate}
              onChange={(e) => list.setToDate(e.target.value)}
              className="w-full px-3 py-1.5 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div className="flex gap-2 col-span-full justify-end">
            <button
              type="button"
              onClick={list.resetFilters}
              className="px-3 py-1.5 bg-[var(--bg-body)] border border-[var(--border-color)] rounded text-xs font-semibold text-[var(--text-muted)] hover:border-[var(--text-primary)] transition-all"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[var(--color-primary)] hover:opacity-90 rounded text-xs font-semibold text-white transition-all"
            >
              Apply Filter
            </button>
          </div>
        </form>
      </div>

      {/* Grid Table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg overflow-hidden shadow-sm">
        {list.loading ? (
          <div className="p-8 text-center text-sm text-[var(--text-muted)] animate-pulse">
            Loading registry...
          </div>
        ) : list.purchases.length === 0 ? (
          <div className="p-8 text-center text-sm text-[var(--text-muted)]">
            No purchase vouchers recorded matching the filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-xs text-[var(--text-muted)] font-semibold uppercase bg-[var(--bg-body)]">
                  <th className="py-3 px-4">Purchase No.</th>
                  <th className="py-3 px-4">Voucher Date</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Warehouse</th>
                  <th className="py-3 px-4">Voucher Status</th>
                  <th className="py-3 px-4 text-right">Grand Total (₹)</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-sm text-[var(--text-primary)]">
                {list.purchases.map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--bg-body)] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[var(--color-primary)]">
                      <Link to={`/purchase/${p.id}`}>{p.purchaseNumber}</Link>
                    </td>
                    <td className="py-3.5 px-4">
                      {new Date(p.purchaseDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      {p.supplierName}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.warehouseName}
                    </td>
                    <td className="py-3.5 px-4">
                      <PurchaseStatusBadge status={p.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold">
                      ₹{p.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Link
                        to={`/purchase/${p.id}`}
                        className="px-2.5 py-1 bg-[var(--bg-body)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-xs font-semibold rounded text-[var(--text-primary)] transition-all"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination footer */}
        {list.totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-[var(--border-color)] bg-[var(--bg-body)] text-xs text-[var(--text-muted)]">
            <div>
              Showing {list.page * 10 + 1} to {Math.min((list.page + 1) * 10, list.totalElements)} of {list.totalElements} entries
            </div>
            <div className="flex gap-2">
              <button
                disabled={list.page === 0}
                onClick={() => list.setPage(list.page - 1)}
                className="px-3 py-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded disabled:opacity-50 text-[var(--text-primary)]"
              >
                Previous
              </button>
              <span className="self-center">
                Page {list.page + 1} of {list.totalPages}
              </span>
              <button
                disabled={list.page === list.totalPages - 1}
                onClick={() => list.setPage(list.page + 1)}
                className="px-3 py-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded disabled:opacity-50 text-[var(--text-primary)]"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
