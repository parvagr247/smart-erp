import { useState, useEffect } from 'react';
import { inventoryService } from '../../inventory.service';

export function useInventoryDashboardViewData() {
  const [summary, setSummary] = useState({
    totalItems: 0,
    totalWarehouses: 0,
    totalBrands: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalInventoryValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentItems, setRecentItems] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [sumRes, itemsRes, dbSumRes] = await Promise.all([
        inventoryService.getSummary(),
        inventoryService.getItems({ page: 0, size: 5 }),
        inventoryService.getDashboardSummary()
      ]);
      
      let totalItems = 0;
      let totalWarehouses = 0;
      let totalBrands = 0;
      let lowStockCount = 0;
      let outOfStockCount = 0;
      let totalInventoryValue = 0;

      if (sumRes.success && sumRes.data) {
        totalItems = sumRes.data.totalItems || 0;
        totalWarehouses = sumRes.data.totalWarehouses || 0;
        totalBrands = sumRes.data.totalBrands || 0;
        lowStockCount = sumRes.data.lowStockCount || 0;
        outOfStockCount = sumRes.data.outOfStockCount || 0;
      }

      if (dbSumRes.success && dbSumRes.data) {
        totalInventoryValue = dbSumRes.data.totalInventoryValue || 0;
        if (dbSumRes.data.lowStockCount) {
          lowStockCount = dbSumRes.data.lowStockCount;
        }
      }

      setSummary({
        totalItems,
        totalWarehouses,
        totalBrands,
        lowStockCount,
        outOfStockCount,
        totalInventoryValue
      });

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
