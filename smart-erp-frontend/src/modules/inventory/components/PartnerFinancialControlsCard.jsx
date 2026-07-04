import React from 'react';
import SectionCard from '@shared/components/SectionCard';
import './styles/PartnerFinancialControlsCard.css';

export default function PartnerFinancialControlsCard({ partner }) {
  return (
    <SectionCard title="Financial Controls" description="Account opening balance values, payment terms, and credit limits">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-left">
        <div className="p-3 bg-[var(--bg-hover)] border border-[var(--border-light)] rounded">
          <span className="text-[var(--text-muted)] block text-xs font-semibold">Opening Balance</span>
          <span className="text-base font-bold text-[var(--text-primary)] mt-1 block">
            ₹ {parseFloat(partner.openingBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })} {partner.balanceType || ''}
          </span>
        </div>
        <div className="p-3 bg-[var(--bg-hover)] border border-[var(--border-light)] rounded">
          <span className="text-[var(--text-muted)] block text-xs font-semibold">Allowed Credit Limit</span>
          <span className="text-base font-bold text-[var(--text-primary)] mt-1 block">
            ₹ {parseFloat(partner.creditLimit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="p-3 bg-[var(--bg-hover)] border border-[var(--border-light)] rounded">
          <span className="text-[var(--text-muted)] block text-xs font-semibold">Standard Payment Terms</span>
          <span className="text-base font-bold text-[var(--text-primary)] mt-1 block">
            {partner.paymentTerms || 'COD / Instant'}
          </span>
        </div>
      </div>
    </SectionCard>
  );
}
