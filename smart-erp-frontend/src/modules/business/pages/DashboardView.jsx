import React from 'react';
import { useDashboardViewData } from './services/DashboardViewService';
import PageContainer from '@shared/components/PageContainer';
import SectionCard from '@shared/components/SectionCard';
import StatsGrid from '../components/StatsGrid';
import ShortcutsPanel from '../components/ShortcutsPanel';
import TimelinePanel from '../components/TimelinePanel';
import { ShieldAlert } from 'lucide-react';
import './styles/DashboardView.css';

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
    usersAccess,
    accessLoading,
    handleToggleAccess
  } = useDashboardViewData();

  if (!activeCompany) {
    return (
      <div className="db-no-company-container">
        <h2 className="text-lg font-bold">No Active Company Context</h2>
        <p className="text-sm">Please select or register a company context to load the SmartERP dashboard.</p>
        <button onClick={() => navigate('/company-select')} className="db-no-company-btn">Select Company</button>
      </div>
    );
  }

  return (
    <PageContainer>
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 text-sm font-semibold rounded-lg border border-rose-200 dark:border-rose-900/50 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={fetchDashboardData} className="px-3 py-1 bg-white dark:bg-slate-700 rounded text-xs border border-rose-200 dark:border-slate-600">Retry</button>
        </div>
      )}
      <StatsGrid stats={stats} navigate={navigate} />
      {summary.lowStockCount > 0 && (
        <div className="db-low-stock-alert">
          <ShieldAlert className="text-amber-600 dark:text-amber-400" size={20} />
          <div className="text-left">
            <div className="text-sm font-semibold text-amber-800 dark:text-amber-300">Low Stock Alert!</div>
            <p className="text-xs text-amber-700 dark:text-amber-400">There are {summary.lowStockCount} stock items at or below reorder levels.</p>
          </div>
          <button onClick={() => navigate('/inventory/stock-items')} className="ml-auto px-3 py-1.5 bg-amber-100 dark:bg-amber-900/50 text-amber-850 dark:text-amber-200 font-semibold rounded text-xs transition cursor-pointer">Review Stock</button>
        </div>
      )}
      <ShortcutsPanel navigate={navigate} />
      
      {user?.role === 'ADMIN' && (
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
      )}

      <TimelinePanel loading={loading} activities={activities} />
    </PageContainer>
  );
}
