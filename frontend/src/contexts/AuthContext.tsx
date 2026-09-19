import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/client';

export type UserRole = 'BUYER' | 'MANUFACTURER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName?: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  demoLogin: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {}
      }

      const token = localStorage.getItem('token');
      if (token && token !== 'mock-prototype-token') {
        try {
          const response = await api.get('/auth/me');
          if (response.data.success) {
            setUser(response.data.data);
          }
        } catch (error) {
          console.warn('Backend offline, using cached/demo user session', error);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const demoLogin = (role: UserRole) => {
    const demoUsers: Record<UserRole, User> = {
      BUYER: {
        id: "demo-buyer-001",
        name: "Jai Duggal",
        email: "buyer@d2c.com",
        role: "BUYER",
        companyName: "Aether Lifestyle Brands",
        isVerified: true,
      },
      MANUFACTURER: {
        id: "demo-mfr-001",
        name: "Amit Patel",
        email: "mfr@factory.com",
        role: "MANUFACTURER",
        companyName: "Artisan Metals Co.",
        isVerified: true,
      },
      ADMIN: {
        id: "demo-admin-001",
        name: "Operations Admin",
        email: "admin@nirmaan.com",
        role: "ADMIN",
        companyName: "Nirmaan Operations",
        isVerified: true,
      },
    };
    login("mock-prototype-token", demoUsers[role]);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
