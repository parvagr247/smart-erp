import React from 'react';
import { useCompanyDetails } from '@modules/administration/company/services/company.service';
import { Button } from '@shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@shared/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import '@modules/administration/company/styles/company.css';

export default function CompanyDetailsView({ companyId, onBack }) {
  const { company, loading, error } = useCompanyDetails(companyId);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[30vh] text-[var(--text-secondary)] font-medium">
        Loading company details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 text-sm text-red-500 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
        {error}
      </div>
    );
  }

  if (!company) {
    return <div className="text-center py-8 text-[var(--text-secondary)]">No company details loaded.</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <Card className="details-container bg-[var(--bg-surface)] border-[var(--border-light)] shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-[var(--border-light)]">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold font-heading text-[var(--text-primary)]">
              {company.name}
            </CardTitle>
            <CardDescription className="text-xs font-mono text-[var(--text-secondary)]">
              GSTIN: {company.gstNumber}
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack} 
            className="border-[var(--border-light)] text-[var(--text-primary)] hover:bg-[var(--bg-input)] cursor-pointer flex items-center gap-1.5"
          >
            <ChevronLeft size={16} /> 
            Back
          </Button>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Financial Year</span>
              <span className="detail-value">{company.financialYear}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">PAN Number</span>
              <span className="detail-value">{company.panNumber}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">State</span>
              <span className="detail-value">{company.state}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">City</span>
              <span className="detail-value">{company.city || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{company.phone || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email Address</span>
              <span className="detail-value">{company.email || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Currency</span>
              <span className="detail-value">{company.currency || 'INR'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Pincode</span>
              <span className="detail-value">{company.pincode || 'N/A'}</span>
            </div>
            {company.address && (
              <div className="detail-item form-full-width">
                <span className="detail-label">Registered Address</span>
                <span className="detail-value">{company.address}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
