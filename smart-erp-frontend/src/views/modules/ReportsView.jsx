import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import ActionButton from '../../components/common/ActionButton';
import { BarChart3, FileSpreadsheet } from 'lucide-react';

export default function ReportsView() {
  return (
    <PageContainer>
      <PageHeader 
        title="Financial Statements & Reports" 
        description="View corporate balance sheets, profit and loss logs, ledger summaries, and ratio analyses"
      >
        <ActionButton 
          label="Export Report (PDF)" 
          icon={<FileSpreadsheet size={14} />} 
          onClick={() => alert('PDF export coming soon')} 
        />
      </PageHeader>
      
      <EmptyState
        title="No Financial Records Found"
        description="Reconcile your double-entry accounts ledgers and submit transactions to generate active audit balance reports."
        icon={<BarChart3 size={32} className="stroke-[2.5]" />}
        actionButton={
          <ActionButton 
            label="Generate Trial Balance" 
            onClick={() => alert('Trial balance generation placeholder')} 
          />
        }
      />
    </PageContainer>
  );
}
