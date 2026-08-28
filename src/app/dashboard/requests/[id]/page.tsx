'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileQuickBar } from '@/components/layout/MobileQuickBar';
import { getServiceRequestById, getCompanySettings } from '@/lib/actions/db';
import { ServiceRequest, CompanySettings } from '@/types/database';
import { formatDate, formatDateTime, getStatusBadgeClass } from '@/lib/utils';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Phone,
  MessageSquare,
  FileText,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Activity,
} from 'lucide-react';

export default function CustomerRequestDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const data = await getServiceRequestById(id);
        const setts = await getCompanySettings().catch(() => null);
        setRequest(data);
        setSettings(setts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-xl font-bold text-slate-900">Request Not Found</h2>
          <p className="text-slate-500 text-sm mt-1">
            The service ticket you are looking for does not exist.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Return to Dashboard
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const cleanPhone = settings?.phone || '+92 300 4545280';
  const cleanWhatsApp = (settings?.whatsapp || '+923004545280').replace(/[^0-9]/g, '');

  const statusProgression = [
    'PENDING',
    'REVIEWING',
    'ACCEPTED',
    'ASSIGNED',
    'IN_PROGRESS',
    'COMPLETED',
  ];

  const currentStepIndex = statusProgression.indexOf(request.status);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Back link */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Dashboard
          </Link>

          {/* Ticket Header Card */}
          <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-black text-amber-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                  {request.request_id}
                </span>
                <span
                  className={`text-xs font-black px-3 py-1 rounded-xl border ${getStatusBadgeClass(
                    request.status
                  )}`}
                >
                  {request.status}
                </span>
              </div>
              <h1 className="text-2xl font-black mt-2">
                {request.service?.name || 'Custom Engineering Service'}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Submitted on {formatDateTime(request.created_at)}
              </p>
            </div>

            {/* Quick Hotline Actions */}
            <div className="flex items-center gap-2">
              <a
                href={`tel:${cleanPhone.replace(/\s+/g, '')}`}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>Call Hotline</span>
              </a>
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                  `Hello Fast Services, I am inquiring regarding my Request ID: ${request.request_id}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Desk</span>
              </a>
            </div>
          </div>

          {/* Real-Time Status Progression Bar */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Service Progress Workflow</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {statusProgression.map((st, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = request.status === st;

                return (
                  <div
                    key={st}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md font-bold'
                        : isPassed
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    <div className="text-[10px] font-mono mb-1">0{idx + 1}</div>
                    <div className="text-xs uppercase font-bold tracking-tight">{st}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Grid: Details & Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Request Scope & Location */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Work Requirements & Scope</span>
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {request.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>
                      <strong>Preferred Date:</strong> {formatDate(request.preferred_date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>
                      <strong>Time Slot:</strong> {request.preferred_time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location & GPS Map */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span>Site Address & Coordinates</span>
                </h3>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase">Site Location</div>
                    <div className="text-sm font-semibold text-slate-800 mt-0.5">
                      {request.location_address}
                    </div>
                    {request.latitude && request.longitude && (
                      <div className="text-xs text-slate-500 mt-1 font-mono">
                        GPS: {request.latitude.toFixed(5)}, {request.longitude.toFixed(5)}
                      </div>
                    )}
                  </div>

                  {request.latitude && request.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${request.latitude},${request.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors flex-shrink-0"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Uploaded Photos Gallery */}
              {request.images && request.images.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span>Uploaded Site Photos ({request.images.length})</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {request.images.map((img) => (
                      <div
                        key={img.id}
                        className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-36 relative group"
                      >
                        <img
                          src={img.image_url}
                          alt={img.file_name || 'Uploaded photo'}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a
                            href={img.image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-bold shadow"
                          >
                            View Full Size
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Status Log & Admin Notes */}
            <div className="space-y-6">
              {/* Admin Remarks */}
              {request.admin_notes && (
                <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 text-amber-900 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Engineering Desk Notes</span>
                  </div>
                  <p className="text-xs leading-relaxed font-medium">
                    {request.admin_notes}
                  </p>
                </div>
              )}

              {/* Audit / Timeline History */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Ticket Activity History
                </h3>

                <div className="space-y-4">
                  {(request.history || []).map((hist, idx) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-blue-500/30 pb-2">
                      <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-blue-600"></div>
                      <div className="text-xs font-bold text-slate-900">
                        {hist.status}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{hist.notes}</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {formatDateTime(hist.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileQuickBar />
    </div>
  );
}
