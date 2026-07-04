import React from 'react';
import SectionCard from '@shared/components/SectionCard';
import './styles/TimelinePanel.css';

export default function TimelinePanel({ loading, activities }) {
  return (
    <SectionCard title="Recent Activity Timeline" description="Recent master modifications and transaction logs" className="text-left">
      {loading ? (
        <div className="text-center py-8 text-xs text-slate-400">Loading timeline...</div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-400">No activity records found.</div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          {activities.map((act, idx) => (
            <div key={idx} className="db-timeline-item">
              <div className="text-left">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold mr-3 ${
                  act.type === 'LEDGER' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400' :
                  act.type === 'PARTNER' ? 'bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400' :
                  'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'
                }`}>
                  {act.type}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{act.title}</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{act.details}</p>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
