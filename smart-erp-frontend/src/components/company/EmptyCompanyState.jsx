import React from 'react';
import { Button } from '@/components/ui/button';
import { Briefcase, Plus } from 'lucide-react';

export default function EmptyCompanyState({ onCreateClick }) {
  return (
    <div className="empty-state-card">
      <div className="empty-state-icon">
        <Briefcase size={32} className="stroke-[2.5]" />
      </div>
      <h2 className="empty-state-title">Create First Company</h2>
      <p className="empty-state-desc">
        To start using SmartERP, you must set up a working company profile. This serves as the workspace for all accounting registers, inventory modules, and billing ledgers.
      </p>
      <Button 
        onClick={onCreateClick}
        className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] cursor-pointer flex items-center gap-2"
      >
        <Plus size={16} />
        Create New Company
      </Button>
    </div>
  );
}
