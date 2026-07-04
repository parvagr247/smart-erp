import React from 'react';
import { useEditPurchaseViewData } from './services/EditPurchaseViewService';
import PurchaseForm from '../components/PurchaseForm';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import './styles/EditPurchaseView.css';

export default function EditPurchaseView() {
  const { id, navigate, activeCompany, purchase, loading, error, submitting, handleSave } = useEditPurchaseViewData();

  return (
    <PageContainer>
      <PageHeader title="Edit Purchase Draft" subtitle="Modify details of your saved purchase draft before posting." />
      {error && <div className="bg-red-100 border border-red-200 text-red-800 text-sm p-4 rounded-lg mb-4 text-left"><span className="font-semibold">Error:</span> {error}</div>}
      {loading && <div className="p-8 text-center text-sm text-[var(--text-muted)] animate-pulse">Loading purchase data...</div>}
      {!loading && !error && purchase && (
        <PurchaseForm initialData={purchase} onSave={handleSave} onCancel={() => navigate(`/purchase/${id}`)} companyState={activeCompany ? activeCompany.state : ''} loading={submitting} />
      )}
    </PageContainer>
  );
}
