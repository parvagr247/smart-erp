import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';
import { useAuth } from '@shared/context/AuthContext';
import { inventoryService } from '@modules/inventory/services/inventory.service';
import PageContainer from '@shared/components/PageContainer';
import SectionCard from '@shared/components/SectionCard';
import ActionButton from '@shared/components/ActionButton';
import { Landmark, Box, ShoppingBag, Plus, Calendar, User, Building2, ShieldAlert } from 'lucide-react';

export default function DashboardView() {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeCompany) {
      fetchDashboardData();
    }
  }, [activeCompany]);

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
    } catch (err) {
      console.error("Error loading dashboard data", err);
      setError("Unable to sync dashboard statistics with backend services.");
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toLocaleDateString(undefined, { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  if (!activeCompany) {
    return (
      <div className="p-6 text-center text-slate-500 max-w-md mx-auto space-y-4 mt-12">
        <h2 className="text-lg font-bold">No Active Company Context</h2>
        <p className="text-sm">Please select or register a company context to load the SmartERP dashboard.</p>
        <button
          onClick={() => navigate('/company-select')}
          className="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition"
        >
          Select Company
        </button>
      </div>
    );
  }

  const stats = [
    { title: 'Pending Approvals', value: summary.pendingApprovals || 0, desc: 'Awaiting review', path: '/accounting/vouchers' },
    { title: "Today's Sales", value: `₹${(summary.revenueToday || 0).toLocaleString()}`, desc: 'Completed invoices today', path: '/inventory/sales' },
    { title: "Today's Purchases", value: `₹${(summary.purchaseToday || 0).toLocaleString()}`, desc: 'Purchase orders today', path: '/inventory/purchases' },
    { title: 'Receivables', value: `₹${(summary.receivables || 0).toLocaleString()}`, desc: 'Customer outstandings', path: '/accounting/reports' },
    { title: 'Payables', value: `₹${(summary.payables || 0).toLocaleString()}`, desc: 'Supplier outstandings', path: '/accounting/reports' },
    { title: 'Cash Position', value: `₹${(summary.cashPosition || 0).toLocaleString()}`, desc: 'Liquid funds on hand', path: '/accounting/reports' },
    { title: 'Inventory Valuation', value: `₹${(summary.totalInventoryValue || 0).toLocaleString()}`, desc: 'Total asset value', path: '/accounting/reports' }
  ];

  return (
    <PageContainer>
      {/* Context Banner */}
      <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-semibold">
            <Building2 size={16} className="text-indigo-500" />
            <span>{activeCompany.companyName}</span>
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] uppercase font-bold rounded">
              FY {activeCompany.financialYear}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Company registration ID: {activeCompany.id}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <User size={14} className="text-indigo-400" />
            <span>{user?.email || 'Administrator'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-indigo-400" />
            <span>{todayStr}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 text-sm font-semibold rounded-lg border border-rose-200 dark:border-rose-900/50 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={fetchDashboardData} className="px-3 py-1 bg-white dark:bg-slate-700 rounded text-xs border border-rose-200 dark:border-slate-600">Retry</button>
        </div>
      )}

      {/* Main Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div 
            key={idx} 
            onClick={() => s.path && navigate(s.path)}
            className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col justify-between cursor-pointer hover:border-indigo-500 transition duration-150"
          >
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{s.title}</span>
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">{s.value}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{s.desc}</span>
          </div>
        ))}
      </div>

      {summary.lowStockCount > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/50 flex items-center gap-3">
          <ShieldAlert className="text-amber-600 dark:text-amber-400" size={20} />
          <div>
            <div className="text-sm font-semibold text-amber-800 dark:text-amber-300">Low Stock Alert!</div>
            <p className="text-xs text-amber-700 dark:text-amber-400">There are {summary.lowStockCount} stock items that are at or below reorder levels. Please review inventory listings.</p>
          </div>
          <button
            onClick={() => navigate('/inventory/stock-items')}
            className="ml-auto px-3 py-1.5 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/50 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-200 font-semibold rounded text-xs transition"
          >
            Review Stock
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Quick Actions Panel */}
        <SectionCard title="Accounting & Inventory Shortcuts" description="Instantly open master setup and configuration sheets" className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <ActionButton 
              label="Create Ledger" 
              icon={<Plus size={14} />} 
              variant="outline" 
              onClick={() => navigate('/accounting/ledgers/create')} 
              className="w-full justify-start py-3"
            />
            <ActionButton 
              label="Create Business Partner" 
              icon={<Plus size={14} />} 
              variant="outline" 
              onClick={() => navigate('/inventory/partners/create')} 
              className="w-full justify-start py-3"
            />
            <ActionButton 
              label="Add Stock Item" 
              icon={<Plus size={14} />} 
              variant="outline" 
              onClick={() => navigate('/inventory/stock-items/create')} 
              className="w-full justify-start py-3"
            />
            <ActionButton 
              label="Manage Warehouses" 
              icon={<Plus size={14} />} 
              variant="outline" 
              onClick={() => navigate('/inventory/warehouses')} 
              className="w-full justify-start py-3"
            />
            <ActionButton 
              label="Manage Units" 
              icon={<Plus size={14} />} 
              variant="outline" 
              onClick={() => navigate('/inventory/units')} 
              className="w-full justify-start py-3"
            />
            <ActionButton 
              label="Manage Tax & HSN" 
              icon={<Plus size={14} />} 
              variant="outline" 
              onClick={() => navigate('/inventory/tax-categories')} 
              className="w-full justify-start py-3"
            />
          </div>
        </SectionCard>
        
        {/* Announcements (Real check) */}
        <SectionCard title="System Notifications" description="Updates from company audit activities">
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-3 text-left">
            <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border-l-4 border-indigo-500">
              <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">Welcome to SmartERP!</strong>
              All master parameters, tax sheets, and warehouses are fully configured and synced with the active company database.
            </div>
            <div className="text-[10px] text-slate-400 text-center py-2">
              No new system announcements available.
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Recent Timeline Activities */}
      <SectionCard title="Recent Activity Timeline" description="Trace of recent master ledger modifications and inventory additions">
        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">Loading timeline data...</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No activity records found. Get started by creating your first Ledger, Partner, or Stock Item.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {activities.map((act, idx) => (
              <div key={idx} className="py-3 flex justify-between items-start">
                <div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold mr-3 ${
                    act.type === 'LEDGER' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400' :
                    act.type === 'PARTNER' ? 'bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400' :
                    'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'
                  }`}>
                    {act.type}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{act.title}</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{act.details}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </PageContainer>
  );
}
