import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import ActionButton from '../../components/common/ActionButton';
import { Plus } from 'lucide-react';

const MOCK_USERS = [
  { id: '1', fullName: 'System Administrator', email: 'admin@smarterp.com', role: 'ADMIN', status: 'Active' },
  { id: '2', fullName: 'Parth Agrawal', email: 'parvagr247@gmail.com', role: 'ADMIN', status: 'Active' },
  { id: '3', fullName: 'John Doe Accountant', email: 'john.doe@company.com', role: 'USER', status: 'Active' }
];

const COLUMNS = [
  { key: 'fullName', header: 'Full Name' },
  { key: 'email', header: 'Email Address' },
  { key: 'role', header: 'Role Scope' },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> }
];

export default function AdminUsersView() {
  return (
    <PageContainer>
      <PageHeader 
        title="Users Configuration" 
        description="View and authorize tenant accounts access to SmartERP environments"
      >
        <ActionButton 
          label="Add User" 
          icon={<Plus size={14} />} 
          onClick={() => alert('Create user dialog placeholder')} 
        />
      </PageHeader>
      
      <DataTable columns={COLUMNS} data={MOCK_USERS} />
    </PageContainer>
  );
}
