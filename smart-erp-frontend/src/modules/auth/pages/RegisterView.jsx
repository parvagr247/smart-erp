import React from 'react';
import { useRegisterViewData } from './services/RegisterViewService';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@shared/components/ui/card';
import './styles/RegisterView.css';

export default function RegisterView({ onRegisterSuccess, onLoginClick }) {
  const { error, errors, loading, handleSubmit, nameBind, emailBind, passwordBind, roleBind } = useRegisterViewData(onRegisterSuccess);

  return (
    <Card className="auth-card">
      <CardHeader className="auth-header">
        <CardTitle className="auth-title">Create Account</CardTitle>
        <CardDescription className="auth-desc">Sign up to access the ERP platform</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="auth-content">
          {error && <div className="error-alert">{error}</div>}
          <div className="form-group">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" type="text" placeholder="John Doe" {...nameBind} />
            {errors?.fullName && <span className="text-red-500 text-xs mt-1 block text-left">{errors.fullName}</span>}
          </div>
          <div className="form-group">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="name@company.com" {...emailBind} />
            {errors?.email && <span className="text-red-500 text-xs mt-1 block text-left">{errors.email}</span>}
          </div>
          <div className="form-group">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="•••••••• (Min 6 characters)" {...passwordBind} />
            {errors?.password && <span className="text-red-500 text-xs mt-1 block text-left">{errors.password}</span>}
          </div>
          <div className="form-group">
            <Label htmlFor="role">User Role</Label>
            <select id="role" {...roleBind} className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-sm text-[var(--text-primary)] cursor-pointer h-10">
              <option value="ACCOUNTANT">Accountant</option>
              <option value="ADMIN">Administrator</option>
              <option value="INVENTORY_MANAGER">Inventory Manager</option>
            </select>
          </div>
        </CardContent>
        <CardFooter className="auth-footer">
          <Button type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</Button>
          <div className="auth-toggle">Already have an account? <span onClick={onLoginClick}>Login here</span></div>
        </CardFooter>
      </form>
    </Card>
  );
}
