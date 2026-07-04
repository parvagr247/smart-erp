import React from 'react';
import SectionCard from '@shared/components/SectionCard';
import { MapPin } from 'lucide-react';
import './styles/PartnerAddressesCard.css';

export default function PartnerAddressesCard({ addresses }) {
  return (
    <SectionCard title="Billing & Shipping Addresses" description="Physical warehouse deliveries and corporate tax register locations">
      {addresses.length === 0 ? (
        <div className="text-sm text-[var(--text-muted)] italic text-left">No billing or shipping addresses registered.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {addresses.map((addr) => (
            <div key={addr.id} className="p-4 border border-[var(--border-light)] rounded bg-[var(--bg-surface)] flex gap-3">
              <MapPin size={18} className="text-[var(--primary)] shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-[var(--text-primary)] uppercase tracking-wide block mb-1">{addr.addressType}</span>
                <p className="text-[var(--text-primary)]">{addr.addressLine1}</p>
                {addr.addressLine2 && <p className="text-[var(--text-primary)]">{addr.addressLine2}</p>}
                <p className="text-[var(--text-primary)]">{addr.city}, {addr.state} - {addr.pincode}</p>
                <p className="text-[var(--text-muted)] mt-1">{addr.country}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
