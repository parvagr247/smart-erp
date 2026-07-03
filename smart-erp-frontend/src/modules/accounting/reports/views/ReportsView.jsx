import React from 'react';
import ComingSoonView from '@shared/components/ComingSoonView';
import { BarChart3 } from 'lucide-react';

export default function ReportsView() {
  return (
    <ComingSoonView
      moduleName="Financial Statements & Reports"
      description="Generate and export corporate balance sheets, profit & loss accounts, ledger summaries, cash flow statements, and financial ratio analyses."
      requiredPermissions={['REPORTS_VIEW', 'REPORTS_EXPORT', 'AUDIT_LOG_VIEW']}
      icon={<BarChart3 size={24} />}
    />
  );
}
