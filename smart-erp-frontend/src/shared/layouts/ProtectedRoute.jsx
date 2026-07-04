import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@shared/context/AuthContext';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';

export default function ProtectedRoute({ children, requireCompany = true, requireAdmin = false }) {
  const { token, user } = useAuth();
  const { activeCompany } = useActiveCompany();
  const location = useLocation();

  // 1. Authenticated session check
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Company context check (enforced for ERP pages)
  if (requireCompany && !activeCompany) {
    return <Navigate to="/company-select" replace />;
  }

  // 3. Administrative role validation
  if (requireAdmin && user?.role !== 'ADMIN') {
    return <Navigate to="/access-denied" replace />;
  }

  // 4. Role-based namespace constraints
  const path = location.pathname;
  if (user?.role === 'ACCOUNTANT') {
    const isRestricted = ['/inventory', '/sales', '/purchase'].some(p => path.startsWith(p));
    if (isRestricted) {
      return <Navigate to="/access-denied" replace />;
    }
  }

  if (user?.role === 'INVENTORY_MANAGER') {
    const isRestricted = ['/accounting'].some(p => path.startsWith(p));
    if (isRestricted) {
      return <Navigate to="/access-denied" replace />;
    }
  }

  return children;
}
