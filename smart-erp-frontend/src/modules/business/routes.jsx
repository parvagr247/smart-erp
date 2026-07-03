import React, { lazy } from 'react';
import { Route } from 'react-router-dom';

const DashboardView = lazy(() => import('./dashboard/views/DashboardView'));

export const getBusinessRoutes = () => (
  <>
    <Route path="dashboard" element={<DashboardView />} />
  </>
);
