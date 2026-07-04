import { useState, useEffect } from 'react';
import { inventoryService } from '../../services/inventory.service';

export function useInventoryDashboardViewData() {
  const [summary, setSummary] = useState({
    totalItems: 0,
    totalWarehouses: 0,
    totalBrands: 0,
    lowStockCount: 0,
    outOfStockCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentItems, setRecentItems] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const sumRes = await inventoryService.getSummary();
      if (sumRes.success && sumRes.data) {
        setSummary(sumRes.data);
      }

      const itemsRes = await inventoryService.getItems({ page: 0, size: 5 });
      if (itemsRes.success && itemsRes.data) {
        setRecentItems(itemsRes.data.content || []);
      }
    } catch (e) {
      console.error("Error loading inventory dashboard", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    summary,
    loading,
    recentItems,
    refresh: fetchDashboardData
  };
}
