import React from 'react';
import './styles/EmptyState.css';

export default function EmptyState({ title, description, icon, actionButton }) {
  return (
    <div className="empty-state-card">
      {icon && (
        <div className="empty-state-icon">
          {icon}
        </div>
      )}
      <h2 className="empty-state-title">{title}</h2>
      <p className="empty-state-desc">{description}</p>
      {actionButton && <div className="empty-state-action">{actionButton}</div>}
    </div>
  );
}
