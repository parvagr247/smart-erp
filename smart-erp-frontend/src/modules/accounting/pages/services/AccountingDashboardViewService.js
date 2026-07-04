import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGroupsList, fetchLedgersList } from '@modules/accounting/accounting.service';
import { inventoryService } from '@modules/inventory/inventory.service';

export function useAccountingDashboardViewData() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ groups: 0, ledgers: 0, cashPosition: 0, loading: true });
  const [recentLedgers, setRecentLedgers] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [groupsRes, ledgersRes, summaryRes] = await Promise.all([
          fetchGroupsList(),
          fetchLedgersList({ page: 0, size: 5 }),
          inventoryService.getDashboardSummary()
        ]);
        setStats({
          groups: groupsRes.data?.length || 0,
          ledgers: ledgersRes.data?.totalElements || 0,
          cashPosition: summaryRes.data?.cashPosition || 0,
          loading: false
        });
        setRecentLedgers(ledgersRes.data?.content || []);
      } catch (err) {
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    loadDashboardData();
  }, []);

  const kpis = [
    { title: 'Total Ledgers', value: stats.loading ? '...' : stats.ledgers, iconType: 'ledger' },
    { title: 'Total Account Groups', value: stats.loading ? '...' : stats.groups, iconType: 'group' },
    { title: 'Cash Position', value: stats.loading ? '...' : `₹${stats.cashPosition.toLocaleString()}`, iconType: 'cash', trend: { value: 'Active', isPositive: true } }
  ];

  return {
    navigate,
    kpis,
    recentLedgers,
    stats
  };
}
