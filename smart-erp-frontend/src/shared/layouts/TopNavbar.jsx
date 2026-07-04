import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';
import { useAuth } from '@shared/context/AuthContext';
import CompanySelector from '@modules/administration/components/CompanySelector';
import useNotifications from '@shared/hooks/useNotifications';
import { Search, Bell, Sun, Moon, LogOut, Settings, User as UserIcon, Building2, Calendar, Keyboard } from 'lucide-react';
import { useInteraction } from '@shared/interaction/InteractionContext';

export default function TopNavbar({ onSearchClick }) {
  const navigate = useNavigate();
  const { activeCompany } = useActiveCompany();
  const { user, theme, toggleTheme, handleLogout } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    filterType, 
    setFilterType, 
    hasMore, 
    setPageSize, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();
  const { setIsShortcutOverlayOpen } = useInteraction();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside clicks
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
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
    <header className="navbar-top">
      {/* Active Company summary details */}
      <div className="navbar-left">
        <div 
          onClick={() => activeCompany && navigate('/company-profile')}
          className={`hidden sm:flex flex-col text-left ${activeCompany ? 'cursor-pointer hover:opacity-85 transition-all' : ''}`}
          title={activeCompany ? "View Company Profile" : ""}
        >
          <span className="text-sm font-bold text-[var(--text-primary)] font-heading leading-tight truncate max-w-xs">
            {activeCompany?.name || 'No Company Active'}
          </span>
          <span className="text-[10px] text-[var(--text-muted)] font-mono leading-none">
            FY: {activeCompany?.financialYear || 'N/A'} | GST: {activeCompany?.gstNumber || 'N/A'}
          </span>
        </div>
        <CompanySelector />
      </div>

      {/* Keyboard Mode Indicator */}
      {activeCompany?.keyboardOnlyMode && (
        <div className="flex items-center mx-2">
          <span className="px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-full text-[10px] sm:text-[11px] font-bold flex items-center gap-1.5 shadow-sm animate-pulse select-none">
            ⌨️ Keyboard Mode Enabled
          </span>
        </div>
      )}

      {/* Action buttons */}
      <div className="navbar-right">
        {/* Command Search bar trigger */}
        <button
          onClick={onSearchClick}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-[var(--border-light)] bg-[var(--bg-input)] rounded-lg text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer select-none transition-all w-48"
        >
          <Search size={14} />
          <span>Search... (Ctrl + K)</span>
        </button>

        {/* Keyboard shortcut help trigger */}
        <button
          onClick={() => setIsShortcutOverlayOpen(prev => !prev)}
          className="w-9 h-9 border border-[var(--border-light)] rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-input)] cursor-pointer transition-colors"
          aria-label="Keyboard Shortcut Help"
          title="Keyboard Shortcut Help (F1)"
        >
          <Keyboard size={16} />
        </button>

        {/* Theme mode toggler */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 border border-[var(--border-light)] rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-input)] cursor-pointer transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-9 h-9 border border-[var(--border-light)] rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-input)] cursor-pointer relative transition-colors"
            aria-label="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[var(--bg-surface)] animate-pulse" />
            )}
          </button>

          {isNotifOpen && (
            <div className="notification-menu">
              <div className="notification-header">
                <div className="flex justify-between items-center w-full mb-2">
                  <span className="notification-title">Notifications</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-[10px] font-bold text-[var(--primary)] hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                {/* Filter Tabs */}
                <div className="flex gap-1.5 border-b border-[var(--border-light)] pb-2.5 w-full">
                  <button 
                    onClick={() => setFilterType('ALL')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${filterType === 'ALL' ? 'bg-[var(--primary)] text-white' : 'bg-neutral-100 dark:bg-neutral-900 text-[var(--text-secondary)] hover:bg-neutral-200'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setFilterType('UNREAD')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${filterType === 'UNREAD' ? 'bg-[var(--primary)] text-white' : 'bg-neutral-100 dark:bg-neutral-900 text-[var(--text-secondary)] hover:bg-neutral-200'}`}
                  >
                    Unread ({unreadCount})
                  </button>
                  <button 
                    onClick={() => setFilterType('HIGH')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${filterType === 'HIGH' ? 'bg-[var(--primary)] text-white' : 'bg-neutral-100 dark:bg-neutral-900 text-[var(--text-secondary)] hover:bg-neutral-200'}`}
                  >
                    High Priority
                  </button>
                </div>
              </div>
              <div className="notification-list max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                    <Bell size={24} className="text-neutral-300 mb-2" />
                    <span className="text-xs font-bold text-[var(--text-primary)]">No alerts available</span>
                    <span className="text-[10px] text-[var(--text-muted)] mt-0.5">Nothing matches your active filter.</span>
                  </div>
                ) : (
                  notifications.map((n) => {
                    let priorityColor = "bg-neutral-100 text-neutral-600";
                    if (n.priority === "HIGH") priorityColor = "bg-rose-50 dark:bg-rose-950/20 text-rose-600";
                    else if (n.priority === "MEDIUM") priorityColor = "bg-amber-50 dark:bg-amber-950/20 text-amber-600";

                    return (
                      <div
                        key={n.id}
                        className={`notification-item flex items-start gap-2.5 p-3 hover:bg-[var(--bg-hover)] border-b border-[var(--border-light)] relative ${!n.isRead ? 'notification-item-unread bg-neutral-50/50 dark:bg-neutral-900/30' : ''}`}
                      >
                        {/* Priority/Icon Circle */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${priorityColor}`}>
                          <Bell size={12} />
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-[var(--text-primary)] truncate pr-4">{n.title}</span>
                            <span className="text-[9px] text-[var(--text-muted)] shrink-0 font-mono">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">{n.desc}</p>
                          <div className="flex gap-3 mt-2">
                            {!n.isRead && (
                              <button 
                                onClick={() => markAsRead(n.id)}
                                className="text-[10px] font-bold text-[var(--primary)] hover:underline cursor-pointer flex items-center gap-0.5"
                              >
                                Mark Read
                              </button>
                            )}
                            <button 
                              onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                              className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              {hasMore && (
                <div className="p-2 border-t border-[var(--border-light)] text-center">
                  <button 
                    onClick={() => setPageSize(prev => prev + 5)}
                    className="text-[10px] font-bold text-[var(--primary)] hover:underline cursor-pointer"
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile avatar initials dropdown */}
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
      </div>
    </header>
  );
}
