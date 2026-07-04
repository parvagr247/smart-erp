import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import './styles/AccessDeniedView.css';

export default function AccessDeniedView() {
  const navigate = useNavigate();

  return (
    <div className="accessdenied-container">
      <div className="accessdenied-icon-wrap">
        <ShieldAlert size={32} className="text-rose-500 animate-bounce-none" />
      </div>
      <h1 className="accessdenied-title">Access Restricted</h1>
      <p className="accessdenied-text">
        Your current user role profile does not have permission authorization to view this workspace partition. Please contact your system administrator to modify your access rights.
      </p>
      <Button onClick={() => navigate('/dashboard')} className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-medium cursor-pointer">
        Back to Dashboard
      </Button>
    </div>
  );
}
