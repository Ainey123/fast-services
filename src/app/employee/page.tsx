'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileQuickBar } from '@/components/layout/MobileQuickBar';
import { useAuth } from '@/lib/auth-context';
import { getTasks, getProjects, updateTaskProgress } from '@/lib/actions/db';
import { Task, Project, Client, TaskStatus } from '@/types/database';
import { formatDate, getStatusBadgeClass } from '@/lib/utils';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  ListTodo,
  TrendingUp,
  Layers,
  Save,
  User,
  RefreshCw,
} from 'lucide-react';

export default function EmployeeDashboardPage() {
  const router = useRouter();
  const { user, role } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [editProgress, setEditProgress] = useState<Record<string, number>>({});
  const [editStatus, setEditStatus] = useState<Record<string, TaskStatus>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadEmployeeWork = async () => {
    setLoading(true);
    setError(null);
    try {
      const allTasks = user?.id ? await getTasks(undefined, user.id) : await getTasks();
      const empTasks = allTasks.length > 0 ? allTasks : await getTasks();
      setTasks(empTasks);

      const allProjects = await getProjects();
      setProjects(allProjects.slice(0, 4));

      const initialProgress: Record<string, number> = {};
      const initialStatus: Record<string, TaskStatus> = {};
      empTasks.forEach((t) => {
        initialProgress[t.id] = t.progress;
        initialStatus[t.id] = t.status;
      });
      setEditProgress(initialProgress);
      setEditStatus(initialStatus);
    } catch (err: any) {
      console.error(err);
      setError('Unable to load employee tasks from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployeeWork();
  }, [user]);

  const handleUpdateProgress = async (taskId: string) => {
    setUpdatingTaskId(taskId);
    setSuccessMessage(null);
    const progressVal = editProgress[taskId] ?? 0;
    const statusVal = editStatus[taskId] ?? 'IN_PROGRESS';

    try {
      await updateTaskProgress(
        taskId,
        progressVal,
        statusVal,
        user?.full_name || 'Assigned Engineer'
      );
      // Reload updated tasks
      const updatedList = await getTasks();
      setTasks(updatedList.filter((t) => tasks.some((existing) => existing.id === t.id) || !user?.id));
      setSuccessMessage(`Task progress updated to ${progressVal}% (${statusVal}) in PostgreSQL. Project progress updated.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (e: any) {
      alert(e.message || 'Error updating task progress in database.');
    } finally {
      setUpdatingTaskId(null);
    }
  };


  const pendingCount = tasks.filter((t) => t.status === 'PENDING').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Banner */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Briefcase className="w-3.5 h-3.5" /> Staff Engineering Desk
              </div>
              <h1 className="text-2xl sm:text-3xl font-black">
                {user?.full_name || 'Engr. Usman Tariq'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Department: <strong>Electrical & Solar Systems</strong> | Role: <span className="text-amber-400 font-bold">{user?.role || 'EMPLOYEE'}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              {role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
                >
                  Switch to Admin Hub
                </Link>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase">Assigned Tasks</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{tasks.length}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-amber-600 uppercase">Pending / In Queue</div>
              <div className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-blue-600 uppercase">In Progress</div>
              <div className="text-2xl font-black text-blue-600 mt-1">{inProgressCount}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-emerald-600 uppercase">Completed</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">{completedCount}</div>
            </div>
          </div>

          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Active Assigned Projects */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>My Active Projects ({projects.length})</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                      {proj.project_code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${getStatusBadgeClass(proj.status)}`}>
                      {proj.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                    {proj.name}
                  </h3>

                  <p className="text-xs text-slate-500">
                    Client: <strong className="text-slate-800">{proj.client?.company_name || 'Commercial Client'}</strong>
                  </p>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Project Progress</span>
                      <span>{proj.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${proj.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200/80">
                    Expected Target: {formatDate(proj.expected_completion_date)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Tasks & Interactive Progress Updater */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-blue-600" />
                  <span>My Assigned Tasks & Progress Control</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your completion percentage and status. Admin and clients see real-time updates.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {tasks.map((task) => (
                <div key={task.id} className="p-6 hover:bg-slate-50/60 transition-colors space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {task.task_code}
                        </span>
                        <h3 className="text-base font-bold text-slate-900">{task.title}</h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                    </div>

                    <div className="text-xs text-slate-500 flex-shrink-0">
                      Deadline: <strong className="text-slate-800">{formatDate(task.deadline)}</strong>
                    </div>
                  </div>

                  {/* Interactive Progress Controller */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    {/* Status selector */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Task Status
                      </label>
                      <select
                        value={editStatus[task.id] || task.status}
                        onChange={(e) =>
                          setEditStatus({
                            ...editStatus,
                            [task.id]: e.target.value as TaskStatus,
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="BLOCKED">BLOCKED</option>
                      </select>
                    </div>

                    {/* Progress Slider (0% - 100%) */}
                    <div className="md:col-span-2 space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Completion Progress</span>
                        <span className="text-blue-600">{editProgress[task.id] ?? task.progress}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={editProgress[task.id] ?? task.progress}
                        onChange={(e) =>
                          setEditProgress({
                            ...editProgress,
                            [task.id]: parseInt(e.target.value),
                          })
                        }
                        className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleUpdateProgress(task.id)}
                        disabled={updatingTaskId === task.id}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{updatingTaskId === task.id ? 'Syncing...' : 'Save Progress'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileQuickBar />
    </div>
  );
}
