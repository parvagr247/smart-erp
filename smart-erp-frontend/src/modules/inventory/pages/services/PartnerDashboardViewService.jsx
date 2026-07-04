import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPartnerSummary, fetchPartnersList } from '../../components/services/partner.service';
import StatusBadge from '@shared/components/StatusBadge';
import ActionButton from '@shared/components/ActionButton';
import { Eye } from 'lucide-react';

export function usePartnerDashboardViewData() {
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

  return { navigate, summary, recentPartners, loading, columns };
}
