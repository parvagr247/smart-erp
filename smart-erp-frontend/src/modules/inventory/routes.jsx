import React, { lazy } from 'react';
import { Route } from 'react-router-dom';

const InventoryDashboardView = lazy(() => import('./views/InventoryDashboardView'));
const CreateItemView = lazy(() => import('./views/CreateItemView'));
const EditItemView = lazy(() => import('./views/EditItemView'));
const ItemDetailsView = lazy(() => import('./views/ItemDetailsView'));
const BrandListView = lazy(() => import('./views/BrandListView'));
const ManufacturerListView = lazy(() => import('./views/ManufacturerListView'));
const CategoryListView = lazy(() => import('./views/CategoryListView'));
const UnitListView = lazy(() => import('./views/UnitListView'));
const TaxListView = lazy(() => import('./views/TaxListView'));
const WarehouseListView = lazy(() => import('./views/WarehouseListView'));

const StockGroupsView = lazy(() => import('./stockgroups/views/StockGroupsView'));
const StockItemsView = lazy(() => import('./items/views/StockItemsView'));

const PartnerDashboardView = lazy(() => import('./partner/views/PartnerDashboardView'));
const PartnerListView = lazy(() => import('./partner/views/PartnerListView'));
const CreatePartnerView = lazy(() => import('./partner/views/CreatePartnerView'));
const EditPartnerView = lazy(() => import('./partner/views/EditPartnerView'));
const PartnerDetailsView = lazy(() => import('./partner/views/PartnerDetailsView'));

const SalesView = lazy(() => import('./sales/views/SalesView'));
const PurchaseView = lazy(() => import('./purchase/views/PurchaseView'));

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
    <Route path="purchase" element={<PurchaseView />} />
  </>
);
