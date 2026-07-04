export function useAdminSettingsViewData() {
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
  const handleSaveSettings = () => {
    alert('Save settings placeholder');
  };
  return { securitySettings, databaseSettings, handleSaveSettings };
}
