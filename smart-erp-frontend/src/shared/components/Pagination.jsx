import React from 'react';
import { Button } from '@shared/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePaginationData } from './services/PaginationService';
import './styles/Pagination.css';

export default function Pagination(props) {
  const { totalPages } = props;
  const { handlePrev, handleNext, displayPageText, isPrevDisabled, isNextDisabled } = usePaginationData(props);

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-bar">
      <Button variant="outline" size="sm" onClick={handlePrev} disabled={isPrevDisabled} className="pagination-btn">
        <ChevronLeft size={16} />
        Previous
      </Button>
      <span className="text-sm font-semibold text-[var(--text-secondary)] font-heading">
        {displayPageText}
      </span>
      <Button variant="outline" size="sm" onClick={handleNext} disabled={isNextDisabled} className="pagination-btn">
        Next
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
