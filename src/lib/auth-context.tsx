'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '@/types/database';
import { loginUser, registerUser, getCurrentSession, logoutUser } from '@/lib/actions/auth';
import { db } from '@/lib/db/data-store';

interface AuthContextType {
  user: Profile | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (email: string, password?: string, overrideRole?: UserRole) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { full_name: string; email: string; phone: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default fallback profiles for development/offline
const DEMO_PROFILES: Record<UserRole, Profile> = {
  ADMIN: {
    id: 'emp-001',
    full_name: 'Engr. Ahmed Raza',
    email: 'ahmed.raza@fastengineeringsolutions.com',
    phone: '+92 300 5551122',
    role: 'ADMIN',
    status: 'ACTIVE',
    created_at: '2025-06-01T08:00:00Z',
    updated_at: '2026-08-01T08:00:00Z',
  },
  MANAGER: {
    id: 'emp-002',
    full_name: 'Engr. Ali Hassan',
    email: 'ali.hassan@fastengineeringsolutions.com',
    phone: '+92 301 6662233',
    role: 'MANAGER',
    status: 'ACTIVE',
    created_at: '2025-08-15T08:00:00Z',
    updated_at: '2026-08-01T08:00:00Z',
  },
  EMPLOYEE: {
    id: 'emp-003',
    full_name: 'Usman Tariq',
    email: 'usman.tariq@fastengineeringsolutions.com',
    phone: '+92 302 7773344',
    role: 'EMPLOYEE',
    status: 'ACTIVE',
    created_at: '2026-01-10T08:00:00Z',
    updated_at: '2026-08-01T08:00:00Z',
  },
  CUSTOMER: {
    id: 'cust-101',
    full_name: 'Tariq Mehmood',
    email: 'tariq@apextextiles.com.pk',
    phone: '+92 300 8472910',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-08-10T08:00:00Z',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Check active server session cookie
    getCurrentSession().then((sessionUser) => {
      if (sessionUser) {
        setUser(sessionUser);
        localStorage.setItem('fast_services_auth_user', JSON.stringify(sessionUser));
        setIsLoading(false);
      } else {
        try {
          const savedUser = localStorage.getItem('fast_services_auth_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      }
    });
  }, []);

  const login = async (email: string, password?: string, overrideRole?: UserRole) => {
    setIsLoading(true);

    // 1. Neon Database Authentication
    try {
      const result = await loginUser(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem('fast_services_auth_user', JSON.stringify(result.user));
        setIsLoading(false);
        return { success: true };
      } else if (result.error) {
        setIsLoading(false);
        return { success: false, error: result.error };
      }
    } catch (e: any) {
      console.warn('[Auth Login] Neon direct query warning:', e.message);
    }

    setIsLoading(false);
    return { success: false, error: 'Invalid email or password. Please check your credentials.' };
  };

  const signup = async (data: { full_name: string; email: string; phone: string; password?: string }) => {
    setIsLoading(true);

    // 1. Neon Database Registration
    try {
      const result = await registerUser(data);
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem('fast_services_auth_user', JSON.stringify(result.user));
        setIsLoading(false);
        return { success: true };
      } else if (result.error) {
        setIsLoading(false);
        return { success: false, error: result.error };
      }
    } catch (e: any) {
      console.error('[Auth Signup Error]', e);
    }

    setIsLoading(false);
    return { success: false, error: 'Registration failed. Please try again.' };
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      // ignore
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fast_services_auth_user');
      window.location.href = '/auth/login';
    }
  };

  const switchRole = (newRole: UserRole) => {
    const profile = DEMO_PROFILES[newRole];
    setUser(profile);
    localStorage.setItem('fast_services_auth_user', JSON.stringify(profile));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isLoading,
        login,
        signup,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

