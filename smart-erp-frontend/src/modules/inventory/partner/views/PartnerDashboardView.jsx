import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import StatCard from '@shared/components/StatCard';
import SectionCard from '@shared/components/SectionCard';
import ActionButton from '@shared/components/ActionButton';
import DataTable from '@shared/components/DataTable';
import StatusBadge from '@shared/components/StatusBadge';
import { Users, UserPlus, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { fetchPartnerSummary, fetchPartnersList } from '../services/partner.service';

export default function PartnerDashboardView() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    totalCustomers: 0,
    totalSuppliers: 0,
    totalPartners: 0,
    outstandingReceivables: 0.00,
    outstandingPayables: 0.00
  });
  const [recentPartners, setRecentPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [sumRes, listRes] = await Promise.all([
          fetchPartnerSummary(),
          fetchPartnersList({ page: 0, size: 5, sort: 'createdAt,desc' })
        ]);
        if (sumRes.success && sumRes.data) {
          setSummary(sumRes.data);
        }
        if (listRes.success && listRes.data) {
          setRecentPartners(listRes.data.content || []);
        }
      } catch (err) {
        console.error('Failed to load partner dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const columns = [
    { key: 'code', header: 'Partner Code' },
    { key: 'name', header: 'Partner Name' },
    { key: 'type', header: 'Classification Type' },
    { 
      key: 'openingBalance', 
      header: 'Opening Balance',
      render: (row) => `${row.openingBalance || '0.00'} ${row.balanceType || ''}`
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} /> 
    },
    {
      key: 'actions',
      header: 'Action',
      render: (row) => (
        <ActionButton
          label="View"
          variant="secondary"
          icon={<Eye size={12} />}
          onClick={() => navigate(`/inventory/partners/${row.id}`)}
        />
      )
    }
  ];

  return (
    <PageContainer>
      <PageHeader 
        title="Business Partners Dashboard" 
        description="Unified management ledger hub for Customers, Suppliers, and Creditors"
      >
        <ActionButton 
          label="Register Partner" 
          icon={<UserPlus size={14} />} 
          onClick={() => navigate('/inventory/partners/create')} 
        />
      </PageHeader>

      {loading ? (
        <div className="text-center py-8 text-sm text-[var(--text-muted)] animate-pulse">Loading dashboard KPIs...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard 
              title="Total Customers" 
              value={summary.totalCustomers} 
              icon={<Users size={20} className="text-blue-500" />}
            />
            <StatCard 
              title="Total Suppliers" 
              value={summary.totalSuppliers} 
              icon={<Users size={20} className="text-green-500" />}
            />
            <StatCard 
              title="Outstanding Receivables" 
              value={`₹ ${parseFloat(summary.outstandingReceivables || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} 
              icon={<ArrowUpRight size={20} className="text-red-500" />}
            />
            <StatCard 
              title="Outstanding Payables" 
              value={`₹ ${parseFloat(summary.outstandingPayables || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} 
              icon={<ArrowDownRight size={20} className="text-emerald-500" />}
            />
          </div>

          <SectionCard 
            title="Recently Registered Partners" 
            description="Quick access to recently added vendor ledgers and client profiles"
          >
            <DataTable columns={columns} data={recentPartners} />
            <div className="mt-4 text-left">
              <ActionButton 
                label="View All Partners" 
                variant="secondary" 
                onClick={() => navigate('/inventory/partners/list')} 
              />
            </div>
          </SectionCard>
        </>
      )}
    </PageContainer>
  );
}
