export function useAdminAuditLogsViewData() {
  const audits = [
    { id: '1', time: '2026-07-03 09:44:12', user: 'parvagr247@gmail.com', event: 'Company Switch: Active scope switched to "Acme Corp"', ip: '192.168.1.42', status: 'Success' },
    { id: '2', time: '2026-07-03 09:37:08', user: 'parvagr247@gmail.com', event: 'Authentication Login: Valid JWT token issued', ip: '192.168.1.42', status: 'Success' },
    { id: '3', time: '2026-07-03 08:12:09', user: 'john.doe@company.com', event: 'Record Modification: Updated Company "Apex Tech"', ip: '122.14.9.112', status: 'Success' }
  ];
  const handleClearLogs = () => {
    alert('Clear logs placeholder');
  };
  return { audits, handleClearLogs };
}
