import React from 'react';
import StatusBadge from '@shared/components/StatusBadge';

export function useCustomersViewData() {
  const mockCustomers = [
    { id: '1', name: 'Acme Traders', gstin: '27AAAAA1111A1Z1', state: 'Maharashtra', balance: '₹45,200.00 Cr', email: 'billing@acme.com', status: 'Active' },
    { id: '2', name: 'Global Logistics', gstin: '24BBBBB2222B2Z2', state: 'Gujarat', balance: '₹12,400.00 Cr', email: 'accounts@globallog.com', status: 'Active' },
    { id: '3', name: 'Vertex Systems', gstin: '09CCCCC3333C3Z3', state: 'Uttar Pradesh', balance: '₹0.00', email: 'finance@vertex.in', status: 'Active' }
  ];

  const columns = [
    { key: 'name', header: 'Customer Name' },
    { key: 'gstin', header: 'GSTIN' },
    { key: 'state', header: 'Billing State' },
    { key: 'balance', header: 'Outstanding Balance' },
    { key: 'email', header: 'Contact Email' },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> }
  ];

  return { mockCustomers, columns };
}
