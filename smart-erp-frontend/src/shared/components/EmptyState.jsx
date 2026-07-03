import React from 'react';
import '@modules/administration/styles/company.css';

export default function EmptyState({ title, description, icon, actionButton }) {
  return (
    <div className="empty-state-card mt-6">
      {icon && (
        <div className="empty-state-icon">
          {icon}
        </div>
      )}
      <h2 className="empty-state-title">{title}</h2>
      <p className="empty-state-desc">{description}</p>
      {actionButton && <div className="mt-2">{actionButton}</div>}
    </div>
  );
}
