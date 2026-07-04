import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import DataTable from '@shared/components/DataTable';
import ActionButton from '@shared/components/ActionButton';
import { Plus } from 'lucide-react';
import { useSuppliersViewData } from './services/SuppliersViewService';
import './styles/SuppliersView.css';

export default function SuppliersView() {
  const { mockSuppliers, columns } = useSuppliersViewData();

  return (
    <PageContainer>
      <PageHeader title="Supplier Contacts" description="Sundry creditors registry details containing vendor tax parameters and payables">
        <ActionButton label="Create Supplier" icon={<Plus size={14} />} onClick={() => alert('Create Supplier dialog placeholder')} />
      </PageHeader>
      <DataTable columns={columns} data={mockSuppliers} />
    </PageContainer>
  );
}
