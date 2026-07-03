import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';
import { createPurchaseApi } from '../services/purchase.service';
import PurchaseForm from '../components/PurchaseForm';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';

export default function CreatePurchaseView() {
  const navigate = useNavigate();
  const { activeCompany } = useActiveCompany();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      const res = await createPurchaseApi(data);
      if (res.success) {
        navigate(`/inventory/purchases/${res.data.id}`);
      } else {
        setError(res.message || 'Failed to create purchase.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server error occurred while creating purchase.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="New Purchase Voucher"
        subtitle="Record new supplier invoice, update warehouse stock, and create ledger entries."
      />

      {error && (
        <div className="bg-red-100 border border-red-200 text-red-800 text-sm p-4 rounded-lg mb-4 text-left">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {submitting ? (
        <div className="p-8 text-center text-sm text-[var(--text-muted)] animate-pulse">
          Posting purchase transaction to ledgers... Please wait.
        </div>
      ) : (
        <PurchaseForm
          onSave={handleSave}
          onCancel={() => navigate('/inventory/purchases')}
          companyState={activeCompany ? activeCompany.state : ''}
        />
      )}
    </PageContainer>
  );
}
