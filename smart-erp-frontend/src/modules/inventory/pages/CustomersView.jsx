import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import DataTable from '@shared/components/DataTable';
import ActionButton from '@shared/components/ActionButton';
import { Plus } from 'lucide-react';
import { useCustomersViewData } from './services/CustomersViewService';
import './styles/CustomersView.css';

export default function CustomersView() {
  const { mockCustomers, columns } = useCustomersViewData();

  return (
    <PageContainer>
      <PageHeader title="Customer Contacts" description="Sundry debtors ledger index with quick balance checks and billing terms">
        <ActionButton label="Create Customer" icon={<Plus size={14} />} onClick={() => alert('Create Customer dialog placeholder')} />
      </PageHeader>
      <DataTable columns={columns} data={mockCustomers} />
    </PageContainer>
  );
}
