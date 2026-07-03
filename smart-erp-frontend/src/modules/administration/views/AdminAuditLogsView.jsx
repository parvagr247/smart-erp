import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import DataTable from '@shared/components/DataTable';
import StatusBadge from '@shared/components/StatusBadge';
import ActionButton from '@shared/components/ActionButton';
import { Trash2 } from 'lucide-react';

const MOCK_AUDITS = [
  { id: '1', time: '2026-07-03 09:44:12', user: 'parvagr247@gmail.com', event: 'Company Switch: Active scope switched to "Acme Corp"', ip: '192.168.1.42', status: 'Success' },
  { id: '2', time: '2026-07-03 09:37:08', user: 'parvagr247@gmail.com', event: 'Authentication Login: Valid JWT token issued', ip: '192.168.1.42', status: 'Success' },
  { id: '3', time: '2026-07-03 08:12:09', user: 'john.doe@company.com', event: 'Record Modification: Updated Company "Apex Tech"', ip: '122.14.9.112', status: 'Success' }
];

const COLUMNS = [
  { key: 'time', header: 'Timestamp' },
  { key: 'user', header: 'System User' },
  { key: 'event', header: 'Action Event' },
  { key: 'ip', header: 'IP Address' },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> }
];

export default function AdminAuditLogsView() {
  return (
    <PageContainer>
      <PageHeader 
        title="System Audit Logs" 
        description="Verify security events, data operations, and logins track records"
      >
        <ActionButton 
          label="Clear Logs" 
          variant="destructive"
          icon={<Trash2 size={14} />} 
          onClick={() => alert('Clear logs placeholder')} 
        />
      </PageHeader>
      
      <DataTable columns={COLUMNS} data={MOCK_AUDITS} />
    </PageContainer>
  );
}
