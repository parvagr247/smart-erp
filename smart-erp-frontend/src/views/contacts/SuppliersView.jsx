import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import ActionButton from '../../components/common/ActionButton';
import StatusBadge from '../../components/common/StatusBadge';
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
