'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, PlusCircle, MapPin, Download } from 'lucide-react';
import { getCompanySettings } from '@/lib/actions/db';
import { CompanySettings } from '@/types/database';

export const MobileQuickBar: React.FC = () => {
  const [settings, setSettings] = useState<CompanySettings | null>(null);

  useEffect(() => {
    getCompanySettings().then(setSettings).catch(() => null);
  }, []);

  const openInstallModal = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-install-modal'));
    }
  };

  const cleanPhone = settings?.phone || '+92 300 4545280';
  const cleanWhatsApp = (settings?.whatsapp || '+923004545280').replace(/[^0-9]/g, '');

  return (
    <aside aria-label="Mobile quick actions" className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 text-white shadow-2xl safe-area-inset-bottom">
      <div className="grid grid-cols-5 gap-1.5 text-center text-[9px] font-bold">
        {/* Direct Phone Call */}
        <a
          href={`tel:${cleanPhone.replace(/\s+/g, '')}`}
          className="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-blue-400 active:scale-95 transition-all"
        >
          <Phone className="w-4 h-4 mb-0.5" />
          <span>Call</span>
        </a>

        {/* Direct WhatsApp */}
        <a
          href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
            'Hello Fast Services, I would like to know more about your services.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-400 active:scale-95 transition-all border border-emerald-800/40"
        >
          <MessageSquare className="w-4 h-4 mb-0.5 text-emerald-400" />
          <span>WhatsApp</span>
        </a>

        {/* Instant Service Request */}
        <Link
          href="/request"
          className="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black active:scale-95 transition-all shadow-md shadow-blue-600/40"
        >
          <PlusCircle className="w-4 h-4 mb-0.5" />
          <span>Request</span>
        </Link>

        {/* Download App */}
        <button
          onClick={openInstallModal}
          className="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 active:scale-95 transition-all"
        >
          <Download className="w-4 h-4 mb-0.5 text-amber-400" />
          <span>Get App</span>
        </button>

        {/* Head Office / Location */}
        <Link
          href="/contact"
          className="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 active:scale-95 transition-all"
        >
          <MapPin className="w-4 h-4 mb-0.5 text-rose-400" />
          <span>Location</span>
        </Link>
      </div>
    </aside>
  );
};
