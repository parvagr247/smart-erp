import { useAuth } from '@shared/context/AuthContext';

export function useAdminUsersViewData() {
  const { user } = useAuth();
  
  const users = [
    { id: user?.id || '1', fullName: user?.fullName || 'System Administrator', email: user?.email || 'admin@smarterp.com', role: user?.role || 'ADMIN', status: 'Active' },
    { id: '2', fullName: 'Parth Agrawal', email: 'parvagr247@gmail.com', role: 'ADMIN', status: 'Active' },
    { id: '3', fullName: 'John Doe Accountant', email: 'john.doe@company.com', role: 'ACCOUNTANT', status: 'Active' }
  ];

  const handleAddUser = () => {
    alert('Tenant authorization is restricted. Please contact your support representative.');
  };

  return { users, handleAddUser };
}
