import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ProtectedRoute from '@shared/layouts/ProtectedRoute';
import AppLayout from '@shared/layouts/AppLayout';
import AdminLayout from '@shared/layouts/AdminLayout';
import AuthLayout from '@shared/layouts/AuthLayout';
import { useAuth } from '@shared/context/AuthContext';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';
import { fetchCompaniesList } from '@modules/administration/company/services/company.service';

// Lazy load views
const LoginView = lazy(() => import('@modules/auth/views/LoginView'));
const RegisterView = lazy(() => import('@modules/auth/views/RegisterView'));
const CompanySelectionView = lazy(() => import('@modules/administration/company/views/CompanySelectionView'));
const CreateCompanyView = lazy(() => import('@modules/administration/company/views/CreateCompanyView'));
const EditCompanyView = lazy(() => import('@modules/administration/company/views/EditCompanyView'));
const DashboardView = lazy(() => import('@modules/business/dashboard/views/DashboardView'));

const StockGroupsView = lazy(() => import('@modules/inventory/stockgroups/views/StockGroupsView'));
const StockItemsView = lazy(() => import('@modules/inventory/items/views/StockItemsView'));
const PartnerDashboardView = lazy(() => import('@modules/inventory/partner/views/PartnerDashboardView'));
const PartnerListView = lazy(() => import('@modules/inventory/partner/views/PartnerListView'));
const CreatePartnerView = lazy(() => import('@modules/inventory/partner/views/CreatePartnerView'));
const EditPartnerView = lazy(() => import('@modules/inventory/partner/views/EditPartnerView'));
const PartnerDetailsView = lazy(() => import('@modules/inventory/partner/views/PartnerDetailsView'));

const InventoryDashboardView = lazy(() => import('@modules/inventory/views/InventoryDashboardView'));
const CreateItemView = lazy(() => import('@modules/inventory/views/CreateItemView'));
const EditItemView = lazy(() => import('@modules/inventory/views/EditItemView'));
const ItemDetailsView = lazy(() => import('@modules/inventory/views/ItemDetailsView'));
const BrandListView = lazy(() => import('@modules/inventory/views/BrandListView'));
const ManufacturerListView = lazy(() => import('@modules/inventory/views/ManufacturerListView'));
const CategoryListView = lazy(() => import('@modules/inventory/views/CategoryListView'));
const UnitListView = lazy(() => import('@modules/inventory/views/UnitListView'));
const TaxListView = lazy(() => import('@modules/inventory/views/TaxListView'));
const WarehouseListView = lazy(() => import('@modules/inventory/views/WarehouseListView'));

const AccountingDashboardView = lazy(() => import('@modules/accounting/views/AccountingDashboardView'));
const AccountGroupsView = lazy(() => import('@modules/accounting/views/AccountGroupsView'));
const LedgerListView = lazy(() => import('@modules/accounting/views/LedgerListView'));
const CreateLedgerView = lazy(() => import('@modules/accounting/views/CreateLedgerView'));
const EditLedgerView = lazy(() => import('@modules/accounting/views/EditLedgerView'));
const LedgerDetailsView = lazy(() => import('@modules/accounting/views/LedgerDetailsView'));
const SalesView = lazy(() => import('@modules/inventory/sales/views/SalesView'));
const PurchaseView = lazy(() => import('@modules/inventory/purchase/views/PurchaseView'));
const GstView = lazy(() => import('@modules/accounting/gst/views/GstView'));
const BankingView = lazy(() => import('@modules/accounting/banking/views/BankingView'));
const ReportsView = lazy(() => import('@modules/accounting/reports/views/ReportsView'));

const AdminDashboardView = lazy(() => import('@modules/administration/dashboard/views/AdminDashboardView'));
const AdminUsersView = lazy(() => import('@modules/administration/users/views/AdminUsersView'));
const AdminRolesView = lazy(() => import('@modules/administration/roles/views/AdminRolesView'));
const AdminPermissionsView = lazy(() => import('@modules/administration/permissions/views/AdminPermissionsView'));
const AdminAuditLogsView = lazy(() => import('@modules/administration/audit/views/AdminAuditLogsView'));
const AdminSettingsView = lazy(() => import('@modules/administration/settings/views/AdminSettingsView'));

const NotFoundView = lazy(() => import('@shared/components/NotFoundView'));

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
          <Route path="masters/ledgers" element={<Navigate to="/accounting/ledgers" replace />} />
          <Route path="masters/groups" element={<Navigate to="/accounting/groups" replace />} />
          <Route path="masters/customers" element={<Navigate to="/inventory/partners" replace />} />
          <Route path="masters/suppliers" element={<Navigate to="/inventory/partners" replace />} />
          <Route path="inventory" element={<InventoryDashboardView />} />
          <Route path="inventory/stock-groups" element={<StockGroupsView />} />
          <Route path="inventory/stock-items" element={<StockItemsView />} />
          <Route path="inventory/stock-items/create" element={<CreateItemView />} />
          <Route path="inventory/stock-items/edit/:id" element={<EditItemView />} />
          <Route path="inventory/stock-items/:id" element={<ItemDetailsView />} />
          <Route path="inventory/brands" element={<BrandListView />} />
          <Route path="inventory/manufacturers" element={<ManufacturerListView />} />
          <Route path="inventory/categories" element={<CategoryListView />} />
          <Route path="inventory/units" element={<UnitListView />} />
          <Route path="inventory/tax-categories" element={<TaxListView />} />
          <Route path="inventory/warehouses" element={<WarehouseListView />} />
          
          <Route path="inventory/partners" element={<PartnerDashboardView />} />
          <Route path="inventory/partners/list" element={<PartnerListView />} />
          <Route path="inventory/partners/create" element={<CreatePartnerView />} />
          <Route path="inventory/partners/edit/:id" element={<EditPartnerView />} />
          <Route path="inventory/partners/:id" element={<PartnerDetailsView />} />
          
          <Route path="accounting" element={<AccountingDashboardView />} />
          <Route path="accounting/groups" element={<AccountGroupsView />} />
          <Route path="accounting/ledgers" element={<LedgerListView />} />
          <Route path="accounting/ledgers/create" element={<CreateLedgerView />} />
          <Route path="accounting/ledgers/edit/:id" element={<EditLedgerView />} />
          <Route path="accounting/ledgers/:id" element={<LedgerDetailsView />} />
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
