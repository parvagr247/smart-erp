import React from 'react';
import CompanyCard from './CompanyCard';
import EmptyCompanyState from './EmptyCompanyState';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './styles/WorkspaceList.css';

export default function WorkspaceList({
  companies, page, setPage, totalPages, handleSelect, onEdit, onDelete, onCreateCompany
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] font-heading">
          Your Company Profiles ({companies.length})
        </h2>
        <span className="text-[10px] bg-[var(--bg-surface)] border border-[var(--border-light)] px-2 py-0.5 rounded font-mono text-[var(--text-muted)]">
          Active Session
        </span>
      </div>

      {companies.length === 0 ? (
        <div className="my-8">
          <EmptyCompanyState onCreateClick={onCreateCompany} />
        </div>
      ) : (
        <>
          <div className="companies-grid">
            {companies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onSelect={handleSelect}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-6 mt-10 w-full pt-6 border-t border-[var(--border-light)]">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-[var(--border-light)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-input)] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-semibold cursor-pointer"
              >
                <ChevronLeft size={15} />
                Previous
              </button>
              <span className="text-xs font-bold text-[var(--text-secondary)]">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={page === totalPages - 1}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-[var(--border-light)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-input)] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-semibold cursor-pointer"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
