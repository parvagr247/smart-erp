import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/common/PageHeader';
import InfoCard from '../../components/common/InfoCard';
import SectionCard from '../../components/common/SectionCard';
import ActionButton from '../../components/common/ActionButton';
import { Save } from 'lucide-react';

const SECURITY_SETTINGS = [
  { label: 'Token Expiry', value: '86400 seconds (24h)' },
  { label: 'Min Password Length', value: '8 characters' },
  { label: 'Max Login Attempts', value: '5 attempts' },
  { label: 'Session Lockout', value: '15 minutes' }
];

const DATABASE_SETTINGS = [
  { label: 'DB Pool Size', value: '10 connections' },
  { label: 'Idle Timeout', value: '30000 ms' },
  { label: 'Migration Schema', value: 'Flyway / Hibernate Auto-update' }
];

export default function AdminSettingsView() {
  return (
    <PageContainer>
      <PageHeader 
        title="System Settings" 
        description="Configure backend server parameters, token windows, and security locks"
      >
        <ActionButton 
          label="Save Settings" 
          icon={<Save size={14} />} 
          onClick={() => alert('Save settings placeholder')} 
        />
      </PageHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <InfoCard title="Security Parameters" items={SECURITY_SETTINGS} />
        <InfoCard title="Database Connection Pool" items={DATABASE_SETTINGS} />
      </div>

      <SectionCard title="Server System Information" description="Administrative operational environment status.">
        <div className="text-xs text-[var(--text-muted)] space-y-1 text-left font-mono">
          <div>IP Address: 127.0.0.1 (Localhost Bind)</div>
          <div>Active Profile: dev</div>
          <div>CORS Allowed Origins: *</div>
        </div>
      </SectionCard>
    </PageContainer>
  );
}
