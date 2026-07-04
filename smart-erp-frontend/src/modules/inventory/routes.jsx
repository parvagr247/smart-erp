import React, { lazy } from 'react';
import { Route } from 'react-router-dom';

const InventoryDashboardView = lazy(() => import('./pages/InventoryDashboardView'));
const CreateItemView = lazy(() => import('./pages/CreateItemView'));
const EditItemView = lazy(() => import('./pages/EditItemView'));
const ItemDetailsView = lazy(() => import('./pages/ItemDetailsView'));
const BrandListView = lazy(() => import('./pages/BrandListView'));
const ManufacturerListView = lazy(() => import('./pages/ManufacturerListView'));
const CategoryListView = lazy(() => import('./pages/CategoryListView'));
const UnitListView = lazy(() => import('./pages/UnitListView'));
const TaxListView = lazy(() => import('./pages/TaxListView'));
const WarehouseListView = lazy(() => import('./pages/WarehouseListView'));

const StockGroupsView = lazy(() => import('./pages/StockGroupsView'));
const StockItemsView = lazy(() => import('./pages/StockItemsView'));

const PartnerDashboardView = lazy(() => import('./pages/PartnerDashboardView'));
const PartnerListView = lazy(() => import('./pages/PartnerListView'));
const CreatePartnerView = lazy(() => import('./pages/CreatePartnerView'));
const EditPartnerView = lazy(() => import('./pages/EditPartnerView'));
const PartnerDetailsView = lazy(() => import('./pages/PartnerDetailsView'));

const SalesView = lazy(() => import('./pages/SalesView'));
const PurchaseDashboardView = lazy(() => import('./pages/PurchaseDashboardView'));
const PurchaseListView = lazy(() => import('./pages/PurchaseListView'));
const CreatePurchaseView = lazy(() => import('./pages/CreatePurchaseView'));
const EditPurchaseView = lazy(() => import('./pages/EditPurchaseView'));
const PurchaseDetailsView = lazy(() => import('./pages/PurchaseDetailsView'));

export const getInventoryRoutes = () => (
  <>
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

    <Route path="sales" element={<SalesView />} />
    <Route path="purchase" element={<PurchaseDashboardView />} />
    <Route path="purchase/list" element={<PurchaseListView />} />
    <Route path="purchase/create" element={<CreatePurchaseView />} />
    <Route path="purchase/edit/:id" element={<EditPurchaseView />} />
    <Route path="purchase/:id" element={<PurchaseDetailsView />} />
  </>
);
