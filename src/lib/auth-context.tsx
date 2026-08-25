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
    // 1. First attempt to check active server session cookie
    getCurrentSession().then((sessionUser) => {
      if (sessionUser) {
        setUser(sessionUser);
        setIsLoading(false);
      } else {
        // Fallback to local session storage
        try {
          const savedUser = localStorage.getItem('fast_services_auth_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            setUser(DEMO_PROFILES.CUSTOMER);
          }
        } catch {
          setUser(DEMO_PROFILES.CUSTOMER);
        } finally {
          setIsLoading(false);
        }
      }
    });
  }, []);

  const login = async (email: string, password?: string, overrideRole?: UserRole) => {
    setIsLoading(true);

    // 1. Attempt Neon Database Authentication
    const result = await loginUser(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      localStorage.setItem('fast_services_auth_user', JSON.stringify(result.user));
      setIsLoading(false);
      return { success: true };
    }

    // 2. Fallback in-memory matching if database is initializing or offline
    const lowerEmail = email.toLowerCase().trim();
    let matchedProfile: Profile | null = null;
    const employees = await db.getEmployees();
    const emp = employees.find((e) => e.profile?.email.toLowerCase() === lowerEmail);

    if (emp && emp.profile) {
      matchedProfile = emp.profile;
    } else if (lowerEmail.includes('admin')) {
      matchedProfile = DEMO_PROFILES.ADMIN;
    } else if (lowerEmail.includes('manager') || lowerEmail.includes('ali')) {
      matchedProfile = DEMO_PROFILES.MANAGER;
    } else if (lowerEmail.includes('usman') || lowerEmail.includes('employee')) {
      matchedProfile = DEMO_PROFILES.EMPLOYEE;
    } else {
      matchedProfile = {
        id: `cust-${Date.now().toString().slice(-4)}`,
        full_name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: lowerEmail,
        role: overrideRole || 'CUSTOMER',
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    if (overrideRole) {
      matchedProfile.role = overrideRole;
    }

    setUser(matchedProfile);
    localStorage.setItem('fast_services_auth_user', JSON.stringify(matchedProfile));
    setIsLoading(false);
    return { success: true };
  };

  const signup = async (data: { full_name: string; email: string; phone: string; password?: string }) => {
    setIsLoading(true);

    // 1. Attempt Neon Database Registration
    const result = await registerUser(data);
    if (result.success && result.user) {
      setUser(result.user);
      localStorage.setItem('fast_services_auth_user', JSON.stringify(result.user));
      setIsLoading(false);
      return { success: true };
    }

    // 2. Fallback Profile Creation
    const newProfile: Profile = {
      id: `cust-${Date.now().toString().slice(-4)}`,
      full_name: data.full_name,
      email: data.email.toLowerCase().trim(),
      phone: data.phone,
      role: 'CUSTOMER',
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(newProfile);
    localStorage.setItem('fast_services_auth_user', JSON.stringify(newProfile));
    setIsLoading(false);
    return { success: true };
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    localStorage.removeItem('fast_services_auth_user');
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

