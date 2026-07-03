import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import InfoCard from '@shared/components/InfoCard';
import ActionButton from '@shared/components/ActionButton';
import StatusBadge from '@shared/components/StatusBadge';
import { fetchLedgerById } from '@modules/accounting/services/accounting.service';
import { ArrowLeft, Edit } from 'lucide-react';

export default function LedgerDetailsView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ledger, setLedger] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLedgerById(id)
      .then(res => {
        setLedger(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6 text-center animate-pulse">Loading details...</div>;
  if (!ledger) return <div className="p-6 text-center text-red-500">Ledger not found.</div>;

  const basicItems = [
    { label: 'Ledger Name', value: ledger.name },
    { label: 'Group Category', value: ledger.groupName },
    { label: 'Opening Balance', value: `₹${ledger.openingBalance?.toFixed(2) || '0.00'}` },
    { label: 'Balance Type', value: ledger.balanceType || 'N/A' },
    { label: 'Status', value: <StatusBadge status={ledger.isActive ? 'Active' : 'Inactive'} /> }
  ];

  const contactItems = [
    { label: 'Email Address', value: ledger.email || 'N/A' },
    { label: 'Phone Number', value: ledger.phone || 'N/A' },
    { label: 'Registered Address', value: ledger.address || 'N/A' },
    { label: 'PAN Number', value: ledger.pan || 'N/A' },
    { label: 'GSTIN Registration', value: ledger.gstNumber || 'N/A' }
  ];

  return (
    <PageContainer>
      <PageHeader title={ledger.name} description="Inspect company ledger configuration parameters and tax status">
        <ActionButton label="Back" variant="outline" icon={<ArrowLeft size={14} />} onClick={() => navigate('/accounting/ledgers')} />
        <ActionButton label="Edit Ledger" icon={<Edit size={14} />} onClick={() => navigate(`/accounting/ledgers/edit/${ledger.id}`)} />
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-start">
        <InfoCard title="Basic Profile" items={basicItems} />
        <InfoCard title="Tax & Contacts" items={contactItems} />
      </div>
    </PageContainer>
  );
}
