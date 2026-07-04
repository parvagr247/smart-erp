import React from 'react';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import './styles/PartnerFinancialSection.css';

export default function PartnerFinancialSection({ formData, handleChange }) {
  return (
    <div className="border-b border-[var(--border-light)] pb-6 text-left">
      <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4">2. Financial Control & Balances</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <Label htmlFor="openingBalance">Opening Ledger Balance</Label>
          <Input id="openingBalance" name="openingBalance" type="number" step="0.01" placeholder="0.00" value={formData.openingBalance} onChange={handleChange} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="balanceType">Balance Type</Label>
          <select id="balanceType" name="balanceType" value={formData.balanceType || ''} onChange={handleChange} className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-sm text-[var(--text-primary)] cursor-pointer h-10">
            <option value="">-- No Balance --</option>
            <option value="DEBIT">Debit (Dr)</option>
            <option value="CREDIT">Credit (Cr)</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="creditLimit">Allowed Credit Limit</Label>
          <Input id="creditLimit" name="creditLimit" type="number" step="0.01" placeholder="0.00" value={formData.creditLimit} onChange={handleChange} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="paymentTerms">Payment terms</Label>
          <Input id="paymentTerms" name="paymentTerms" placeholder="e.g. Net 30, Net 15" value={formData.paymentTerms || ''} onChange={handleChange} />
        </div>
      </div>
    </div>
  );
}
