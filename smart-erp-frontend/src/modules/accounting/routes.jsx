import React, { lazy } from 'react';
import { Route } from 'react-router-dom';

const AccountingDashboardView = lazy(() => import('./pages/AccountingDashboardView'));
const AccountGroupsView = lazy(() => import('./pages/AccountGroupsView'));
const LedgerListView = lazy(() => import('./pages/LedgerListView'));
const CreateLedgerView = lazy(() => import('./pages/CreateLedgerView'));
const EditLedgerView = lazy(() => import('./pages/EditLedgerView'));
const LedgerDetailsView = lazy(() => import('./pages/LedgerDetailsView'));

const GstView = lazy(() => import('./pages/GstView'));
const BankingView = lazy(() => import('./pages/BankingView'));
const ReportsView = lazy(() => import('./pages/ReportsView'));

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
