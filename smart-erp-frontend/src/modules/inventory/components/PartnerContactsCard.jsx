import React from 'react';
import SectionCard from '@shared/components/SectionCard';
import { User, Mail, Phone } from 'lucide-react';
import './styles/PartnerContactsCard.css';

export default function PartnerContactsCard({ contacts }) {
  return (
    <SectionCard title="Contact Persons" description="Company representatives and logistics point of contacts">
      {contacts.length === 0 ? (
        <div className="text-sm text-[var(--text-muted)] italic text-left">No representatives registered.</div>
      ) : (
        <div className="space-y-3 text-left">
          {contacts.map((c) => (
            <div key={c.id} className={`p-4 border rounded bg-[var(--bg-surface)] text-xs space-y-2 ${c.isPrimary ? 'border-[var(--primary)] shadow-sm' : 'border-[var(--border-light)]'}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
                  <User size={14} className="text-[var(--text-muted)]" />
                  {c.contactName}
                </span>
                {c.isPrimary && (
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded font-semibold uppercase">Primary</span>
                )}
              </div>
              {c.designation && <p className="text-[var(--text-muted)] font-medium italic">{c.designation}</p>}
              <div className="space-y-1 pt-1 text-[var(--text-primary)] border-t border-[var(--border-light)] mt-2">
                {c.email && (
                  <p className="flex items-center gap-2">
                    <Mail size={12} className="text-[var(--text-muted)]" />
                    <a href={`mailto:${c.email}`} className="hover:underline text-[var(--primary)]">{c.email}</a>
                  </p>
                )}
                {c.mobile && (
                  <p className="flex items-center gap-2">
                    <Phone size={12} className="text-[var(--text-muted)]" />
                    <span>{c.mobile} (Mobile)</span>
                  </p>
                )}
                {c.phone && (
                  <p className="flex items-center gap-2">
                    <Phone size={12} className="text-[var(--text-muted)]" />
                    <span>{c.phone} (Direct)</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
