import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import SectionCard from '@shared/components/SectionCard';
import ActionButton from '@shared/components/ActionButton';
import DataTable from '@shared/components/DataTable';
import { Search, RefreshCw } from 'lucide-react';
import { usePartnerListViewData } from './services/PartnerListViewService';
import './styles/PartnerListView.css';

export default function PartnerListView() {
  const { navigate, columns, partners, loading, totalPages, currentPage, search, setSearch, type, setType, status, setStatus, handleSearchSubmit, handleClearFilters, loadPartners } = usePartnerListViewData();

  return (
    <PageContainer>
      <PageHeader title="Business Partners Registry" description="Search, filter, and manage all your customer and vendor profiles">
        <ActionButton label="Partner Dashboard" variant="secondary" onClick={() => navigate('/inventory/partners')} />
        <ActionButton label="Add Partner" onClick={() => navigate('/inventory/partners/create')} />
      </PageHeader>
      <SectionCard title="Ledger Index" description="Search and filter active partners list">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6 text-left">
          <div className="relative">
            <input type="text" placeholder="Search code, name, tax IDs..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full p-2 pl-8 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-sm text-[var(--text-primary)]" />
            <Search size={14} className="absolute left-2.5 top-3 text-[var(--text-muted)]" />
          </div>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-sm text-[var(--text-primary)] cursor-pointer"><option value="">-- Classification --</option><option value="CUSTOMER">Customer</option><option value="SUPPLIER">Supplier</option><option value="BOTH">Both</option></select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-sm text-[var(--text-primary)] cursor-pointer"><option value="">-- Status --</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="BLOCKED">Blocked</option></select>
          <div className="flex gap-2">
            <ActionButton label="Apply Search" type="submit" className="flex-grow w-full py-2 h-auto text-xs font-semibold" />
            <button type="button" onClick={handleClearFilters} className="p-2 border border-[var(--border-light)] text-[var(--text-muted)] rounded-lg hover:bg-[var(--bg-input)] cursor-pointer flex items-center justify-center" title="Reset parameters"><RefreshCw size={14} /></button>
          </div>
        </form>
        {loading ? <div className="text-center py-8 text-sm text-[var(--text-muted)] animate-pulse">Loading partners dataset...</div> :
          <>
            <DataTable columns={columns} data={partners} />
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 border-t border-[var(--border-light)] pt-4">
                <span className="text-xs text-[var(--text-muted)]">Page {currentPage + 1} of {totalPages}</span>
                <div className="flex gap-2">
                  <ActionButton label="Previous" variant="secondary" disabled={currentPage === 0} onClick={() => loadPartners(currentPage - 1)} />
                  <ActionButton label="Next" variant="secondary" disabled={currentPage + 1 >= totalPages} onClick={() => loadPartners(currentPage + 1)} />
                </div>
              </div>
            )}
          </>
        }
      </SectionCard>
    </PageContainer>
  );
}
