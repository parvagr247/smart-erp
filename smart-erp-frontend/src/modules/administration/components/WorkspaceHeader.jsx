import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, Sun, Moon, LogOut, User as UserIcon, Settings, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './styles/WorkspaceHeader.css';

export default function WorkspaceHeader({ user, theme, onToggleTheme, onLogout, getInitials }) {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown on outside clicks
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <header className="navbar-top">
      <div className="navbar-left">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[var(--primary)] to-indigo-600 text-white flex items-center justify-center shadow-md">
          <Briefcase size={18} />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-sm font-black font-heading tracking-wider leading-none text-[var(--text-primary)]">SmartERP</span>
          <span className="text-[10px] text-[var(--text-muted)] font-mono leading-none mt-1">WORKSPACE SELECTOR</span>
        </div>
      </div>

      <div className="navbar-right">
        {/* Theme mode toggler */}
        <button
          onClick={onToggleTheme}
          className="w-9 h-9 border border-[var(--border-light)] rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-input)] cursor-pointer transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* User Profile avatar initials dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-9 h-9 rounded-full bg-[var(--primary)] text-white font-bold text-sm flex items-center justify-center hover:opacity-90 cursor-pointer border border-[var(--border-light)]"
            aria-label="Profile Menu"
          >
            {getInitials(user?.name)}
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 p-3 space-y-2">
              <div className="px-1 py-1 text-left">
                <div className="font-bold text-sm text-[var(--text-primary)] truncate">{user?.name || 'User'}</div>
                <div className="text-xs text-[var(--text-muted)] truncate mb-2">{user?.email}</div>
                
                <div className="mt-2 pt-2 border-t border-[var(--border-light)] flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
                  <Calendar size={12} className="text-indigo-400 shrink-0" />
                  <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>

              <div className="border-t border-[var(--border-light)] pt-2 space-y-1">
                <button
                  onClick={() => { setIsProfileOpen(false); navigate('/settings'); }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-input)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <UserIcon size={14} /> My Profile
                </button>
                <button
                  onClick={() => { setIsProfileOpen(false); navigate('/settings'); }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-input)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <Settings size={14} /> Settings
                </button>
                <button
                  onClick={() => { setIsProfileOpen(false); onLogout(); }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
