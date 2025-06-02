'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authConstants } from '@/features/auth/constants/authConstants';

interface AuthContextType {
  isAuthenticated: boolean;
  loginKey: string | null;
  login: (key: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loginKey, setLoginKey] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const key = localStorage.getItem(authConstants.localStorage.masterLoginKey);
    if (key) {
      setLoginKey(key);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (key: string) => {
    localStorage.setItem(authConstants.localStorage.masterLoginKey, key);
    setLoginKey(key);
    setIsAuthenticated(true);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem(authConstants.localStorage.masterLoginKey);
    setLoginKey(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loginKey, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
} 
