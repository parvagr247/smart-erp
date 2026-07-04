import React from 'react';
import './styles/PageHeader.css';

export default function PageHeader({ title, description, children }) {
  return (
    <div className="page-header-container">
      <div className="page-header-meta">
        <h1 className="page-header-title font-heading">{title}</h1>
        {description && <p className="page-header-desc">{description}</p>}
      </div>
      {children && (
        <div className="page-header-toolbar">
          {children}
        </div>
      )}
    </div>
  );
}
