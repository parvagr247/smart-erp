import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import DataTable from '@shared/components/DataTable';
import StatusBadge from '@shared/components/StatusBadge';
import ActionButton from '@shared/components/ActionButton';
import { useAdminAuditLogsViewData } from './services/AdminAuditLogsViewService';
import { Trash2 } from 'lucide-react';
import './styles/AdminAuditLogsView.css';

export default function AdminAuditLogsView() {
  const { audits, handleClearLogs } = useAdminAuditLogsViewData();
  const columns = [
    { key: 'time', header: 'Timestamp' },
    { key: 'user', header: 'System User' },
    { key: 'event', header: 'Action Event' },
    { key: 'ip', header: 'IP Address' },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> }
  ];

  return (
    <PageContainer>
      <PageHeader title="System Audit Logs" description="Verify security events, data operations, and logins track records">
        <ActionButton label="Clear Logs" variant="destructive" icon={<Trash2 size={14} />} onClick={handleClearLogs} />
      </PageHeader>
      <DataTable columns={columns} data={audits} />
    </PageContainer>
  );
}
