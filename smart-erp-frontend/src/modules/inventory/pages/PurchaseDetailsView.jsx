import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePurchaseDetailsViewData } from './services/PurchaseDetailsViewService';
import PurchaseDetailsHeader from '../components/PurchaseDetailsHeader';
import PurchaseDetailsInvoiceHeader from '../components/PurchaseDetailsInvoiceHeader';
import PurchaseDetailsAddresses from '../components/PurchaseDetailsAddresses';
import PurchaseDetailsLineItems from '../components/PurchaseDetailsLineItems';
import PurchaseDetailsSummary from '../components/PurchaseDetailsSummary';
import PageContainer from '@shared/components/PageContainer';
import ActionButton from '@shared/components/ActionButton';
import './styles/PurchaseDetailsView.css';

export default function PurchaseDetailsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeCompany, details, isIntraState } = usePurchaseDetailsViewData();

  if (details.loading) return <PageContainer><div className="p-8 text-center text-sm text-[var(--text-muted)] animate-pulse">Loading purchase voucher details...</div></PageContainer>;
  if (details.error && !details.purchase) {
    return (
      <PageContainer>
        <div className="bg-red-100 border border-red-200 text-red-800 text-sm p-4 rounded-lg text-left"><span className="font-semibold">Error:</span> {details.error}</div>
        <ActionButton label="Back to List" onClick={() => navigate('/purchase/list')} className="mt-4" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PurchaseDetailsHeader id={id} purchase={details.purchase} details={details} navigate={navigate} />
      {details.error && <div className="bg-red-100 border border-red-200 text-red-800 text-sm p-4 rounded-lg mb-4 text-left"><span className="font-semibold">Error:</span> {details.error}</div>}
      <div className="print-invoice-card bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-6 shadow-sm text-left max-w-4xl mx-auto print:border-none print:shadow-none">
        <PurchaseDetailsInvoiceHeader activeCompany={activeCompany} purchase={details.purchase} />
        <PurchaseDetailsAddresses purchase={details.purchase} />
        <PurchaseDetailsLineItems purchase={details.purchase} isIntraState={isIntraState()} />
        <PurchaseDetailsSummary purchase={details.purchase} isIntraState={isIntraState()} />
      </div>
    </PageContainer>
  );
}
