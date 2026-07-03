import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import SectionCard from '@shared/components/SectionCard';
import PartnerForm from '../components/PartnerForm';
import { usePartnerForm } from '../services/partner.service';

export default function EditPartnerView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const formState = usePartnerForm(id, () => navigate('/inventory/partners/list'));

  return (
    <PageContainer>
      <PageHeader 
        title="Modify Business Partner" 
        description="Update profile data, payment terms, or representatives for this ledger" 
      />

      <SectionCard title="Update Profile Details" description="Amend existing tax IDs, contact information, and address mappings">
        <PartnerForm 
          {...formState} 
          onCancel={() => navigate('/inventory/partners/list')} 
        />
      </SectionCard>
    </PageContainer>
  );
}
