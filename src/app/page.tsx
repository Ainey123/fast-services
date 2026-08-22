'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileQuickBar } from '@/components/layout/MobileQuickBar';
import { db } from '@/lib/db/data-store';
import { Service, CompanySettings } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import {
  Phone,
  MessageSquare,
  Mail,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  Wrench,
  Cpu,
  Activity,
  Award,
  Users,
  Building2,
  HelpCircle,
} from 'lucide-react';

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const loadedServices = await db.getServices(true);
      const loadedSettings = await db.getCompanySettings();
      setServices(loadedServices);
      setSettings(loadedSettings);
      setLoading(false);
    }
    loadData();
  }, []);

  const cleanPhone = settings?.phone || '+923001234567';
  const cleanWhatsApp = (settings?.whatsapp || '+923001234567').replace(/[^0-9]/g, '');
  const companyEmail = settings?.email || 'info@fastengineeringsolutions.com';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* ================================================================= */}
        {/* 1. HERO SECTION */}
        {/* ================================================================= */}
        <section className="relative bg-slate-950 text-white overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-slate-800">
          {/* Subtle Engineering Grid Backdrop */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>FAST ENGINEERING SOLUTIONS</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                FAST SERVICES
              </h1>
              <p className="mt-4 text-xl sm:text-2xl font-medium text-slate-300">
                &ldquo;Professional Services. Fast Response. Reliable Solutions.&rdquo;
              </p>

              <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl">
                Engineered for manufacturing industries, commercial facilities, and residential plazas. Certified electrical, HVAC, solar, CCTV surveillance, and automation engineering.
              </p>

              {/* Strong CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  href="/request"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02]"
                >
                  <Wrench className="w-5 h-5" />
                  <span>Request a Service</span>
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-base transition-all hover:scale-[1.02]"
                >
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span>Contact Us</span>
                </Link>

                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                    'Hello Fast Services, I would like to know more about your services.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>WhatsApp Us</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">24/7</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Emergency Dispatch
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-blue-400">100%</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Certified Engineers
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">500+</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Projects Delivered
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. COMPANY INTRODUCTION */}
        {/* ================================================================= */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-black tracking-widest text-blue-600 uppercase">
                  Corporate Overview
                </span>
                <h2 className="text-3xl font-black text-slate-900 mt-2">
                  Engineering Precision Meets Rapid On-Site Execution
                </h2>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  <strong>FAST ENGINEERING SOLUTIONS</strong> is a multi-disciplinary engineering contractor and service provider. Through our digital service engine, <strong>FAST SERVICES</strong>, we eliminate downtime for factories, commercial towers, and institutions with scheduled maintenance and rapid emergency response teams.
                </p>

                <div className="mt-6 space-y-3">
                  {[
                    'Certified PEC (Pakistan Engineering Council) registered engineers',
                    'Transparent estimation, standardized materials, and no hidden charges',
                    'Full GPS-enabled job tracking and digital service verification',
                    'Adherence to strict OSHA safety protocols and industrial standards',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <a
                    href={`tel:${cleanPhone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
                  >
                    <span>Direct Call: {cleanPhone}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Corporate Visual Card */}
              <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl"></div>
                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-400" />
                  <span>Engineering Operating Matrix</span>
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
                    <div className="text-xs text-slate-400 uppercase font-bold">Standard SLA Response</div>
                    <div className="text-base font-bold text-white mt-1">Under 45 Minutes for Critical Sites</div>
                  </div>
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
                    <div className="text-xs text-slate-400 uppercase font-bold">Service Range</div>
                    <div className="text-base font-bold text-white mt-1">Lahore, Islamabad, Rawalpindi & Nationwide EPC</div>
                  </div>
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
                    <div className="text-xs text-slate-400 uppercase font-bold">Material Integrity</div>
                    <div className="text-base font-bold text-white mt-1">100% Genuine Certified Industrial Spares</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 3. MAIN SERVICES SECTION */}
        {/* ================================================================= */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-black tracking-widest text-blue-600 uppercase">
                Our Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
                Specialized Engineering Services
              </h2>
              <p className="text-slate-600 mt-3 text-base">
                Explore our database-backed service catalog. Request immediate service or book a site assessment.
              </p>
            </div>

            {/* Service Cards Grid */}
            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Service Image */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full">
                      {service.category}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                        {service.name}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                        {service.short_description}
                      </p>

                      {service.price_starting_at && (
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <span>Starting from</span>
                          <span className="text-sm font-bold text-slate-900">
                            {formatCurrency(service.price_starting_at)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center justify-center px-3 py-2 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold text-center transition-colors"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/request?service=${service.id}`}
                        className="inline-flex items-center justify-center px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center shadow-sm transition-colors"
                      >
                        Request Service
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-md transition-all"
              >
                <span>View Full Service Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. WHY CHOOSE US */}
        {/* ================================================================= */}
        <section className="py-20 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-black tracking-widest text-blue-600 uppercase">
                Our Competitive Advantage
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-2">
                Why Industry Leaders Choose Fast Services
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">
                  Rapid Emergency Mobilization
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Equipped emergency response vehicles with on-board diagnostics, testing tools, and industrial spare components for immediate on-site rectifications.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">
                  Engineered Standards & Quality
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  No guesswork or makeshift fixes. Every installation follows strict IEEE, NFPA, and local regulatory guidelines with verifiable handover checklists.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">
                  Real-Time Digital Tracking
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Track your service tickets, assigned engineers, project milestones, and material utilization directly through your online customer dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 5. HOW IT WORKS */}
        {/* ================================================================= */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
                Seamless Workflow
              </span>
              <h2 className="text-3xl font-black text-white mt-2">
                How Fast Services Works
              </h2>
              <p className="text-slate-400 mt-2 text-sm">
                4 streamlined steps from booking to technical resolution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {[
                {
                  step: '01',
                  title: 'Submit Service Request',
                  desc: 'Pick your service, capture GPS location or enter address, and upload photos of the issue.',
                },
                {
                  step: '02',
                  title: 'Technical Review & Call',
                  desc: 'Our senior engineering desk reviews requirements and confirms schedule with prompt quote.',
                },
                {
                  step: '03',
                  title: 'On-Site Execution',
                  desc: 'Assigned specialist engineers arrive on site with equipment to perform precision work.',
                },
                {
                  step: '04',
                  title: 'Verification & Handover',
                  desc: 'System testing, customer sign-off, digital receipt, and warranty protection.',
                },
              ].map((s, idx) => (
                <div key={idx} className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 relative">
                  <div className="text-3xl font-black text-blue-500 mb-3">{s.step}</div>
                  <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 6. CONTACT & LOCATION SECTION */}
        {/* ================================================================= */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <span className="text-xs font-black tracking-widest text-blue-600 uppercase">
                  Direct Inquiries
                </span>
                <h2 className="text-3xl font-black text-slate-900 mt-2">
                  Get in Touch with Our Engineering Team
                </h2>
                <p className="text-slate-600 mt-3 text-sm">
                  Whether you require immediate troubleshooting, scheduled plant maintenance, or an EPC tender proposal, reach us through your preferred channel.
                </p>

                <div className="mt-8 space-y-5">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <Phone className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase">Phone Dialer</div>
                      <a
                        href={`tel:${cleanPhone.replace(/\s+/g, '')}`}
                        className="text-lg font-black text-slate-900 hover:text-blue-600 transition-colors"
                      >
                        {cleanPhone}
                      </a>
                      <div className="text-xs text-slate-500 mt-0.5">Click on mobile to open phone dialer immediately</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <MessageSquare className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-xs font-bold text-emerald-800 uppercase">Official WhatsApp</div>
                      <a
                        href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                          'Hello Fast Services, I would like to know more about your services.'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-black text-emerald-950 hover:text-emerald-700 transition-colors"
                      >
                        Chat on WhatsApp
                      </a>
                      <div className="text-xs text-emerald-700 mt-0.5">Instant chat with pre-filled inquiry message</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <Mail className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase">Official Email</div>
                      <a
                        href={`mailto:${companyEmail}?subject=Service%20Inquiry%20-%20Fast%20Services&body=Hello%20Fast%20Services,%0A%0AI%20would%20like%20to%20inquire%20about%20your%20services.%0A%0AThank%20you.`}
                        className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors"
                      >
                        {companyEmail}
                      </a>
                      <div className="text-xs text-slate-500 mt-0.5">Click to open pre-filled email client</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Map Preview */}
              <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-black tracking-wider text-slate-500 uppercase mb-2">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>Headquarters & Dispatch Base</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    {settings?.company_name || 'FAST ENGINEERING SOLUTIONS'}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2">
                    {settings?.address || 'Industrial Estate, Sector H-9, Islamabad / Lahore, Pakistan'}
                  </p>

                  <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-800">
                    <Clock className="w-3.5 h-3.5 inline mr-1 text-blue-600" />
                    <strong>Working Hours:</strong> {settings?.working_hours || 'Mon - Sat: 08:00 AM - 07:00 PM'}
                  </div>
                </div>

                {/* Map Visual / Link */}
                <div className="mt-6 rounded-2xl overflow-hidden border border-slate-300 relative h-48 bg-slate-200 flex items-center justify-center text-center p-4">
                  <div className="z-10">
                    <MapPin className="w-8 h-8 text-rose-600 mx-auto animate-bounce" />
                    <div className="text-xs font-bold text-slate-800 mt-1">
                      Lahore & Islamabad Operations
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        settings?.address || 'Lahore Pakistan'
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 transition-all"
                    >
                      <span>Open in Google Maps</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                </div>
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
