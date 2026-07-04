import React from 'react';
import StatusBadge from '@shared/components/StatusBadge';
import { Wallet } from 'lucide-react';
import './styles/LedgerProfileCard.css';

export default function LedgerProfileCard({ ledger }) {
  return (
    <div className="group relative rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface)] p-6 shadow-md transition-all duration-300 hover:border-[var(--primary)]/30">
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[var(--primary-glow)] blur-3xl" />
      
      <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider mb-5 flex items-center gap-2 pb-3 border-b border-[var(--border-light)]">
        <Wallet size={16} className="text-[var(--primary)]" />
        Financial Profile
      </h2>
      
      <div className="space-y-5">
        <div>
          <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Ledger Name</label>
          <div className="text-base font-bold text-[var(--text-primary)]">{ledger.name}</div>
        </div>
        
        <div>
          <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Group Category</label>
          <div className="inline-flex items-center rounded-md bg-[var(--primary-glow)] px-2.5 py-1 text-xs font-semibold text-[var(--primary)] ring-1 ring-inset ring-[var(--primary)]/20 mt-0.5">
            {ledger.groupName}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Opening Balance</label>
            <div className="text-lg font-black text-[var(--text-primary)]">₹{ledger.openingBalance?.toFixed(2) || '0.00'}</div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Balance Type</label>
            <div className={`text-xs font-bold mt-1 inline-block px-2 py-0.5 rounded ${ledger.balanceType === 'DEBIT' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              {ledger.balanceType || 'DEBIT'}
            </div>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Status</label>
          <div className="mt-1">
            <StatusBadge status={ledger.isActive ? 'Active' : 'Inactive'} />
          </div>
        </div>
      </div>
    </div>
  );
}
