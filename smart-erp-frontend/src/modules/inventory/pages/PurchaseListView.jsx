import React from 'react';
import { Link } from 'react-router-dom';
import { usePurchaseListViewData } from './services/PurchaseListViewService';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import PurchaseFilterPanel from '../components/PurchaseFilterPanel';
import PurchaseListTable from '../components/PurchaseListTable';
import './styles/PurchaseListView.css';

export default function PurchaseListView() {
  const list = usePurchaseListViewData();

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[var(--border-color)] pb-4 text-left">
        <PageHeader title="Purchase Vouchers Registry" subtitle="View and manage all purchase orders, draft vouchers, and posted supplier invoices." />
        <Link to="/purchase/create" className="px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 text-sm font-semibold rounded-md text-white transition-all self-start md:self-center">+ Record Purchase</Link>
      </div>
      <PurchaseFilterPanel list={list} />
      <PurchaseListTable list={list} />
    </PageContainer>
  );
}
