import React from 'react';
import './styles/PageContainer.css';

export default function PageContainer({ children }) {
  return (
    <div className="page-container">
      {children}
    </div>
  );
}
