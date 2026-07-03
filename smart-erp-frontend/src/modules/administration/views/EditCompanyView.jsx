import React from 'react';
import { useParams } from 'react-router-dom';
import { useCompanyForm } from '../services/company.service';
import CompanyForm from '../components/CompanyForm';
import { Card, CardHeader, CardTitle, CardDescription } from '@shared/components/ui/card';
import '../styles/company.css';

export default function EditCompanyView({ companyId, onSaveSuccess, onCancel }) {
  const { id } = useParams();
  const formHooks = useCompanyForm(id || companyId, onSaveSuccess);

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <Card className="shadow-lg border border-[var(--border-light)] bg-[var(--bg-surface)]">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold font-heading tracking-tight text-[var(--text-primary)]">
            Edit Company
          </CardTitle>
          <CardDescription className="text-sm text-[var(--text-secondary)]">
            Update your enterprise configuration profile
          </CardDescription>
        </CardHeader>
        <CompanyForm 
          formHooks={formHooks} 
          onCancel={onCancel} 
          isEdit={true} 
        />
      </Card>
    </div>
  );
}
