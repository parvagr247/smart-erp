import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import AuthLayout from '@shared/layouts/AuthLayout';

const LoginView = lazy(() => import('./pages/LoginView'));
const RegisterView = lazy(() => import('./pages/RegisterView'));
const LogoutView = lazy(() => import('./pages/LogoutView'));

export const getAuthRoutes = (handleAuthSuccess, navigate) => (
  <Route element={<AuthLayout />}>
    <Route path="/login" element={<LoginView onLoginSuccess={handleAuthSuccess} onRegisterClick={() => navigate('/register')} />} />
    <Route path="/register" element={<RegisterView onRegisterSuccess={handleAuthSuccess} onLoginClick={() => navigate('/login')} />} />
    <Route path="/logout" element={<LogoutView />} />
  </Route>
);
