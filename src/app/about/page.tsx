'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileQuickBar } from '@/components/layout/MobileQuickBar';
import {
  Building2,
  ShieldCheck,
  Award,
  Users,
  Target,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Code2,
  ArrowRight,
  MessageSquare,
  Wrench,
  Zap,
  Layers,
  HeartHandshake
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-25"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wide uppercase">
                <Building2 className="w-3.5 h-3.5" />
                <span>Operating Since 2012 • General Contractor</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-amber-400">FAST ENGINEERING SOLUTIONS</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Founded in 2012, Fast Engineering Solutions operates as a versatile general contractor delivering turnkey construction, power distribution, renewable energy, and real estate plot development solutions throughout Pakistan.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/services"
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
                >
                  <span>Explore Our Services</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/real-estate"
                  className="px-6 py-3.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-sm transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Real Estate & Plot Hub</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Executive Messages & Leadership */}
        <section className="py-20 bg-slate-950 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Leadership & Vision</span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">Executive Messages</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Guiding Fast Engineering Solutions with over a decade of dedication, safety, and technical mastery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Chairman Card */}
              <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black text-lg">
                    AA
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">ABDUL AZIZ</h3>
                    <div className="text-xs font-bold text-amber-400 tracking-wider uppercase">Chairman</div>
                    <div className="text-[11px] text-slate-400">FAST ENGINEERING SOLUTIONS</div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    &ldquo;Our pledge is to establish lasting relationships with our customers by exceeding their expectations and gaining their trust through exceptional performance by every member of the construction team.&rdquo;
                  </p>
                </div>
              </div>

              {/* CEO Card */}
              <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-black text-lg">
                    AM
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">ABDUL MANAN AZIZ</h3>
                    <div className="text-xs font-bold text-blue-400 tracking-wider uppercase">Chief Executive Officer</div>
                    <div className="text-[11px] text-slate-400">FAST ENGINEERING SOLUTIONS</div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    &ldquo;Fast Engineering Solutions has established its position as a reliable EPC contractor offering technically sound and competitive solutions under one umbrella with remarkable efficiency and professionalism.&rdquo;
                  </p>
                </div>
              </div>

              {/* Director Card */}
              <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-lg">
                    AW
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">ABDUL WAHID</h3>
                    <div className="text-xs font-bold text-emerald-400 tracking-wider uppercase">Director (South)</div>
                    <div className="text-[11px] text-slate-400">FAST ENGINEERING SOLUTIONS</div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    &ldquo;We will continue to work and produce in order to benefit the future of our nation, contributing to the economy and employment across all industrial and commercial sectors.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Guiding Principles</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">Our Core Values</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Our 6 fundamental values guide every decision, blueprint, and on-site engineering execution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Excellence',
                desc: 'We strive for excellence in quality and continuously innovate by utilizing cutting-edge technologies and proven engineering practices.',
              },
              {
                title: 'Teamwork',
                desc: 'We insist on mutual respect, cooperation, and mutual encouragement to achieve every team member and project milestone potential.',
              },
              {
                title: 'Integrity',
                desc: 'We act with uncompromised reliability, honesty, transparent budgeting, and fairness in all stakeholder engagements.',
              },
              {
                title: 'Commitment',
                desc: 'We are fully dedicated to delivering project objectives on schedule through the most efficient and safe use of resources.',
              },
              {
                title: 'Sustainability',
                desc: 'We safeguard health and safety on site, ensuring environmentally conscious designs and durable infrastructure.',
              },
              {
                title: 'Accountability',
                desc: 'We are fully accountable for our work quality, offering verifiable warranties and post-handover support.',
              },
            ].map((val, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 space-y-3 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
                  0{idx + 1}
                </div>
                <h3 className="text-lg font-bold text-white">{val.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI Engineering Architecture & Developer Reference */}
        <section className="py-20 bg-slate-950 border-t border-slate-800 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/60 border border-blue-500/30 shadow-2xl space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Software & Platform Architecture</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    Application Architecture & Development
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold">
                    Next.js 14 • Serverless Neon DB
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="space-y-1">
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      Architect & Lead AI Engineer
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white">
                      Qurat ul Ain Sabir
                    </h3>
                    <p className="text-blue-400 font-bold text-sm">
                      AI Engineer & Full-Stack System Architect
                    </p>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    This unified digital operations platform for <strong>FAST ENGINEERING SOLUTIONS</strong> was architected, engineered, and built by <strong>AI Engineer Qurat ul Ain Sabir</strong>. 
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The system features a 100% real-time serverless PostgreSQL backend, instant service request dispatching, live milestone & GPS tracking, an interactive Real Estate & Plot Engineering Hub, PDF brochure generation, and Progressive Web App (PWA) offline resiliency for on-ground site engineers.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {[
                      'Full-Stack AI Architecture',
                      'Serverless Neon PostgreSQL',
                      'Enterprise ERP & Dispatch Workflows',
                      'PWA & Offline Service Engine',
                      'Interactive Real Estate Portal',
                      'Automated PDF Document Engine'
                    ].map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-lg shadow-blue-500/20">
                    QS
                  </div>
                  <div>
                    <div className="text-base font-bold text-white">Qurat ul Ain Sabir</div>
                    <div className="text-xs text-slate-400">AI Engineer</div>
                  </div>
                  <div className="pt-2 border-t border-slate-900">
                    <span className="text-[11px] text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Production Platform Live
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Regional Offices Network */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Nationwide Footprint</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">Regional Offices & Dispatch Hubs</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Serving industrial, commercial, and residential clients across all major metropolitan centers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                city: 'Lahore (Head Office)',
                address: '52, Al Jannat Ul Firdous Society Near LDA Avenue 1, Raiwind Road, Lahore',
                phone: '+92 300 4545280 / +92 326 4545222',
              },
              {
                city: 'Multan Regional Office',
                address: 'Regional Engineering Dispatch Center, Multan',
                phone: '+92 306 4545511 / +92 300 4545280',
              },
              {
                city: 'Faisalabad Regional Office',
                address: 'Industrial Operations Office, Faisalabad',
                phone: '+92 321 7564347 / +92 300 4545280',
              },
              {
                city: 'Islamabad Regional Office',
                address: 'Federal Capital & Northern Operations, Islamabad',
                phone: '+92 313 0458001 / +92 300 4545280',
              },
              {
                city: 'Vehari Regional Office',
                address: 'Southern Punjab Dispatch Station, Vehari',
                phone: '+92 322 7292813 / +92 300 4545280',
              },
              {
                city: '24/7 Emergency Desk',
                address: 'Nationwide On-Call Rapid Response Unit',
                phone: '+92 300 4545280 (WhatsApp & Call)',
              },
            ].map((off, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
              >
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>{off.city}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{off.address}</p>
                <div className="pt-2 border-t border-slate-900 text-xs font-mono text-slate-300">
                  <Phone className="w-3.5 h-3.5 inline mr-1.5 text-blue-400" />
                  {off.phone}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <MobileQuickBar />
    </div>
  );
}
