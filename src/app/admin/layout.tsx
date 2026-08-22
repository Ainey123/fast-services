'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Layers,
  ListTodo,
  Wrench,
  Package,
  FileBarChart,
  Activity,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Clients', href: '/admin/clients', icon: Users },
    { name: 'Employees', href: '/admin/employees', icon: Briefcase },
    { name: 'Projects', href: '/admin/projects', icon: Layers },
    { name: 'Who Is Working On What', href: '/admin/work', icon: ListTodo },
    { name: 'Service Requests', href: '/admin/requests', icon: Wrench },
    { name: 'Services Catalog', href: '/admin/services', icon: Wrench },
    { name: 'Products & Inventory', href: '/admin/products', icon: Package },
    { name: 'Monthly Reports & Export', href: '/admin/reports', icon: FileBarChart },
    { name: 'Activity / Audit Log', href: '/admin/activity', icon: Activity },
    { name: 'Company Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between z-30 sticky top-0">
        <Logo variant="white" size="sm" />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          aria-label="Toggle navigation menu"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800/80">
            <Logo variant="white" size="md" />
            <div className="mt-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Business Management</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Portal Quick Switch */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="truncate">
              <div className="font-bold text-white truncate">{user?.full_name || 'Admin User'}</div>
              <div className="text-[10px] text-slate-400">{user?.role || 'ADMIN'}</div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60">
            <Link
              href="/"
              target="_blank"
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] font-bold text-slate-300 flex items-center justify-center gap-1 text-center"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href="/employee"
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] font-bold text-blue-400 flex items-center justify-center text-center"
            >
              <span>Staff Desk</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 md:ml-64 bg-slate-900 min-h-screen">
        {children}
      </div>
    </div>
  );
}
