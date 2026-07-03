import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import ActionButton from '../../components/common/ActionButton';
import StatusBadge from '../../components/common/StatusBadge';
import { Plus } from 'lucide-react';

const MOCK_LEDGERS = [
  { id: '1', name: 'Cash Account', group: 'Cash-in-hand', openingBalance: '₹12,500.00', currentBalance: '₹12,500.00', type: 'Asset', status: 'Active' },
  { id: '2', name: 'HDFC Bank A/c', group: 'Bank Accounts', openingBalance: '₹4,50,000.00', currentBalance: '₹5,12,000.00', type: 'Asset', status: 'Active' },
  { id: '3', name: 'CGST Input A/c', group: 'Duties & Taxes', openingBalance: '₹0.00', currentBalance: '₹24,500.00', type: 'Asset', status: 'Active' },
  { id: '4', name: 'Rent Expense A/c', group: 'Indirect Expenses', openingBalance: '₹0.00', currentBalance: '₹45,000.00', type: 'Expense', status: 'Active' }
];

const COLUMNS = [
  { key: 'name', header: 'Ledger Name' },
  { key: 'group', header: 'Account Group' },
  { key: 'openingBalance', header: 'Opening Bal.' },
  { key: 'currentBalance', header: 'Current Bal.' },
  { key: 'type', header: 'Type' },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> }
];

export default function LedgersView() {
  return (
    <PageContainer>
      <PageHeader 
        title="Ledger Accounts" 
        description="Accounting ledger master configurations for bookkeeping and double-entry registers"
      >
        <ActionButton 
          label="Create Ledger" 
          icon={<Plus size={14} />} 
          onClick={() => alert('Create Ledger dialog placeholder')} 
        />
      </PageHeader>
      
      <DataTable columns={COLUMNS} data={MOCK_LEDGERS} />
    </PageContainer>
  );
}
