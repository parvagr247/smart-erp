import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import EmptyState from '@shared/components/EmptyState';
import ActionButton from '@shared/components/ActionButton';
import { ShoppingBag, Plus } from 'lucide-react';

export default function SalesView() {
  return (
    <PageContainer>
      <PageHeader 
        title="Sales Vouchers" 
        description="Record billing tax invoices, credit notes, sales orders, and customer billing slips"
      >
        <ActionButton 
          label="Create Invoice" 
          icon={<Plus size={14} />} 
          onClick={() => alert('New Sales Invoice creation placeholder')} 
        />
      </PageHeader>
      
      <EmptyState
        title="No Sales Invoices Found"
        description="Create tax invoices for your products and catalog items to record sales revenue registers."
        icon={<ShoppingBag size={32} className="stroke-[2.5]" />}
        actionButton={
          <ActionButton 
            label="Record Sales Voucher" 
            onClick={() => alert('Sales voucher dialog placeholder')} 
          />
        }
      />
    </PageContainer>
  );
}
