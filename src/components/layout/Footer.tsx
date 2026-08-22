'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { db } from '@/lib/db/data-store';
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
    db.getCompanySettings().then(setSettings);
    db.getServices(true).then((srvs) => setServices(srvs.slice(0, 5)));
  }, []);

  const cleanPhone = settings?.phone || '+923001234567';
  const cleanWhatsApp = (settings?.whatsapp || '+923001234567').replace(/[^0-9]/g, '');
  const companyEmail = settings?.email || 'info@fastengineeringsolutions.com';

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Upper Footer CTA Strip */}
      <div className="border-b border-slate-800/80 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Certified Engineering Excellence
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Need Immediate Industrial or Commercial Support?
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Our certified engineering dispatch units respond rapidly across Pakistan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <a
              href={`tel:${cleanPhone.replace(/\s+/g, '')}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              <Phone className="w-4 h-4" />
              <span>Call Now</span>
            </a>
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                'Hello Fast Services, I would like to inquire about an engineering service.'
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
            FAST SERVICES is the dedicated service platform of{' '}
            <strong className="text-slate-200">FAST ENGINEERING SOLUTIONS</strong>. We deliver high-reliability electrical, HVAC, solar, CCTV, and automation solutions.
          </p>
          <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> PEC Registered
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> ISO Certified
            </span>
          </div>
        </div>

        {/* Quick Service Links */}
        <div>
          <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">
            Core Engineering Services
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
                Contact & Headquarters
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
              <span>{settings?.address || 'Industrial Estate, Sector H-9, Islamabad / Lahore, Pakistan'}</span>
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
              <span className="text-xs">{settings?.working_hours || 'Mon - Sat: 08:00 AM - 07:00 PM'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} <strong className="text-slate-400">FAST ENGINEERING SOLUTIONS</strong>. All rights reserved.
          </span>
          <span className="text-slate-400">
            FAST SERVICES — Engineering & Industrial Support
          </span>
        </div>
      </div>
    </footer>
  );
};
