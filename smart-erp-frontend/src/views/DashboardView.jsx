import React from 'react';
import { useDashboard } from '../services/auth-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Copy, Check } from 'lucide-react';

export default function DashboardView({ user, token, onLogout }) {
  const {
    initials,
    roleName,
    createdDate,
    copied,
    handleCopyToken,
  } = useDashboard(user, token);

  return (
    <Card className="w-full max-w-3xl shadow-lg border border-[var(--border-light)] bg-[var(--bg-surface)]">
      <CardHeader className="text-center md:text-left md:flex md:flex-row md:items-center md:justify-between border-b border-[var(--border-light)] pb-6">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold font-title tracking-tight text-[var(--text-primary)]">Dashboard Overview</CardTitle>
          <CardDescription className="text-sm text-[var(--text-secondary)]">
            Successfully authenticated session details
          </CardDescription>
        </div>
        <div className="mt-4 md:mt-0 flex justify-center">
          <Button
            variant="outline"
            onClick={onLogout}
            className="border-[var(--border-light)] text-[var(--text-primary)] hover:bg-[var(--bg-input)] cursor-pointer flex items-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        {/* Profile and Details Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Avatar Area */}
          <div className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-[var(--bg-input)] rounded-xl border border-[var(--border-light)]">
            <div className="w-20 h-20 bg-[var(--primary)] text-white rounded-full flex items-center justify-center text-2xl font-bold font-title shadow-md shadow-[var(--primary-glow)]">
              {initials}
            </div>
            <h3 className="mt-4 font-semibold text-lg text-[var(--text-primary)] text-center">{user?.fullName}</h3>
            <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--primary-glow)] text-[var(--primary)] uppercase tracking-wider">
              {roleName}
            </span>
          </div>

          {/* Details Area */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Session Details</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-[var(--border-light)]">
                <span className="text-sm font-medium text-[var(--text-secondary)]">User ID</span>
                <span className="text-sm font-semibold text-[var(--text-primary)] font-mono">{user?.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border-light)]">
                <span className="text-sm font-medium text-[var(--text-secondary)]">Email Address</span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">{user?.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border-light)]">
                <span className="text-sm font-medium text-[var(--text-secondary)]">Created At</span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">{createdDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Token Output Area */}
        <div className="space-y-2 pt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Active Session Token (JWT)</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyToken}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)] cursor-pointer flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-500" />
                  <span className="text-xs text-emerald-500 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span className="text-xs font-medium">Copy Token</span>
                </>
              )}
            </Button>
          </div>
          <div className="p-3 bg-[var(--bg-input)] rounded-lg font-mono text-xs text-[var(--text-secondary)] border border-[var(--border-light)] break-all max-h-[120px] overflow-y-auto">
            Bearer {token}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
