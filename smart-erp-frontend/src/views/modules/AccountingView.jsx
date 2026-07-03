import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import ActionButton from '../../components/common/ActionButton';
import { Landmark, Plus } from 'lucide-react';

export default function AccountingView() {
  return (
    <PageContainer>
      <PageHeader 
        title="Accounting Registers" 
        description="Record general journals, view bank cash books, and configure double-entry accounting files"
      >
        <ActionButton 
          label="New Voucher" 
          icon={<Plus size={14} />} 
          onClick={() => alert('New Accounting Voucher creation placeholder')} 
        />
      </PageHeader>
      
      <EmptyState
        title="No Vouchers Registered"
        description="Configure your chart of accounts ledgers and begin recording direct journals or banking cash vouchers."
        icon={<Landmark size={32} className="stroke-[2.5]" />}
        actionButton={
          <ActionButton 
            label="Configure Chart of Accounts" 
            onClick={() => alert('Chart of accounts settings coming soon')} 
          />
        }
      />
    </PageContainer>
  );
}
