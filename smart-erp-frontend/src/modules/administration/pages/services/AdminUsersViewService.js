export function useAdminUsersViewData() {
  const users = [
    { id: '1', fullName: 'System Administrator', email: 'admin@smarterp.com', role: 'ADMIN', status: 'Active' },
    { id: '2', fullName: 'Parth Agrawal', email: 'parvagr247@gmail.com', role: 'ADMIN', status: 'Active' },
    { id: '3', fullName: 'John Doe Accountant', email: 'john.doe@company.com', role: 'USER', status: 'Active' }
  ];
  const handleAddUser = () => {
    alert('Create user dialog placeholder');
  };
  return { users, handleAddUser };
}
