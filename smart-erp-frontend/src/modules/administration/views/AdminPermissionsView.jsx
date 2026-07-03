import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import DataTable from '@shared/components/DataTable';
import StatusBadge from '@shared/components/StatusBadge';
import ActionButton from '@shared/components/ActionButton';
import { ShieldCheck } from 'lucide-react';

const MOCK_PERMISSIONS = [
  { id: '1', module: 'Accounting', role: 'USER', read: 'Yes', write: 'Yes', delete: 'No', export: 'Yes' },
  { id: '2', module: 'Accounting', role: 'ADMIN', read: 'Yes', write: 'Yes', delete: 'Yes', export: 'Yes' },
  { id: '3', module: 'Accounting', role: 'AUDITOR', read: 'Yes', write: 'No', delete: 'No', export: 'Yes' },
  { id: '4', module: 'Administration', role: 'USER', read: 'No', write: 'No', delete: 'No', export: 'No' }
];

const COLUMNS = [
  { key: 'module', header: 'Module Name' },
  { key: 'role', header: 'Target Role' },
  { key: 'read', header: 'Read Access', render: (row) => <StatusBadge status={row.read === 'Yes' ? 'Active' : 'False'} /> },
  { key: 'write', header: 'Write Access', render: (row) => <StatusBadge status={row.write === 'Yes' ? 'Active' : 'False'} /> },
  { key: 'delete', header: 'Delete Access', render: (row) => <StatusBadge status={row.delete === 'Yes' ? 'Active' : 'False'} /> },
  { key: 'export', header: 'Export Access', render: (row) => <StatusBadge status={row.export === 'Yes' ? 'Active' : 'False'} /> }
];

export default function AdminPermissionsView() {
  return (
    <PageContainer>
      <PageHeader 
        title="Permissions Map" 
        description="Fuzzy map access privileges (Read/Write/Delete/Export) across modules"
      >
        <ActionButton 
          label="Save Mapping" 
          icon={<ShieldCheck size={14} />} 
          onClick={() => alert('Permissions saved mapping placeholder')} 
        />
      </PageHeader>
      
      <DataTable columns={COLUMNS} data={MOCK_PERMISSIONS} />
    </PageContainer>
  );
}
