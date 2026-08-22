'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/db/data-store';
import { formatDate, formatCurrency, getStatusBadgeClass } from '@/lib/utils';
import {
  Users,
  Briefcase,
  Layers,
  Wrench,
  Package,
  Calendar,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  ListTodo,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState<number>(7); // 0-indexed: 7 = August
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [overview, setOverview] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      const data = await db.getMonthlyOverview(selectedMonth, selectedYear);
      const allTasks = await db.getTasks();
      const logs = await db.getAuditLogs();
      setOverview(data);
      setTasks(allTasks);
      setAuditLogs(logs.slice(0, 5));
      setLoading(false);
    }
    loadDashboardData();
  }, [selectedMonth, selectedYear]);

  const months = [
    { value: 0, label: 'January' },
    { value: 1, label: 'February' },
    { value: 2, label: 'March' },
    { value: 3, label: 'April' },
    { value: 4, label: 'May' },
    { value: 5, label: 'June' },
    { value: 6, label: 'July' },
    { value: 7, label: 'August' },
    { value: 8, label: 'September' },
    { value: 9, label: 'October' },
    { value: 10, label: 'November' },
    { value: 11, label: 'December' },
  ];

  return (
    <div className="p-4 sm:p-8 space-y-8">
      {/* Top Header & Unified Month Selector */}
      <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
            Fast Engineering Solutions
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Enterprise Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time business operations, project delivery, workforce allocations & inventory.
          </p>
        </div>

        {/* Global Month & Year Selector */}
        <div className="flex items-center gap-2.5 bg-slate-900 p-2 rounded-2xl border border-slate-800 flex-shrink-0">
          <Calendar className="w-4 h-4 text-amber-400 ml-2" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="bg-slate-950 text-white text-xs font-bold px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-slate-950 text-white text-xs font-bold px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
          </select>
        </div>
      </div>

      {loading || !overview ? (
        <div className="p-16 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-xs text-slate-400 mt-3">Recalculating monthly performance metrics...</p>
        </div>
      ) : (
        <>
          {/* ============================================================= */}
          {/* 1. MASTER KPI CARDS */}
          {/* ============================================================= */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Clients */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Total Clients</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-black text-white mt-2">
                {overview.kpis.totalClients}
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                {overview.kpis.activeClients} Active Clients
              </div>
            </div>

            {/* Employees */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Staff & Engineers</span>
                <Briefcase className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white mt-2">
                {overview.kpis.totalEmployees}
              </div>
              <div className="text-[11px] text-blue-400 font-semibold mt-1">
                {overview.kpis.employeesWorking} Working on Site
              </div>
            </div>

            {/* Active Projects */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Month Projects</span>
                <Layers className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-purple-400 mt-2">
                {overview.kpis.monthProjectsCount}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {overview.kpis.inProgressProjects} In Progress | {overview.kpis.completedProjects} Done
              </div>
            </div>

            {/* Overall Month Progress */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Work Progress</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400 mt-2">
                {overview.kpis.overallProgress}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Calculated across {overview.projects.length} projects
              </div>
            </div>

            {/* Service Requests */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Service Requests</span>
                <Wrench className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-black text-white mt-2">
                {overview.kpis.monthRequestsCount}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Logged in {overview.monthName}
              </div>
            </div>

            {/* Product Usage Cost */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Material Cost</span>
                <Package className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-black text-amber-400 mt-2">
                {formatCurrency(overview.kpis.monthProductCost)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {overview.productUsages.length} allocations
              </div>
            </div>
          </div>

          {/* ============================================================= */}
          {/* 2. PROJECT PROGRESS SECTION */}
          {/* ============================================================= */}
          <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-500" />
                  <span>Project Delivery & Milestones ({overview.monthName})</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visual completion progress for active industrial engineering contracts.
                </p>
              </div>

              <Link
                href="/admin/projects"
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>Manage All Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {overview.projects.map((proj: any) => (
                <div
                  key={proj.id}
                  className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-lg border border-blue-500/20">
                      {proj.project_code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${getStatusBadgeClass(
                        proj.status
                      )}`}
                    >
                      {proj.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-1">{proj.name}</h3>
                  <div className="text-xs text-slate-400">
                    Client: <strong className="text-slate-200">{proj.client?.company_name}</strong>
                  </div>

                  {/* Visual Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-mono font-bold text-slate-300 mb-1">
                      <span>Progress</span>
                      <span className="text-blue-400">{proj.progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${proj.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ============================================================= */}
          {/* 3. WHO IS WORKING ON WHAT */}
          {/* ============================================================= */}
          <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-amber-400" />
                  <span>Work Assignments & Live Status</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time synchronization between on-ground staff and management.
                </p>
              </div>

              <Link
                href="/admin/work"
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Full Work Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px]">
                    <th className="pb-3">Employee</th>
                    <th className="pb-3">Client</th>
                    <th className="pb-3">Project</th>
                    <th className="pb-3">Task</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Progress</th>
                    <th className="pb-3">Deadline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {tasks.slice(0, 6).map((task) => (
                    <tr key={task.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 font-bold text-white">
                        {task.assigned_employee?.profile?.full_name || 'Unassigned'}
                      </td>
                      <td className="py-3.5 text-slate-300">
                        {task.project?.client?.company_name || 'Commercial Client'}
                      </td>
                      <td className="py-3.5 text-slate-300 truncate max-w-xs">{task.project?.name}</td>
                      <td className="py-3.5 text-slate-400 truncate max-w-xs">{task.title}</td>
                      <td className="py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono font-bold text-blue-400">{task.progress}%</td>
                      <td className="py-3.5 text-slate-400">{formatDate(task.deadline)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ============================================================= */}
          {/* 4. PRODUCT USAGE & RECENT ACTIVITY DUAL GRID */}
          {/* ============================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Usage */}
            <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-400" />
                  <span>Materials & Product Consumptions ({overview.monthName})</span>
                </h3>
                <Link
                  href="/admin/products"
                  className="text-xs font-bold text-slate-400 hover:text-white"
                >
                  Inventory
                </Link>
              </div>

              <div className="space-y-3">
                {overview.productUsages.map((usage: any) => (
                  <div
                    key={usage.id}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{usage.product?.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Used in: <strong className="text-slate-300">{usage.project?.name}</strong>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-amber-400">
                        {usage.quantity} {usage.unit}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {formatCurrency(usage.quantity * usage.unit_cost)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit / Recent Activity Log */}
            <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Audit Trail & Activity Log</span>
                </h3>
                <Link
                  href="/admin/activity"
                  className="text-xs font-bold text-slate-400 hover:text-white"
                >
                  Full Log
                </Link>
              </div>

              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{log.actor_name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {formatDate(log.created_at)}
                      </span>
                    </div>
                    <div className="text-slate-300 text-[11px]">
                      Action: <span className="font-bold text-blue-400">{log.action}</span> on{' '}
                      <span className="font-bold text-amber-400">{log.entity_type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
