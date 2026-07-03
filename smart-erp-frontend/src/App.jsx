import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ProtectedRoute from '@shared/layouts/ProtectedRoute';
import AppLayout from '@shared/layouts/AppLayout';
import AdminLayout from '@shared/layouts/AdminLayout';
import { useAuth } from '@shared/context/AuthContext';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';
import { fetchCompaniesList } from '@modules/administration/services/company.service';

import { getAuthRoutes } from '@modules/auth';
import { getBusinessRoutes } from '@modules/business';
import { getAdministrationRoutes } from '@modules/administration';
import { getAccountingRoutes } from '@modules/accounting';
import { getInventoryRoutes } from '@modules/inventory';

const NotFoundView = React.lazy(() => import('@shared/components/NotFoundView'));

const Loading = () => (
  <div className="flex items-center justify-center min-h-[40vh] text-sm text-[var(--text-muted)] font-semibold animate-pulse">
    Loading module...
  </div>
);

export default function App() {
  const navigate = useNavigate();
  const { token, handleLoginSuccess } = useAuth();
  const { activeCompany, updateActiveCompany } = useActiveCompany();

  // Enforce company selection if logged in without company context
  useEffect(() => {
    if (!token) return;
    const path = window.location.pathname;
    const isEx = ['/company-select', '/create-company', '/login', '/register'].some(p => path.startsWith(p));
    
    if (!activeCompany && !isEx) {
      fetchCompaniesList(0, 1).then((res) => {
        if (res.success && res.data && res.data.totalElements > 0) navigate('/company-select');
        else navigate('/create-company');
      }).catch(() => navigate('/company-select'));
    }
  }, [token, activeCompany, navigate]);

  const handleAuthSuccess = (userData, jwtToken) => {
    handleLoginSuccess(userData, jwtToken);
    fetchCompaniesList(0, 1).then((res) => {
      if (res.success && res.data && res.data.totalElements > 0) navigate('/company-select');
      else navigate('/create-company');
    }).catch(() => navigate('/company-select'));
  };

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Auth Module Routes */}
        {getAuthRoutes(handleAuthSuccess, navigate)}

        {/* Administration company select, create, edit routes */}
        {getAdministrationRoutes(updateActiveCompany, activeCompany, 'company')}

        {/* Main App Layout routes */}
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          {getBusinessRoutes()}
          
          {getAccountingRoutes()}

          {getInventoryRoutes()}
          <Route path="settings" element={<div className="p-6 font-bold text-left">Personal Settings (Coming Soon)</div>} />
        </Route>

        {/* Administration console layout routes */}
        <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminLayout /></ProtectedRoute>}>
          
          <Route index element={<Navigate to="dashboard" replace />} />
            
          {getAdministrationRoutes(updateActiveCompany, activeCompany, 'admin')}
        </Route>

        <Route path="/404" element={<NotFoundView />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}
