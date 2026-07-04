import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import SectionCard from '@shared/components/SectionCard';
import PartnerForm from '../components/PartnerForm';
import { useEditPartnerViewData } from './services/EditPartnerViewService';
import './styles/EditPartnerView.css';

export default function EditPartnerView() {
  const { navigate, formState } = useEditPartnerViewData();

  return (
    <PageContainer>
      <PageHeader title="Modify Business Partner" description="Update profile data, payment terms, or representatives for this ledger" />
      <SectionCard title="Update Profile Details" description="Amend existing tax IDs, contact information, and address mappings">
        <PartnerForm {...formState} onCancel={() => navigate('/inventory/partners/list')} />
      </SectionCard>
    </PageContainer>
  );
}
