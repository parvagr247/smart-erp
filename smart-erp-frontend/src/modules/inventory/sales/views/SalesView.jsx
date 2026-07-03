import React from 'react';
import ComingSoonView from '@shared/components/ComingSoonView';
import { ShoppingBag } from 'lucide-react';

export default function SalesView() {
  return (
    <ComingSoonView
      moduleName="Sales Vouchers"
      description="Record billing tax invoices, credit notes, sales orders, and customer billing slips. This module will integrate with the GST portal for direct e-way bill generation."
      requiredPermissions={['SALES_VIEW', 'SALES_CREATE', 'INVOICE_EDIT']}
      icon={<ShoppingBag size={24} />}
    />
  );
}
