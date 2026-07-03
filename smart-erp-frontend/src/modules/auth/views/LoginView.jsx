import React from 'react';
import { useLoginForm } from '@modules/auth/services/auth.service';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@shared/components/ui/card';
import '@modules/auth/styles/login.css';

export default function LoginView({ onLoginSuccess, onRegisterClick }) {
  const { error, errors, loading, handleSubmit, emailBind, passwordBind } = useLoginForm(onLoginSuccess);

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
        </CardContent>

        <CardFooter className="auth-footer">
          <Button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
          <div className="auth-toggle">
            Don't have an account?{' '}
            <span onClick={onRegisterClick}>Register here</span>
          </div>
        </CardFooter>
        
      </form>

    </Card>
  );
}
