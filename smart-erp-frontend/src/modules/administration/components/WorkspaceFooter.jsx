import React from 'react';
import { Shield, Terminal, Clock } from 'lucide-react';
import './styles/WorkspaceFooter.css';

export default function WorkspaceFooter({ user, currentTime }) {
  return (
    <footer className="w-full border-t border-[var(--border-light)] bg-[var(--bg-surface)] py-4 px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--text-muted)] font-mono">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <span className="flex items-center gap-1">
          <Shield size={12} className="text-green-500" />
          Security Profile: <strong className="text-[var(--text-secondary)]">{user?.role || 'User'}</strong>
        </span>
        <span className="flex items-center gap-1">
          <Terminal size={12} />
          API Connection: <strong className="text-green-500">Connected</strong>
        </span>
        <span className="flex items-center gap-1">
          <Clock size={12} />
          Local Time: <strong className="text-[var(--text-secondary)]">{currentTime}</strong>
        </span>
      </div>
      <div>
        &copy; {new Date().getFullYear()} SmartERP. All rights reserved. Platform v1.0.0
      </div>
    </footer>
  );
}
