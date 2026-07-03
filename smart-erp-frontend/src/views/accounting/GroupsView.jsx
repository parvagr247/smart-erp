import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import ActionButton from '../../components/common/ActionButton';
import StatusBadge from '../../components/common/StatusBadge';
import { Plus } from 'lucide-react';

const MOCK_GROUPS = [
  { id: '1', name: 'Bank Accounts', parent: 'Current Assets', nature: 'Assets', affectsGross: 'No', status: 'Active' },
  { id: '2', name: 'Duties & Taxes', parent: 'Current Liabilities', nature: 'Liabilities', affectsGross: 'No', status: 'Active' },
  { id: '3', name: 'Direct Expenses', parent: 'Primary', nature: 'Expenses', affectsGross: 'Yes', status: 'Active' },
  { id: '4', name: 'Sundry Debtors', parent: 'Current Assets', nature: 'Assets', affectsGross: 'No', status: 'Active' }
];

const COLUMNS = [
  { key: 'name', header: 'Group Name' },
  { key: 'parent', header: 'Parent Group' },
  { key: 'nature', header: 'Nature' },
  { key: 'affectsGross', header: 'Gross Profit Influence' },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> }
];

export default function GroupsView() {
  return (
    <PageContainer>
      <PageHeader 
        title="Account Groups" 
        description="Classify ledgers in hierarchical groups for structured trial balance generation"
      >
        <ActionButton 
          label="Create Group" 
          icon={<Plus size={14} />} 
          onClick={() => alert('Create Group dialog placeholder')} 
        />
      </PageHeader>
      
      <DataTable columns={COLUMNS} data={MOCK_GROUPS} />
    </PageContainer>
  );
}
