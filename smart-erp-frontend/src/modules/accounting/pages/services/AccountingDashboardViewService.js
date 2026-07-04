import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGroupsList, fetchLedgersList } from '@modules/accounting/services/accounting.service';

export function useAccountingDashboardViewData() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ groups: 0, ledgers: 0, loading: true });
  const [recentLedgers, setRecentLedgers] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [groupsRes, ledgersRes] = await Promise.all([
          fetchGroupsList(),
          fetchLedgersList({ page: 0, size: 5 })
        ]);
        setStats({
          groups: groupsRes.data?.length || 0,
          ledgers: ledgersRes.data?.totalElements || 0,
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
    { title: 'Total Account Groups', value: stats.loading ? '...' : stats.group, iconType: 'group' },
    { title: 'Cash Balance', value: '₹45,200.00', iconType: 'cash', trend: { value: 'Active', isPositive: true } },
    { title: 'Bank Accounts', value: '₹3,84,500.00', iconType: 'bank', trend: { value: 'Active', isPositive: true } }
  ];

  return {
    navigate,
    kpis,
    recentLedgers,
    stats
  };
}
