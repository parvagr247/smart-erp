import React from 'react';
import { useCompanySelectionViewData } from './services/CompanySelectionViewService';
import WorkspaceLoader from '../components/WorkspaceLoader';
import WorkspaceHeader from '../components/WorkspaceHeader';
import WorkspaceHero from '../components/WorkspaceHero';
import WorkspaceList from '../components/WorkspaceList';
import WorkspaceFooter from '../components/WorkspaceFooter';
import ConfirmationDialog from '@shared/components/ConfirmationDialog';
import './styles/CompanySelectionView.css';

export default function CompanySelectionView(props) {
  const state = useCompanySelectionViewData(props);
  const { user, theme, toggleTheme, handleLogout, companies, loading, error, page, setPage, totalPages, handleSelect, deleteModal, setDeleteModal, deleteLoading, deleteError, executeDelete, triggerDeleteConfirm, currentTime, getInitials } = state;

  if (loading && companies.length === 0) return <WorkspaceLoader />;

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="h-screen overflow-y-auto flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200">
      <WorkspaceHeader user={user} theme={theme} onToggleTheme={toggleTheme} onLogout={handleLogout} getInitials={getInitials} />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 flex flex-col justify-start">
        <WorkspaceHero user={user} onCreateCompany={props.onCreateCompany} isAdmin={isAdmin} />
        {(error || deleteError) && <div className="w-full p-3 text-sm text-red-500 rounded-lg bg-red-500/10 border border-red-500/30 mb-6">{error || deleteError}</div>}
        <WorkspaceList companies={companies} page={page} setPage={setPage} totalPages={totalPages} handleSelect={handleSelect} onEdit={props.onEditCompany} onDelete={triggerDeleteConfirm} onCreateCompany={props.onCreateCompany} isAdmin={isAdmin} />
      </main>
      <WorkspaceFooter user={user} currentTime={currentTime} />
      <ConfirmationDialog 
        isOpen={deleteModal.isOpen} 
        title="Delete Company" 
        description={`Are you sure you want to delete ${deleteModal.company?.name || ''}? This action is permanent and will delete all ledger accounts, inventory balances, and transactions associated with this company profile.`} 
        onConfirm={executeDelete} 
        onCancel={() => setDeleteModal({ isOpen: false, company: null })} 
        loading={deleteLoading} 
        variant="destructive"
        confirmText="Permanently Delete"
      />
    </div>
  );
}
