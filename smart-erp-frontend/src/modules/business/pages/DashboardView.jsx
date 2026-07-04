import React from 'react';
import { useDashboardViewData } from './services/DashboardViewService';
import PageContainer from '@shared/components/PageContainer';
import ContextBanner from '../components/ContextBanner';
import StatsGrid from '../components/StatsGrid';
import ShortcutsPanel from '../components/ShortcutsPanel';
import TimelinePanel from '../components/TimelinePanel';
import { ShieldAlert } from 'lucide-react';
import './styles/DashboardView.css';

export default function DashboardView() {
  const { activeCompany, user, summary, activities, loading, error, todayStr, stats, navigate, fetchDashboardData } = useDashboardViewData();

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
      <ContextBanner activeCompany={activeCompany} user={user} todayStr={todayStr} />
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
      <TimelinePanel loading={loading} activities={activities} />
    </PageContainer>
  );
}
