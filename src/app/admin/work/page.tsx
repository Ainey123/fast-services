'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/db/data-store';
import { Task, Employee, Project, Client, TaskStatus } from '@/types/database';
import { formatDate, getStatusBadgeClass } from '@/lib/utils';
import {
  ListTodo,
  Plus,
  Search,
  Filter,
  User,
  Building2,
  Calendar,
  X,
  CheckCircle2,
} from 'lucide-react';

export default function AdminWorkPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  // Filters
  const [selectedEmployee, setSelectedEmployee] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assignedEmployeeId, setAssignedEmployeeId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const tsks = await db.getTasks();
    const emps = await db.getEmployees();
    const prjs = await db.getProjects();
    const clis = await db.getClients();
    setTasks(tsks);
    setEmployees(emps);
    setProjects(prjs);
    setClients(clis);

    if (prjs.length > 0) setProjectId(prjs[0].id);
    if (emps.length > 0) setAssignedEmployeeId(emps[0].id);
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setDeadline(d.toISOString().split('T')[0]);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await db.createTask({
        title,
        description,
        project_id: projectId,
        assigned_employee_id: assignedEmployeeId,
        status: 'PENDING',
        progress: 0,
        deadline,
      });

      setShowAddModal(false);
      setTitle('');
      setDescription('');
      await loadAll();
    } catch (err) {
      alert('Error creating task');
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesEmp = selectedEmployee === 'ALL' || t.assigned_employee_id === selectedEmployee;
    const matchesPrj = selectedProject === 'ALL' || t.project_id === selectedProject;
    const matchesSt = selectedStatus === 'ALL' || t.status === selectedStatus;
    return matchesEmp && matchesPrj && matchesSt;
  });

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Workforce Allocation Matrix
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Who Is Working On What
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live tracker mapping individual engineers to active clients, projects, and specific task deliverables.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Assign New Task</span>
        </button>
      </div>

      {/* Dynamic Multi-Filters Bar */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
            Filter by Employee
          </label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl border border-slate-800 focus:outline-none"
          >
            <option value="ALL">All Employees</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.profile?.full_name} ({e.department})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
            Filter by Project
          </label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl border border-slate-800 focus:outline-none"
          >
            <option value="ALL">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.project_code} - {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
            Filter by Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl border border-slate-800 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>
        </div>
      </div>

      {/* Master Work Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px] bg-slate-900/60">
                <th className="py-4 px-6">Assigned Employee</th>
                <th className="py-4 px-6">Client</th>
                <th className="py-4 px-6">Project Title</th>
                <th className="py-4 px-6">Specific Task</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Progress %</th>
                <th className="py-4 px-6">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-white">
                      {task.assigned_employee?.profile?.full_name || 'Unassigned'}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {task.assigned_employee?.position}
                    </div>
                  </td>

                  <td className="py-4 px-6 text-slate-300 font-medium">
                    {task.project?.client?.company_name || 'Institutional Client'}
                  </td>

                  <td className="py-4 px-6 text-slate-200">
                    <div className="font-semibold">{task.project?.name}</div>
                    <div className="font-mono text-[10px] text-blue-400">
                      {task.project?.project_code}
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="text-white font-medium">{task.title}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{task.description}</div>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${getStatusBadgeClass(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-400">{task.progress}%</span>
                      <div className="w-16 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-slate-400 font-mono">
                    {formatDate(task.deadline)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-amber-400" />
                <span>Assign New Work Task</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. DC Cable Stringing & Combiner Box Terminations"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Parent Project
                </label>
                <select
                  required
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.project_code} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Assign to Employee
                </label>
                <select
                  required
                  value={assignedEmployeeId}
                  onChange={(e) => setAssignedEmployeeId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.profile?.full_name} ({e.department} - {e.position})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Deadline Date
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Task Specifications
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Testing guidelines, tool prerequisites..."
                ></textarea>
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
                  {loading ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
