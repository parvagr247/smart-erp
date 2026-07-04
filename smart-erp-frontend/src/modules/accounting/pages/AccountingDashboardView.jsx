import React from 'react';
import { useAccountingDashboardViewData } from './services/AccountingDashboardViewService';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import StatCard from '@shared/components/StatCard';
import SectionCard from '@shared/components/SectionCard';
import DataTable from '@shared/components/DataTable';
import ActionButton from '@shared/components/ActionButton';
import { FolderTree, BookOpen, Plus, Activity, Landmark } from 'lucide-react';
import './styles/AccountingDashboardView.css';

export default function AccountingDashboardView() {
  const { navigate, kpis, recentLedgers } = useAccountingDashboardViewData();
  const iconMap = { ledger: <BookOpen size={16} />, group: <FolderTree size={16} />, cash: <Landmark size={16} />, bank: <Landmark size={16} /> };

  const columns = [
    { key: 'name', header: 'Ledger Name' },
    { key: 'groupName', header: 'Parent Group' },
    { key: 'openingBalance', header: 'Opening Balance', render: (row) => `₹${row.openingBalance?.toFixed(2) || '0.00'}` },
    { key: 'balanceType', header: 'Type' },
    { key: 'gstNumber', header: 'GSTIN', render: (row) => row.gstNumber || 'N/A' },
    { key: 'actions', header: 'Actions', render: (row) => <ActionButton label="Details" variant="outline" onClick={() => navigate(`/accounting/ledgers/${row.id}`)} className="py-1 px-2 text-xs" /> }
  ];

  return (
    <PageContainer>
      <PageHeader title="Accounting Dashboard" description="Configure master files, balances sheets, and ledger registries" />
      <div className="stat-card-grid">{kpis.map((kpi, idx) => <StatCard key={idx} {...kpi} icon={iconMap[kpi.iconType]} />)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <SectionCard title="Quick Master Actions" description="Fast master files creation shortcuts" className="lg:col-span-2 text-left">
          <div className="shortcut-grid-col">
            <ActionButton label="Create Ledger" icon={<Plus size={12} />} onClick={() => navigate('/accounting/ledgers/create')} className="w-full justify-start py-3" />
            <ActionButton label="Explore Groups Tree" icon={<FolderTree size={12} />} variant="outline" onClick={() => navigate('/accounting/groups')} className="w-full justify-start py-3" />
            <ActionButton label="Ledger Registry" icon={<BookOpen size={12} />} variant="outline" onClick={() => navigate('/accounting/ledgers')} className="w-full justify-start py-3" />
          </div>
        </SectionCard>
        <SectionCard title="Recent Audit Activity" description="System audit actions track log placeholder" className="text-left">
          <div className="audit-logs-column">
            <div className="flex gap-2 items-center"><Activity size={12} className="text-[var(--primary)]" /> Ledgers loaded successfully</div>
            <div className="flex gap-2 items-center"><Activity size={12} className="text-[var(--primary)]" /> System auto-initializer checked</div>
          </div>
        </SectionCard>
      </div>
      <SectionCard title="Recent Ledgers Created" description="List of latest ledger masters configured inside active company" className="text-left">
        <DataTable columns={columns} data={recentLedgers} />
      </SectionCard>
    </PageContainer>
  );
}
