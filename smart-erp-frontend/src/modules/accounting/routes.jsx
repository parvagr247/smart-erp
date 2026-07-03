import React, { lazy } from 'react';
import { Route } from 'react-router-dom';

const AccountingDashboardView = lazy(() => import('./views/AccountingDashboardView'));
const AccountGroupsView = lazy(() => import('./views/AccountGroupsView'));
const LedgerListView = lazy(() => import('./views/LedgerListView'));
const CreateLedgerView = lazy(() => import('./views/CreateLedgerView'));
const EditLedgerView = lazy(() => import('./views/EditLedgerView'));
const LedgerDetailsView = lazy(() => import('./views/LedgerDetailsView'));

const GstView = lazy(() => import('./gst/views/GstView'));
const BankingView = lazy(() => import('./banking/views/BankingView'));
const ReportsView = lazy(() => import('./reports/views/ReportsView'));

export const getAccountingRoutes = () => (
  <>
    <Route path="accounting" element={<AccountingDashboardView />} />
    <Route path="accounting/groups" element={<AccountGroupsView />} />
    <Route path="accounting/ledgers" element={<LedgerListView />} />
    <Route path="accounting/ledgers/create" element={<CreateLedgerView />} />
    <Route path="accounting/ledgers/edit/:id" element={<EditLedgerView />} />
    <Route path="accounting/ledgers/:id" element={<LedgerDetailsView />} />
    
    <Route path="gst" element={<GstView />} />
    <Route path="banking" element={<BankingView />} />
    <Route path="reports" element={<ReportsView />} />
  </>
);
