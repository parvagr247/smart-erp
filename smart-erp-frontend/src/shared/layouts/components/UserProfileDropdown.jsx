import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/context/AuthContext';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';
import { LogOut, Settings, User as UserIcon, Building2, Calendar } from 'lucide-react';

export default function UserProfileDropdown() {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();
  const { activeCompany } = useActiveCompany();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="relative" ref={profileRef}>
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="w-9 h-9 rounded-full bg-[var(--primary)] text-white font-bold text-sm flex items-center justify-center hover:opacity-90 cursor-pointer border border-[var(--border-light)]"
        aria-label="Profile Menu"
      >
        {getInitials(user?.fullName)}
      </button>

      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 p-3 space-y-2">
          <div className="px-1 py-1 text-left">
            <div className="font-bold text-sm text-[var(--text-primary)] truncate">{user?.fullName}</div>
            <div className="text-xs text-[var(--text-muted)] truncate mb-2">{user?.email}</div>
            
            {/* Active Company Metadata */}
            {activeCompany && (
              <div className="mt-2 pt-2 border-t border-[var(--border-light)] space-y-1.5 text-xs text-[var(--text-secondary)]">
                <div 
                  onClick={() => { setIsProfileOpen(false); navigate('/company-profile'); }}
                  className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)] cursor-pointer hover:text-[var(--primary)] transition-colors"
                  title="View Company Profile"
                >
                  <Building2 size={13} className="text-indigo-500 shrink-0" />
                  <span className="truncate">{activeCompany.name}</span>
                </div>
                <div className="pl-4 text-[10px] space-y-1 text-[var(--text-secondary)]">
                  <div><strong>GSTIN:</strong> {activeCompany.gstNumber || 'N/A'}</div>
                  <div><strong>FY Period:</strong> {activeCompany.financialYear || 'N/A'}</div>
                </div>
              </div>
            )}
            
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
              onClick={() => { setIsProfileOpen(false); navigate('/logout'); }}
              className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
