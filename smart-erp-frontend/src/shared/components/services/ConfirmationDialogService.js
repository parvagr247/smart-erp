import { useEffect } from 'react';
import { shortcutRegistry } from '../ShortcutRegistry';

export function useConfirmationDialogData({ isOpen, variant, confirmText = 'Confirm', loading = false, onConfirm }) {
  const isDestructive = variant === 'destructive' || variant === 'danger';
  const displayConfirmText = loading ? 'Processing...' : confirmText;

  useEffect(() => {
    if (!isOpen) return;

    // Register Enter shortcut to trigger confirm action
    shortcutRegistry.register('enter', (e) => {
      if (!loading && onConfirm) {
        onConfirm();
      }
    }, 'Confirm dialog action');

    return () => {
      shortcutRegistry.unregister('enter');
    };
  }, [isOpen, loading, onConfirm]);

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
