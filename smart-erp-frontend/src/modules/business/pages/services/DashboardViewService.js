import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';
import { useAuth } from '@shared/context/AuthContext';
import { inventoryService } from '@modules/inventory/inventory.service';
import { fetchCompanyPermittedUsers, updateCompanyUserAccess } from '@modules/administration/administration.service';

export function useDashboardViewData() {
  const navigate = useNavigate();
  const { activeCompany } = useActiveCompany();
  const { user } = useAuth();
  
  const [summary, setSummary] = useState({
    ledgerCount: 0,
    partnerCount: 0,
    stockItemCount: 0,
    warehouseCount: 0,
    totalInventoryValue: 0,
    lowStockCount: 0
  });

  const [activities, setActivities] = useState([]);
  const [usersAccess, setUsersAccess] = useState([]);
  const [accessLoading, setAccessLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const sumRes = await inventoryService.getDashboardSummary();
      if (sumRes.success && sumRes.data) {
        setSummary(sumRes.data);
      }
      
      const actRes = await inventoryService.getDashboardRecentActivity();
      if (actRes.success && actRes.data) {
        setActivities(actRes.data.activities || []);
      }

      if (user?.role === 'ADMIN' && activeCompany) {
        const accessRes = await fetchCompanyPermittedUsers(activeCompany.id);
        if (accessRes.success && accessRes.data) {
          setUsersAccess(accessRes.data);
        }
      }
    } catch (err) {
      console.error("Error loading dashboard data", err);
      setError("Unable to sync dashboard statistics with backend services.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAccess = async (userId, currentAccess) => {
    try {
      setAccessLoading(true);
      const grant = !currentAccess;
      const res = await updateCompanyUserAccess(activeCompany.id, userId, grant);
      if (res.success) {
        setUsersAccess(prev => prev.map(u => u.userId === userId ? { ...u, hasAccess: grant } : u));
      }
    } catch (err) {
      console.error("Error toggling user access", err);
    } finally {
      setAccessLoading(false);
    }
  };

  useEffect(() => {
    if (activeCompany) {
      fetchDashboardData();
    }
  }, [activeCompany]);

  const todayStr = new Date().toLocaleDateString(undefined, { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  const stats = [
    { title: 'Pending Approvals', value: summary.pendingApprovals || 0, desc: 'Awaiting review', path: '/accounting/vouchers' },
    { title: "Today's Sales", value: `₹${(summary.revenueToday || 0).toLocaleString()}`, desc: 'Completed invoices today', path: '/inventory/sales' },
    { title: "Today's Purchases", value: `₹${(summary.purchaseToday || 0).toLocaleString()}`, desc: 'Purchase orders today', path: '/inventory/purchases' },
    { title: 'Receivables', value: `₹${(summary.receivables || 0).toLocaleString()}`, desc: 'Customer outstandings', path: '/accounting/reports' },
    { title: 'Payables', value: `₹${(summary.payables || 0).toLocaleString()}`, desc: 'Supplier outstandings', path: '/accounting/reports' },
    { title: 'Cash Position', value: `₹${(summary.cashPosition || 0).toLocaleString()}`, desc: 'Liquid funds on hand', path: '/accounting/reports' },
    { title: 'Inventory Valuation', value: `₹${(summary.totalInventoryValue || 0).toLocaleString()}`, desc: 'Total asset value', path: '/accounting/reports' }
  ];

  return {
    activeCompany,
    user,
    summary,
    activities,
    loading,
    error,
    todayStr,
    stats,
    navigate,
    fetchDashboardData,
    usersAccess,
    accessLoading,
    handleToggleAccess
  };
}
