import React from 'react';
import ComingSoonView from '@shared/components/ComingSoonView';
import { CreditCard } from 'lucide-react';
import { useBankingViewData } from './services/BankingViewService';
import './styles/BankingView.css';

export default function BankingView() {
  const _data = useBankingViewData();
  return (
    <ComingSoonView
      moduleName="Banking & Bank Reconciliation"
      description="Verify bank ledger statements, balance cash books, reconcile checks, import bank feeds, and transfer electronic funds."
      requiredPermissions={['BANKING_VIEW', 'BANK_RECONCILE', 'STATEMENT_IMPORT']}
      icon={<CreditCard size={24} />}
    />
  );
}
