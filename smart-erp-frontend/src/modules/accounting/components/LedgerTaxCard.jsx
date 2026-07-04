import React from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import './styles/LedgerTaxCard.css';

export default function LedgerTaxCard({ ledger, copiedField, onCopy }) {
  return (
    <div className="group relative rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface)] p-6 shadow-md transition-all duration-300 hover:border-[var(--primary)]/30">
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[var(--primary-glow)] blur-3xl" />
      
      <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider mb-5 flex items-center gap-2 pb-3 border-b border-[var(--border-light)]">
        <FileText size={16} className="text-purple-500" />
        Tax & Regulatory
      </h2>
      
      <div className="space-y-5">
        <div>
          <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">GST Applicable</label>
          <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${ledger.gstApplicable ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' : 'bg-[var(--bg-input)] text-[var(--text-secondary)] ring-[var(--border-light)]'}`}>
            {ledger.gstApplicable ? 'Yes' : 'No'}
          </span>
        </div>

        <div>
          <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">GSTIN Number</label>
          <div className="flex items-center justify-between gap-2 p-2.5 bg-[var(--bg-input)] rounded-xl border border-[var(--border-light)]">
            <span className="text-xs font-mono font-bold text-[var(--text-primary)] select-all">{ledger.gstNumber || 'Not Registered'}</span>
            {ledger.gstNumber && (
              <button 
                onClick={() => onCopy(ledger.gstNumber, 'gst')}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded transition-colors cursor-pointer"
                title="Copy GSTIN"
              >
                {copiedField === 'gst' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">PAN Number</label>
          <div className="flex items-center justify-between gap-2 p-2.5 bg-[var(--bg-input)] rounded-xl border border-[var(--border-light)]">
            <span className="text-xs font-mono font-bold text-[var(--text-primary)] select-all">{ledger.pan || 'Not Provided'}</span>
            {ledger.pan && (
              <button 
                onClick={() => onCopy(ledger.pan, 'pan')}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded transition-colors cursor-pointer"
                title="Copy PAN"
              >
                {copiedField === 'pan' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
