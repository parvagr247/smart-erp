import React from 'react';
import SectionCard from '@shared/components/SectionCard';
import StatusBadge from '@shared/components/StatusBadge';
import { Mail, Phone, Globe } from 'lucide-react';
import './styles/PartnerProfileDetailsCard.css';

export default function PartnerProfileDetailsCard({ partner }) {
  return (
    <SectionCard title="Ledger Profile Details" description="Core contact details, company scope parameters, and tax registrations">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm text-left">
        <div>
          <span className="text-[var(--text-muted)] block text-xs font-semibold">TAX / GSTIN Identification</span>
          <span className="font-medium text-[var(--text-primary)]">{partner.gstNumber || 'N/A'}</span>
        </div>
        <div>
          <span className="text-[var(--text-muted)] block text-xs font-semibold">Permanent Account Number (PAN)</span>
          <span className="font-medium text-[var(--text-primary)]">{partner.pan || 'N/A'}</span>
        </div>
        <div>
          <span className="text-[var(--text-muted)] block text-xs font-semibold">Primary Email Address</span>
          <span className="font-medium text-[var(--text-primary)] flex items-center gap-1.5 mt-0.5 animate-pulse-none">
            <Mail size={12} className="text-[var(--text-muted)]" />
            {partner.email ? <a href={`mailto:${partner.email}`} className="hover:underline text-[var(--accent)]">{partner.email}</a> : 'N/A'}
          </span>
        </div>
        <div>
          <span className="text-[var(--text-muted)] block text-xs font-semibold">Primary Landline Phone</span>
          <span className="font-medium text-[var(--text-primary)] flex items-center gap-1.5 mt-0.5">
            <Phone size={12} className="text-[var(--text-muted)]" />
            {partner.phone || 'N/A'}
          </span>
        </div>
        <div>
          <span className="text-[var(--text-muted)] block text-xs font-semibold">Official Website</span>
          <span className="font-medium text-[var(--text-primary)] flex items-center gap-1.5 mt-0.5">
            <Globe size={12} className="text-[var(--text-muted)]" />
            {partner.website ? <a href={partner.website.startsWith('http') ? partner.website : `https://${partner.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-[var(--accent)]">{partner.website}</a> : 'N/A'}
          </span>
        </div>
        <div>
          <span className="text-[var(--text-muted)] block text-xs font-semibold">Ledger Active Status</span>
          <span className="inline-block mt-1">
            <StatusBadge status={partner.status} />
          </span>
        </div>
      </div>
    </SectionCard>
  );
}
