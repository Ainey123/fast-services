'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/db/data-store';
import { Employee, UserRole } from '@/types/database';
import { formatDate, getStatusBadgeClass } from '@/lib/utils';
import {
  Briefcase,
  Plus,
  Key,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Phone,
  Mail,
  Calendar,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Electrical Engineering');
  const [position, setPosition] = useState('Site Engineer');
  const [role, setRole] = useState<UserRole>('EMPLOYEE');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const list = await db.getEmployees();
    setEmployees(list);
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await db.createEmployee({
        full_name: fullName,
        email,
        phone,
        department,
        position,
        role,
        joining_date: joiningDate,
      });

      setFeedback({
        type: 'success',
        msg: `Employee account created for ${fullName}. Role: ${role}. Credentials dispatched securely.`,
      });
      setShowAddModal(false);
      setFullName('');
      setEmail('');
      setPhone('');
      await loadEmployees();
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Failed to create employee profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, name: string, currentStatus: string) => {
    const action = currentStatus === 'ACTIVE' ? 'deactivate' : 'activate';
    if (confirm(`Are you sure you want to ${action} ${name}? Historical records and past projects will remain intact.`)) {
      await db.deactivateEmployee(id);
      setFeedback({
        type: 'success',
        msg: `Employee ${name} has been ${action}d. Account status updated.`,
      });
      await loadEmployees();
    }
  };

  const handleResetPassword = async (id: string, name: string) => {
    const res = await db.resetEmployeePassword(id);
    setFeedback({
      type: 'success',
      msg: `Password reset dispatched for ${name}. Passwords are never revealed in plain text.`,
    });
  };

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Workforce & Authorization Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Employee & Staff Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage engineering personnel, roles (ADMIN, MANAGER, EMPLOYEE), and account status.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Employee</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between animate-in slide-in-from-top-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/60 border-rose-800 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{feedback.msg}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Employees Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px] bg-slate-900/60">
                <th className="py-4 px-6">Employee ID & Name</th>
                <th className="py-4 px-6">Department & Position</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Contact Details</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Account Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center border border-blue-500/30">
                        {emp.profile?.full_name?.charAt(0) || 'E'}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">
                          {emp.profile?.full_name}
                        </div>
                        <div className="font-mono text-[10px] text-blue-400">
                          {emp.employee_code}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="text-white font-medium">{emp.position}</div>
                    <div className="text-[11px] text-slate-400">{emp.department}</div>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${
                        emp.profile?.role === 'ADMIN'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : emp.profile?.role === 'MANAGER'
                          ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                          : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                      }`}
                    >
                      {emp.profile?.role || 'EMPLOYEE'}
                    </span>
                  </td>

                  <td className="py-4 px-6 space-y-1">
                    <div className="text-slate-300">{emp.profile?.email}</div>
                    <div className="text-[11px] text-slate-500">{emp.profile?.phone}</div>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${getStatusBadgeClass(
                        emp.status
                      )}`}
                    >
                      {emp.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right space-x-2">
                    {/* Password Reset Trigger */}
                    <button
                      onClick={() => handleResetPassword(emp.id, emp.profile?.full_name || 'Staff')}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-semibold border border-slate-700 transition-colors inline-flex items-center gap-1"
                      title="Trigger Password Reset"
                    >
                      <Key className="w-3 h-3 text-amber-400" />
                      <span>Reset Password</span>
                    </button>

                    {/* Soft Deactivation / Activation */}
                    <button
                      onClick={() =>
                        handleToggleStatus(
                          emp.id,
                          emp.profile?.full_name || 'Staff',
                          emp.status
                        )
                      }
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors inline-flex items-center gap-1 ${
                        emp.status === 'ACTIVE'
                          ? 'bg-rose-950/40 text-rose-300 border-rose-800 hover:bg-rose-900'
                          : 'bg-emerald-950/40 text-emerald-300 border-emerald-800 hover:bg-emerald-900'
                      }`}
                    >
                      {emp.status === 'ACTIVE' ? (
                        <>
                          <UserX className="w-3 h-3 text-rose-400" />
                          <span>Deactivate</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3 h-3 text-emerald-400" />
                          <span>Activate</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <span>Create Staff / Employee Account</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Engr. Usman Tariq"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="name@fastengineering.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="+92 300 1234567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical & HVAC">Mechanical & HVAC</option>
                    <option value="Solar & Renewable">Solar & Renewable</option>
                    <option value="Automation & Security">Automation & Security</option>
                    <option value="Civil & Plumbing">Civil & Plumbing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Position Title
                  </label>
                  <input
                    type="text"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. Senior Site Engineer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Access Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="EMPLOYEE">EMPLOYEE (Standard Staff)</option>
                    <option value="MANAGER">MANAGER (Project Supervisor)</option>
                    <option value="ADMIN">ADMIN (Full Control)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-900/60 text-[11px] text-blue-300">
                <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-blue-400" />
                Passwords are managed securely through hashed authentication. No plain-text passwords stored.
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md"
                >
                  {loading ? 'Creating...' : 'Create Employee Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
