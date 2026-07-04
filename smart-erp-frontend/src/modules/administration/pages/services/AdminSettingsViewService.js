import { useState, useEffect } from 'react';
import { useKeyboard } from '@shared/keyboard/KeyboardContext';

export function useAdminSettingsViewData() {
  const { settings, updateSettings } = useKeyboard();
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

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
    setLocalSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveSettings = () => {
    updateSettings(localSettings);
  };

  return {
    securitySettings,
    databaseSettings,
    localSettings,
    handleToggle,
    handleSaveSettings
  };
}
