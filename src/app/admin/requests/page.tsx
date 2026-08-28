'use client';

import React, { useState, useEffect } from 'react';
import {
  getServiceRequests,
  updateServiceRequestStatus,
  deleteServiceRequest,
} from '@/lib/actions/db';
import { ServiceRequest, RequestStatus } from '@/types/database';
import { formatDate, formatDateTime, getStatusBadgeClass } from '@/lib/utils';
import {
  Wrench,
  Search,
  Filter,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  ExternalLink,
  Save,
  CheckCircle2,
  Calendar,
  Image as ImageIcon,
  AlertCircle,
  RefreshCw,
  Trash2,
} from 'lucide-react';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [editStatus, setEditStatus] = useState<RequestStatus>('PENDING');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setError(null);
    try {
      const list = await getServiceRequests();
      setRequests(list);
      if (list.length > 0 && !selectedRequest) {
        setSelectedRequest(list[0]);
        setEditStatus(list[0].status);
        setEditNotes(list[0].admin_notes || '');
      }
    } catch (err: any) {
      console.error(err);
      setError('Unable to load service requests from database.');
    }
  };

  const handleSelectRequest = (req: ServiceRequest) => {
    setSelectedRequest(req);
    setEditStatus(req.status);
    setEditNotes(req.admin_notes || '');
  };

  const handleSaveStatus = async () => {
    if (!selectedRequest) return;
    setSaving(true);
    try {
      await updateServiceRequestStatus(
        selectedRequest.id,
        editStatus,
        editNotes,
        undefined,
        'Admin'
      );
      setSuccessMsg(`Status updated to ${editStatus} for ticket ${selectedRequest.request_id} in Neon PostgreSQL.`);
      setTimeout(() => setSuccessMsg(null), 4000);
      await loadRequests();
    } catch (e: any) {
      alert(e.message || 'Error updating status in database.');
    } finally {
      setSaving(false);
    }
  };


  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.request_id.toLowerCase().includes(search.toLowerCase()) ||
      r.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      r.customer_phone.includes(search) ||
      r.service?.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
          Customer Service Dispatch
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
          Service Requests & Dispatch Pipeline
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Inspect customer submissions, GPS coordinates, uploaded site photos, and advance ticket statuses.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid: Ticket List + Ticket Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tickets List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search request ID, customer, phone..."
              className="bg-transparent text-white text-xs w-full focus:outline-none placeholder:text-slate-600"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['ALL', 'PENDING', 'REVIEWING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {error ? (
            <div className="p-6 text-center bg-rose-950/40 rounded-2xl border border-rose-800 text-xs text-rose-300 space-y-2">
              <p>{error}</p>
              <button
                onClick={loadRequests}
                className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-500">
              {requests.length === 0
                ? 'No service requests found in database.'
                : 'No requests match the search/filter criteria.'}
            </div>
          ) : (
            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => handleSelectRequest(req)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    selectedRequest?.id === req.id
                      ? 'bg-slate-900 border-blue-500 shadow-md ring-1 ring-blue-500/30'
                      : 'bg-slate-950 border-slate-800/80 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-amber-400">
                      {req.request_id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadgeClass(
                        req.status
                      )}`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="font-bold text-white text-xs truncate">
                    {req.customer_name}
                  </div>

                  <div className="text-[11px] text-slate-400 truncate">
                    {req.service?.name}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                    <span>Target: {formatDate(req.preferred_date)}</span>
                    <span>{formatDate(req.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Ticket Dossier & Status Controller */}
        <div className="lg:col-span-7">
          {selectedRequest ? (
            <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl sticky top-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black text-amber-400">
                      {selectedRequest.request_id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${getStatusBadgeClass(
                        selectedRequest.status
                      )}`}
                    >
                      {selectedRequest.status}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1">
                    {selectedRequest.service?.name}
                  </h2>
                </div>

                <div className="text-[11px] text-slate-400">
                  Logged: {formatDateTime(selectedRequest.created_at)}
                </div>
              </div>

              {/* Customer Contact & Quick Action */}
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                <div className="text-xs font-bold uppercase text-slate-400">Customer Dossier</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Full Name / Org:</span>
                    <div className="font-bold text-white">{selectedRequest.customer_name}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Phone:</span>
                    <div className="font-bold text-blue-400">{selectedRequest.customer_phone}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Email:</span>
                    <div className="font-bold text-slate-300">{selectedRequest.customer_email}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Preferred Schedule:</span>
                    <div className="font-bold text-amber-400">
                      {formatDate(selectedRequest.preferred_date)} ({selectedRequest.preferred_time})
                    </div>
                  </div>
                </div>

                {/* Direct Communications Triggers */}
                <div className="pt-2 flex flex-wrap gap-2 border-t border-slate-800">
                  <a
                    href={`tel:${selectedRequest.customer_phone.replace(/\s+/g, '')}`}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold inline-flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Customer</span>
                  </a>

                  <a
                    href={`https://wa.me/${selectedRequest.customer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${selectedRequest.customer_name}, regarding your Fast Services Request ID: ${selectedRequest.request_id}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold inline-flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`mailto:${selectedRequest.customer_email}?subject=Update%20on%20Request%20${selectedRequest.request_id}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold inline-flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </a>
                </div>
              </div>

              {/* Work Scope & Location */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 font-bold uppercase block mb-1">
                    Job Requirements
                  </span>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 leading-relaxed">
                    {selectedRequest.description}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 font-bold uppercase block mb-1">
                    Job Location & Coordinates
                  </span>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{selectedRequest.location_address}</div>
                      {selectedRequest.latitude && selectedRequest.longitude && (
                        <div className="text-[10px] text-blue-400 font-mono mt-0.5">
                          GPS: {selectedRequest.latitude.toFixed(5)}, {selectedRequest.longitude.toFixed(5)}
                        </div>
                      )}
                    </div>

                    {selectedRequest.latitude && selectedRequest.longitude && (
                      <a
                        href={`https://www.google.com/maps?q=${selectedRequest.latitude},${selectedRequest.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-slate-800 text-blue-400 hover:text-white"
                        title="Open in Maps"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Uploaded Site Photos */}
                {selectedRequest.images && selectedRequest.images.length > 0 && (
                  <div>
                    <span className="text-slate-500 font-bold uppercase block mb-1">
                      Uploaded Customer Photos ({selectedRequest.images.length})
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedRequest.images.map((img) => (
                        <div
                          key={img.id}
                          className="h-20 rounded-xl overflow-hidden border border-slate-800 relative group bg-slate-900"
                        >
                          <img
                            src={img.image_url}
                            alt="Site photo"
                            className="w-full h-full object-cover"
                          />
                          <a
                            href={img.image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold"
                          >
                            Enlarge
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status & Notes Management */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Update Ticket Status & Notes
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      New Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as RequestStatus)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="REVIEWING">REVIEWING</option>
                      <option value="ACCEPTED">ACCEPTED</option>
                      <option value="ASSIGNED">ASSIGNED</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Engineering Internal Notes
                    </label>
                    <input
                      type="text"
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="e.g. Assigned to Engr. Ali. Site kit dispatched."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveStatus}
                    disabled={saving}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? 'Synchronizing...' : 'Save & Publish Status Update'}</span>
                  </button>

                  <button
                    onClick={async () => {
                      if (window.confirm(`Permanently delete ticket ${selectedRequest.request_id}?`)) {
                        try {
                          await deleteServiceRequest(selectedRequest.id);
                          setSelectedRequest(null);
                          await loadRequests();
                        } catch {
                          alert('Failed to delete service request from database.');
                        }
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 text-xs font-bold transition-all"
                    title="Delete Request"
                  >
                    Delete Ticket
                  </button>

                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950 rounded-3xl border border-slate-800 p-12 text-center text-slate-500 text-xs">
              Select a request ticket to inspect details and manage status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
