import React, { useState } from 'react';
import { useAuth } from '@shared/context/AuthContext';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import SectionCard from '@shared/components/SectionCard';
import ActionButton from '@shared/components/ActionButton';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { User, Shield, Building, Moon, Sun, Lock, CheckCircle2 } from 'lucide-react';
import './styles/SettingsView.css';

export default function SettingsView() {
  const { user, theme, toggleTheme } = useAuth();
  const { activeCompany } = useActiveCompany();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1200);
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Personal Settings" 
        description="Manage your user profile configuration, system themes, and active company details" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
        {/* Profile Card & Theme Toggle */}
        <div className="space-y-6">
          <SectionCard title="My Profile" description="Authorized user credentials">
            <div className="text-left space-y-4 p-2">
              <div className="flex items-center gap-4 border-b border-[var(--border-light)] pb-4">
                <div className="w-12 h-12 rounded-full bg-[var(--primary)] text-white font-bold text-lg flex items-center justify-center">
                  {user?.fullName?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">{user?.fullName}</h3>
                  <p className="text-xs text-[var(--text-muted)] font-semibold">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-medium">
                  <User size={14} className="text-[var(--primary)]" />
                  <span><strong>Role Scope:</strong> {user?.role?.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-medium">
                  <Shield size={14} className="text-[var(--primary)]" />
                  <span><strong>Permission Tier:</strong> {user?.role === 'ADMIN' ? 'Superuser Admin' : 'Staff Level'}</span>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Preferences" description="Customize display parameters">
            <div className="flex items-center justify-between p-2 text-left">
              <div>
                <h4 className="text-xs font-bold text-[var(--text-primary)]">System Appearance</h4>
                <p className="text-[10px] text-[var(--text-muted)]">Toggle dark mode interface</p>
              </div>
              <button 
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-light)] hover:bg-[var(--bg-hover)] text-xs font-semibold text-[var(--text-secondary)] cursor-pointer select-none"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun size={14} className="text-amber-500" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={14} className="text-indigo-500" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </SectionCard>
        </div>

        {/* Password Reset & Company Context Info */}
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Update Password" description="Secure your user credentials">
            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-left p-2">
              {message && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  <span>{message}</span>
                </div>
              )}
              {error && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 text-xs font-semibold rounded-lg border border-rose-200 dark:border-rose-900/50">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 settings-input-group">
                <div className="form-item">
                  <Label htmlFor="current-pw">Current Password</Label>
                  <Input 
                    id="current-pw" 
                    type="password" 
                    value={currentPassword} 
                    onChange={e => setCurrentPassword(e.target.value)} 
                    required 
                  />
                </div>
                <div className="hidden md:block"></div>
                <div className="form-item">
                  <Label htmlFor="new-pw">New Password</Label>
                  <Input 
                    id="new-pw" 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-item">
                  <Label htmlFor="confirm-pw">Confirm New Password</Label>
                  <Input 
                    id="confirm-pw" 
                    type="password" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <ActionButton 
                  label={loading ? 'Saving...' : 'Save Password'} 
                  icon={<Lock size={12} />} 
                  type="submit" 
                  disabled={loading} 
                />
              </div>
            </form>
          </SectionCard>

          {activeCompany && (
            <SectionCard title="Active Workspace Environment" description="Details about the loaded company workspace context">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left p-2">
                <div className="flex items-start gap-3">
                  <Building className="text-[var(--primary)] mt-0.5 shrink-0" size={16} />
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)]">{activeCompany.name}</h4>
                    <p className="text-[10px] text-[var(--text-muted)]">Registered Tenant Context</p>
                  </div>
                </div>
                <div className="space-y-2 font-mono text-[11px] text-[var(--text-secondary)] border-l border-[var(--border-light)] pl-4">
                  <div><strong>GSTIN:</strong> {activeCompany.gstNumber || 'N/A'}</div>
                  <div><strong>PAN:</strong> {activeCompany.panNumber || 'N/A'}</div>
                  <div><strong>FY Period:</strong> {activeCompany.financialYear}</div>
                  <div>
                    <strong>Address:</strong> {
                      [
                        activeCompany.address,
                        activeCompany.city,
                        activeCompany.pincode,
                        activeCompany.state,
                        activeCompany.country
                      ].filter(p => p && String(p).trim() !== '' && String(p) !== 'undefined').join(', ') || 'N/A'
                    }
                  </div>
                </div>
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
