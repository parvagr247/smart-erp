import React, { useRef, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useStatCardData } from './services/StatCardService';
import { focusRegistry } from '@shared/interaction/FocusRegistry';
import './styles/StatCard.css';

export default function StatCard(props) {
  const { title, value, icon, trend } = props;
  const { isPositive, trendClass } = useStatCardData(props);
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (el) {
      el.tabIndex = 0;
      focusRegistry.register(el);
      return () => focusRegistry.unregister(el);
    }
  }, []);

  return (
    <div ref={cardRef} className="stat-card">
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
