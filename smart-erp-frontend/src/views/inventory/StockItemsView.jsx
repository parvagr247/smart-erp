import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import ActionButton from '../../components/common/ActionButton';
import StatusBadge from '../../components/common/StatusBadge';
import { Plus } from 'lucide-react';

const MOCK_STOCK_ITEMS = [
  { id: '1', name: 'Industrial Motor 5HP', group: 'Finished Goods', part: 'IM-5HP-01', unit: 'Nos', qty: '12', rate: '₹14,500.00', value: '₹1,74,000.00', status: 'Active' },
  { id: '2', name: 'Steel Sheet 2mm', group: 'Raw Materials', part: 'SS-2MM-09', unit: 'Kgs', qty: '450', rate: '₹65.00', value: '₹29,250.00', status: 'Active' },
  { id: '3', name: 'Packaging Box C1', group: 'Packaging Box', part: 'PB-C1-02', unit: 'Pcs', qty: '20', rate: '₹12.00', value: '₹240.00', status: 'Active' }
];

const COLUMNS = [
  { key: 'name', header: 'Item Name' },
  { key: 'group', header: 'Stock Group' },
  { key: 'part', header: 'Part No.' },
  { key: 'unit', header: 'Base Unit' },
  { key: 'qty', header: 'Qty' },
  { key: 'rate', header: 'Standard Rate' },
  { key: 'value', header: 'Stock Value' },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> }
];

export default function StockItemsView() {
  return (
    <PageContainer>
      <PageHeader 
        title="Stock Items" 
        description="Catalog inventory records containing physical stock ledger, unit measures, and standard costs"
      >
        <ActionButton 
          label="Create Stock Item" 
          icon={<Plus size={14} />} 
          onClick={() => alert('Create Stock Item dialog placeholder')} 
        />
      </PageHeader>
      
      <DataTable columns={COLUMNS} data={MOCK_STOCK_ITEMS} />
    </PageContainer>
  );
}
