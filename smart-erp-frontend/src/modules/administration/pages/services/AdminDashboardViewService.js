export function useAdminDashboardViewData() {
  const kpis = [
    { title: 'System Users', value: '3', iconType: 'users', trend: { value: '+1', isPositive: true, label: 'this week' } },
    { title: 'Security Roles', value: '4', iconType: 'roles' },
    { title: 'Audit Log Entries', value: '142', iconType: 'logs', trend: { value: '+24', isPositive: true, label: 'today' } },
    { title: 'API Server Status', value: '100%', iconType: 'status', trend: { value: 'Healthy', isPositive: true, label: 'uptime' } }
  ];
  return { kpis };
}
