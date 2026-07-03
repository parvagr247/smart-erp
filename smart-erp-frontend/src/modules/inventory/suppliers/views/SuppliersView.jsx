import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import DataTable from '@shared/components/DataTable';
import ActionButton from '@shared/components/ActionButton';
import StatusBadge from '@shared/components/StatusBadge';
import { Plus } from 'lucide-react';

const MOCK_SUPPLIERS = [
  { id: '1', name: 'Zeta Manufacturing', gstin: '27DDDDD4444D4Z4', state: 'Maharashtra', balance: '₹1,50,000.00 Dr', email: 'sales@zetamanuf.com', status: 'Active' },
  { id: '2', name: 'Prime Packaging', gstin: '29EEEEE5555E5Z5', state: 'Karnataka', balance: '₹84,300.00 Dr', email: 'billing@primepack.com', status: 'Active' }
];

const COLUMNS = [
  { key: 'name', header: 'Supplier Name' },
  { key: 'gstin', header: 'GSTIN' },
  { key: 'state', header: 'Billing State' },
  { key: 'balance', header: 'Outstanding Balance' },
  { key: 'email', header: 'Contact Email' },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> }
];

export default function SuppliersView() {
  return (
    <PageContainer>
      <PageHeader 
        title="Supplier Contacts" 
        description="Sundry creditors registry details containing vendor tax parameters and payables"
      >
        <ActionButton 
          label="Create Supplier" 
          icon={<Plus size={14} />} 
          onClick={() => alert('Create Supplier dialog placeholder')} 
        />
      </PageHeader>
      
      <DataTable columns={COLUMNS} data={MOCK_SUPPLIERS} />
    </PageContainer>
  );
}
