import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import StatCard from '../components/common/StatCard';
import SectionCard from '../components/common/SectionCard';
import DataTable from '../components/common/DataTable';
import ActionButton from '../components/common/ActionButton';
import { Landmark, Box, ShoppingBag, ShoppingCart, Plus } from 'lucide-react';

const STATS = [
  { title: 'Total Sales', value: '₹2,45,000.00', icon: <ShoppingBag size={16} />, trend: { value: '+12.5%', isPositive: true } },
  { title: 'Total Purchases', value: '₹1,12,000.00', icon: <ShoppingCart size={16} />, trend: { value: '+8.3%', isPositive: true } },
  { title: 'Low Stock Items', value: '2 items', icon: <Box size={16} />, trend: { value: 'Reorder', isPositive: false } },
  { title: 'Pending Receivables', value: '₹34,500.00', icon: <Landmark size={16} />, trend: { value: '3 invoices', isPositive: false } }
];

const QUICK_ACTIONS = [
  { label: 'Create Ledger', path: '/masters/ledgers' },
  { label: 'Create Customer', path: '/masters/customers' },
  { label: 'Create Supplier', path: '/masters/suppliers' },
  { label: 'Create Invoice', path: '/sales' },
  { label: 'Create Purchase', path: '/purchase' },
  { label: 'Add Stock', path: '/inventory/stock-items' }
];

const MOCK_TX = [
  { id: '1', date: '2026-07-03', ledger: 'Acme Traders', type: 'Sales', amount: '₹14,500.00' },
  { id: '2', date: '2026-07-03', ledger: 'Cash Account', type: 'Receipt', amount: '₹2,500.00' },
  { id: '3', date: '2026-07-02', ledger: 'Zeta Manufacturing', type: 'Purchase', amount: '₹84,300.00' }
];

export default function DashboardView() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div className="stat-card-grid">
        {STATS.map((s, idx) => <StatCard key={idx} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Quick Actions Panel */}
        <SectionCard title="Quick Actions" description="Fast master files and vouchers creation tools" className="lg:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {QUICK_ACTIONS.map((a, idx) => (
              <ActionButton 
                key={idx} 
                label={a.label} 
                icon={<Plus size={12} />} 
                variant="outline" 
                onClick={() => navigate(a.path)} 
                className="w-full justify-start py-3"
              />
            ))}
          </div>
        </SectionCard>
        
        {/* Announcements */}
        <SectionCard title="Announcements" description="SmartERP system highlights">
          <div className="text-xs text-[var(--text-secondary)] space-y-3 text-left">
            <div className="p-2.5 rounded-lg bg-[var(--primary-glow)] border-l-4 border-[var(--primary)]">
              <strong className="text-[var(--text-primary)] block">GST Filings Deadline</strong>
              Submit all outstanding quarterly invoice records before the upcoming GST portal window locks.
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Recent Ledger Transactions" description="List of latest voucher registries and accounts adjustments">
        <DataTable 
          columns={[
            { key: 'date', header: 'Date' },
            { key: 'ledger', header: 'Party / Ledger' },
            { key: 'type', header: 'Voucher Type' },
            { key: 'amount', header: 'Voucher Amount', cellClassName: 'font-bold text-[var(--text-primary)]' }
          ]} 
          data={MOCK_TX} 
        />
      </SectionCard>
    </PageContainer>
  );
}
