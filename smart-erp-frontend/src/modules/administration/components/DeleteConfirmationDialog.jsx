import React from 'react';
import { Button } from '@shared/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import './styles/DeleteConfirmationDialog.css';

export default function DeleteConfirmationDialog({ isOpen, companyName, onConfirm, onCancel, loading }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content border-red-500/20 text-left">
        <div className="flex items-center gap-3 mb-4 text-red-500">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
          <h2 className="modal-title text-red-600">Delete Company</h2>
        </div>
        
        <p className="modal-desc text-sm">
          Are you sure you want to delete <strong>{companyName}</strong>? This action is permanent and will delete all ledger accounts, inventory balances, and transactions associated with this company profile.
        </p>

        <div className="modal-buttons">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="border-[var(--border-light)] text-[var(--text-primary)] hover:bg-[var(--bg-input)] cursor-pointer">Cancel</Button>
          <Button type="button" onClick={onConfirm} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white cursor-pointer">{loading ? 'Deleting...' : 'Permanently Delete'}</Button>
        </div>
      </div>
    </div>
  );
}
