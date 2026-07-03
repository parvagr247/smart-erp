import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import DataTable from '@shared/components/DataTable';
import ActionButton from '@shared/components/ActionButton';
import StatusBadge from '@shared/components/StatusBadge';
import { Plus } from 'lucide-react';

const MOCK_STOCK_GROUPS = [
  { id: '1', name: 'Raw Materials', parent: 'Primary', addQty: 'Yes', status: 'Active' },
  { id: '2', name: 'Finished Goods', parent: 'Primary', addQty: 'Yes', status: 'Active' },
  { id: '3', name: 'Packaging Box', parent: 'Raw Materials', addQty: 'No', status: 'Active' }
];

const COLUMNS = [
  { key: 'name', header: 'Group Name' },
  { key: 'parent', header: 'Parent Group' },
  { key: 'addQty', header: 'Quantities Addable' },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> }
];

export default function StockGroupsView() {
  return (
    <PageContainer>
      <PageHeader 
        title="Stock Groups" 
        description="Classify inventory stock items into primary classifications for stock valuation"
      >
        <ActionButton 
          label="Create Stock Group" 
          icon={<Plus size={14} />} 
          onClick={() => alert('Create Stock Group dialog placeholder')} 
        />
      </PageHeader>
      
      <DataTable columns={COLUMNS} data={MOCK_STOCK_GROUPS} />
    </PageContainer>
  );
}
