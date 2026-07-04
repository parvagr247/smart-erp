import React from 'react';
import ActionButton from '@shared/components/ActionButton';
import { Label } from '@shared/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import './styles/PartnerAddressesSection.css';

export default function PartnerAddressesSection({ addresses, addAddress, removeAddress, handleAddressChange }) {
  return (
    <div className="border-b border-[var(--border-light)] pb-6 text-left">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">3. Address Directory</h3>
        <ActionButton label="Add Address" icon={<Plus size={12} />} onClick={addAddress} />
      </div>
      {addresses.length === 0 ? (
        <div className="text-xs text-[var(--text-muted)] italic py-2">No billing or shipping addresses registered. Click "Add Address".</div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr, idx) => (
            <div key={idx} className="p-4 bg-[var(--bg-hover)] rounded border border-[var(--border-light)] space-y-3 relative">
              <div className="absolute right-4 top-4">
                <ActionButton label="Remove" variant="destructive" icon={<Trash2 size={12} />} onClick={() => removeAddress(idx)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-[90%]">
                <div className="space-y-1">
                  <Label>Address Type</Label>
                  <select value={addr.addressType} onChange={(e) => handleAddressChange(idx, 'addressType', e.target.value)} className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] cursor-pointer h-9">
                    <option value="BILLING">Billing Address</option>
                    <option value="SHIPPING">Shipping Address</option>
                    <option value="REGISTERED">Registered Office</option>
                  </select>
                </div>
                <div className="space-y-1 md:col-span-3">
                  <Label>Address Line 1</Label>
                  <input type="text" value={addr.addressLine1} onChange={(e) => handleAddressChange(idx, 'addressLine1', e.target.value)} placeholder="Street address, P.O. box, suite" className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] h-9" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-1">
                  <Label>Line 2 (Optional)</Label>
                  <input type="text" value={addr.addressLine2 || ''} onChange={(e) => handleAddressChange(idx, 'addressLine2', e.target.value)} placeholder="Building, Landmark" className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] h-9" />
                </div>
                <div className="space-y-1">
                  <Label>City</Label>
                  <input type="text" value={addr.city} onChange={(e) => handleAddressChange(idx, 'city', e.target.value)} placeholder="Mumbai" className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] h-9" required />
                </div>
                <div className="space-y-1">
                  <Label>State</Label>
                  <input type="text" value={addr.state} onChange={(e) => handleAddressChange(idx, 'state', e.target.value)} placeholder="Maharashtra" className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] h-9" required />
                </div>
                <div className="space-y-1">
                  <Label>Country</Label>
                  <input type="text" value={addr.country} onChange={(e) => handleAddressChange(idx, 'country', e.target.value)} placeholder="India" className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] h-9" required />
                </div>
                <div className="space-y-1">
                  <Label>Pincode / ZIP</Label>
                  <input type="text" value={addr.pincode} onChange={(e) => handleAddressChange(idx, 'pincode', e.target.value)} placeholder="400001" className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] h-9" required />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
