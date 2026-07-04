export function useAdminPermissionsViewData() {
  const permissions = [
    { id: '1', module: 'Accounting', role: 'USER', read: 'Yes', write: 'Yes', delete: 'No', export: 'Yes' },
    { id: '2', module: 'Accounting', role: 'ADMIN', read: 'Yes', write: 'Yes', delete: 'Yes', export: 'Yes' },
    { id: '3', module: 'Accounting', role: 'AUDITOR', read: 'Yes', write: 'No', delete: 'No', export: 'Yes' },
    { id: '4', module: 'Administration', role: 'USER', read: 'No', write: 'No', delete: 'No', export: 'No' }
  ];
  const handleSaveMapping = () => {
    alert('Permissions saved mapping placeholder');
  };
  return { permissions, handleSaveMapping };
}
