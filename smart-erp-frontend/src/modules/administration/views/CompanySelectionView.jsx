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
    <div className="company-selector-container">
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-6 pb-6 border-b border-[var(--border-light)]">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-2xl font-bold font-heading text-[var(--text-primary)]">Select Company</h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Choose a workspace company or create a new profile to proceed
          </p>
        </div>
        <Button
          onClick={onCreateCompany}
          className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] cursor-pointer flex items-center gap-2"
        >
          <Plus size={16} />
          Create Company
        </Button>
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
            <div className="pagination-bar">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
                className="pagination-btn"
              >
                <ChevronLeft size={16} />
                Previous
              </Button>
              <span className="text-sm font-semibold text-[var(--text-secondary)]">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={page === totalPages - 1}
                className="pagination-btn"
              >
                Next
                <ChevronRight size={16} />
              </Button>
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
