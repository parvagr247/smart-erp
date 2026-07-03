import React from 'react';
import '@shared/styles/CommonComponents.css';

export default function PageContainer({ children }) {
  return (
    <div className="page-container">
      {children}
    </div>
  );
}
