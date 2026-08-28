'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '@/types/database';
import { registerUser, getCurrentSession, logoutUser } from '@/lib/actions/auth';

interface AuthContextType {
  user: Profile | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string; user?: Profile }>;
  signup: (data: { full_name: string; email: string; phone: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const sessionUser = await getCurrentSession();
      setUser(sessionUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      setIsLoading(false);

      if (result.success && result.user) {
        setUser(result.user);
        return { success: true, user: result.user };
      }

      return { success: false, error: result.error || 'Authentication failed. Please check your credentials.' };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: 'Network error: ' + (e.message || 'Could not reach server.') };
    }
  };

  const signup = async (data: { full_name: string; email: string; phone: string; password?: string }) => {
    setIsLoading(true);
    try {
      const result = await registerUser(data);
      if (result.success && result.user) {
        setUser(result.user);
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
      window.location.href = '/auth/login';
    }
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
        refreshSession,
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


