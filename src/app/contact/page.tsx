'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileQuickBar } from '@/components/layout/MobileQuickBar';
import { db } from '@/lib/db/data-store';
import { CompanySettings } from '@/types/database';
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  Send,
  Building2,
} from 'lucide-react';

export default function ContactPage() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    db.getCompanySettings().then(setSettings);
  }, []);

  const cleanPhone = settings?.phone || '+92 300 4545280';
  const cleanWhatsApp = (settings?.whatsapp || '+923004545280').replace(/[^0-9]/g, '');
  const companyEmail = settings?.email || 'fastsales.services@gmail.com';

  const emailSubject = 'Service Inquiry - Fast Services';
  const emailBody = `Hello Fast Services,\n\nI would like to inquire about your construction and engineering services.\n\nThank you.`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* Banner */}
        <section className="bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Building2 className="w-3.5 h-3.5" /> General Contractor & Construction Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl font-black">
              Contact Fast Engineering Solutions
            </h1>
            <p className="text-slate-400 mt-2 max-w-2xl text-sm sm:text-base">
              Founded in 2012, Fast Engineering Solutions operates as a versatile general contractor delivering end-to-end construction solutions throughout Pakistan.
            </p>
          </div>
        </section>

        {/* Contact Matrix */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 1. Direct Phone Call */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-blue-300 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Direct Phone Hotline</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Connect directly with our 24/7 technical desk and engineering dispatch unit.
                </p>
                <div className="mt-6 text-xl font-black text-slate-900">
                  {cleanPhone}
                </div>
              </div>

              <a
                href={`tel:${cleanPhone.replace(/\s+/g, '')}`}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Call: {cleanPhone}</span>
              </a>
            </div>

            {/* 2. Official WhatsApp */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-emerald-300 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Official WhatsApp</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Send project site details, photos, and requirements for immediate quotation.
                </p>
                <div className="mt-6 text-xl font-black text-emerald-700">
                  {settings?.whatsapp || cleanPhone}
                </div>
              </div>

              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                  'Hello Fast Services, I would like to know more about your services.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Us (Direct Chat)</span>
              </a>
            </div>

            {/* 3. Official Email */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-amber-300 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Official Email Desk</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Submit formal commercial RFPs, corporate tenders, and construction inquiries.
                </p>
                <div className="mt-6 text-sm font-bold text-slate-900 truncate">
                  {companyEmail}
                </div>
              </div>

              <a
                href={`mailto:${companyEmail}?subject=${encodeURIComponent(
                  emailSubject
                )}&body=${encodeURIComponent(emailBody)}`}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-md transition-all"
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Email Us: {companyEmail}</span>
              </a>
            </div>
          </div>

          {/* Social Channels Strip */}
          <div className="mt-8 bg-slate-950 rounded-3xl p-6 border border-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-slate-200">Follow Fast Engineering Solutions Online</div>
              <div className="text-xs text-slate-400">Official social media and portfolio channels</div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={settings?.social_links?.pinterest || 'https://www.pinterest.com/fastsalesservices/'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-rose-900/60 border border-slate-800 text-rose-400 text-xs font-bold transition-all"
              >
                Pinterest Portfolio
              </a>
              <a
                href={settings?.social_links?.youtube || 'https://www.youtube.com/@fastengineering8299'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-red-900/60 border border-slate-800 text-red-400 text-xs font-bold transition-all"
              >
                YouTube Channel
              </a>
              <a
                href={settings?.social_links?.tiktok || 'https://www.tiktok.com/@fastengineeringsolution'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition-all"
              >
                TikTok: @fastengineeringsolution
              </a>
            </div>
          </div>

          {/* Location & Map Section */}
          <div className="mt-8 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-black tracking-widest text-blue-600 uppercase">
                  Headquarters & Workshop
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">
                  {settings?.company_name || 'FAST ENGINEERING SOLUTIONS'}
                </h2>

                <div className="mt-6 space-y-4 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">Office Address:</strong>
                      <p className="mt-0.5">{settings?.address || 'Al Jannat Main Road, LDA Avenue 1, Raiwind Road, Lahore, Pakistan'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">Operating Hours:</strong>
                      <p className="mt-0.5">{settings?.working_hours || '24 Hours Service (24/7 Available)'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      settings?.address || 'Al Jannat Main Road, LDA Avenue 1, Raiwind Road, Lahore, Pakistan'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-all"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Location Graphic Card */}
              <div className="h-64 rounded-2xl bg-slate-900 text-white relative overflow-hidden flex items-center justify-center p-6 text-center border border-slate-800">
                <div className="z-10 space-y-2">
                  <MapPin className="w-10 h-10 text-rose-500 mx-auto animate-bounce" />
                  <div className="text-base font-bold">Fast Engineering Solutions</div>
                  <div className="text-xs text-slate-400 max-w-xs mx-auto">
                    {settings?.address || 'Al Jannat Main Road, LDA Avenue 1, Raiwind Road, Lahore, Pakistan'}
                  </div>
                </div>
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:14px_14px]"></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileQuickBar />
    </div>
  );
}
