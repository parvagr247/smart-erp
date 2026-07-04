import React from 'react';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { Button } from '@shared/components/ui/button';
import { CardContent, CardFooter } from '@shared/components/ui/card';
import './styles/CompanyForm.css';

export default function CompanyForm({ formHooks, onCancel, isEdit = false }) {
  const { loading, error, errors, isDirty, handleSubmit, nameBind, gstBind, panBind, fyBind, addressBind, cityBind, stateBind, countryBind, pincodeBind, phoneBind, emailBind, currencyBind, logoBind } = formHooks;

  const handleCancel = () => {
    if (isDirty) {
      if (!confirm("You have unsaved changes. Are you sure you want to discard them?")) {
        return;
      }
    }
    onCancel();
  };

  const fields = [
    { id: 'name', label: 'Company Name *', placeholder: 'e.g. Acme Corporation', bind: nameBind, error: errors?.name, fullWidth: true },
    { id: 'gstNumber', label: 'GST Number *', placeholder: 'e.g. 22AAAAA0000A1Z5', bind: gstBind, error: errors?.gstNumber },
    { id: 'panNumber', label: 'PAN Number *', placeholder: 'e.g. AAAAA0000A', bind: panBind, error: errors?.panNumber },
    { id: 'financialYear', label: 'Financial Year (YYYY-YYYY) *', placeholder: 'e.g. 2026-2027', bind: fyBind, error: errors?.financialYear },
    { id: 'currency', label: 'Currency Code', placeholder: 'e.g. INR', bind: currencyBind },
    { id: 'phone', label: 'Phone Number', placeholder: 'e.g. +91 98765 43210', bind: phoneBind },
    { id: 'email', label: 'Email Address', placeholder: 'e.g. info@acme.com', bind: emailBind, error: errors?.email },
    { id: 'address', label: 'Registered Address', placeholder: 'e.g. 123 Business Street', bind: addressBind, error: errors?.address, fullWidth: true },
    { id: 'city', label: 'City', placeholder: 'e.g. Mumbai', bind: cityBind },
    { id: 'state', label: 'State / Region *', placeholder: 'e.g. Maharashtra', bind: stateBind, error: errors?.state },
    { id: 'country', label: 'Country', placeholder: 'e.g. India', bind: countryBind },
    { id: 'pincode', label: 'Pincode', placeholder: 'e.g. 400001', bind: pincodeBind },
    { id: 'logo', label: 'Logo URL or Path', placeholder: 'e.g. /images/logo.png', bind: logoBind, fullWidth: true }
  ];

  return (
    <form onSubmit={handleSubmit} noValidate>
      <CardContent className="space-y-4">
        {error && <div className="p-3 text-sm text-red-500 rounded-lg bg-red-500/10 border border-red-500/30">{error}</div>}
        <div className="form-grid">
          {fields.map((field) => (
            <div key={field.id} className={`form-group ${field.fullWidth ? 'form-full-width' : ''}`}>
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input id={field.id} type="text" placeholder={field.placeholder} {...field.bind} required />
              {field.error && <span className="text-red-500 text-xs mt-1 block text-left">{field.error}</span>}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="form-actions">
        <Button type="button" variant="outline" onClick={handleCancel} disabled={loading} className="border-[var(--border-light)] text-[var(--text-primary)] hover:bg-[var(--bg-input)] cursor-pointer">Cancel</Button>
        <Button type="submit" disabled={loading} className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] cursor-pointer">{loading ? 'Saving...' : isEdit ? 'Update Company' : 'Create Company'}</Button>
      </CardFooter>
    </form>
  );
}
