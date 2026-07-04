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
  const { securitySettings, databaseSettings, localSettings, keyboardOnlyMode, nextFy, setNextFy, fyStatus, importStatus, handleToggle, handleSaveSettings, handleSwitchFy, handleCloseFy, handleDownloadBackup, handleRestoreBackup, handleImportLedgers, handleImportStockItems } = useAdminSettingsViewData();

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

      <SectionCard title="Financial Year Management" description="Switch active year period, or close the current year and transfer ledger opening balances.">
        <div className="p-2 text-left space-y-4 max-w-xl">
          {fyStatus && (
            <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-[var(--border-light)] text-xs font-semibold rounded-lg text-[var(--text-primary)]">
              {fyStatus}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="form-item shrink-0">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Target Financial Year</label>
              <input 
                type="text" 
                value={nextFy} 
                onChange={e => setNextFy(e.target.value)} 
                placeholder="YYYY-YYYY (e.g. 2026-2027)"
                className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-lg text-xs font-semibold w-52 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-[var(--text-primary)]"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleSwitchFy} 
                className="px-4 py-1.5 bg-[var(--bg-card)] border border-[var(--border-light)] hover:bg-[var(--bg-hover)] text-xs font-bold rounded-lg text-[var(--text-primary)] cursor-pointer"
              >
                Switch Year
              </button>
              <button 
                onClick={handleCloseFy} 
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Close & Transfer Balances
              </button>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Database Backup & System Restore" description="Download a copy of the enterprise tenant environment, or upload a JSON backup snapshot.">
        <div className="p-2 text-left space-y-4 max-w-xl">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button 
              onClick={handleDownloadBackup}
              className="px-4 py-1.5 bg-[var(--primary)] text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Generate & Download Backup
            </button>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">Restore Database Snapshot</label>
              <input 
                type="file" 
                accept=".json"
                onChange={e => handleRestoreBackup(e.target.files[0])}
                className="text-xs text-neutral-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="CSV Data Import Pipeline" description="Bulk upload accounting ledgers or stock items directly from spreadsheets.">
        <div className="p-2 text-left space-y-4 max-w-xl">
          {importStatus && (
            <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-[var(--border-light)] text-xs font-semibold rounded-lg text-[var(--text-primary)]">
              {importStatus}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2 flex flex-col">
              <span className="text-xs font-bold text-[var(--text-primary)] mb-1">Import Ledgers (CSV)</span>
              <input 
                type="file" 
                accept=".csv"
                onChange={e => handleImportLedgers(e.target.files[0])}
                className="text-xs text-neutral-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 cursor-pointer"
              />
            </div>
            <div className="space-y-2 flex flex-col">
              <span className="text-xs font-bold text-[var(--text-primary)] mb-1">Import Stock Items (CSV)</span>
              <input 
                type="file" 
                accept=".csv"
                onChange={e => handleImportStockItems(e.target.files[0])}
                className="text-xs text-neutral-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 cursor-pointer"
              />
            </div>
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
