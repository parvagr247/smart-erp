import { useState, useEffect } from 'react';
import { inventoryService } from '@modules/inventory/inventory.service';

export function useAdminAuditLogsViewData() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAudits = async () => {
      try {
        const res = await inventoryService.getDashboardRecentActivity();
        if (res.success && res.data && res.data.activities) {
          const list = res.data.activities.map((act, index) => ({
            id: String(index + 1),
            time: act.timestamp ? new Date(act.timestamp).toLocaleString() : 'Just now',
            user: act.performedBy || 'system',
            event: act.title,
            ip: '127.0.0.1',
            status: 'Success'
          }));
          setAudits(list);
        }
      } catch (err) {
        console.error('Failed to load audit logs', err);
      } finally {
        setLoading(false);
      }
    };
    loadAudits();
  }, []);

  const handleClearLogs = () => {
    alert('Clear logs action is restricted to super administrators.');
  };

  return { audits, loading, handleClearLogs };
}
