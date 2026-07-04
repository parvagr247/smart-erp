import React from 'react';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import './styles/PartnerGeneralSection.css';

export default function PartnerGeneralSection({ formData, handleChange }) {
  return (
    <div className="border-b border-[var(--border-light)] pb-6 text-left">
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
          <select id="type" name="type" value={formData.type} onChange={handleChange} className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-sm text-[var(--text-primary)] cursor-pointer h-10" required>
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
  );
}
