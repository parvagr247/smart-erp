import { useState, useEffect } from 'react';
import { useInteraction } from '@shared/interaction/InteractionContext';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';
import { updateCompanyApi, fetchCompanyById } from '../../administration.service';

export function useAdminSettingsViewData() {
  const { settings, updateSettings } = useInteraction();
  const { activeCompany, updateActiveCompany } = useActiveCompany();
  
  const [localSettings, setLocalSettings] = useState(settings);
  const [keyboardOnlyMode, setKeyboardOnlyMode] = useState(!!activeCompany?.keyboardOnlyMode);

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
    // 1. Save local preferences
    updateSettings(localSettings);

    // 2. Save global company-wide setting to database
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
          }
        }
      } catch (err) {
        console.error("Failed to save Keyboard Only Mode setting to database:", err);
      }
    }
  };

  return {
    securitySettings,
    databaseSettings,
    localSettings,
    keyboardOnlyMode,
    handleToggle,
    handleSaveSettings
  };
}
