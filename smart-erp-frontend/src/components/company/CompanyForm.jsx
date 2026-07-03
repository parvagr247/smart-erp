import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';

export default function CompanyForm({ formHooks, onCancel, isEdit = false }) {
  const {
    loading,
    error,
    errors,
    handleSubmit,
    nameBind,
    gstBind,
    panBind,
    fyBind,
    addressBind,
    cityBind,
    stateBind,
    countryBind,
    pincodeBind,
    phoneBind,
    emailBind,
    currencyBind,
    logoBind,
  } = formHooks;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-500 rounded-lg bg-red-500/10 border border-red-500/30">
            {error}
          </div>
        )}
        
        <div className="form-grid">
          {/* Company Name */}
          <div className="form-group form-full-width">
            <Label htmlFor="name">Company Name *</Label>
            <Input id="name" type="text" placeholder="e.g. Acme Corporation" {...nameBind} required />
            {errors?.name && <span className="text-red-500 text-xs mt-1 block text-left">{errors.name}</span>}
          </div>

          {/* GSTIN & PAN */}
          <div className="form-group">
            <Label htmlFor="gstNumber">GST Number *</Label>
            <Input id="gstNumber" type="text" placeholder="e.g. 22AAAAA0000A1Z5" {...gstBind} required />
            {errors?.gstNumber && <span className="text-red-500 text-xs mt-1 block text-left">{errors.gstNumber}</span>}
          </div>
          <div className="form-group">
            <Label htmlFor="panNumber">PAN Number *</Label>
            <Input id="panNumber" type="text" placeholder="e.g. AAAAA0000A" {...panBind} required />
            {errors?.panNumber && <span className="text-red-500 text-xs mt-1 block text-left">{errors.panNumber}</span>}
          </div>

          {/* Financial Year & Currency */}
          <div className="form-group">
            <Label htmlFor="financialYear">Financial Year (YYYY-YYYY) *</Label>
            <Input id="financialYear" type="text" placeholder="e.g. 2026-2027" {...fyBind} required />
            {errors?.financialYear && <span className="text-red-500 text-xs mt-1 block text-left">{errors.financialYear}</span>}
          </div>
          <div className="form-group">
            <Label htmlFor="currency">Currency Code</Label>
            <Input id="currency" type="text" placeholder="e.g. INR" {...currencyBind} />
          </div>

          {/* Contact Details */}
          <div className="form-group">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="text" placeholder="e.g. +91 98765 43210" {...phoneBind} />
          </div>
          <div className="form-group">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="e.g. info@acme.com" {...emailBind} />
            {errors?.email && <span className="text-red-500 text-xs mt-1 block text-left">{errors.email}</span>}
          </div>

          {/* Address details */}
          <div className="form-group form-full-width">
            <Label htmlFor="address">Registered Address</Label>
            <Input id="address" type="text" placeholder="e.g. 123 Business Street" {...addressBind} />
            {errors?.address && <span className="text-red-500 text-xs mt-1 block text-left">{errors.address}</span>}
          </div>
          
          <div className="form-group">
            <Label htmlFor="city">City</Label>
            <Input id="city" type="text" placeholder="e.g. Mumbai" {...cityBind} />
          </div>
          <div className="form-group">
            <Label htmlFor="state">State / Region *</Label>
            <Input id="state" type="text" placeholder="e.g. Maharashtra" {...stateBind} required />
            {errors?.state && <span className="text-red-500 text-xs mt-1 block text-left">{errors.state}</span>}
          </div>

          <div className="form-group">
            <Label htmlFor="country">Country</Label>
            <Input id="country" type="text" placeholder="e.g. India" {...countryBind} />
          </div>
          <div className="form-group">
            <Label htmlFor="pincode">Pincode</Label>
            <Input id="pincode" type="text" placeholder="e.g. 400001" {...pincodeBind} />
          </div>

          {/* Logo Path */}
          <div className="form-group form-full-width">
            <Label htmlFor="logo">Logo URL or Path</Label>
            <Input id="logo" type="text" placeholder="e.g. /images/logo.png" {...logoBind} />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="form-actions">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
          className="border-[var(--border-light)] text-[var(--text-primary)] hover:bg-[var(--bg-input)] cursor-pointer"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={loading}
          className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] cursor-pointer"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Company' : 'Create Company'}
        </Button>
      </CardFooter>
    </form>
  );
}
