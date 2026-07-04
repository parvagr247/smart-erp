import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import DataTable from '@shared/components/DataTable';
import StatusBadge from '@shared/components/StatusBadge';
import ActionButton from '@shared/components/ActionButton';
import { useAdminPermissionsViewData } from './services/AdminPermissionsViewService';
import { ShieldCheck } from 'lucide-react';
import './styles/AdminPermissionsView.css';

export default function AdminPermissionsView() {
  const { permissions, handleSaveMapping } = useAdminPermissionsViewData();
  const columns = [
    { key: 'module', header: 'Module Name' },
    { key: 'role', header: 'Target Role' },
    { key: 'read', header: 'Read Access', render: (row) => <StatusBadge status={row.read === 'Yes' ? 'Active' : 'False'} /> },
    { key: 'write', header: 'Write Access', render: (row) => <StatusBadge status={row.write === 'Yes' ? 'Active' : 'False'} /> },
    { key: 'delete', header: 'Delete Access', render: (row) => <StatusBadge status={row.delete === 'Yes' ? 'Active' : 'False'} /> },
    { key: 'export', header: 'Export Access', render: (row) => <StatusBadge status={row.export === 'Yes' ? 'Active' : 'False'} /> }
  ];

  return (
    <PageContainer>
      <PageHeader title="Permissions Map" description="Fuzzy map access privileges (Read/Write/Delete/Export) across modules">
        <ActionButton label="Save Mapping" icon={<ShieldCheck size={14} />} onClick={handleSaveMapping} />
      </PageHeader>
      <DataTable columns={columns} data={permissions} />
    </PageContainer>
  );
}
