'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileQuickBar } from '@/components/layout/MobileQuickBar';
import { db } from '@/lib/db/data-store';
import { ServiceRequest, RequestStatus } from '@/types/database';
import { useAuth } from '@/lib/auth-context';
import { formatDate, formatDateTime, getStatusBadgeClass } from '@/lib/utils';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  MapPin,
  Calendar,
  ChevronRight,
  Eye,
  Activity,
  Layers,
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRequests() {
      // In customer dashboard, show customer's requests
      const all = await db.getServiceRequests();
      if (user?.email) {
        // Match user's requests or show all for demo if user has none
        const userSpecific = all.filter(
          (r) => r.customer_email.toLowerCase() === user.email.toLowerCase() || r.user_id === user.id
        );
        setRequests(userSpecific.length > 0 ? userSpecific : all);
      } else {
        setRequests(all);
      }
      setLoading(false);
    }
    loadRequests();
  }, [user]);

  const statusCounts = {
    ALL: requests.length,
    PENDING: requests.filter((r) => r.status === 'PENDING').length,
    REVIEWING: requests.filter((r) => r.status === 'REVIEWING').length,
    ACCEPTED: requests.filter((r) => r.status === 'ACCEPTED').length,
    ASSIGNED: requests.filter((r) => r.status === 'ASSIGNED').length,
    IN_PROGRESS: requests.filter((r) => r.status === 'IN_PROGRESS').length,
    COMPLETED: requests.filter((r) => r.status === 'COMPLETED').length,
    CANCELLED: requests.filter((r) => r.status === 'CANCELLED').length,
  };

  const filteredRequests = requests.filter((r) => {
    if (selectedStatus === 'ALL') return true;
    return r.status === selectedStatus;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Dashboard Header */}
          <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Customer Service Center
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">
                Welcome, {user?.full_name || 'Valued Client'}
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Real-time tracking for your engineering service requests and site dispatches.
              </p>
            </div>

            <Link
              href="/request"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book New Service</span>
            </Link>
          </div>

          {/* Status Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: 'All Requests', key: 'ALL', count: statusCounts.ALL, color: 'text-slate-900' },
              { label: 'Pending', key: 'PENDING', count: statusCounts.PENDING, color: 'text-amber-600' },
              { label: 'Reviewing', key: 'REVIEWING', count: statusCounts.REVIEWING, color: 'text-purple-600' },
              { label: 'Accepted', key: 'ACCEPTED', count: statusCounts.ACCEPTED, color: 'text-blue-600' },
              { label: 'In Progress', key: 'IN_PROGRESS', count: statusCounts.IN_PROGRESS, color: 'text-indigo-600' },
              { label: 'Completed', key: 'COMPLETED', count: statusCounts.COMPLETED, color: 'text-emerald-600' },
              { label: 'Cancelled', key: 'CANCELLED', count: statusCounts.CANCELLED, color: 'text-rose-600' },
            ].map((stat) => (
              <button
                key={stat.key}
                onClick={() => setSelectedStatus(stat.key)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedStatus === stat.key
                    ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-600/20'
                    : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">
                  {stat.label}
                </div>
                <div className={`text-2xl font-black mt-1 ${stat.color}`}>
                  {stat.count}
                </div>
              </button>
            ))}
          </div>

          {/* Requests List Table / Cards */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Service Requests ({filteredRequests.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Filtered by status: <strong className="text-slate-700">{selectedStatus}</strong>
                </p>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-xs text-slate-500 mt-2">Loading requests...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Layers className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No requests found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You do not have any requests in &ldquo;{selectedStatus}&rdquo; status.
                </p>
                <Link
                  href="/request"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Book a Service
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 sm:p-6 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                          {req.request_id}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${getStatusBadgeClass(
                            req.status
                          )}`}
                        >
                          {req.status}
                        </span>
                        <span className="text-xs text-slate-400">
                          Submitted {formatDate(req.created_at)}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">
                        {req.service?.name || 'Custom Engineering Request'}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2">
                        {req.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Preferred: {formatDate(req.preferred_date)} ({req.preferred_time})
                        </span>
                        <span className="flex items-center gap-1 truncate max-w-xs">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {req.location_address}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link
                        href={`/dashboard/requests/${req.id}`}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-800 text-xs font-bold transition-all w-full sm:w-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Ticket Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <MobileQuickBar />
    </div>
  );
}
