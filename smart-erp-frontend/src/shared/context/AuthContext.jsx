import React, { createContext, useContext } from 'react';
import { useAuth as useAuthService } from '@modules/auth/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = useAuthService();
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
