import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@shared/layouts/ProtectedRoute';

const CompanySelectionView = lazy(() => import('./views/CompanySelectionView'));
const CreateCompanyView = lazy(() => import('./views/CreateCompanyView'));
const EditCompanyView = lazy(() => import('./views/EditCompanyView'));

const AdminDashboardView = lazy(() => import('./views/AdminDashboardView'));
const AdminUsersView = lazy(() => import('./views/AdminUsersView'));
const AdminRolesView = lazy(() => import('./views/AdminRolesView'));
const AdminPermissionsView = lazy(() => import('./views/AdminPermissionsView'));
const AdminAuditLogsView = lazy(() => import('./views/AdminAuditLogsView'));
const AdminSettingsView = lazy(() => import('./views/AdminSettingsView'));

export const getAdministrationRoutes = (updateActiveCompany, activeCompany, mode = 'all') => (
  <>
    {/* Company registration/switching routes */}
    {(mode === 'all' || mode === 'company') && (
      <>
        <Route path="/company-select" element={
          <ProtectedRoute requireCompany={false}>
            <CompanySelectionView 
              onSelectSuccess={() => window.location.assign('/dashboard')} 
              onCreateCompany={() => window.location.assign('/create-company')} 
              onEditCompany={(c) => window.location.assign(`/edit-company/${c.id}`)} 
            />
          </ProtectedRoute>
        } />
        
        <Route path="/create-company" element={
          <ProtectedRoute requireCompany={false}>
            <CreateCompanyView 
              onSaveSuccess={(c) => { updateActiveCompany(c); window.location.assign('/dashboard'); }} 
              onCancel={() => activeCompany ? window.location.assign('/dashboard') : window.location.assign('/company-select')} 
            />
          </ProtectedRoute>
        } />
        
        <Route path="/edit-company/:id" element={
          <ProtectedRoute requireCompany={false}>
            <EditCompanyView 
              onSaveSuccess={(c) => { 
                if (activeCompany && activeCompany.id === c.id) updateActiveCompany(c); 
                window.location.assign('/company-select'); 
              }} 
              onCancel={() => window.location.assign('/company-select')} 
            />
          </ProtectedRoute>
        } />
      </>
    )}

    {/* Admin module paths */}
    {(mode === 'all' || mode === 'admin') && (
      <>
        <Route path="dashboard" element={<AdminDashboardView />} />
        <Route path="users" element={<AdminUsersView />} />
        <Route path="roles" element={<AdminRolesView />} />
        <Route path="permissions" element={<AdminPermissionsView />} />
        <Route path="audit-logs" element={<AdminAuditLogsView />} />
        <Route path="settings" element={<AdminSettingsView />} />
      </>
    )}
  </>
);
