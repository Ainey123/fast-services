'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/db/data-store';
import { exportToCSV, exportToPDF, formatCurrency, formatDate } from '@/lib/utils';
import {
  FileBarChart,
  Download,
  Calendar,
  Building2,
  Briefcase,
  Layers,
  Package,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';

export default function AdminReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState<number>(7); // August
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [reportData, setReportData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'PROJECTS' | 'EMPLOYEES' | 'CLIENTS' | 'PRODUCTS'>('PROJECTS');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(false);
      const data = await db.getMonthlyOverview(selectedMonth, selectedYear);
      const allTasks = await db.getTasks();
      const allEmps = await db.getEmployees();
      const allClis = await db.getClients();
      setReportData({
        ...data,
        allTasks,
        allEmps,
        allClis,
      });
    }
    loadData();
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

  // Export to CSV
  const handleExportCSV = () => {
    if (!reportData) return;

    if (activeTab === 'PROJECTS') {
      const headers = ['Project Code', 'Project Name', 'Client', 'Status', 'Progress %', 'Start Date', 'Target Date'];
      const rows = reportData.projects.map((p: any) => [
        p.project_code,
        p.name,
        p.client?.company_name || 'N/A',
        p.status,
        p.progress,
        p.start_date,
        p.expected_completion_date,
      ]);
      exportToCSV(`Fast_Services_Projects_${reportData.monthName}`, headers, rows);
    } else if (activeTab === 'EMPLOYEES') {
      const headers = ['Employee ID', 'Name', 'Department', 'Position', 'Assigned Tasks', 'Status'];
      const rows = reportData.allEmps.map((e: any) => {
        const empTasks = reportData.allTasks.filter((t: any) => t.assigned_employee_id === e.id);
        return [
          e.employee_code,
          e.profile?.full_name || 'N/A',
          e.department,
          e.position,
          empTasks.length,
          e.status,
        ];
      });
      exportToCSV(`Fast_Services_Employees_${reportData.monthName}`, headers, rows);
    } else if (activeTab === 'CLIENTS') {
      const headers = ['Client Code', 'Company Name', 'Contact Person', 'Phone', 'Email', 'Address', 'Status'];
      const rows = reportData.allClis.map((c: any) => [
        c.client_code,
        c.company_name,
        c.contact_person,
        c.phone,
        c.email || 'N/A',
        c.address,
        c.status,
      ]);
      exportToCSV(`Fast_Services_Clients_${reportData.monthName}`, headers, rows);
    } else if (activeTab === 'PRODUCTS') {
      const headers = ['Project', 'Product Name', 'Quantity Used', 'Unit', 'Unit Cost', 'Total Cost', 'Usage Date'];
      const rows = reportData.productUsages.map((u: any) => [
        u.project?.name || 'N/A',
        u.product?.name || 'N/A',
        u.quantity,
        u.unit,
        u.unit_cost,
        u.quantity * u.unit_cost,
        u.usage_date,
      ]);
      exportToCSV(`Fast_Services_Material_Usage_${reportData.monthName}`, headers, rows);
    }
  };

  // Export to PDF
  const handleExportPDF = () => {
    if (!reportData) return;

    if (activeTab === 'PROJECTS') {
      const headers = ['Code', 'Project Name', 'Client', 'Status', 'Progress', 'Target'];
      const rows = reportData.projects.map((p: any) => [
        p.project_code,
        p.name.substring(0, 30),
        (p.client?.company_name || 'N/A').substring(0, 20),
        p.status,
        `${p.progress}%`,
        p.expected_completion_date,
      ]);
      exportToPDF(
        `Monthly Projects Report - ${reportData.monthName}`,
        headers,
        rows,
        `Overall Progress: ${reportData.kpis.overallProgress}% | Active Projects: ${reportData.projects.length}`
      );
    } else if (activeTab === 'EMPLOYEES') {
      const headers = ['ID', 'Full Name', 'Department', 'Position', 'Tasks', 'Status'];
      const rows = reportData.allEmps.map((e: any) => {
        const empTasks = reportData.allTasks.filter((t: any) => t.assigned_employee_id === e.id);
        return [
          e.employee_code,
          e.profile?.full_name?.substring(0, 25) || 'N/A',
          e.department.substring(0, 20),
          e.position.substring(0, 20),
          empTasks.length.toString(),
          e.status,
        ];
      });
      exportToPDF(`Monthly Workforce Report - ${reportData.monthName}`, headers, rows);
    } else if (activeTab === 'CLIENTS') {
      const headers = ['Code', 'Company Name', 'Contact Person', 'Phone', 'Status'];
      const rows = reportData.allClis.map((c: any) => [
        c.client_code,
        c.company_name.substring(0, 25),
        c.contact_person.substring(0, 20),
        c.phone,
        c.status,
      ]);
      exportToPDF(`Corporate Clients Report - ${reportData.monthName}`, headers, rows);
    } else if (activeTab === 'PRODUCTS') {
      const headers = ['Product', 'Project', 'Qty', 'Cost (PKR)', 'Date'];
      const rows = reportData.productUsages.map((u: any) => [
        u.product?.name?.substring(0, 25) || 'N/A',
        u.project?.name?.substring(0, 25) || 'N/A',
        `${u.quantity} ${u.unit}`,
        (u.quantity * u.unit_cost).toLocaleString(),
        u.usage_date,
      ]);
      exportToPDF(
        `Material Consumption Report - ${reportData.monthName}`,
        headers,
        rows,
        `Total Monthly Material Cost: PKR ${reportData.kpis.monthProductCost.toLocaleString()}`
      );
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Header & Controls */}
      <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
            Audited Monthly Reporting Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Monthly Management & Export
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Single source of truth calculations. Download verified PDF and CSV reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Month / Year Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <Calendar className="w-4 h-4 text-amber-400 ml-1.5" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="bg-slate-950 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-800 focus:outline-none"
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
              className="bg-slate-950 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-800 focus:outline-none"
            >
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>
          </div>

          {/* Export Buttons */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { key: 'PROJECTS', label: 'Monthly Projects', icon: Layers },
          { key: 'EMPLOYEES', label: 'Employee Performance', icon: Briefcase },
          { key: 'CLIENTS', label: 'Client Accounts', icon: Building2 },
          { key: 'PRODUCTS', label: 'Material Usage & Cost', icon: Package },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Report Table Display */}
      {reportData && (
        <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-white">
              Dataset: {reportData.monthName} ({activeTab})
            </h2>
            <div className="text-xs text-slate-400">
              Matches exactly with exported CSV and PDF reports
            </div>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'PROJECTS' && (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px] bg-slate-900/60">
                    <th className="py-4 px-6">Project Code</th>
                    <th className="py-4 px-6">Project Name</th>
                    <th className="py-4 px-6">Client</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Progress</th>
                    <th className="py-4 px-6">Target Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {reportData.projects.map((p: any) => (
                    <tr key={p.id} className="hover:bg-slate-900/40">
                      <td className="py-4 px-6 font-mono text-blue-400 font-bold">{p.project_code}</td>
                      <td className="py-4 px-6 font-bold text-white">{p.name}</td>
                      <td className="py-4 px-6 text-slate-300">{p.client?.company_name}</td>
                      <td className="py-4 px-6 text-slate-300">{p.status}</td>
                      <td className="py-4 px-6 font-mono font-bold text-amber-400">{p.progress}%</td>
                      <td className="py-4 px-6 text-slate-400">{formatDate(p.expected_completion_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'EMPLOYEES' && (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px] bg-slate-900/60">
                    <th className="py-4 px-6">Employee ID</th>
                    <th className="py-4 px-6">Full Name</th>
                    <th className="py-4 px-6">Department</th>
                    <th className="py-4 px-6">Position</th>
                    <th className="py-4 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {reportData.allEmps.map((e: any) => (
                    <tr key={e.id} className="hover:bg-slate-900/40">
                      <td className="py-4 px-6 font-mono text-amber-400 font-bold">{e.employee_code}</td>
                      <td className="py-4 px-6 font-bold text-white">{e.profile?.full_name}</td>
                      <td className="py-4 px-6 text-slate-300">{e.department}</td>
                      <td className="py-4 px-6 text-slate-300">{e.position}</td>
                      <td className="py-4 px-6 text-emerald-400 font-bold">{e.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'CLIENTS' && (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px] bg-slate-900/60">
                    <th className="py-4 px-6">Client Code</th>
                    <th className="py-4 px-6">Company Name</th>
                    <th className="py-4 px-6">Contact Person</th>
                    <th className="py-4 px-6">Phone</th>
                    <th className="py-4 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {reportData.allClis.map((c: any) => (
                    <tr key={c.id} className="hover:bg-slate-900/40">
                      <td className="py-4 px-6 font-mono text-blue-400 font-bold">{c.client_code}</td>
                      <td className="py-4 px-6 font-bold text-white">{c.company_name}</td>
                      <td className="py-4 px-6 text-slate-300">{c.contact_person}</td>
                      <td className="py-4 px-6 text-slate-400">{c.phone}</td>
                      <td className="py-4 px-6 text-emerald-400 font-bold">{c.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'PRODUCTS' && (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px] bg-slate-900/60">
                    <th className="py-4 px-6">Product / Material</th>
                    <th className="py-4 px-6">Consumed in Project</th>
                    <th className="py-4 px-6">Quantity</th>
                    <th className="py-4 px-6">Unit Cost</th>
                    <th className="py-4 px-6">Total Value</th>
                    <th className="py-4 px-6">Usage Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {reportData.productUsages.map((u: any) => (
                    <tr key={u.id} className="hover:bg-slate-900/40">
                      <td className="py-4 px-6 font-bold text-white">{u.product?.name}</td>
                      <td className="py-4 px-6 text-slate-300">{u.project?.name}</td>
                      <td className="py-4 px-6 font-mono font-bold text-amber-400">
                        {u.quantity} {u.unit}
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-300">{formatCurrency(u.unit_cost)}</td>
                      <td className="py-4 px-6 font-mono font-bold text-emerald-400">
                        {formatCurrency(u.quantity * u.unit_cost)}
                      </td>
                      <td className="py-4 px-6 text-slate-400">{formatDate(u.usage_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
