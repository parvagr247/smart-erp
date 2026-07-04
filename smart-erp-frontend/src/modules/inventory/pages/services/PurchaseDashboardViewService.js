import { useState, useEffect } from 'react';
import { inventoryService } from '../../inventory.service';

export function usePurchaseDashboardViewData() {
  const [stats, setStats] = useState({ purchaseCount: 0, totalPurchaseValue: 0 });
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const summaryRes = await inventoryService.getDashboardSummary();
        if (summaryRes.success && summaryRes.data) {
          setStats({
            purchaseCount: summaryRes.data.purchaseCount || 0,
            totalPurchaseValue: summaryRes.data.totalPurchaseValue || 0
          });
        }

        const purchasesRes = await inventoryService.getPurchases({ page: 0, size: 5 });
        if (purchasesRes.success && purchasesRes.data) {
          setRecentPurchases(purchasesRes.data.content);
        }
      } catch (err) {
        console.error('Failed to load purchase dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  return { stats, recentPurchases, loading };
}
