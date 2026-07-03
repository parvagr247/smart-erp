import React from 'react';
import ComingSoonView from '@shared/components/ComingSoonView';
import { CreditCard } from 'lucide-react';

export default function BankingView() {
  return (
    <ComingSoonView
      moduleName="Banking & Bank Reconciliation"
      description="Verify bank ledger statements, balance cash books, reconcile checks, import bank feeds, and transfer electronic funds."
      requiredPermissions={['BANKING_VIEW', 'BANK_RECONCILE', 'STATEMENT_IMPORT']}
      icon={<CreditCard size={24} />}
    />
  );
}
