'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileQuickBar } from '@/components/layout/MobileQuickBar';
import { getServiceBySlug, getCompanySettings } from '@/lib/actions/db';
import { Service, CompanySettings } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import {
  Phone,
  MessageSquare,
  Mail,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowLeft,
  Wrench,
  Sparkles,
  Calendar,
} from 'lucide-react';

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [service, setService] = useState<Service | null>(null);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        const [srv, setts] = await Promise.all([
          getServiceBySlug(slug),
          getCompanySettings().catch(() => null),
        ]);
        setService(srv);
        setSettings(setts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);


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

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Service Not Found</h2>
          <p className="text-slate-600 mt-2">The requested engineering service could not be located.</p>
          <Link href="/services" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">
            Back to Services
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const cleanPhone = settings?.phone || '+92 300 4545280';
  const cleanWhatsApp = (settings?.whatsapp || '+923004545280').replace(/[^0-9]/g, '');
  const companyEmail = settings?.email || 'fastsales.services@gmail.com';

  const emailSubject = `Service Inquiry - ${service.name}`;
  const emailBody = `Hello Fast Services,\n\nI would like to inquire about your ${service.name} service.\n\nThank you.`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Navigation Breadcrumb */}
        <div className="bg-slate-900 text-slate-300 py-4 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs">
            <Link href="/services" className="hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Services
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-blue-400 font-semibold">{service.category}</span>
            <span className="text-slate-600">/</span>
            <span className="text-white truncate max-w-xs">{service.name}</span>
          </div>
        </div>

        {/* Hero Details Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left 2 Columns: Main Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Category */}
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
                  {service.category}
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                  {service.name}
                </h1>
                <p className="mt-3 text-lg text-slate-600">
                  {service.short_description}
                </p>
              </div>

              {/* Large Service Image */}
              <div className="rounded-3xl overflow-hidden shadow-md border border-slate-200 bg-slate-100 h-80 sm:h-96 w-full relative">
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* In-depth Engineering Scope & Description */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-blue-600" />
                  <span>Engineering Scope & Technical Overview</span>
                </h2>
                <p className="text-slate-700 leading-relaxed text-base whitespace-pre-line">
                  {service.description}
                </p>
              </div>

              {/* Technical Features & Capabilities */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Included Deliverables & Quality Standards</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features &&
                    service.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80"
                      >
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-slate-800">{feat}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Right Column: Direct Action Box */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg sticky top-24">
                {/* Price Estimate */}
                {service.price_starting_at ? (
                  <div className="pb-6 border-b border-slate-100">
                    <span className="text-xs text-slate-500 uppercase font-bold">Starting Price</span>
                    <div className="text-3xl font-black text-slate-900 mt-1">
                      {formatCurrency(service.price_starting_at)}
                    </div>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      Custom quotation based on site assessment
                    </span>
                  </div>
                ) : null}

                {/* Service Availability Badge */}
                <div className="my-6 flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Available for immediate dispatch & scheduled booking</span>
                </div>

                {/* Direct Action Triggers */}
                <div className="space-y-3">
                  {/* Request Service Form CTA */}
                  <Link
                    href={`/request?service=${service.id}`}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Request Service Online</span>
                  </Link>

                  {/* Direct Call Now */}
                  <a
                    href={`tel:${cleanPhone.replace(/\s+/g, '')}`}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all"
                  >
                    <Phone className="w-4 h-4 text-blue-400" />
                    <span>Call Now ({cleanPhone})</span>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                      `Hello Fast Services, I would like to inquire about ${service.name}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Inquire via WhatsApp</span>
                  </a>

                  {/* Email Us */}
                  <a
                    href={`mailto:${companyEmail}?subject=${encodeURIComponent(
                      emailSubject
                    )}&body=${encodeURIComponent(emailBody)}`}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 font-bold text-sm transition-colors"
                  >
                    <Mail className="w-4 h-4 text-amber-600" />
                    <span>Email Official Desk</span>
                  </a>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 inline text-blue-600 mr-1" />
                  100% Guaranteed Workmanship by Fast Engineering Solutions
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
