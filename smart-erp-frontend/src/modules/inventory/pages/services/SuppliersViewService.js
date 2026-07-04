import React from 'react';
import StatusBadge from '@shared/components/StatusBadge';

export function useSuppliersViewData() {
  const mockSuppliers = [
    { id: '1', name: 'Zeta Manufacturing', gstin: '27DDDDD4444D4Z4', state: 'Maharashtra', balance: '₹1,50,000.00 Dr', email: 'sales@zetamanuf.com', status: 'Active' },
    { id: '2', name: 'Prime Packaging', gstin: '29EEEEE5555E5Z5', state: 'Karnataka', balance: '₹84,300.00 Dr', email: 'billing@primepack.com', status: 'Active' }
  ];

  const columns = [
    { key: 'name', header: 'Supplier Name' },
    { key: 'gstin', header: 'GSTIN' },
    { key: 'state', header: 'Billing State' },
    { key: 'balance', header: 'Outstanding Balance' },
    { key: 'email', header: 'Contact Email' },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> }
  ];

  return { mockSuppliers, columns };
}
