import React from 'react';
import { Button } from '@shared/components/ui/button';
import { AlertCircle } from 'lucide-react';
import '@modules/administration/styles/company.css';

export default function ConfirmationDialog({ 
  isOpen, 
  title, 
  description, 
  onConfirm, 
  onCancel, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  loading = false,
  variant = 'default'
}) {
  if (!isOpen) return null;

  const isDestructive = variant === 'destructive';

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${isDestructive ? 'border-red-500/20' : ''}`}>
        <div className={`flex items-center gap-3 mb-4 ${isDestructive ? 'text-red-500' : 'text-[var(--primary)]'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-500/10' : 'bg-[var(--primary-glow)]'}`}>
            <AlertCircle size={20} />
          </div>
          <h2 className={`modal-title ${isDestructive ? 'text-red-600' : ''}`}>{title}</h2>
        </div>
        
        <p className="modal-desc text-sm">{description}</p>

        <div className="modal-buttons">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="border-[var(--border-light)] text-[var(--text-primary)] hover:bg-[var(--bg-input)] cursor-pointer"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={isDestructive ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer' : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] cursor-pointer'}
          >
            {loading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
