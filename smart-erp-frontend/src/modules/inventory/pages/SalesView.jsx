import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import { useSalesViewData } from './services/SalesViewService';
import SalesListSection from '../components/SalesListSection';
import SalesFormSection from '../components/SalesFormSection';
import SalesDetailsSection from '../components/SalesDetailsSection';
import './styles/SalesView.css';

export default function SalesView() {
  const data = useSalesViewData();

  if (data.loading) return <div className="p-6 text-center text-slate-400"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>Loading Sales...</div>;

  return (
    <PageContainer>
      {data.mode === 'LIST' && <SalesListSection {...data} />}
      {(data.mode === 'CREATE' || data.mode === 'EDIT') && <SalesFormSection {...data} />}
      {data.mode === 'DETAILS' && <SalesDetailsSection sale={data.selectedSale} setMode={data.setMode} handleEdit={data.handleEdit} handleStatusChange={data.handleStatusChange} handleDelete={data.handleDelete} />}
    </PageContainer>
  );
}
