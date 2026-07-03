import React from 'react';
import ComingSoonView from '@shared/components/ComingSoonView';
import { ShoppingCart } from 'lucide-react';

export default function PurchaseView() {
  return (
    <ComingSoonView
      moduleName="Purchase Vouchers"
      description="Record vendor billing slips, debit notes, purchase orders, and supplier receipts to automatically update your outstanding ledger balances."
      requiredPermissions={['PURCHASE_VIEW', 'PURCHASE_CREATE', 'BILL_EDIT']}
      icon={<ShoppingCart size={24} />}
    />
  );
}
