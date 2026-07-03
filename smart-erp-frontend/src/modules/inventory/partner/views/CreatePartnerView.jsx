import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import SectionCard from '@shared/components/SectionCard';
import PartnerForm from '../components/PartnerForm';
import { usePartnerForm } from '../services/partner.service';

export default function CreatePartnerView() {
  const navigate = useNavigate();
  const formState = usePartnerForm(null, () => navigate('/inventory/partners/list'));

  return (
    <PageContainer>
      <PageHeader 
        title="Register Business Partner" 
        description="Add a new Customer or Supplier ledger master profile to the active scope" 
      />

      <SectionCard title="Partner Onboarding Form" description="Configure tax IDs, payment terms, contacts, and addresses">
        <PartnerForm 
          {...formState} 
          onCancel={() => navigate('/inventory/partners/list')} 
        />
      </SectionCard>
    </PageContainer>
  );
}
