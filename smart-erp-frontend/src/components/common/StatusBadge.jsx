import React from 'react';
import '../../styles/CommonComponents.css';

export default function StatusBadge({ status }) {
  const cleanStatus = String(status).toLowerCase();
  
  let badgeClass = 'status-badge-inactive';
  let label = status;

  if (cleanStatus === 'active' || cleanStatus === 'paid' || cleanStatus === 'success' || cleanStatus === 'true') {
    badgeClass = 'status-badge-active';
    label = cleanStatus === 'true' ? 'Active' : status;
  } else if (cleanStatus === 'pending' || cleanStatus === 'draft') {
    badgeClass = 'status-badge-pending';
  } else if (cleanStatus === 'danger' || cleanStatus === 'failed' || cleanStatus === 'overdue' || cleanStatus === 'false') {
    badgeClass = 'status-badge-danger';
    label = cleanStatus === 'false' ? 'Inactive' : status;
  }

  return (
    <span className={`status-badge ${badgeClass}`}>
      {label}
    </span>
  );
}
