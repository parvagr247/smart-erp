import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import InfoCard from '@shared/components/InfoCard';
import SectionCard from '@shared/components/SectionCard';
import ActionButton from '@shared/components/ActionButton';
import { useAdminSettingsViewData } from './services/AdminSettingsViewService';
import { Save } from 'lucide-react';
import './styles/AdminSettingsView.css';

export default function AdminSettingsView() {
  const { securitySettings, databaseSettings, localSettings, keyboardOnlyMode, handleToggle, handleSaveSettings } = useAdminSettingsViewData();

  return (
    <PageContainer>
      <PageHeader title="System Settings" description="Configure backend server parameters, token windows, and security locks">
        <ActionButton label="Save Settings" icon={<Save size={14} />} onClick={handleSaveSettings} />
      </PageHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <InfoCard title="Security Parameters" items={securitySettings} />
        <InfoCard title="Database Connection Pool" items={databaseSettings} />
      </div>

      <SectionCard title="Interaction Preferences" description="Configure global ERP keyboard-first behaviors and accessibility focus styles.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left p-2">
          
          <div className="flex items-center justify-between p-3 border border-[var(--border-light)] rounded-xl bg-[var(--bg-surface)]">
            <div>
              <div className="text-xs font-bold text-[var(--text-primary)]">Keyboard Only Mode</div>
              <div className="text-[10px] text-[var(--text-muted)]">Block all mouse pointer/touch events globally</div>
            </div>
            <input 
              type="checkbox" 
              checked={keyboardOnlyMode} 
              onChange={() => handleToggle('keyboardOnlyMode')}
              className="w-4 h-4 accent-[var(--primary)] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-[var(--border-light)] rounded-xl bg-[var(--bg-surface)]">
            <div>
              <div className="text-xs font-bold text-[var(--text-primary)]">Keyboard First Mode</div>
              <div className="text-[10px] text-[var(--text-muted)]">Enable ERP-style keyboard focus flow</div>
            </div>
            <input 
              type="checkbox" 
              checked={localSettings.keyboardFirstMode} 
              onChange={() => handleToggle('keyboardFirstMode')}
              className="w-4 h-4 accent-[var(--primary)] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-[var(--border-light)] rounded-xl bg-[var(--bg-surface)]">
            <div>
              <div className="text-xs font-bold text-[var(--text-primary)]">Allow Mouse Navigation</div>
              <div className="text-[10px] text-[var(--text-muted)]">Discourage mouse actions if toggled off</div>
            </div>
            <input 
              type="checkbox" 
              checked={localSettings.allowMouseNavigation} 
              onChange={() => handleToggle('allowMouseNavigation')}
              className="w-4 h-4 accent-[var(--primary)] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-[var(--border-light)] rounded-xl bg-[var(--bg-surface)]">
            <div>
              <div className="text-xs font-bold text-[var(--text-primary)]">Show Keyboard Shortcuts</div>
              <div className="text-[10px] text-[var(--text-muted)]">Display shortcut helpers on action items</div>
            </div>
            <input 
              type="checkbox" 
              checked={localSettings.showKeyboardShortcuts} 
              onChange={() => handleToggle('showKeyboardShortcuts')}
              className="w-4 h-4 accent-[var(--primary)] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-[var(--border-light)] rounded-xl bg-[var(--bg-surface)]">
            <div>
              <div className="text-xs font-bold text-[var(--text-primary)]">High Visibility Focus</div>
              <div className="text-[10px] text-[var(--text-muted)]">Thick outline on active focused elements</div>
            </div>
            <input 
              type="checkbox" 
              checked={localSettings.highVisibilityFocus} 
              onChange={() => handleToggle('highVisibilityFocus')}
              className="w-4 h-4 accent-[var(--primary)] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-[var(--border-light)] rounded-xl bg-[var(--bg-surface)]">
            <div>
              <div className="text-xs font-bold text-[var(--text-primary)]">Enable Command Palette</div>
              <div className="text-[10px] text-[var(--text-muted)]">Allow Ctrl+K search console launcher</div>
            </div>
            <input 
              type="checkbox" 
              checked={localSettings.enableCommandPalette} 
              onChange={() => handleToggle('enableCommandPalette')}
              className="w-4 h-4 accent-[var(--primary)] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-[var(--border-light)] rounded-xl bg-[var(--bg-surface)]">
            <div>
              <div className="text-xs font-bold text-[var(--text-primary)]">Enable Global Shortcuts</div>
              <div className="text-[10px] text-[var(--text-muted)]">Listen for Alt+key and Ctrl+key overlays</div>
            </div>
            <input 
              type="checkbox" 
              checked={localSettings.enableGlobalShortcuts} 
              onChange={() => handleToggle('enableGlobalShortcuts')}
              className="w-4 h-4 accent-[var(--primary)] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-[var(--border-light)] rounded-xl bg-[var(--bg-surface)]">
            <div>
              <div className="text-xs font-bold text-[var(--text-primary)]">Show Out-of-Stock Items</div>
              <div className="text-[10px] text-[var(--text-muted)]">Display out-of-stock items in product selection dropdowns</div>
            </div>
            <input 
              type="checkbox" 
              checked={localSettings.showOutOfStockItems} 
              onChange={() => handleToggle('showOutOfStockItems')}
              className="w-4 h-4 accent-[var(--primary)] cursor-pointer"
            />
          </div>

        </div>
      </SectionCard>

      <SectionCard title="Server System Information" description="Administrative operational environment status.">
        <div className="server-info-logs">
          <div>IP Address: 127.0.0.1 (Localhost Bind)</div>
          <div>Active Profile: dev</div>
          <div>CORS Allowed Origins: *</div>
        </div>
      </SectionCard>
    </PageContainer>
  );
}
