export function useConfirmationDialogData({ variant, confirmText = 'Confirm', loading = false }) {
  const isDestructive = variant === 'destructive' || variant === 'danger';
  const displayConfirmText = loading ? 'Processing...' : confirmText;

  const modalContentClass = `modal-content ${isDestructive ? 'modal-content-destructive' : ''}`;
  const modalHeaderClass = `modal-header ${isDestructive ? 'modal-header-destructive' : ''}`;
  const modalIconClass = `modal-icon-container ${isDestructive ? 'modal-icon-destructive' : ''}`;
  const modalTitleClass = `modal-title ${isDestructive ? 'modal-title-destructive' : ''}`;
  const modalConfirmBtnClass = `modal-confirm-btn ${isDestructive ? 'modal-confirm-btn-destructive' : ''}`;

  return {
    isDestructive,
    displayConfirmText,
    modalContentClass,
    modalHeaderClass,
    modalIconClass,
    modalTitleClass,
    modalConfirmBtnClass
  };
}
