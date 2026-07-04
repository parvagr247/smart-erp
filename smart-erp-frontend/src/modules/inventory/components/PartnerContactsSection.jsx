import React from 'react';
import ActionButton from '@shared/components/ActionButton';
import { Label } from '@shared/components/ui/label';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import './styles/PartnerContactsSection.css';

export default function PartnerContactsSection({ contacts, addContact, removeContact, handleContactChange }) {
  return (
    <div className="border-b border-[var(--border-light)] pb-6 text-left">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">4. Point of Contacts</h3>
        <ActionButton label="Add Contact Person" icon={<Plus size={12} />} onClick={addContact} />
      </div>
      {contacts.length === 0 ? (
        <div className="text-xs text-[var(--text-muted)] italic py-2">No individual contact representatives registered. Click "Add Contact Person".</div>
      ) : (
        <div className="space-y-4">
          {contacts.map((c, idx) => (
            <div key={idx} className="p-4 bg-[var(--bg-hover)] rounded border border-[var(--border-light)] space-y-3 relative">
              <div className="absolute right-4 top-4 flex items-center gap-2">
                <button type="button" onClick={() => handleContactChange(idx, 'isPrimary', true)} className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition border cursor-pointer ${c.isPrimary ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-transparent text-[var(--text-muted)] border-[var(--border-light)] hover:bg-[var(--bg-input)]'}`}>
                  <CheckCircle2 size={12} />
                  {c.isPrimary ? 'Primary Representative' : 'Set as Primary'}
                </button>
                <ActionButton label="Remove" variant="destructive" icon={<Trash2 size={12} />} onClick={() => removeContact(idx)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-[75%]">
                <div className="space-y-1">
                  <Label>Contact Name *</Label>
                  <input type="text" value={c.contactName} onChange={(e) => handleContactChange(idx, 'contactName', e.target.value)} placeholder="e.g. Rajesh Kumar" className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] h-9" required />
                </div>
                <div className="space-y-1">
                  <Label>Designation</Label>
                  <input type="text" value={c.designation || ''} onChange={(e) => handleContactChange(idx, 'designation', e.target.value)} placeholder="e.g. Sales Manager" className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] h-9" />
                </div>
                <div className="space-y-1">
                  <Label>Representative Email</Label>
                  <input type="email" value={c.email || ''} onChange={(e) => handleContactChange(idx, 'email', e.target.value)} placeholder="rajesh@reliance.com" className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] h-9" />
                </div>
                <div className="space-y-1">
                  <Label>Direct Phone</Label>
                  <input type="text" value={c.phone || ''} onChange={(e) => handleContactChange(idx, 'phone', e.target.value)} placeholder="Landline" className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] h-9" />
                </div>
                <div className="space-y-1">
                  <Label>Mobile Number</Label>
                  <input type="text" value={c.mobile || ''} onChange={(e) => handleContactChange(idx, 'mobile', e.target.value)} placeholder="Mobile" className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] h-9" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
