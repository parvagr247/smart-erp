import React from 'react';
import { useLoginViewData } from './services/LoginViewService';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import './styles/LoginView.css';

export default function LoginView({ onLoginSuccess, onRegisterClick }) {
  const { error, errors, loading, handleSubmit, emailBind, passwordBind } = useLoginViewData(onLoginSuccess);

  return (
    <Card className="auth-card">
      <CardHeader className="auth-header">
        <CardTitle className="auth-title">Welcome Back</CardTitle>
        <CardDescription className="auth-desc">Please enter your credentials to login</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="auth-content">
          {error && <div className="error-alert">{error}</div>}
          <div className="form-group">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="name@company.com" {...emailBind} />
            {errors?.email && <span className="text-red-500 text-xs mt-1 block text-left">{errors.email}</span>}
          </div>
          <div className="form-group">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" {...passwordBind} />
            {errors?.password && <span className="text-red-500 text-xs mt-1 block text-left">{errors.password}</span>}
          </div>
          <div className="pt-2">
            <Button type="submit" disabled={loading} className="w-full bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] cursor-pointer py-2 rounded-lg">{loading ? 'Logging in...' : 'Login'}</Button>
          </div>
          <div className="auth-toggle pt-2 text-center text-xs">
            Don't have an account?{' '}
            <span onClick={onRegisterClick} className="text-[var(--primary)] hover:underline font-semibold cursor-pointer">Register here</span>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
