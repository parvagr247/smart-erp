import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import EmptyState from '@shared/components/EmptyState';
import ActionButton from '@shared/components/ActionButton';
import { FileSpreadsheet, Plus } from 'lucide-react';

export default function GstView() {
  return (
    <PageContainer>
      <PageHeader 
        title="GST Portals & Filings" 
        description="Submit GSTR-1, GSTR-3B filings, reconcile Input Tax Credit, and download tax registers"
      >
        <ActionButton 
          label="New GSTR Form" 
          icon={<Plus size={14} />} 
          onClick={() => alert('New GSTR form placeholder')} 
        />
      </PageHeader>
      
      <EmptyState
        title="No GST Filings Active"
        description="Verify your company GSTIN credentials and record sales transactions with tax items to populate GSTR registers."
        icon={<FileSpreadsheet size={32} className="stroke-[2.5]" />}
        actionButton={
          <ActionButton 
            label="Run GST Reconciliation" 
            onClick={() => alert('GST reconciliation dialog placeholder')} 
          />
        }
      />
    </PageContainer>
  );
}
