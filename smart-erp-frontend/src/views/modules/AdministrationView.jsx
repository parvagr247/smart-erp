import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import ActionButton from '../../components/common/ActionButton';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function AdministrationView() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'ADMIN';

  return (
    <PageContainer>
      <PageHeader 
        title="App Administration" 
        description="Verify backend logs, check system resources, and manage app access controls"
      >
        {isAdmin && (
          <ActionButton 
            label="Go to Admin Portal" 
            icon={<ArrowRight size={14} />} 
            onClick={() => navigate('/admin/dashboard')} 
          />
        )}
      </PageHeader>
      
      <EmptyState
        title="Administrative Controls Restricted"
        description={
          isAdmin 
            ? "Your account has full ADMIN permissions. Click the button above to enter the Admin Portal dashboard."
            : "Access to system security configurations, user scopes, database logs, and activity records is restricted to administrators."
        }
        icon={<ShieldCheck size={32} className="stroke-[2.5]" />}
      />
    </PageContainer>
  );
}
