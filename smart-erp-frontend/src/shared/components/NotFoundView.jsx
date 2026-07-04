import React from 'react';
import { useNotFoundViewData } from './services/NotFoundViewService';
import { Button } from '@shared/components/ui/button';
import { AlertCircle } from 'lucide-react';
import './styles/NotFoundView.css';

export default function NotFoundView() {
  const { handleBackHome } = useNotFoundViewData();

  return (
    <div className="notfound-container">
      <div className="notfound-icon-wrap">
        <AlertCircle size={32} />
      </div>
      <h1 className="notfound-title">Page Not Found</h1>
      <p className="notfound-text">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Button onClick={handleBackHome} className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-medium cursor-pointer">
        Back to Dashboard
      </Button>
    </div>
  );
}
