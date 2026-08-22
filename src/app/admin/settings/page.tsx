'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/db/data-store';
import { CompanySettings } from '@/types/database';
import { Settings, Save, CheckCircle2, Building2, Phone, MessageSquare, Mail, MapPin, Clock } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    db.getCompanySettings().then(setSettings);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSuccess(false);

    try {
      await db.updateCompanySettings(settings, 'Engr. Ahmed Raza (Admin)');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (e) {
      alert('Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <div className="p-8 text-white">Loading configuration...</div>;

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
          Central Configuration
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
          Company Information & Contact Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          All values configured here dynamically propagate across the entire website, dialers, WhatsApp links, and footers.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Company settings successfully saved. Public website updated.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Company Legal Name
            </label>
            <input
              type="text"
              required
              value={settings.company_name}
              onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Application Brand Name
            </label>
            <input
              type="text"
              required
              value={settings.app_name}
              onChange={(e) => setSettings({ ...settings, app_name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Official Hotline Phone (with Country Code)
            </label>
            <input
              type="text"
              required
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="+92 300 1234567"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Official WhatsApp Number
            </label>
            <input
              type="text"
              required
              value={settings.whatsapp}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="+923001234567"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Official Inquiry Email
            </label>
            <input
              type="email"
              required
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Working Hours Notice
            </label>
            <input
              type="text"
              required
              value={settings.working_hours}
              onChange={(e) => setSettings({ ...settings, working_hours: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
            Head Office / Workshop Physical Address
          </label>
          <input
            type="text"
            required
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
