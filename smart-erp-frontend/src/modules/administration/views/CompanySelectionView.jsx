import React, { useState } from 'react';
import { useCompanySelection, deleteCompanyApi } from '../services/company.service';
import CompanyCard from '../components/CompanyCard';
import EmptyCompanyState from '../components/EmptyCompanyState';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';
import { Button } from '@shared/components/ui/button';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/company.css';

export default function CompanySelectionView({ onSelectSuccess, onCreateCompany, onEditCompany }) {
  const {
    companies,
    loading,
    error,
    page,
    setPage,
    totalPages,
    handleSelect,
    refreshList,
  } = useCompanySelection(onSelectSuccess);

  // Deletion modal state management
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, company: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const triggerDeleteConfirm = (company) => {
    setDeleteError('');
    setDeleteModal({ isOpen: true, company });
  };

  const executeDelete = async () => {
    if (!deleteModal.company) return;
    setDeleteLoading(true);
    setDeleteError('');
    try {
      const res = await deleteCompanyApi(deleteModal.company.id);
      if (res.success) {
        setDeleteModal({ isOpen: false, company: null });
        refreshList();
      } else {
        setDeleteError(res.message || 'Deletion failed.');
      }
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete company.');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading && companies.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-[var(--text-secondary)] font-medium">
        Loading companies...
      </div>
    );
  }

  return (
    <div className="company-selector-container max-w-6xl mx-auto px-6 py-8">
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-8 pb-6 border-b border-slate-800">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text bg-gradient-to-r from-white to-slate-400">Select Company</h1>
          <p className="text-xs text-slate-400 font-medium">
            Choose a workspace company or create a new profile to proceed
          </p>
        </div>
        <button
          onClick={onCreateCompany}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus size={15} />
          Create Company
        </button>
      </div>

      {error && (
        <div className="w-full p-3 text-sm text-red-500 rounded-lg bg-red-500/10 border border-red-500/30 mb-6">
          {error}
        </div>
      )}

      {deleteError && (
        <div className="w-full p-3 text-sm text-red-500 rounded-lg bg-red-500/10 border border-red-500/30 mb-6">
          {deleteError}
        </div>
      )}

      {companies.length === 0 ? (
        <EmptyCompanyState onCreateClick={onCreateCompany} />
      ) : (
        <>
          <div className="companies-grid">
            {companies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onSelect={handleSelect}
                onEdit={onEditCompany}
                onDelete={triggerDeleteConfirm}
              />
            ))}
          </div>

          {/* Pagination triggers */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-6 mt-10 w-full pt-6 border-t border-slate-800/60">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-semibold cursor-pointer"
              >
                <ChevronLeft size={15} />
                Previous
              </button>
              <span className="text-xs font-bold text-slate-400">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={page === totalPages - 1}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-semibold cursor-pointer"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </>
      )}

      <DeleteConfirmationDialog
        isOpen={deleteModal.isOpen}
        companyName={deleteModal.company?.name || ''}
        onConfirm={executeDelete}
        onCancel={() => setDeleteModal({ isOpen: false, company: null })}
        loading={deleteLoading}
      />
    </div>
  );
}
