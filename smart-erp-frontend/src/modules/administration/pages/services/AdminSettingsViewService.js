import { useState, useEffect } from 'react';
import { useInteraction } from '@shared/interaction/InteractionContext';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';
import { 
  updateCompanyApi, fetchCompanyById, switchFinancialYearApi, closeFinancialYearApi,
  downloadSystemBackupApi, restoreSystemBackupApi, importLedgersApi, importStockItemsApi
} from '../../administration.service';

export function useAdminSettingsViewData() {
  const { settings, updateSettings } = useInteraction();
  const { activeCompany, updateActiveCompany } = useActiveCompany();
  
  const [localSettings, setLocalSettings] = useState(settings);
  const [keyboardOnlyMode, setKeyboardOnlyMode] = useState(!!activeCompany?.keyboardOnlyMode);
  const [nextFy, setNextFy] = useState('2026-2027');
  const [fyStatus, setFyStatus] = useState('');
  const [importStatus, setImportStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    setKeyboardOnlyMode(!!activeCompany?.keyboardOnlyMode);
  }, [activeCompany]);

  const securitySettings = [
    { label: 'Token Expiry', value: '86400 seconds (24h)' },
    { label: 'Min Password Length', value: '8 characters' },
    { label: 'Max Login Attempts', value: '5 attempts' },
    { label: 'Session Lockout', value: '15 minutes' }
  ];

  const databaseSettings = [
    { label: 'DB Pool Size', value: '10 connections' },
    { label: 'Idle Timeout', value: '30000 ms' },
    { label: 'Migration Schema', value: 'Flyway / Hibernate Auto-update' }
  ];

  const handleToggle = (key) => {
    if (key === 'keyboardOnlyMode') {
      setKeyboardOnlyMode(prev => !prev);
    } else {
      setLocalSettings(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    }
  };

  const handleSaveSettings = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveStatus('Saving system configurations...');
    updateSettings(localSettings);

    if (activeCompany) {
      try {
        const fullCompanyRes = await fetchCompanyById(activeCompany.id);
        if (fullCompanyRes.success && fullCompanyRes.data) {
          const payload = {
            ...fullCompanyRes.data,
            keyboardOnlyMode: keyboardOnlyMode
          };
          const response = await updateCompanyApi(activeCompany.id, payload);
          if (response.success && response.data) {
            updateActiveCompany(response.data);
            setSaveStatus('Settings successfully saved!');
            setTimeout(() => setSaveStatus(''), 4000);
          }
        }
      } catch (err) {
        console.error("Failed to save Keyboard Only Mode setting to database:", err);
        setSaveStatus('Failed to save settings: ' + (err.response?.data?.message || err.message));
      } finally {
        setIsSaving(false);
      }
    } else {
      setSaveStatus('Settings updated locally.');
      setIsSaving(false);
      setTimeout(() => setSaveStatus(''), 4000);
    }
  };

  const handleSwitchFy = async () => {
    if (!activeCompany) return;
    setFyStatus('Switching financial year...');
    try {
      const res = await switchFinancialYearApi(activeCompany.id, nextFy);
      if (res.success) {
        setFyStatus('Financial year switched successfully!');
        updateActiveCompany({
          ...activeCompany,
          financialYear: nextFy
        });
      }
    } catch (err) {
      setFyStatus('Failed to switch FY: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCloseFy = async () => {
    if (!activeCompany) return;
    if (!window.confirm("Are you sure you want to close the current financial year? This will transfer all asset and liability balances and reset income and expenses.")) return;
    setFyStatus('Closing year and transferring balances...');
    try {
      const res = await closeFinancialYearApi(activeCompany.id, activeCompany.financialYear, nextFy);
      if (res.success) {
        setFyStatus('Financial year closed successfully! Active year set to ' + nextFy);
        updateActiveCompany({
          ...activeCompany,
          financialYear: nextFy
        });
      }
    } catch (err) {
      setFyStatus('Failed to close FY: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDownloadBackup = async () => {
    try {
      const blob = await downloadSystemBackupApi();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `erp_backup_${activeCompany?.name || 'system'}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download backup: ' + err.message);
    }
  };

  const handleRestoreBackup = async (file) => {
    if (!file) return;
    setImportStatus('Restoring data from backup file...');
    try {
      const res = await restoreSystemBackupApi(file);
      if (res.success) {
        setImportStatus('System data backup restored successfully!');
      }
    } catch (err) {
      setImportStatus('Failed to restore data: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleImportLedgers = async (file) => {
    if (!file) return;
    setImportStatus('Importing ledgers from CSV...');
    try {
      const res = await importLedgersApi(file);
      if (res.success) {
        setImportStatus(res.message || 'Ledgers imported successfully!');
      }
    } catch (err) {
      setImportStatus('Ledger import failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleImportStockItems = async (file) => {
    if (!file) return;
    setImportStatus('Importing stock items from CSV...');
    try {
      const res = await importStockItemsApi(file);
      if (res.success) {
        setImportStatus(res.message || 'Stock items imported successfully!');
      }
    } catch (err) {
      setImportStatus('Stock item import failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return {
    securitySettings,
    databaseSettings,
    localSettings,
    keyboardOnlyMode,
    nextFy,
    setNextFy,
    fyStatus,
    importStatus,
    isSaving,
    saveStatus,
    handleToggle,
    handleSaveSettings,
    handleSwitchFy,
    handleCloseFy,
    handleDownloadBackup,
    handleRestoreBackup,
    handleImportLedgers,
    handleImportStockItems
  };
}
