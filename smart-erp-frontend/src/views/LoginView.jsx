import React from 'react';
import { useLoginForm } from '../services/auth-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import '../styles/LoginView.css';

export default function LoginView({ onLoginSuccess, onRegisterClick }) {
  const { error, loading, handleSubmit, emailBind, passwordBind } = useLoginForm(onLoginSuccess);

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
          </div>
          <div className="form-group">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" {...passwordBind} />
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
