import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import SectionCard from '@shared/components/SectionCard';
import ActionButton from '@shared/components/ActionButton';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { useLedgerForm, fetchGroupsList } from '@modules/accounting/services/accounting.service';

export default function CreateLedgerView() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const { loading, error, errors, bind, handleSubmit } = useLedgerForm(null, () => navigate('/accounting/ledgers'));

  useEffect(() => { fetchGroupsList().then(res => setGroups(res.data || [])); }, []);

  return (
    <PageContainer>
      <PageHeader title="Create Ledger" description="Register a new ledger account master inside the active company scope" />

      <SectionCard title="Ledger Details" description="Fill out ledger name, group, opening balances, and contact details">
        {error && <div className="p-3 mb-4 text-sm text-red-500 rounded bg-red-500/10 border border-red-500/20">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6 text-left max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="name">Ledger Name *</Label>
              <Input id="name" placeholder="e.g. ICICI Bank A/c" {...bind('name')} required />
              {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="groupId">Account Group *</Label>
              <select id="groupId" className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-sm text-[var(--text-primary)] cursor-pointer" {...bind('groupId')} required>
                <option value="">-- Select Group --</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name} ({g.nature})</option>)}
              </select>
              {errors.groupId && <span className="text-red-500 text-xs">{errors.groupId}</span>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="openingBalance">Opening Balance</Label>
              <Input id="openingBalance" type="number" step="0.01" placeholder="0.00" {...bind('openingBalance')} />
              {errors.openingBalance && <span className="text-red-500 text-xs">{errors.openingBalance}</span>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="balanceType">Balance Type</Label>
              <select id="balanceType" className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-sm text-[var(--text-primary)] cursor-pointer" {...bind('balanceType')}>
                <option value="DEBIT">Debit (Dr)</option>
                <option value="CREDIT">Credit (Cr)</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="pan">PAN Number</Label>
              <Input id="pan" placeholder="e.g. AAAAA0000A" {...bind('pan')} />
              {errors.pan && <span className="text-red-500 text-xs">{errors.pan}</span>}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 pt-6">
                <input type="checkbox" id="gstApplicable" className="w-4 h-4 cursor-pointer" {...bind('gstApplicable')} />
                <Label htmlFor="gstApplicable" className="cursor-pointer">GST Applicable</Label>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="gstNumber">GSTIN</Label>
              <Input id="gstNumber" placeholder="e.g. 22AAAAA0000A1Z5" {...bind('gstNumber')} />
              {errors.gstNumber && <span className="text-red-500 text-xs">{errors.gstNumber}</span>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="e.g. +91 98765 43210" {...bind('phone')} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="e.g. finance@ledger.com" {...bind('email')} />
            </div>

            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="address">Registered Address</Label>
              <Input id="address" placeholder="e.g. 101 Corporate towers, G.I.D.C" {...bind('address')} />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-[var(--border-light)]">
            <ActionButton label="Cancel" variant="outline" type="button" onClick={() => navigate('/accounting/ledgers')} />
            <ActionButton label="Create Ledger" type="submit" disabled={loading} />
          </div>
        </form>
      </SectionCard>
    </PageContainer>
  );
}
