import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import DataTable from '@shared/components/DataTable';
import StatusBadge from '@shared/components/StatusBadge';
import ActionButton from '@shared/components/ActionButton';
import { useAdminRolesViewData } from './services/AdminRolesViewService';
import { Plus } from 'lucide-react';
import './styles/AdminRolesView.css';

export default function AdminRolesView() {
  const { roles, handleCreateRole } = useAdminRolesViewData();
  const columns = [
    { key: 'name', header: 'Role Code' },
    { key: 'description', header: 'Description' },
    { key: 'users', header: 'Assigned Users' },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> }
  ];

  return (
    <PageContainer>
      <PageHeader title="Role Masters" description="Configure access control role groups defining tenant actions">
        <ActionButton label="Create Role" icon={<Plus size={14} />} onClick={handleCreateRole} />
      </PageHeader>
      <DataTable columns={columns} data={roles} />
    </PageContainer>
  );
}
