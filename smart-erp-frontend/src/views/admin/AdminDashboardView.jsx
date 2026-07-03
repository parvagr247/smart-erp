import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import SectionCard from '../../components/common/SectionCard';
import { Users, ShieldAlert, FileText, Activity } from 'lucide-react';

export default function AdminDashboardView() {
  return (
    <PageContainer>
      <PageHeader 
        title="Admin Dashboard" 
        description="System health monitors, user counts, and active access registers"
      />
      
      <div className="stat-card-grid">
        <StatCard title="System Users" value="3" icon={<Users size={16} />} trend={{ value: '+1', isPositive: true, label: 'this week' }} />
        <StatCard title="Security Roles" value="4" icon={<ShieldAlert size={16} />} />
        <StatCard title="Audit Log Entries" value="142" icon={<FileText size={16} />} trend={{ value: '+24', isPositive: true, label: 'today' }} />
        <StatCard title="API Server Status" value="100%" icon={<Activity size={16} />} trend={{ value: 'Healthy', isPositive: true, label: 'uptime' }} />
      </div>

      <SectionCard 
        title="System Administration Environment" 
        description="Configure tenant mappings, customize server settings, and check user authentication audit logs using the sidebar links."
      >
        <div className="text-sm text-[var(--text-secondary)] space-y-2">
          <p>This portal is restricted to authorized accounts with administrative role claims.</p>
          <div className="flex gap-2 text-xs font-mono text-[var(--text-muted)] mt-4">
            <span>Server version: v1.0.0</span>
            <span>|</span>
            <span>JVM: Java 21 LTS</span>
            <span>|</span>
            <span>Database: PostgreSQL 16</span>
          </div>
        </div>
      </SectionCard>
    </PageContainer>
  );
}
