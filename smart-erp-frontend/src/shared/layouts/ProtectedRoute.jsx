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
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
