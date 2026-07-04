import React from 'react';
import ActionButton from '@shared/components/ActionButton';
import DataTable from '@shared/components/DataTable';
import StatusBadge from '@shared/components/StatusBadge';
import { Eye, CheckCircle2, XCircle, Search } from 'lucide-react';

export default function SalesListSection(props) {
  const { 
    sales = [], 
    stats = {}, 
    handleCreate, 
    handleDetails, 
    handleStatusChange,
    // Filter props
    filterSearch = "",
    setFilterSearch,
    filterStatus = "",
    setFilterStatus,
    filterStartDate = "",
    setFilterStartDate,
    filterEndDate = "",
    setFilterEndDate,
    resetFilters,
    applyFilters,
    customers = [],
    selectedCustomerFilter = "",
    setSelectedCustomerFilter
  } = props;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const columns = [
    {
      key: 'salesNumber',
      header: 'Invoice No.',
      cellClassName: 'font-semibold text-[var(--text-primary)]'
    },
    {
      key: 'customerName',
      header: 'Customer'
    },
    {
      key: 'salesDate',
      header: 'Date'
    },
    {
      key: 'netAmount',
      header: 'Amount',
      cellClassName: 'font-medium text-[var(--text-primary)]',
      render: (row) => `₹${(row.netAmount || 0).toFixed(2)}`
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <ActionButton 
            label="View" 
            variant="secondary" 
            icon={<Eye size={12} />} 
            onClick={() => handleDetails(row.id)} 
          />
          {row.status === 'DRAFT' && (
            <>
              <ActionButton 
                label="Post" 
                variant="primary" 
                icon={<CheckCircle2 size={12} />} 
                onClick={() => handleStatusChange(row.id, 'APPROVED')} 
              />
              <ActionButton 
                label="Cancel" 
                variant="danger" 
                icon={<XCircle size={12} />} 
                onClick={() => handleStatusChange(row.id, 'CANCELLED')} 
              />
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Sales Vouchers</h1>
          <p className="text-sm text-[var(--text-secondary)]">Manage tax invoices and billing accounts.</p>
        </div>
        <button onClick={handleCreate} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow cursor-pointer">+ New Invoice</button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border-light)] shadow-sm">
          <span className="text-xs text-[var(--text-secondary)] font-semibold uppercase">Total Sales Invoices</span>
          <h2 className="text-3xl font-bold mt-2 text-[var(--text-primary)]">{stats.salesCount}</h2>
        </div>
        <div className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border-light)] shadow-sm">
          <span className="text-xs text-[var(--text-secondary)] font-semibold uppercase">Total Sales Revenue</span>
          <h2 className="text-3xl font-bold mt-2 text-indigo-600 dark:text-indigo-400 font-mono">₹{(stats.totalSalesValue || 0).toLocaleString()}</h2>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-xl p-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Search Invoice</label>
            <input 
              type="text" 
              placeholder="Search no..." 
              value={filterSearch} 
              onChange={(e) => setFilterSearch(e.target.value)} 
              className="w-full px-3 py-1.5 bg-[var(--bg-input)] border border-[var(--border-light)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Customer</label>
            <select
              value={selectedCustomerFilter}
              onChange={(e) => setSelectedCustomerFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-[var(--bg-input)] border border-[var(--border-light)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none cursor-pointer"
            >
              <option value="">All Customers</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Invoice Status</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)} 
              className="w-full px-3 py-1.5 bg-[var(--bg-input)] border border-[var(--border-light)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="APPROVED">Approved</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">From Date</label>
            <input 
              type="date" 
              value={filterStartDate} 
              onChange={(e) => setFilterStartDate(e.target.value)} 
              className="w-full px-3 py-1.5 bg-[var(--bg-input)] border border-[var(--border-light)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">To Date</label>
            <input 
              type="date" 
              value={filterEndDate} 
              onChange={(e) => setFilterEndDate(e.target.value)} 
              className="w-full px-3 py-1.5 bg-[var(--bg-input)] border border-[var(--border-light)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none" 
            />
          </div>
          <div className="flex gap-2 col-span-full justify-end">
            <button 
              type="button" 
              onClick={resetFilters} 
              className="px-3 py-1.5 bg-[var(--bg-input)] border border-[var(--border-light)] rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:border-[var(--text-primary)] transition-all cursor-pointer"
            >
              Reset
            </button>
            <button 
              type="submit" 
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-semibold text-white transition-all cursor-pointer"
            >
              Apply Filter
            </button>
          </div>
        </form>
      </div>

      <div className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border-light)] shadow-sm">
        <DataTable 
          columns={columns} 
          data={sales} 
          exportTitle="Sales Invoices List" 
          exportFilters={`Search: ${filterSearch || 'None'} | Customer: ${selectedCustomerFilter || 'All'} | Status: ${filterStatus || 'All'} | Period: ${filterStartDate || 'Start'} to ${filterEndDate || 'End'}`}
        />
      </div>
    </div>
  );
}
