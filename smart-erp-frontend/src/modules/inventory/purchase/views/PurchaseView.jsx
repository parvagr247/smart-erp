import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import EmptyState from '@shared/components/EmptyState';
import ActionButton from '@shared/components/ActionButton';
import { ShoppingCart, Plus } from 'lucide-react';

export default function PurchaseView() {
  return (
    <PageContainer>
      <PageHeader 
        title="Purchase Vouchers" 
        description="Record vendor billing slips, debit notes, purchase orders, and supplier receipts"
      >
        <ActionButton 
          label="Create Purchase" 
          icon={<Plus size={14} />} 
          onClick={() => alert('New Purchase Voucher creation placeholder')} 
        />
      </PageHeader>
      
      <EmptyState
        title="No Supplier Bills Found"
        description="Record raw materials purchases or vendor services bills to reconcile creditor ledger books."
        icon={<ShoppingCart size={32} className="stroke-[2.5]" />}
        actionButton={
          <ActionButton 
            label="Record Purchase Voucher" 
            onClick={() => alert('Purchase voucher dialog placeholder')} 
          />
        }
      />
    </PageContainer>
  );
}
