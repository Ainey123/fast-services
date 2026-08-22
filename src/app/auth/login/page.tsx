'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/types/database';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  User,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('ahmed.raza@fastengineeringsolutions.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await login(email, selectedRole);
      if (res.success) {
        if (selectedRole === 'ADMIN') {
          router.push('/admin');
        } else if (selectedRole === 'MANAGER' || selectedRole === 'EMPLOYEE') {
          router.push('/employee');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(res.error || 'Authentication failed.');
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Account Select helper for testing different roles
  const selectQuickAccount = (role: UserRole, accEmail: string) => {
    setSelectedRole(role);
    setEmail(accEmail);
    setPassword('SecurePassword123!');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Visual background lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex justify-center mb-4">
          <Logo variant="white" size="lg" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Sign In to Fast Services
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400">
          Access your Customer, Employee, or Enterprise Admin dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl py-8 px-6 sm:px-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          {/* Quick Role Switcher for Rapid Verification */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Select Portal / Role
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => selectQuickAccount('ADMIN', 'ahmed.raza@fastengineeringsolutions.com')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  selectedRole === 'ADMIN'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => selectQuickAccount('EMPLOYEE', 'usman.tariq@fastengineeringsolutions.com')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  selectedRole === 'EMPLOYEE' || selectedRole === 'MANAGER'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Employee
              </button>
              <button
                type="button"
                onClick={() => selectQuickAccount('CUSTOMER', 'tariq@apextextiles.com.pk')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  selectedRole === 'CUSTOMER'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Customer
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-950 border-slate-800 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember_me" className="ml-2 block text-xs text-slate-400">
                Remember my session on this device
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Don&apos;t have a customer account?{' '}
            <Link href="/auth/signup" className="text-blue-400 font-bold hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
