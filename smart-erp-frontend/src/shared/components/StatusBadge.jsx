import React from 'react';
import { useStatusBadgeData } from './services/StatusBadgeService';
import './styles/StatusBadge.css';

export default function StatusBadge(props) {
  const { badgeClass, label } = useStatusBadgeData(props);

  return (
    <span className={`status-badge ${badgeClass}`}>
      {label}
    </span>
  );
}
