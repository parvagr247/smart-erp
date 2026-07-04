import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import SectionCard from '@shared/components/SectionCard';
import PartnerForm from '../components/PartnerForm';
import { useCreatePartnerViewData } from './services/CreatePartnerViewService';
import './styles/CreatePartnerView.css';

export default function CreatePartnerView() {
  const { navigate, formState } = useCreatePartnerViewData();

  return (
    <PageContainer>
      <PageHeader title="Register Business Partner" description="Add a new Customer or Supplier ledger master profile to the active scope" />
      <SectionCard title="Partner Onboarding Form" description="Configure tax IDs, payment terms, contacts, and addresses">
        <PartnerForm {...formState} onCancel={() => navigate('/inventory/partners/list')} />
      </SectionCard>
    </PageContainer>
  );
}
