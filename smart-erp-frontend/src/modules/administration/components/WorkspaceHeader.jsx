import React from 'react';
import { Briefcase, Sun, Moon, LogOut } from 'lucide-react';
import './styles/WorkspaceHeader.css';

export default function WorkspaceHeader({ user, theme, onToggleTheme, onLogout, getInitials }) {
  return (
    <header className="w-full h-16 border-b border-[var(--border-light)] bg-[var(--bg-surface)] px-6 flex items-center justify-between shadow-sm sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[var(--primary)] to-indigo-600 text-white flex items-center justify-center shadow-md">
          <Briefcase size={18} />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-sm font-black font-heading tracking-wider leading-none text-[var(--text-primary)]">SmartERP</span>
          <span className="text-[10px] text-[var(--text-muted)] font-mono leading-none mt-1">WORKSPACE SELECTOR</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleTheme}
          className="w-9 h-9 border border-[var(--border-light)] rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-input)] cursor-pointer transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="flex items-center gap-2 border-l border-[var(--border-light)] pl-4">
          <div className="h-8 w-8 rounded-full bg-[var(--primary)] text-white text-xs font-black flex items-center justify-center shadow-sm">
            {getInitials(user?.name)}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-[var(--text-primary)] leading-tight">{user?.name || 'User'}</span>
            <span className="text-[9px] text-[var(--text-muted)] leading-none truncate max-w-[120px]">{user?.email || 'N/A'}</span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-9 h-9 border border-red-500/20 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500/10 cursor-pointer transition-colors"
          title="Log Out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
