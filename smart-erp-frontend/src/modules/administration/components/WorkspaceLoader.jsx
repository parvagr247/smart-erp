import React from 'react';
import './styles/WorkspaceLoader.css';

export default function WorkspaceLoader() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[var(--bg-base)] gap-3">
      <div className="h-8 w-8 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
      <span className="text-sm font-semibold text-[var(--text-secondary)] animate-pulse">Loading workspaces...</span>
    </div>
  );
}
