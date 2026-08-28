'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { getCompanySettings, getServices } from '@/lib/actions/db';
import { CompanySettings, Service } from '@/types/database';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    getCompanySettings().then(setSettings).catch(() => null);
    getServices(true).then((srvs) => setServices(srvs.slice(0, 5))).catch(() => null);
  }, []);


  const cleanPhone = settings?.phone || '+92 300 4545280';
  const cleanWhatsApp = (settings?.whatsapp || '+923004545280').replace(/[^0-9]/g, '');
  const companyEmail = settings?.email || 'fastsales.services@gmail.com';
  const companyDescription =
    settings?.description ||
    'Fast Engineering Solutions is a versatile general contractor founded in 2012, delivering end-to-end construction solutions throughout Pakistan.';

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Upper Footer CTA Strip */}
      <div className="border-b border-slate-800/80 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> General Contractor & Construction Solutions
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Need Immediate Engineering or Construction Support?
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              24/7 emergency dispatch and end-to-end construction solutions across Pakistan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <a
              href={`tel:${cleanPhone.replace(/\s+/g, '')}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              <Phone className="w-4 h-4" />
              <span>Call: {cleanPhone}</span>
            </a>
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                'Hello Fast Services, I would like to inquire about your construction and engineering services.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Company Profile */}
        <div className="space-y-4">
          <Logo variant="white" size="lg" />
          <p className="text-sm text-slate-400 leading-relaxed">
            {companyDescription}
          </p>

          {/* Official Social Links */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <a
              href={settings?.social_links?.pinterest || 'https://www.pinterest.com/fastsalesservices/'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-rose-900/60 border border-slate-800 text-rose-400 font-bold transition-colors"
            >
              Pinterest
            </a>
            <a
              href={settings?.social_links?.youtube || 'https://www.youtube.com/@fastengineering8299'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-red-900/60 border border-slate-800 text-red-400 font-bold transition-colors"
            >
              YouTube
            </a>
            <a
              href={settings?.social_links?.tiktok || 'https://www.tiktok.com/@fastengineeringsolution'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold transition-colors"
            >
              TikTok
            </a>
          </div>
        </div>

        {/* Quick Service Links */}
        <div>
          <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">
            Services & Solutions
          </h4>
          <ul className="space-y-2.5 text-sm">
            {services.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-slate-400 hover:text-blue-400 transition-colors flex items-center justify-between group"
                >
                  <span className="truncate">{s.name}</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                </Link>
              </li>
            ))}
            <li>
              <Link href="/services" className="text-blue-400 hover:underline text-xs font-bold">
                View All Services →
              </Link>
            </li>
          </ul>
        </div>

        {/* Portals & Navigation */}
        <div>
          <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">
            Navigation & Portals
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/request" className="text-slate-400 hover:text-white transition-colors">
                Book a Service Request
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                Customer Status Tracker
              </Link>
            </li>
            <li>
              <Link href="/employee" className="text-slate-400 hover:text-white transition-colors">
                Staff & Employee Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin" className="text-slate-400 hover:text-white transition-colors">
                Admin Management Portal
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
                Contact & Location
              </Link>
            </li>
          </ul>
        </div>

        {/* Official Contact & Head Office */}
        <div>
          <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">
            Company Contact Info
          </h4>
          <div className="space-y-3 text-sm text-slate-400">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" />
              <span>{settings?.address || 'Al Jannat Main Road, LDA Avenue 1, Raiwind Road, Lahore, Pakistan'}</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <a
                href={`tel:${cleanPhone.replace(/\s+/g, '')}`}
                className="hover:text-white transition-colors font-medium text-slate-200"
              >
                {cleanPhone}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <a
                href={`mailto:${companyEmail}?subject=Service%20Inquiry%20-%20Fast%20Services&body=Hello%20Fast%20Services,%0A%0AI%20would%20like%20to%20inquire%20about%20your%20services.%0A%0AThank%20you.`}
                className="hover:text-white transition-colors truncate"
              >
                {companyEmail}
              </a>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="text-xs">{settings?.working_hours || '24 Hours Service (24/7 Available)'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} <strong className="text-slate-400">FAST ENGINEERING SOLUTIONS</strong>. All rights reserved. (Operating Since 2012)
          </span>
          <span className="text-slate-400">
            FAST SERVICES — General Contractor & Construction Solutions
          </span>
        </div>
      </div>
    </footer>
  );
};
