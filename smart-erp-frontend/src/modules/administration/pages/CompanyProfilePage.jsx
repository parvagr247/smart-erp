import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';
import CompanyDetailsView from './CompanyDetailsView';

export default function CompanyProfilePage() {
  const navigate = useNavigate();
  const { activeCompany } = useActiveCompany();

  return (
    <CompanyDetailsView 
      companyId={activeCompany?.id} 
      onBack={() => navigate('/dashboard')} 
    />
  );
}
