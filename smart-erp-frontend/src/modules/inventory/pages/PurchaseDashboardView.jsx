import React from 'react';
import { Link } from 'react-router-dom';
import { usePurchaseDashboardViewData } from './services/PurchaseDashboardViewService';
import PurchaseStatusBadge from '../components/PurchaseStatusBadge';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import StatCard from '@shared/components/StatCard';
import SectionCard from '@shared/components/SectionCard';
import './styles/PurchaseDashboardView.css';

export default function PurchaseDashboardView() {
  const { stats, recentPurchases, loading } = usePurchaseDashboardViewData();

  const cards = [
    { title: 'Voucher Entry', desc: 'Record fresh stock inflows, map batches, split taxes, and auto-update stock valuations.', link: '/purchase/create', label: 'Go to Entry form →' },
    { title: 'Voucher Registry', desc: 'Review detailed invoice summaries, print invoices, and filter by status, supplier or warehouse.', link: '/purchase/list', label: 'Open Registry list →' },
    { title: 'Sundry Creditors', desc: 'Manage suppliers, review credit limits, outstanding balances, and purchase histories.', link: '/inventory/partners', label: 'Manage Suppliers →' }
  ];

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[var(--border-color)] pb-4 text-left">
        <PageHeader title="Purchase Management Console" subtitle="Track stock inflows, manage supplier invoices, compute GST liability, and audit account ledgers." />
        <Link to="/purchase/create" className="px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 text-sm font-semibold rounded-md text-white transition-all self-start md:self-center">+ Record Purchase</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard title="Total Purchase Vouchers" value={stats.purchaseCount} subtitle="All drafted and approved supplier invoices" icon="📋" />
        <StatCard title="Total Purchases Value" value={`₹${stats.totalPurchaseValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} subtitle="Gross outflow volume" icon="💰" />
        <StatCard title="Outstanding Supplier Liabilities" value="Calculated live" subtitle="Updated in Sundry Creditors ledger" icon="🤝" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 text-left">
        {cards.map((c, idx) => (
          <div key={idx} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-lg">
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">{c.title}</h3>
            <p className="text-xs text-[var(--text-muted)] mb-4">{c.desc}</p>
            <Link to={c.link} className="text-xs font-semibold text-[var(--color-primary)] hover:underline">{c.label}</Link>
          </div>
        ))}
      </div>
      <SectionCard title="Recent Transactions" description="Latest purchase vouchers logged in the system.">
        {loading ? <div className="p-8 text-center text-sm text-[var(--text-muted)] animate-pulse">Loading recent purchases...</div> :
          recentPurchases.length === 0 ? <div className="p-8 text-center text-sm text-[var(--text-muted)]">No purchase vouchers recorded yet. Click "+ Record Purchase" to get started.</div> :
            <div className="overflow-x-auto text-left">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-color)] text-xs text-[var(--text-muted)] font-semibold uppercase">
                    <th className="py-2.5 px-4">Purchase No.</th>
                    <th className="py-2.5 px-4">Supplier</th>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Grand Total (₹)</th>
                    <th className="py-2.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)] text-sm text-[var(--text-primary)]">
                  {recentPurchases.map((p) => (
                    <tr key={p.id} className="hover:bg-[var(--bg-body)] transition-colors">
                      <td className="py-3 px-4 font-semibold text-[var(--color-primary)]"><Link to={`/purchase/${p.id}`}>{p.purchaseNumber}</Link></td>
                      <td className="py-3 px-4 font-medium">{p.supplierName}</td>
                      <td className="py-3 px-4">{new Date(p.purchaseDate).toLocaleDateString('en-IN')}</td>
                      <td className="py-3 px-4"><PurchaseStatusBadge status={p.status} /></td>
                      <td className="py-3 px-4 text-right font-bold">₹{p.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-4 text-center"><Link to={`/purchase/${p.id}`} className="px-2.5 py-1 bg-[var(--bg-body)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-xs font-semibold rounded text-[var(--text-primary)] transition-all">Details</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        }
      </SectionCard>
    </PageContainer>
  );
}
