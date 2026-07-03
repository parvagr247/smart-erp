import React from 'react';
import { Button } from '@shared/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '@modules/administration/styles/company.css';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-bar">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(page - 1, 0))}
        disabled={page === 0}
        className="pagination-btn"
      >
        <ChevronLeft size={16} />
        Previous
      </Button>
      <span className="text-sm font-semibold text-[var(--text-secondary)] font-heading">
        Page {page + 1} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(page + 1, totalPages - 1))}
        disabled={page === totalPages - 1}
        className="pagination-btn"
      >
        Next
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
