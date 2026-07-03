import React from 'react';
import { useRegisterForm } from '../services/auth-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import '../styles/RegisterView.css';

export default function RegisterView({ onRegisterSuccess, onLoginClick }) {
  const { error, loading, handleSubmit, nameBind, emailBind, passwordBind, roleBind } = useRegisterForm(onRegisterSuccess);

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
          </div>
          <div className="form-group">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="name@company.com" {...emailBind} />
          </div>
          <div className="form-group">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="•••••••• (Min 6 characters)" {...passwordBind} />
          </div>
          <div className="form-group">
            <Label htmlFor="role">User Role</Label>
            <select id="role" {...roleBind}>
              <option value="ACCOUNTANT">Accountant</option>
              <option value="ADMIN">Administrator</option>
              <option value="INVENTORY_MANAGER">Inventory Manager</option>
            </select>
          </div>
        </CardContent>
        <CardFooter className="auth-footer">
          <Button type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</Button>
          <div className="auth-toggle">
            Already have an account?{' '}
            <span onClick={onLoginClick}>Login here</span>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
