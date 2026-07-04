import React from 'react';
import { Building2, User, Calendar } from 'lucide-react';
import './styles/ContextBanner.css';

export default function ContextBanner({ activeCompany, user, todayStr }) {
  return (
    <div className="db-banner">
      <div className="space-y-1 text-left">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-semibold">
          <Building2 size={16} className="text-indigo-500" />
          <span>{activeCompany.companyName}</span>
          <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] uppercase font-bold rounded">
            FY {activeCompany.financialYear}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Company ID: {activeCompany.id}</p>
      </div>
      <div className="db-banner-meta">
        <div className="flex items-center gap-1.5">
          <User size={14} className="text-indigo-400" />
          <span>{user?.email || 'Admin'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={14} className="text-indigo-400" />
          <span>{todayStr}</span>
        </div>
      </div>
    </div>
  );
}
