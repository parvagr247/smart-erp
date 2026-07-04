import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import InfoCard from '@shared/components/InfoCard';
import SectionCard from '@shared/components/SectionCard';
import ActionButton from '@shared/components/ActionButton';
import { useAdminSettingsViewData } from './services/AdminSettingsViewService';
import { Save } from 'lucide-react';
import './styles/AdminSettingsView.css';

export default function AdminSettingsView() {
  const { securitySettings, databaseSettings, handleSaveSettings } = useAdminSettingsViewData();

  return (
    <PageContainer>
      <PageHeader title="System Settings" description="Configure backend server parameters, token windows, and security locks">
        <ActionButton label="Save Settings" icon={<Save size={14} />} onClick={handleSaveSettings} />
      </PageHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <InfoCard title="Security Parameters" items={securitySettings} />
        <InfoCard title="Database Connection Pool" items={databaseSettings} />
      </div>

      <SectionCard title="Server System Information" description="Administrative operational environment status.">
        <div className="server-info-logs">
          <div>IP Address: 127.0.0.1 (Localhost Bind)</div>
          <div>Active Profile: dev</div>
          <div>CORS Allowed Origins: *</div>
        </div>
      </SectionCard>
    </PageContainer>
  );
}
