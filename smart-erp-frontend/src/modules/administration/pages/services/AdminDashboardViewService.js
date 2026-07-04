import { useState, useEffect } from 'react';
import { inventoryService } from '@modules/inventory/inventory.service';

export function useAdminDashboardViewData() {
  const [logCount, setLogCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const res = await inventoryService.getDashboardRecentActivity();
        if (res.success && res.data && res.data.activities) {
          setLogCount(res.data.activities.length);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, []);

  const kpis = [
    { title: 'System Users', value: '3', iconType: 'users', trend: { value: 'Active', isPositive: true, label: 'this week' } },
    { title: 'Security Roles', value: '3', iconType: 'roles' },
    { title: 'Audit Log Entries', value: loading ? '...' : String(logCount), iconType: 'logs', trend: { value: 'Synced', isPositive: true, label: 'now' } },
    { title: 'API Server Status', value: '100%', iconType: 'status', trend: { value: 'Healthy', isPositive: true, label: 'uptime' } }
  ];

  return { kpis };
}
