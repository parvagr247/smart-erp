import React, { useState, useEffect } from 'react';
import { useDashboardViewData } from './services/DashboardViewService';
import PageContainer from '@shared/components/PageContainer';
import SectionCard from '@shared/components/SectionCard';
import StatsGrid from '../components/StatsGrid';
import ShortcutsPanel from '../components/ShortcutsPanel';
import TimelinePanel from '../components/TimelinePanel';
import { ShieldAlert, SlidersHorizontal, ArrowUp, ArrowDown, Eye, EyeOff, RotateCcw } from 'lucide-react';
import './styles/DashboardView.css';

const DEFAULT_LAYOUT = [
  { id: 'stats', label: 'Key Financial KPIs', visible: true },
  { id: 'alerts', label: 'Stock Reorder Alerts', visible: true },
  { id: 'shortcuts', label: 'Quick Actions shortcuts', visible: true },
  { id: 'access', label: 'Admin Access Settings', visible: true },
  { id: 'timeline', label: 'System Activity Timeline', visible: true }
];

export default function DashboardView() {
  const { 
    activeCompany, 
    user, 
    summary, 
    activities, 
    loading, 
    error, 
    todayStr, 
    stats, 
    navigate, 
    fetchDashboardData,
    // Access controls
    usersAccess,
    accessLoading,
    handleToggleAccess
  } = useDashboardViewData();

  const storageKey = `smarterp_dashboard_layout_${user?.email || 'guest'}`;
  const [layout, setLayout] = useState(DEFAULT_LAYOUT);
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Load layout from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setLayout(JSON.parse(saved));
      } catch (e) {
        setLayout(DEFAULT_LAYOUT);
      }
    }
  }, [storageKey]);

  const saveLayout = (newLayout) => {
    setLayout(newLayout);
    localStorage.setItem(storageKey, JSON.stringify(newLayout));
  };

  const handleToggleWidget = (id) => {
    const updated = layout.map(w => w.id === id ? { ...w, visible: !w.visible } : w);
    saveLayout(updated);
  };

  const handleMoveWidget = (index, direction) => {
    const updated = [...layout];
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= updated.length) return;
    
    // Swap items
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    saveLayout(updated);
  };

  const handleResetLayout = () => {
    saveLayout(DEFAULT_LAYOUT);
    setIsCustomizing(false);
  };

  if (!activeCompany) {
    return (
      <div className="db-no-company-container">
        <h2 className="text-lg font-bold">No Active Company Context</h2>
        <p className="text-sm">Please select or register a company context to load the SmartERP dashboard.</p>
        <button onClick={() => navigate('/company-select')} className="db-no-company-btn cursor-pointer">Select Company</button>
      </div>
    );
  }

  // Render widget content helper
  const renderWidget = (id) => {
    switch (id) {
      case 'stats':
        return <StatsGrid stats={stats} navigate={navigate} />;
      
      case 'alerts':
        if (summary.lowStockCount <= 0) return null;
        return (
          <div className="db-low-stock-alert flex items-center gap-3 p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl">
            <ShieldAlert className="text-amber-600 dark:text-amber-400 shrink-0" size={20} />
            <div className="text-left">
              <div className="text-sm font-semibold text-amber-800 dark:text-amber-300">Low Stock Alert!</div>
              <p className="text-xs text-amber-700 dark:text-amber-400">There are {summary.lowStockCount} stock items at or below reorder levels.</p>
            </div>
            <button onClick={() => navigate('/inventory/stock-items')} className="ml-auto px-3 py-1.5 bg-amber-100 dark:bg-amber-900/50 text-amber-850 dark:text-amber-200 font-semibold rounded text-xs transition cursor-pointer">Review Stock</button>
          </div>
        );

      case 'shortcuts':
        return <ShortcutsPanel navigate={navigate} />;

      case 'access':
        if (user?.role !== 'ADMIN') return null;
        return (
          <SectionCard 
            title={`Company Access Settings (Context: ${activeCompany.name})`} 
            description="Grant or revoke user access authorization for the active company context."
            className="w-full text-left"
          >
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-light)] text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">System Role</th>
                    <th className="py-3 px-4 text-center">Company Access</th>
                  </tr>
                </thead>
                <tbody>
                  {usersAccess.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-4 text-center text-[var(--text-muted)] italic">No non-admin users registered in the tenant environment.</td>
                    </tr>
                  ) : (
                    usersAccess.map((u) => (
                      <tr key={u.userId} className="border-b border-[var(--border-light)]/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                        <td className="py-3.5 px-4 font-semibold text-[var(--text-primary)]">{u.fullName}</td>
                        <td className="py-3.5 px-4 text-[var(--text-muted)]">{u.email}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            u.role === 'ACCOUNTANT' ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-150' : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-150'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex justify-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={u.hasAccess} 
                                disabled={accessLoading}
                                onChange={() => handleToggleAccess(u.userId, u.hasAccess)}
                                className="sr-only peer" 
                              />
                              <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </SectionCard>
        );

      case 'timeline':
        return <TimelinePanel loading={loading} activities={activities} />;

      default:
        return null;
    }
  };

  return (
    <PageContainer>
      {/* Title & Personalization Controls */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Welcome back, {user?.fullName}</h1>
          <p className="text-xs text-[var(--text-muted)] font-mono">{todayStr}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsCustomizing(!isCustomizing)}
            className={`px-3 py-1.5 border border-[var(--border-light)] rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${isCustomizing ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <SlidersHorizontal size={13} /> Customize Layout
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 text-sm font-semibold rounded-lg border border-rose-200 dark:border-rose-900/50 flex justify-between items-center mb-4">
          <span>{error}</span>
          <button onClick={fetchDashboardData} className="px-3 py-1 bg-white dark:bg-slate-700 rounded text-xs border border-rose-200 dark:border-slate-600">Retry</button>
        </div>
      )}

      {/* Personalizer Workspace */}
      {isCustomizing && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border border-[var(--border-light)] rounded-xl mb-6 text-left space-y-3">
          <div className="flex justify-between items-center border-b border-[var(--border-light)] pb-2 mb-2">
            <div>
              <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase">Configure Dashboard Cards</h3>
              <p className="text-[10px] text-[var(--text-muted)]">Toggle visibility and reorder widgets to customize your layout.</p>
            </div>
            <button
              onClick={handleResetLayout}
              className="text-[10px] font-bold text-rose-600 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RotateCcw size={10} /> Reset Layout
            </button>
          </div>
          <div className="space-y-2">
            {layout.map((w, idx) => (
              <div key={w.id} className="flex justify-between items-center bg-[var(--bg-surface)] border border-[var(--border-light)] p-2.5 rounded-lg text-xs">
                <span className="font-semibold text-[var(--text-primary)]">{w.label}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleWidget(w.id)}
                    className="p-1 border border-[var(--border-light)] hover:bg-[var(--bg-hover)] rounded text-[var(--text-secondary)] cursor-pointer"
                    title={w.visible ? "Hide Widget" : "Show Widget"}
                  >
                    {w.visible ? <Eye size={12} /> : <EyeOff size={12} className="text-rose-500" />}
                  </button>
                  <button
                    onClick={() => handleMoveWidget(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 border border-[var(--border-light)] hover:bg-[var(--bg-hover)] rounded disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    onClick={() => handleMoveWidget(idx, 1)}
                    disabled={idx === layout.length - 1}
                    className="p-1 border border-[var(--border-light)] hover:bg-[var(--bg-hover)] rounded disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Dashboard layout rendering */}
      <div className="space-y-6">
        {layout
          .filter(w => w.visible)
          .map(w => (
            <div key={w.id}>
              {renderWidget(w.id)}
            </div>
          ))}
      </div>
    </PageContainer>
  );
}
