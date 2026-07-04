import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import './styles/LedgerContactCard.css';

export default function LedgerContactCard({ ledger }) {
  return (
    <div className="group relative rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface)] p-6 shadow-md transition-all duration-300 hover:border-[var(--primary)]/30">
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[var(--primary-glow)] blur-3xl" />
      
      <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider mb-5 flex items-center gap-2 pb-3 border-b border-[var(--border-light)]">
        <Mail size={16} className="text-blue-500" />
        Contact Details
      </h2>
      
      <div className="space-y-5">
        <div>
          <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Email Address</label>
          {ledger.email ? (
            <a href={`mailto:${ledger.email}`} className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1.5">
              <Mail size={13} className="text-[var(--text-muted)]" />
              {ledger.email}
            </a>
          ) : (
            <span className="text-xs text-[var(--text-muted)]">Not Provided</span>
          )}
        </div>

        <div>
          <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Phone Number</label>
          {ledger.phone ? (
            <a href={`tel:${ledger.phone}`} className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1.5">
              <Phone size={13} className="text-[var(--text-muted)]" />
              {ledger.phone}
            </a>
          ) : (
            <span className="text-xs text-[var(--text-muted)]">Not Provided</span>
          )}
        </div>

        <div>
          <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Registered Address</label>
          {ledger.address ? (
            <div className="flex items-start gap-1.5 text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
              <MapPin size={13} className="text-[var(--text-muted)] mt-0.5 flex-shrink-0" />
              <span className="select-all">{ledger.address}</span>
            </div>
          ) : (
            <span className="text-xs text-[var(--text-muted)]">Not Provided</span>
          )}
        </div>
      </div>
    </div>
  );
}
