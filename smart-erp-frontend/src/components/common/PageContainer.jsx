import React from 'react';
import '../../styles/CommonComponents.css';

export default function PageContainer({ children }) {
  return (
    <div className="page-container">
      {children}
    </div>
  );
}
