import React from 'react';
import './styles/StatsGrid.css';

export default function StatsGrid({ stats, navigate }) {
  return (
    <div className="db-stats-grid">
      {stats.map((s, idx) => (
        <div key={idx} onClick={() => s.path && navigate(s.path)} className="db-stat-card">
          <span className="db-kpi-title">{s.title}</span>
          <span className="db-kpi-value">{s.value}</span>
          <span className="db-kpi-desc">{s.desc}</span>
        </div>
      ))}
    </div>
  );
}
