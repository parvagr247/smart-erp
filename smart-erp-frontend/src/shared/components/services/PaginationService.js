export function usePaginationData({ page, totalPages, onPageChange }) {
  const handlePrev = () => {
    if (onPageChange) {
      onPageChange(Math.max(page - 1, 0));
    }
  };

  const handleNext = () => {
    if (onPageChange) {
      onPageChange(Math.min(page + 1, totalPages - 1));
    }
  };

  const displayPageText = `Page ${page + 1} of ${totalPages}`;
  const isPrevDisabled = page === 0;
  const isNextDisabled = page === totalPages - 1;

  return {
    handlePrev,
    handleNext,
    displayPageText,
    isPrevDisabled,
    isNextDisabled
  };
}
