import React from 'react';
import { Button } from '@shared/components/ui/button';
import { Briefcase, Plus } from 'lucide-react';
import './styles/EmptyCompanyState.css';

export default function EmptyCompanyState({ onCreateClick, isAdmin }) {
  return (
    <div className="empty-state-card text-center">
      <div className="empty-state-icon">
        <Briefcase size={32} className="stroke-[2.5]" />
      </div>
      <h2 className="empty-state-title">
        {isAdmin ? 'Create First Company' : 'No Active Workspace'}
      </h2>
      <p className="empty-state-desc font-medium">
        {isAdmin 
          ? 'To start using SmartERP, you must set up a working company profile. This serves as the workspace for all accounting registers, inventory modules, and billing ledgers.'
          : 'There are no company workspaces registered in this environment yet. Please contact your system administrator to configure a company profile context.'}
      </p>
      {isAdmin && (
        <Button onClick={onCreateClick} className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] cursor-pointer flex items-center gap-2">
          <Plus size={16} />
          Create New Company
        </Button>
      )}
    </div>
  );
}
