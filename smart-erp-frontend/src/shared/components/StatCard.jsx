import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import '@shared/styles/CommonComponents.css';

export default function StatCard({ title, value, icon, trend }) {
  const isPositive = trend?.isPositive;

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        {icon && <span className="stat-card-icon">{icon}</span>}
      </div>

      <div className="stat-card-content">
        <span className="stat-card-value font-heading">{value}</span>
        
        {trend && (
          <div className="stat-card-footer">
            <span className={`flex items-center gap-0.5 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {trend.value}
            </span>
            <span className="text-[var(--text-muted)] font-normal">{trend.label || 'vs last month'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
