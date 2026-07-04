import React from 'react';
import { Button } from '@shared/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useConfirmationDialogData } from './services/ConfirmationDialogService';
import './styles/ConfirmationDialog.css';

export default function ConfirmationDialog(props) {
  const { isOpen, title, description, onConfirm, onCancel, loading = false } = props;
  const { 
    isDestructive, 
    displayConfirmText,
    modalContentClass,
    modalHeaderClass,
    modalIconClass,
    modalTitleClass,
    modalConfirmBtnClass
  } = useConfirmationDialogData(props);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={modalContentClass}>
        <div className={modalHeaderClass}>
          <div className={modalIconClass}>
            <AlertCircle size={20} />
          </div>
          <h2 className={modalTitleClass}>{title}</h2>
        </div>
        
        <p className="modal-desc">{description}</p>

        <div className="modal-buttons">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="modal-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={modalConfirmBtnClass}
          >
            {displayConfirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
