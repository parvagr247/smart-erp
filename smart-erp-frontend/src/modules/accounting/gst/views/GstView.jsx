import React from 'react';
import ComingSoonView from '@shared/components/ComingSoonView';
import { FileSpreadsheet } from 'lucide-react';

export default function GstView() {
  return (
    <ComingSoonView
      moduleName="GST Portals & Filings"
      description="Submit GSTR-1, GSTR-3B filings, reconcile Input Tax Credit (ITC), and download tax registers to file compliant GST returns directly."
      requiredPermissions={['GST_VIEW', 'GST_FILE', 'TAX_RECONCILE']}
      icon={<FileSpreadsheet size={24} />}
    />
  );
}
