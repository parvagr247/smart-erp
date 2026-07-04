import React from 'react';
import WorkspaceHeader from '../components/WorkspaceHeader';
import WorkspaceFooter from '../components/WorkspaceFooter';
import CompanyForm from '../components/CompanyForm';
import { Card, CardHeader, CardTitle, CardDescription } from '@shared/components/ui/card';
import { useEditCompanyViewData } from './services/EditCompanyViewService';
import { ChevronLeft } from 'lucide-react';
import './styles/EditCompanyView.css';

export default function EditCompanyView(props) {
  const { user, theme, toggleTheme, handleLogout, formHooks, currentTime, getInitials } = useEditCompanyViewData(props);

  return (
    <div className="h-screen overflow-y-auto flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200">
      <WorkspaceHeader user={user} theme={theme} onToggleTheme={toggleTheme} onLogout={handleLogout} getInitials={getInitials} />
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10 flex flex-col justify-start">
        <div className="mb-6 text-left">
          <button onClick={props.onCancel} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-light)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)] transition-all text-xs font-semibold cursor-pointer"><ChevronLeft size={14} />Back to Workspaces</button>
        </div>
        <Card className="shadow-lg border border-[var(--border-light)] bg-[var(--bg-surface)] overflow-hidden">
          <CardHeader className="text-center pb-6 border-b border-[var(--border-light)] bg-[var(--bg-input)]/10">
            <CardTitle className="text-xl font-bold font-heading tracking-tight text-[var(--text-primary)]">Edit Company</CardTitle>
            <CardDescription className="text-xs text-[var(--text-secondary)]">Update your enterprise configuration profile</CardDescription>
          </CardHeader>
          <div className="p-6"><CompanyForm formHooks={formHooks} onCancel={props.onCancel} isEdit={true} /></div>
        </Card>
      </main>
      <WorkspaceFooter user={user} currentTime={currentTime} />
    </div>
  );
}
