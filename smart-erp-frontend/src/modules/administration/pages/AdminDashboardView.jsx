import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import StatCard from '@shared/components/StatCard';
import SectionCard from '@shared/components/SectionCard';
import { Users, ShieldAlert, FileText, Activity } from 'lucide-react';
import { useAdminDashboardViewData } from './services/AdminDashboardViewService';
import './styles/AdminDashboardView.css';

export default function AdminDashboardView() {
  const { kpis } = useAdminDashboardViewData();
  const iconMap = {
    users: <Users size={16} />,
    roles: <ShieldAlert size={16} />,
    logs: <FileText size={16} />,
    status: <Activity size={16} />
  };

  return (
    <PageContainer>
      <PageHeader title="Admin Dashboard" description="System health monitors, user counts, and active access registers" />
      
      <div className="stat-card-grid">
        {kpis.map((kpi, idx) => <StatCard key={idx} {...kpi} icon={iconMap[kpi.iconType]} />)}
      </div>

      <SectionCard title="System Administration Environment" description="Configure tenant mappings, customize server settings, and check user authentication audit logs using the sidebar links.">
        <div className="env-meta-container">
          <p>This portal is restricted to authorized accounts with administrative role claims.</p>
          <div className="env-meta-info">
            <span>Server version: v1.0.0</span><span>|</span>
            <span>JVM: Java 21 LTS</span><span>|</span>
            <span>Database: PostgreSQL 16</span>
          </div>
        </div>
      </SectionCard>
    </PageContainer>
  );
}
