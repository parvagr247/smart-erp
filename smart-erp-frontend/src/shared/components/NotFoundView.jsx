import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/ui/button';
import { AlertCircle } from 'lucide-react';
import '@modules/business/dashboard/styles/dashboard.css';

export default function NotFoundView() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-[var(--bg-base)] text-[var(--text-primary)]">
      <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
        <AlertCircle size={32} />
      </div>
      <h1 className="text-4xl font-bold font-heading mb-2">Page Not Found</h1>
      <p className="text-sm text-[var(--text-secondary)] max-w-sm mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button 
        onClick={() => navigate('/dashboard')}
        className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] cursor-pointer"
      >
        Go to Dashboard
      </Button>
    </div>
  );
}
