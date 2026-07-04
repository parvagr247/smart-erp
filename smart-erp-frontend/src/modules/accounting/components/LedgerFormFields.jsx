import React from 'react';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import './styles/LedgerFormFields.css';

export default function LedgerFormFields({ bind, errors, groups }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
      <div className="space-y-1"><Label htmlFor="name">Ledger Name *</Label><Input id="name" placeholder="e.g. ICICI Bank A/c" {...bind('name')} required />{errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}</div>
      <div className="space-y-1"><Label htmlFor="groupId">Account Group *</Label>
        <select id="groupId" className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-sm text-[var(--text-primary)] cursor-pointer focus:outline-none" {...bind('groupId')} required>
          <option value="">-- Select Group --</option>
          {groups.map(g => <option key={g.id} value={g.id}>{g.name} ({g.nature})</option>)}
        </select>
        {errors.groupId && <span className="text-red-500 text-xs">{errors.groupId}</span>}
      </div>
      <div className="space-y-1"><Label htmlFor="openingBalance">Opening Balance</Label><Input id="openingBalance" type="number" step="0.01" placeholder="0.00" {...bind('openingBalance')} />{errors.openingBalance && <span className="text-red-500 text-xs">{errors.openingBalance}</span>}</div>
      <div className="space-y-1"><Label htmlFor="balanceType">Balance Type</Label>
        <select id="balanceType" className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-sm text-[var(--text-primary)] cursor-pointer focus:outline-none" {...bind('balanceType')}>
          <option value="DEBIT">Debit (Dr)</option><option value="CREDIT">Credit (Cr)</option>
        </select>
      </div>
      <div className="space-y-1"><Label htmlFor="pan">PAN Number</Label><Input id="pan" placeholder="e.g. AAAAA0000A" {...bind('pan')} />{errors.pan && <span className="text-red-500 text-xs">{errors.pan}</span>}</div>
      <div className="space-y-1"><div className="flex items-center gap-2 pt-6"><input type="checkbox" id="gstApplicable" className="w-4 h-4 cursor-pointer" {...bind('gstApplicable')} /><Label htmlFor="gstApplicable" className="cursor-pointer">GST Applicable</Label></div></div>
      <div className="space-y-1"><Label htmlFor="gstNumber">GSTIN</Label><Input id="gstNumber" placeholder="e.g. 22AAAAA0000A1Z5" {...bind('gstNumber')} />{errors.gstNumber && <span className="text-red-500 text-xs">{errors.gstNumber}</span>}</div>
      <div className="space-y-1"><Label htmlFor="phone">Phone Number</Label><Input id="phone" placeholder="e.g. +91 98765 43210" {...bind('phone')} /></div>
      <div className="space-y-1"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" placeholder="e.g. finance@ledger.com" {...bind('email')} /></div>
      <div className="space-y-1 md:col-span-2"><Label htmlFor="address">Registered Address</Label><Input id="address" placeholder="e.g. 101 Corporate towers, G.I.D.C" {...bind('address')} /></div>
    </div>
  );
}
