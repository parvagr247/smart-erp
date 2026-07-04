import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import DataTable from '@shared/components/DataTable';
import StatusBadge from '@shared/components/StatusBadge';
import ActionButton from '@shared/components/ActionButton';
import { useAdminUsersViewData } from './services/AdminUsersViewService';
import { Plus } from 'lucide-react';
import './styles/AdminUsersView.css';

export default function AdminUsersView() {
  const { users, handleAddUser } = useAdminUsersViewData();
  const columns = [
    { key: 'fullName', header: 'Full Name' },
    { key: 'email', header: 'Email Address' },
    { key: 'role', header: 'Role Scope' },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> }
  ];

  return (
    <PageContainer>
      <PageHeader title="Users Configuration" description="View and authorize tenant accounts access to SmartERP environments">
        <ActionButton label="Add User" icon={<Plus size={14} />} onClick={handleAddUser} />
      </PageHeader>
      <DataTable columns={columns} data={users} />
    </PageContainer>
  );
}
