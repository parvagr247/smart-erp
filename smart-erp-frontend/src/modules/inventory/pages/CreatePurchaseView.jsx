import React from 'react';
import { useCreatePurchaseViewData } from './services/CreatePurchaseViewService';
import PurchaseForm from '../components/PurchaseForm';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import './styles/CreatePurchaseView.css';

export default function CreatePurchaseView() {
  const { navigate, activeCompany, error, submitting, handleSave } = useCreatePurchaseViewData();

  return (
    <PageContainer>
      <PageHeader title="New Purchase Voucher" subtitle="Record new supplier invoice, update warehouse stock, and create ledger entries." />
      {error && <div className="bg-red-100 border border-red-200 text-red-800 text-sm p-4 rounded-lg mb-4 text-left"><span className="font-semibold">Error:</span> {error}</div>}
      <PurchaseForm onSave={handleSave} onCancel={() => navigate('/purchase/list')} companyState={activeCompany ? activeCompany.state : ''} loading={submitting} />
    </PageContainer>
  );
}
