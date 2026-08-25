'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/db/data-store';
import { CompanySettings } from '@/types/database';
import {
  Phone,
  MessageSquare,
  Menu,
  X,
  User,
  ShieldCheck,
  Briefcase,
  Layers,
  Calendar,
  LogOut,
  ChevronRight,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<CompanySettings | null>(null);

  useEffect(() => {
    db.getCompanySettings().then(setSettings);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Request Service', href: '/request' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const cleanPhone = settings?.phone || '+92 300 4545280';
  const cleanWhatsApp = (settings?.whatsapp || '+923004545280').replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      {/* Top Corporate Strip for Desktop */}
      <div className="hidden lg:block bg-slate-900 text-slate-300 text-xs py-1.5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-medium text-slate-300">
              FAST ENGINEERING SOLUTIONS — General Contractor & Construction Solutions
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {settings?.working_hours || '24/7 Service Available (24 Hours Emergency Support)'}
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={`tel:${cleanPhone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>{cleanPhone}</span>
            </a>
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                'Hello Fast Services, I would like to know more about your services.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Logo size="md" />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-blue-600 bg-blue-50/80 font-bold'
                    : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Auth State */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Quick Call Button */}
          <a
            href={`tel:${cleanPhone.replace(/\s+/g, '')}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-all"
            title="Call Engineering Support"
          >
            <Phone className="w-4 h-4 text-blue-600" />
            <span className="hidden xl:inline">Call Now</span>
          </a>

          {/* User Auth Portal Actions */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              {role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shadow-sm transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Admin Hub</span>
                </Link>
              )}

              {(role === 'MANAGER' || role === 'EMPLOYEE') && (
                <Link
                  href="/employee"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm transition-all"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Staff Portal</span>
                </Link>
              )}

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold transition-all"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span className="max-w-[100px] truncate">{user.full_name.split(' ')[0]}</span>
              </Link>

              <button
                onClick={logout}
                className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/request"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
              >
                Request Service
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1 pb-4 border-b border-slate-100">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-base font-semibold ${
                  pathname === link.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </div>

          {/* Mobile Auth & Portal Links */}
          <div className="pt-4 space-y-2.5">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-slate-50 rounded-lg text-xs text-slate-600">
                  Logged in as <strong className="text-slate-900">{user.full_name}</strong> ({user.role})
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-lg bg-slate-100 text-slate-800 text-sm font-bold"
                >
                  <User className="w-4 h-4 text-blue-600" />
                  <span>My Dashboard</span>
                </Link>

                {role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-bold"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Admin Hub</span>
                  </Link>
                )}

                {(role === 'MANAGER' || role === 'EMPLOYEE') && (
                  <Link
                    href="/employee"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-bold"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Staff Portal</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-lg bg-rose-50 text-rose-700 text-sm font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-bold text-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/request"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-bold text-center shadow-sm"
                >
                  Request Service
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
