import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import SectionCard from '@shared/components/SectionCard';
import ActionButton from '@shared/components/ActionButton';
import StatusBadge from '@shared/components/StatusBadge';
import { ArrowLeft, Edit3, Globe, Mail, Phone, MapPin, User, FileText } from 'lucide-react';
import { fetchPartnerById } from '../services/partner.service';

export default function PartnerDetailsView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPartnerDetails = async () => {
      try {
        const res = await fetchPartnerById(id);
        if (res.success && res.data) {
          setPartner(res.data);
        } else {
          setError(res.message || 'Failed to fetch details.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load business partner profile.');
      } finally {
        setLoading(false);
      }
    };
    loadPartnerDetails();
  }, [id]);

  if (loading) {
    return (
      <PageContainer>
        <div className="text-center py-12 text-sm text-[var(--text-muted)] animate-pulse">Loading partner profile details...</div>
      </PageContainer>
    );
  }

  if (error || !partner) {
    return (
      <PageContainer>
        <div className="p-4 text-sm text-red-500 rounded bg-red-500/10 border border-red-500/20 mb-4">{error || 'Partner not found.'}</div>
        <ActionButton label="Back to List" icon={<ArrowLeft size={12} />} onClick={() => navigate('/inventory/partners/list')} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader 
        title={partner.name} 
        description={`Partner Code: ${partner.code} | Classification: ${partner.type}`}
      >
        <ActionButton 
          label="Back" 
          variant="secondary"
          icon={<ArrowLeft size={14} />} 
          onClick={() => navigate('/inventory/partners/list')} 
        />
        <ActionButton 
          label="Edit Partner" 
          icon={<Edit3 size={14} />} 
          onClick={() => navigate(`/inventory/partners/edit/${partner.id}`)} 
        />
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* Left Side: General and Financial Details */}
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Ledger Profile Details" description="Core contact details, company scope parameters, and tax registrations">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm">
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
                <span className="font-medium text-[var(--text-primary)] flex items-center gap-1.5 mt-0.5">
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

          <SectionCard title="Financial Controls" description="Account opening balance values, payment terms, and credit limits">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
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

          {/* Internal Notes */}
          {partner.notes && (
            <SectionCard title="Internal Remarks" description="Internal comments and credit history details">
              <div className="p-3 bg-[var(--bg-hover)] border border-[var(--border-light)] rounded text-sm text-[var(--text-primary)] whitespace-pre-line flex items-start gap-2">
                <FileText size={16} className="text-[var(--text-muted)] mt-0.5 shrink-0" />
                <span>{partner.notes}</span>
              </div>
            </SectionCard>
          )}

          {/* Addresses */}
          <SectionCard title="Billing & Shipping Addresses" description="Physical warehouse deliveries and corporate tax register locations">
            {partner.addresses.length === 0 ? (
              <div className="text-sm text-[var(--text-muted)] italic">No billing or shipping addresses registered.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {partner.addresses.map((addr) => (
                  <div key={addr.id} className="p-4 border border-[var(--border-light)] rounded bg-[var(--bg-surface)] flex gap-3">
                    <MapPin size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
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
        </div>

        {/* Right Side: Contacts / Representatives */}
        <div className="space-y-6">
          <SectionCard title="Contact Persons" description="Company representatives and logistics point of contacts">
            {partner.contacts.length === 0 ? (
              <div className="text-sm text-[var(--text-muted)] italic">No representatives registered.</div>
            ) : (
              <div className="space-y-3">
                {partner.contacts.map((c) => (
                  <div key={c.id} className={`p-4 border rounded bg-[var(--bg-surface)] text-xs space-y-2 ${c.isPrimary ? 'border-[var(--accent)] shadow-sm' : 'border-[var(--border-light)]'}`}>
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
                          <a href={`mailto:${c.email}`} className="hover:underline text-[var(--accent)]">{c.email}</a>
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
        </div>
      </div>
    </PageContainer>
  );
}
