import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@shared/components/ui/card';
import { LogOut } from 'lucide-react';
import './styles/LogoutView.css';

export default function LogoutView() {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  return (
    <Card className="logout-card">
      <CardHeader className="logout-header">
        <div className="mx-auto my-2 p-3.5 bg-rose-500/10 rounded-full w-fit border border-rose-500/20 text-rose-500 animate-pulse">
          <LogOut size={36} />
        </div>
        <CardTitle className="logout-title">Confirm Logout</CardTitle>
        <CardDescription className="logout-desc">
          Are you sure you want to sign out of SmartERP?
        </CardDescription>
      </CardHeader>
      <CardContent className="logout-content">
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm mx-auto">
          You will need to re-authenticate with your email and password to access your active company workspace.
        </p>
      </CardContent>
      <CardFooter className="logout-footer">
        <button 
          type="button" 
          onClick={() => navigate(-1)} 
          className="logout-btn-cancel"
        >
          Cancel
        </button>
        <button 
          type="button" 
          onClick={handleLogout} 
          className="logout-btn-confirm"
        >
          Yes, Logout
        </button>
      </CardFooter>
    </Card>
  );
}
