import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import SectionCard from '@shared/components/SectionCard';
import ActionButton from '@shared/components/ActionButton';
import { ArrowLeft, Edit3, FileText } from 'lucide-react';
import { usePartnerDetailsViewData } from './services/PartnerDetailsViewService';
import PartnerProfileDetailsCard from '../components/PartnerProfileDetailsCard';
import PartnerFinancialControlsCard from '../components/PartnerFinancialControlsCard';
import PartnerAddressesCard from '../components/PartnerAddressesCard';
import PartnerContactsCard from '../components/PartnerContactsCard';
import './styles/PartnerDetailsView.css';

export default function PartnerDetailsView() {
  const { navigate, partner, loading, error } = usePartnerDetailsViewData();

  if (loading) return <PageContainer><div className="text-center py-12 text-sm text-[var(--text-muted)] animate-pulse">Loading partner profile details...</div></PageContainer>;
  if (error || !partner) {
    return (
      <PageContainer>
        <div className="p-4 text-sm text-red-500 rounded bg-red-500/10 border border-red-500/20 mb-4">{error || 'Partner not found.'}</div>
        <ActionButton label="Back to List" icon={<ArrowLeft size={12} />} onClick={() => navigate('/inventory/partners/list')} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title={partner.name} description={`Partner Code: ${partner.code} | Classification: ${partner.type}`}>
        <ActionButton label="Back" variant="secondary" icon={<ArrowLeft size={14} />} onClick={() => navigate('/inventory/partners/list')} />
        <ActionButton label="Edit Partner" icon={<Edit3 size={14} />} onClick={() => navigate(`/inventory/partners/edit/${partner.id}`)} />
      </PageHeader>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        <div className="lg:col-span-2 space-y-6">
          <PartnerProfileDetailsCard partner={partner} />
          <PartnerFinancialControlsCard partner={partner} />
          {partner.notes && (
            <SectionCard title="Internal Remarks" description="Internal comments and credit history details">
              <div className="p-3 bg-[var(--bg-hover)] border border-[var(--border-light)] rounded text-sm text-[var(--text-primary)] whitespace-pre-line flex items-start gap-2"><FileText size={16} className="text-[var(--text-muted)] mt-0.5 shrink-0" /><span>{partner.notes}</span></div>
            </SectionCard>
          )}
          <PartnerAddressesCard addresses={partner.addresses} />
        </div>
        <div className="space-y-6"><PartnerContactsCard contacts={partner.contacts} /></div>
      </div>
    </PageContainer>
  );
}
