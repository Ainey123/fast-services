'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileQuickBar } from '@/components/layout/MobileQuickBar';
import {
  Download,
  Smartphone,
  Share,
  PlusSquare,
  CheckCircle2,
  Zap,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Phone,
  MessageSquare,
  HardHat,
  Building2,
  ExternalLink,
} from 'lucide-react';

export default function DownloadAppPage() {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('android');
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isApp =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isApp);

    const ua = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatform('ios');
    } else if (/android/.test(ua)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }
  }, []);

  const triggerOpenInstallModal = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-install-modal'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <Navbar />

      <main className="flex-1">
        {/* ================================================================= */}
        {/* 1. HERO SECTION */}
        {/* ================================================================= */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-25"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Official Mobile App (PWA)</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                  Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-amber-400">FAST SERVICES</span> on Your Mobile Phone
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                  Install the official Fast Services app directly to your home screen on <strong>Android & iOS</strong> without needing an app store download. Experience instant offline access, 1-tap GPS location booking, real-time ticket tracking, and direct emergency hotline dialing.
                </p>

                {isStandalone && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>You are currently using the Fast Services Mobile App in Standalone Mode!</span>
                  </div>
                )}

                {/* Main Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={triggerOpenInstallModal}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-base shadow-xl shadow-blue-600/30 transition-all flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Download className="w-5 h-5" />
                    <span>Install Mobile App Now</span>
                  </button>

                  <a
                    href="https://wa.me/923004545280?text=Hello%20Fast%20Services,%20I%20need%20assistance%20installing%20the%20mobile%20app."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm transition-all flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp Support</span>
                  </a>
                </div>

                {/* Badges / Specs */}
                <div className="pt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>Ultra-fast (under 3MB)</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>100% Free & No Ads</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Automatic Updates</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Interactive Mobile Mockup Card */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-sm rounded-[40px] p-4 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-4 border-slate-700 shadow-2xl shadow-blue-900/40">
                  {/* Phone Speaker Notch */}
                  <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
                  </div>

                  {/* Mock Screen Content */}
                  <div className="bg-slate-950 rounded-[28px] p-5 space-y-4 border border-slate-800 text-left">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                          FS
                        </div>
                        <div>
                          <div className="font-bold text-xs text-white">FAST SERVICES</div>
                          <div className="text-[9px] text-emerald-400">● 24/7 Dispatch Ready</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                        PWA APP
                      </span>
                    </div>

                    {/* Mock Action Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                        <HardHat className="w-5 h-5 text-blue-400 mx-auto" />
                        <div className="font-bold text-white text-[11px]">Book Service</div>
                        <div className="text-[9px] text-slate-400">GPS location</div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                        <Building2 className="w-5 h-5 text-amber-400 mx-auto" />
                        <div className="font-bold text-white text-[11px]">Plots & Land</div>
                        <div className="text-[9px] text-slate-400">Turnkey build</div>
                      </div>
                    </div>

                    {/* Mock Quick Dispatch Status */}
                    <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-blue-300 font-bold">
                        <span>Latest Service Dispatch</span>
                        <span className="text-amber-400">EN-ROUTE</span>
                      </div>
                      <div className="text-white font-bold text-xs truncate">
                        Industrial Substation Inspection
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Assigned: Engr. Usman Tariq (PEC #64920)
                      </div>
                    </div>

                    {/* Mock Install CTA */}
                    <button
                      onClick={triggerOpenInstallModal}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tap to Install on Your Device</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. PLATFORM SPECIFIC STEP-BY-STEP GUIDES */}
        {/* ================================================================= */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
              Simple Installation
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
              How to Install in 30 Seconds
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Choose your device below for exact step-by-step visual instructions.
            </p>
          </div>

          {/* Platform Tabs */}
          <div className="flex justify-center gap-2 mb-10">
            <button
              onClick={() => setPlatform('android')}
              className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
                platform === 'android'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Android (Samsung, Xiaomi, Vivo, etc.)
            </button>
            <button
              onClick={() => setPlatform('ios')}
              className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
                platform === 'ios'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Apple iOS (iPhone & iPad Safari)
            </button>
          </div>

          {/* Guide Content */}
          {platform === 'android' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 font-mono font-bold flex items-center justify-center text-sm">
                  01
                </div>
                <h3 className="text-lg font-bold text-white">Open in Chrome or Edge</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Open <strong>fastservices.pk</strong> (or your app URL) in Google Chrome or Microsoft Edge on your Android phone.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 font-mono font-bold flex items-center justify-center text-sm">
                  02
                </div>
                <h3 className="text-lg font-bold text-white">Tap Install App or Menu</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Click the <strong>&ldquo;Install Mobile App&rdquo;</strong> button on this page, or tap the three dots (⋮) menu in Chrome and select <strong>&ldquo;Install app&rdquo;</strong>.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 font-mono font-bold flex items-center justify-center text-sm">
                  03
                </div>
                <h3 className="text-lg font-bold text-white">Launch from Home Screen</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Confirm <strong>&ldquo;Install&rdquo;</strong>. The FAST SERVICES icon will immediately appear on your app drawer and home screen.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 font-mono font-bold flex items-center justify-center text-sm">
                  01
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Tap Share Button</span>
                  <Share className="w-4 h-4 text-blue-400" />
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Open this website in <strong>Safari</strong> on your iPhone or iPad. Tap the <strong>Share</strong> button (the square with an arrow pointing up) at the bottom toolbar.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 font-mono font-bold flex items-center justify-center text-sm">
                  02
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Add to Home Screen</span>
                  <PlusSquare className="w-4 h-4 text-amber-400" />
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Scroll down the Safari share sheet options and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong> (+ icon).
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 font-mono font-bold flex items-center justify-center text-sm">
                  03
                </div>
                <h3 className="text-lg font-bold text-white">Tap &ldquo;Add&rdquo;</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tap <strong>&ldquo;Add&rdquo;</strong> in the top-right corner. The app will be saved as a full-screen native app icon on your iPhone home screen!
                </p>
              </div>
            </div>
          )}

          <div className="mt-10 text-center">
            <button
              onClick={triggerOpenInstallModal}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Open Installation Helper</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 3. KEY APP FEATURES GRID */}
        {/* ================================================================= */}
        <section className="py-20 bg-slate-950 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                Built for Speed & Reliability
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
                Why Use the Mobile App?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Instant Offline Caching</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Service catalog, contacts, and previously loaded pages open instantly even during weak mobile network reception.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">1-Tap GPS Site Location</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Book emergency repairs with instant GPS auto-location detection, removing the need to type complex site addresses manually.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Real-Time Ticket Tracking</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Live progression from submission to engineer assignment, on-site arrival, and completion handover.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">1-Touch Emergency Call</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Quick bottom bar dialer to reach our 24/7 Lahore & nationwide dispatch desk immediately.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. FAQ SECTION */}
        {/* ================================================================= */}
        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-slate-400">Everything you need to know about the mobile app.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Do I need to download from Google Play Store or Apple App Store?',
                a: 'No! Fast Services uses modern Progressive Web App (PWA) technology. You can install it directly from your web browser with 1 tap, saving time and storage.',
              },
              {
                q: 'How much phone storage does the app use?',
                a: 'The app is ultra-lightweight and uses under 3 MB of phone storage, compared to standard 50-100MB store apps.',
              },
              {
                q: 'How do I get updates?',
                a: 'Updates are 100% automatic! Whenever Fast Services updates services, plots, or features, your app refreshes instantly in the background.',
              },
              {
                q: 'Is my data and location secure?',
                a: 'Yes, all GPS site coordinates, phone numbers, and service requests are transmitted over secure SSL encryption and stored in our protected database.',
              },
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed pl-6">{faq.a}</p>
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
