import React from 'react';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import ActionButton from '@shared/components/ActionButton';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function PartnerForm({ formData, setFormData, error, loading, handleChange, handleCustomChange, handleSubmit, onCancel }) {
  
  // Dynamic Addresses handlers
  const addAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [...prev.addresses, { addressType: 'BILLING', addressLine1: '', addressLine2: '', city: '', state: '', country: 'India', pincode: '' }]
    }));
  };

  const removeAddress = (index) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index)
    }));
  };

  const handleAddressChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.addresses];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, addresses: updated };
    });
  };

  // Dynamic Contacts handlers
  const addContact = () => {
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, { contactName: '', designation: '', email: '', phone: '', mobile: '', isPrimary: prev.contacts.length === 0 }]
    }));
  };

  const removeContact = (index) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index)
    }));
  };

  const handleContactChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.contacts];
      if (field === 'isPrimary' && value === true) {
        // Toggle other contacts to false
        updated.forEach((c, idx) => {
          updated[idx] = { ...c, isPrimary: idx === index };
        });
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, contacts: updated };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-left max-w-5xl">
      {error && (
        <div className="p-3 text-sm text-red-500 rounded bg-red-500/10 border border-red-500/20">
          {error}
        </div>
      )}

      {/* 1. General Info */}
      <div className="border-b border-[var(--border-light)] pb-6">
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4">1. General Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label htmlFor="code">Partner Code *</Label>
            <Input id="code" name="code" placeholder="e.g. BP-001" value={formData.code} onChange={handleChange} required />
          </div>

          <div className="space-y-1">
            <Label htmlFor="name">Partner Legal Name *</Label>
            <Input id="name" name="name" placeholder="e.g. Reliance Industries Ltd" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="space-y-1">
            <Label htmlFor="type">Classification Type *</Label>
            <select 
              id="type" 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
              className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-sm text-[var(--text-primary)] cursor-pointer h-10"
              required
            >
              <option value="CUSTOMER">Customer</option>
              <option value="SUPPLIER">Supplier</option>
              <option value="BOTH">Both (Customer & Supplier)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="space-y-1">
            <Label htmlFor="gstNumber">GSTIN Number</Label>
            <Input id="gstNumber" name="gstNumber" placeholder="15-digit GSTIN" value={formData.gstNumber || ''} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="pan">PAN Card Number</Label>
            <Input id="pan" name="pan" placeholder="10-digit PAN" value={formData.pan || ''} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" placeholder="e.g. info@reliance.com" value={formData.email || ''} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone">Phone / Landline</Label>
            <Input id="phone" name="phone" placeholder="e.g. +91-22-22448899" value={formData.phone || ''} onChange={handleChange} />
          </div>
        </div>
      </div>

      {/* 2. Financial parameters */}
      <div className="border-b border-[var(--border-light)] pb-6">
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4">2. Financial Control & Balances</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <Label htmlFor="openingBalance">Opening Ledger Balance</Label>
            <Input id="openingBalance" name="openingBalance" type="number" step="0.01" placeholder="0.00" value={formData.openingBalance} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="balanceType">Balance Type</Label>
            <select 
              id="balanceType" 
              name="balanceType" 
              value={formData.balanceType || ''} 
              onChange={handleChange}
              className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-sm text-[var(--text-primary)] cursor-pointer h-10"
            >
              <option value="">-- No Balance --</option>
              <option value="DEBIT">Debit (Dr)</option>
              <option value="CREDIT">Credit (Cr)</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="creditLimit">Allowed Credit Limit</Label>
            <Input id="creditLimit" name="creditLimit" type="number" step="0.01" placeholder="0.00" value={formData.creditLimit} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="paymentTerms">Payment terms</Label>
            <Input id="paymentTerms" name="paymentTerms" placeholder="e.g. Net 30, Net 15" value={formData.paymentTerms || ''} onChange={handleChange} />
          </div>
        </div>
      </div>

      {/* 3. Address List */}
      <div className="border-b border-[var(--border-light)] pb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">3. Address Directory</h3>
          <ActionButton label="Add Address" icon={<Plus size={12} />} onClick={addAddress} />
        </div>

        {formData.addresses.length === 0 ? (
          <div className="text-xs text-[var(--text-muted)] italic py-2">No billing or shipping addresses registered. Click "Add Address".</div>
        ) : (
          <div className="space-y-4">
            {formData.addresses.map((addr, idx) => (
              <div key={idx} className="p-4 bg-[var(--bg-hover)] rounded border border-[var(--border-light)] space-y-3 relative">
                <div className="absolute right-4 top-4">
                  <ActionButton label="Remove" variant="destructive" icon={<Trash2 size={12} />} onClick={() => removeAddress(idx)} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-[90%]">
                  <div className="space-y-1">
                    <Label>Address Type</Label>
                    <select 
                      value={addr.addressType} 
                      onChange={(e) => handleAddressChange(idx, 'addressType', e.target.value)}
                      className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] cursor-pointer h-9"
                    >
                      <option value="BILLING">Billing Address</option>
                      <option value="SHIPPING">Shipping Address</option>
                      <option value="REGISTERED">Registered Office</option>
                    </select>
                  </div>

                  <div className="space-y-1 md:col-span-3">
                    <Label>Address Line 1</Label>
                    <input 
                      type="text" 
                      value={addr.addressLine1} 
                      onChange={(e) => handleAddressChange(idx, 'addressLine1', e.target.value)}
                      placeholder="Street address, P.O. box, suite" 
                      className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] h-9"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="space-y-1">
                    <Label>Line 2 (Optional)</Label>
                    <input 
                      type="text" 
                      value={addr.addressLine2 || ''} 
                      onChange={(e) => handleAddressChange(idx, 'addressLine2', e.target.value)}
                      placeholder="Building, Landmark" 
                      className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>City</Label>
                    <input 
                      type="text" 
                      value={addr.city} 
                      onChange={(e) => handleAddressChange(idx, 'city', e.target.value)}
                      placeholder="Mumbai" 
                      className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] h-9"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>State</Label>
                    <input 
                      type="text" 
                      value={addr.state} 
                      onChange={(e) => handleAddressChange(idx, 'state', e.target.value)}
                      placeholder="Maharashtra" 
                      className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] h-9"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Country</Label>
                    <input 
                      type="text" 
                      value={addr.country} 
                      onChange={(e) => handleAddressChange(idx, 'country', e.target.value)}
                      placeholder="India" 
                      className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] h-9"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Pincode / ZIP</Label>
                    <input 
                      type="text" 
                      value={addr.pincode} 
                      onChange={(e) => handleAddressChange(idx, 'pincode', e.target.value)}
                      placeholder="400001" 
                      className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] h-9"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Contacts List */}
      <div className="border-b border-[var(--border-light)] pb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">4. Point of Contacts</h3>
          <ActionButton label="Add Contact Person" icon={<Plus size={12} />} onClick={addContact} />
        </div>

        {formData.contacts.length === 0 ? (
          <div className="text-xs text-[var(--text-muted)] italic py-2">No individual contact representatives registered. Click "Add Contact Person".</div>
        ) : (
          <div className="space-y-4">
            {formData.contacts.map((c, idx) => (
              <div key={idx} className="p-4 bg-[var(--bg-hover)] rounded border border-[var(--border-light)] space-y-3 relative">
                <div className="absolute right-4 top-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleContactChange(idx, 'isPrimary', true)}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition border ${c.isPrimary ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-transparent text-[var(--text-muted)] border-[var(--border-light)] hover:bg-[var(--bg-input)]'}`}
                  >
                    <CheckCircle2 size={12} />
                    {c.isPrimary ? 'Primary Representative' : 'Set as Primary'}
                  </button>
                  <ActionButton label="Remove" variant="destructive" icon={<Trash2 size={12} />} onClick={() => removeContact(idx)} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-[75%]">
                  <div className="space-y-1">
                    <Label>Contact Name *</Label>
                    <input 
                      type="text" 
                      value={c.contactName} 
                      onChange={(e) => handleContactChange(idx, 'contactName', e.target.value)}
                      placeholder="e.g. Rajesh Kumar" 
                      className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] h-9"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Designation</Label>
                    <input 
                      type="text" 
                      value={c.designation || ''} 
                      onChange={(e) => handleContactChange(idx, 'designation', e.target.value)}
                      placeholder="e.g. Sales Manager" 
                      className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Representative Email</Label>
                    <input 
                      type="email" 
                      value={c.email || ''} 
                      onChange={(e) => handleContactChange(idx, 'email', e.target.value)}
                      placeholder="rajesh@reliance.com" 
                      className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Direct Phone</Label>
                    <input 
                      type="text" 
                      value={c.phone || ''} 
                      onChange={(e) => handleContactChange(idx, 'phone', e.target.value)}
                      placeholder="Landline" 
                      className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Mobile Number</Label>
                    <input 
                      type="text" 
                      value={c.mobile || ''} 
                      onChange={(e) => handleContactChange(idx, 'mobile', e.target.value)}
                      placeholder="Mobile" 
                      className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-xs text-[var(--text-primary)] h-9"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Internal Remarks / Notes</Label>
        <textarea 
          id="notes" 
          name="notes" 
          rows={3} 
          placeholder="Enter credit history notes, logistics constraints, or special terms..." 
          value={formData.notes || ''} 
          onChange={handleChange}
          className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-sm text-[var(--text-primary)]"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end border-t border-[var(--border-light)] pt-6">
        <ActionButton label="Cancel" variant="secondary" onClick={onCancel} disabled={loading} />
        <button 
          type="submit" 
          disabled={loading}
          className="p-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold rounded transition px-6 flex items-center justify-center disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Save Partner Record'}
        </button>
      </div>
    </form>
  );
}
