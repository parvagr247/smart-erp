import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import EmptyState from '@shared/components/EmptyState';
import ActionButton from '@shared/components/ActionButton';
import { CreditCard, Plus } from 'lucide-react';

export default function BankingView() {
  return (
    <PageContainer>
      <PageHeader 
        title="Banking Registers" 
        description="Verify bank ledger statements, balance cash books, reconcile checks, and transfer electronic funds"
      >
        <ActionButton 
          label="New Deposit Slip" 
          icon={<Plus size={14} />} 
          onClick={() => alert('New bank deposit slip placeholder')} 
        />
      </PageHeader>
      
      <EmptyState
        title="No Bank Transactions Found"
        description="Reconcile bank accounts ledgers with physical statements or import Excel bank books to begin audits."
        icon={<CreditCard size={32} className="stroke-[2.5]" />}
        actionButton={
          <ActionButton 
            label="Import Bank Statement" 
            onClick={() => alert('Excel bank statement import placeholder')} 
          />
        }
      />
    </PageContainer>
  );
}
