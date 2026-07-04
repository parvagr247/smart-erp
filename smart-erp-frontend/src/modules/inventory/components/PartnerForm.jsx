import React from 'react';
import { Label } from '@shared/components/ui/label';
import ActionButton from '@shared/components/ActionButton';
import { usePartnerFormViewData } from './services/PartnerFormService';
import PartnerGeneralSection from './PartnerGeneralSection';
import PartnerFinancialSection from './PartnerFinancialSection';
import PartnerAddressesSection from './PartnerAddressesSection';
import PartnerContactsSection from './PartnerContactsSection';
import './styles/PartnerForm.css';

export default function PartnerForm(props) {
  const { formData, error, loading, handleChange, handleSubmit, onCancel, addAddress, removeAddress, handleAddressChange, addContact, removeContact, handleContactChange } = usePartnerFormViewData(props);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-left max-w-5xl">
      {error && <div className="p-3 text-sm text-red-500 rounded bg-red-500/10 border border-red-500/20">{error}</div>}
      <PartnerGeneralSection formData={formData} handleChange={handleChange} />
      <PartnerFinancialSection formData={formData} handleChange={handleChange} />
      <PartnerAddressesSection addresses={formData.addresses} addAddress={addAddress} removeAddress={removeAddress} handleAddressChange={handleAddressChange} />
      <PartnerContactsSection contacts={formData.contacts} addContact={addContact} removeContact={removeContact} handleContactChange={handleContactChange} />
      <div className="space-y-2">
        <Label htmlFor="notes">Internal Remarks / Notes</Label>
        <textarea id="notes" name="notes" rows={3} placeholder="Enter credit history notes, logistics constraints, or special terms..." value={formData.notes || ''} onChange={handleChange} className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-sm text-[var(--text-primary)]" />
      </div>
      <div className="flex gap-2 justify-end border-t border-[var(--border-light)] pt-6">
        <ActionButton label="Cancel" variant="secondary" onClick={onCancel} disabled={loading} />
        <button type="submit" disabled={loading} className="p-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold rounded transition px-6 flex items-center justify-center disabled:opacity-50 cursor-pointer">{loading ? 'Processing...' : 'Save Partner Record'}</button>
      </div>
    </form>
  );
}
