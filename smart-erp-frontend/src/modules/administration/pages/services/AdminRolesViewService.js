export function useAdminRolesViewData() {
  const roles = [
    { id: '1', name: 'ADMIN', description: 'Full system administration capabilities across all tenants', users: '2', status: 'Active' },
    { id: '2', name: 'USER', description: 'Standard accounting, stock entry and sales voucher logs operations', users: '1', status: 'Active' },
    { id: '3', name: 'AUDITOR', description: 'Read-only audit access to financial books and logs summaries', users: '0', status: 'Active' }
  ];
  const handleCreateRole = () => {
    alert('Create role dialog placeholder');
  };
  return { roles, handleCreateRole };
}
