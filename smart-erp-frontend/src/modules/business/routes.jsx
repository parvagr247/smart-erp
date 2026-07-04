import React, { lazy } from 'react';
import { Route } from 'react-router-dom';

const DashboardView = lazy(() => import('./pages/DashboardView'));

export const getBusinessRoutes = () => (
  <>
    <Route path="dashboard" element={<DashboardView />} />
  </>
);
