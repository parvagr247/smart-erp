import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import AdminLayout from './components/layout/AdminLayout';
import { useAuth } from './context/AuthContext';
import { useActiveCompany } from './context/ActiveCompanyContext';
import { fetchCompaniesList } from './services/company-service';

// Lazy load views
const LoginView = lazy(() => import('./views/LoginView'));
const RegisterView = lazy(() => import('./views/RegisterView'));
const CompanySelectionView = lazy(() => import('./views/company/CompanySelectionView'));
const CreateCompanyView = lazy(() => import('./views/company/CreateCompanyView'));
const EditCompanyView = lazy(() => import('./views/company/EditCompanyView'));
const DashboardView = lazy(() => import('./views/DashboardView'));

const LedgersView = lazy(() => import('./views/accounting/LedgersView'));
const GroupsView = lazy(() => import('./views/accounting/GroupsView'));
const CustomersView = lazy(() => import('./views/contacts/CustomersView'));
const SuppliersView = lazy(() => import('./views/contacts/SuppliersView'));
const StockGroupsView = lazy(() => import('./views/inventory/StockGroupsView'));
const StockItemsView = lazy(() => import('./views/inventory/StockItemsView'));

const AccountingView = lazy(() => import('./views/modules/AccountingView'));
const SalesView = lazy(() => import('./views/modules/SalesView'));
const PurchaseView = lazy(() => import('./views/modules/PurchaseView'));
const GstView = lazy(() => import('./views/modules/GstView'));
const BankingView = lazy(() => import('./views/modules/BankingView'));
const ReportsView = lazy(() => import('./views/modules/ReportsView'));
const AdministrationView = lazy(() => import('./views/modules/AdministrationView'));

const AdminDashboardView = lazy(() => import('./views/admin/AdminDashboardView'));
const AdminUsersView = lazy(() => import('./views/admin/AdminUsersView'));
const AdminRolesView = lazy(() => import('./views/admin/AdminRolesView'));
const AdminPermissionsView = lazy(() => import('./views/admin/AdminPermissionsView'));
const AdminAuditLogsView = lazy(() => import('./views/admin/AdminAuditLogsView'));
const AdminSettingsView = lazy(() => import('./views/admin/AdminSettingsView'));

const NotFoundView = lazy(() => import('./views/NotFoundView'));
const AuthLayout = lazy(() => import('./components/layout/AuthLayout'));

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
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginView onLoginSuccess={handleAuthSuccess} onRegisterClick={() => navigate('/register')} />} />
          <Route path="/register" element={<RegisterView onRegisterSuccess={handleAuthSuccess} onLoginClick={() => navigate('/login')} />} />
        </Route>

        <Route path="/company-select" element={
          <ProtectedRoute requireCompany={false}>
            <CompanySelectionView onSelectSuccess={() => navigate('/dashboard')} onCreateCompany={() => navigate('/create-company')} onEditCompany={(c) => navigate(`/edit-company/${c.id}`)} />
          </ProtectedRoute>
        } />
        
        <Route path="/create-company" element={
          <ProtectedRoute requireCompany={false}>
            <CreateCompanyView onSaveSuccess={(c) => { updateActiveCompany(c); navigate('/dashboard'); }} onCancel={() => activeCompany ? navigate('/dashboard') : navigate('/company-select')} />
          </ProtectedRoute>
        } />
        
        <Route path="/edit-company/:id" element={
          <ProtectedRoute requireCompany={false}>
            <EditCompanyView onSaveSuccess={(c) => { if (activeCompany && activeCompany.id === c.id) updateActiveCompany(c); navigate('/company-select'); }} onCancel={() => navigate('/company-select')} />
          </ProtectedRoute>
        } />

        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="masters/ledgers" element={<LedgersView />} />
          <Route path="masters/groups" element={<GroupsView />} />
          <Route path="masters/customers" element={<CustomersView />} />
          <Route path="masters/suppliers" element={<SuppliersView />} />
          <Route path="inventory/stock-groups" element={<StockGroupsView />} />
          <Route path="inventory/stock-items" element={<StockItemsView />} />
          
          <Route path="accounting" element={<AccountingView />} />
          <Route path="sales" element={<SalesView />} />
          <Route path="purchase" element={<PurchaseView />} />
          <Route path="gst" element={<GstView />} />
          <Route path="banking" element={<BankingView />} />
          <Route path="reports" element={<ReportsView />} />
          <Route path="settings" element={<div className="p-6 font-bold text-left">Personal Settings (Coming Soon)</div>} />
        </Route>

        <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardView />} />
          <Route path="users" element={<AdminUsersView />} />
          <Route path="roles" element={<AdminRolesView />} />
          <Route path="permissions" element={<AdminPermissionsView />} />
          <Route path="audit-logs" element={<AdminAuditLogsView />} />
          <Route path="settings" element={<AdminSettingsView />} />
        </Route>

        <Route path="/404" element={<NotFoundView />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}
