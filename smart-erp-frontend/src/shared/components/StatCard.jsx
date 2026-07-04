import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useStatCardData } from './services/StatCardService';
import './styles/StatCard.css';

export default function StatCard(props) {
  const { title, value, icon, trend } = props;
  const { isPositive, trendClass } = useStatCardData(props);

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
            <span className={`stat-card-trend ${trendClass}`}>
              {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {trend.value}
            </span>
            <span className="stat-card-trend-label">{trend.label || 'vs last month'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
