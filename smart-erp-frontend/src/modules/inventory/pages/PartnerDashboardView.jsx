import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import StatCard from '@shared/components/StatCard';
import SectionCard from '@shared/components/SectionCard';
import ActionButton from '@shared/components/ActionButton';
import DataTable from '@shared/components/DataTable';
import { Users, UserPlus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { usePartnerDashboardViewData } from './services/PartnerDashboardViewService';
import './styles/PartnerDashboardView.css';

export default function PartnerDashboardView() {
  const { navigate, summary, recentPartners, loading, columns } = usePartnerDashboardViewData();

  return (
    <PageContainer>
      <PageHeader title="Business Partners Dashboard" description="Unified management ledger hub for Customers, Suppliers, and Creditors">
        <ActionButton label="Register Partner" icon={<UserPlus size={14} />} onClick={() => navigate('/inventory/partners/create')} />
      </PageHeader>
      {loading ? <div className="text-center py-8 text-sm text-[var(--text-muted)] animate-pulse">Loading dashboard KPIs...</div> :
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Customers" value={summary.totalCustomers} icon={<Users size={20} className="text-blue-500" />} />
            <StatCard title="Total Suppliers" value={summary.totalSuppliers} icon={<Users size={20} className="text-green-500" />} />
            <StatCard title="Outstanding Receivables" value={`₹ ${parseFloat(summary.outstandingReceivables || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} icon={<ArrowUpRight size={20} className="text-red-500" />} />
            <StatCard title="Outstanding Payables" value={`₹ ${parseFloat(summary.outstandingPayables || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} icon={<ArrowDownRight size={20} className="text-emerald-500" />} />
          </div>
          <SectionCard title="Recently Registered Partners" description="Quick access to recently added vendor ledgers and client profiles">
            <DataTable columns={columns} data={recentPartners} />
            <div className="mt-4 text-left">
              <ActionButton label="View All Partners" variant="secondary" onClick={() => navigate('/inventory/partners/list')} />
            </div>
          </SectionCard>
        </>
      }
    </PageContainer>
  );
}
