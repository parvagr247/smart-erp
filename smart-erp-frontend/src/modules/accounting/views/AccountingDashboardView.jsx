import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import StatCard from '@shared/components/StatCard';
import SectionCard from '@shared/components/SectionCard';
import DataTable from '@shared/components/DataTable';
import ActionButton from '@shared/components/ActionButton';
import { fetchGroupsList, fetchLedgersList } from '@modules/accounting/services/accounting.service';
import { Landmark, FolderTree, BookOpen, Plus, Activity } from 'lucide-react';

export default function AccountingDashboardView() {
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
    { title: 'Total Ledgers', value: stats.loading ? '...' : stats.ledgers, icon: <BookOpen size={16} /> },
    { title: 'Total Account Groups', value: stats.loading ? '...' : stats.groups, icon: <FolderTree size={16} /> },
    { title: 'Cash Balance', value: '₹45,200.00', icon: <Landmark size={16} />, trend: { value: 'Active', isPositive: true } },
    { title: 'Bank Accounts', value: '₹3,84,500.00', icon: <Landmark size={16} />, trend: { value: 'Active', isPositive: true } }
  ];

  return (
    <PageContainer>
      <PageHeader title="Accounting Dashboard" description="Configure master files, balances sheets, and ledger registries" />

      <div className="stat-card-grid">
        {kpis.map((kpi, idx) => <StatCard key={idx} {...kpi} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <SectionCard title="Quick Master Actions" description="Fast master files creation shortcuts" className="lg:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <ActionButton label="Create Ledger" icon={<Plus size={12} />} onClick={() => navigate('/accounting/ledgers/create')} className="w-full justify-start py-3" />
            <ActionButton label="Explore Groups Tree" icon={<FolderTree size={12} />} variant="outline" onClick={() => navigate('/accounting/groups')} className="w-full justify-start py-3" />
            <ActionButton label="Ledger Registry" icon={<BookOpen size={12} />} variant="outline" onClick={() => navigate('/accounting/ledgers')} className="w-full justify-start py-3" />
          </div>
        </SectionCard>

        <SectionCard title="Recent Audit Activity" description="System audit actions track log placeholder">
          <div className="text-xs text-[var(--text-secondary)] space-y-2 text-left font-mono">
            <div className="flex gap-2 items-center"><Activity size={12} className="text-[var(--primary)]" /> Ledgers loaded successfully</div>
            <div className="flex gap-2 items-center"><Activity size={12} className="text-[var(--primary)]" /> System auto-initializer checked</div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Recent Ledgers Created" description="List of latest ledger masters configured inside active company">
        <DataTable
          columns={[
            { key: 'name', header: 'Ledger Name' },
            { key: 'groupName', header: 'Parent Group' },
            { key: 'openingBalance', header: 'Opening Balance', render: (row) => `₹${row.openingBalance?.toFixed(2) || '0.00'}` },
            { key: 'balanceType', header: 'Type' },
            { key: 'gstNumber', header: 'GSTIN', render: (row) => row.gstNumber || 'N/A' },
            { 
              key: 'actions', 
              header: 'Actions', 
              render: (row) => (
                <ActionButton label="Details" variant="outline" onClick={() => navigate(`/accounting/ledgers/${row.id}`)} className="py-1 px-2 text-xs" />
              )
            }
          ]}
          data={recentLedgers}
        />
      </SectionCard>
    </PageContainer>
  );
}
