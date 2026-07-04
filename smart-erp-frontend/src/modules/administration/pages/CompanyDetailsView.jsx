import React from 'react';
import { useCompanyDetailsViewData } from './services/CompanyDetailsViewService';
import { Button } from '@shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@shared/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import './styles/CompanyDetailsView.css';

export default function CompanyDetailsView({ companyId, onBack }) {
  const { company, loading, error } = useCompanyDetailsViewData(companyId);

  if (loading) return <div className="flex justify-center items-center min-h-[30vh] text-[var(--text-secondary)] font-medium">Loading company details...</div>;
  if (error) return <div className="p-3 text-sm text-red-500 rounded-lg bg-red-500/10 border border-red-500/30 text-center">{error}</div>;
  if (!company) return <div className="text-center py-8 text-[var(--text-secondary)]">No company details loaded.</div>;

  const items = [
    { label: 'Financial Year', value: company.financialYear },
    { label: 'PAN Number', value: company.panNumber },
    { label: 'State', value: company.state },
    { label: 'City', value: company.city || 'N/A' },
    { label: 'Phone', value: company.phone || 'N/A' },
    { label: 'Email Address', value: company.email || 'N/A' },
    { label: 'Currency', value: company.currency || 'INR' },
    { label: 'Pincode', value: company.pincode || 'N/A' }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <Card className="details-container">
        <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-[var(--border-light)]">
          <div className="space-y-1 text-left">
            <CardTitle className="text-2xl font-bold font-heading text-[var(--text-primary)]">{company.name}</CardTitle>
            <CardDescription className="text-xs font-mono text-[var(--text-secondary)]">GSTIN: {company.gstNumber}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onBack} className="border-[var(--border-light)] text-[var(--text-primary)] hover:bg-[var(--bg-input)] cursor-pointer flex items-center gap-1.5"><ChevronLeft size={16} /> Back</Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="details-grid">
            {items.map((item, idx) => <div key={idx} className="detail-item"><span className="detail-label">{item.label}</span><span className="detail-value">{item.value}</span></div>)}
            {company.address && <div className="detail-item form-full-width"><span className="detail-label">Registered Address</span><span className="detail-value">{company.address}</span></div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
