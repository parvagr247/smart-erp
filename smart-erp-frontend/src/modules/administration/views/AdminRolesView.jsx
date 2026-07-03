import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import DataTable from '@shared/components/DataTable';
import StatusBadge from '@shared/components/StatusBadge';
import ActionButton from '@shared/components/ActionButton';
import { Plus } from 'lucide-react';

const MOCK_ROLES = [
  { id: '1', name: 'ADMIN', description: 'Full system administration capabilities across all tenants', users: '2', status: 'Active' },
  { id: '2', name: 'USER', description: 'Standard accounting, stock entry and sales voucher logs operations', users: '1', status: 'Active' },
  { id: '3', name: 'AUDITOR', description: 'Read-only audit access to financial books and logs summaries', users: '0', status: 'Active' }
];

const COLUMNS = [
  { key: 'name', header: 'Role Code' },
  { key: 'description', header: 'Description' },
  { key: 'users', header: 'Assigned Users' },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> }
];

export default function AdminRolesView() {
  return (
    <PageContainer>
      <PageHeader 
        title="Role Masters" 
        description="Configure access control role groups defining tenant actions"
      >
        <ActionButton 
          label="Create Role" 
          icon={<Plus size={14} />} 
          onClick={() => alert('Create role dialog placeholder')} 
        />
      </PageHeader>
      
      <DataTable columns={COLUMNS} data={MOCK_ROLES} />
    </PageContainer>
  );
}
