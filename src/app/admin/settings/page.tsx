'use client';

import React, { useState, useEffect } from 'react';
import { getCompanySettings, updateCompanySettings } from '@/lib/actions/db';
import { CompanySettings } from '@/types/database';
import { Settings, Save, CheckCircle2, Building2, Phone, MessageSquare, Mail, MapPin, Clock, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    setError(null);
    try {
      const data = await getCompanySettings();
      setSettings(data);
    } catch (err: any) {
      console.error(err);
      setError('Unable to load company settings from database.');
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSuccess(false);

    try {
      await updateCompanySettings(settings, 'Admin');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (e: any) {
      alert(e.message || 'Error updating settings in database.');
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-6 rounded-3xl text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm font-bold">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadSettings}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  if (!settings) return <div className="p-8 text-white">Loading configuration from database...</div>;


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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              Business Type
            </label>
            <input
              type="text"
              value={settings.business_type || ''}
              onChange={(e) => setSettings({ ...settings, business_type: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="General Contractor / Construction & Engineering"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Founded Year
            </label>
            <input
              type="number"
              value={settings.founded_year || 2012}
              onChange={(e) => setSettings({ ...settings, founded_year: parseInt(e.target.value) || 2012 })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Official Hotline Phone
            </label>
            <input
              type="text"
              required
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="+92 300 4545280"
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
              placeholder="+923004545280"
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
              Official Website
            </label>
            <input
              type="text"
              value={settings.website || ''}
              onChange={(e) => setSettings({ ...settings, website: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="fastengineeringsolutions.com"
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
            Company Description / Overview
          </label>
          <textarea
            rows={3}
            value={settings.description || ''}
            onChange={(e) => setSettings({ ...settings, description: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Official company introduction..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Street Address
            </label>
            <input
              type="text"
              required
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              City
            </label>
            <input
              type="text"
              value={settings.city || ''}
              onChange={(e) => setSettings({ ...settings, city: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Lahore"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Province & Country
            </label>
            <input
              type="text"
              value={`${settings.province || 'Punjab'}, ${settings.country || 'Pakistan'}`}
              onChange={(e) => {
                const parts = e.target.value.split(',');
                setSettings({ ...settings, province: parts[0]?.trim(), country: parts[1]?.trim() || 'Pakistan' });
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Punjab, Pakistan"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="border-t border-slate-800 pt-6">
          <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-slate-300">
            Official Social Media Links
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Pinterest URL
              </label>
              <input
                type="text"
                value={settings.social_links?.pinterest || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, pinterest: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="https://www.pinterest.com/fastsalesservices/"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                YouTube URL
              </label>
              <input
                type="text"
                value={settings.social_links?.youtube || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, youtube: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="https://www.youtube.com/@fastengineering8299"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                TikTok URL
              </label>
              <input
                type="text"
                value={settings.social_links?.tiktok || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, tiktok: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="https://www.tiktok.com/@fastengineeringsolution"
              />
            </div>
          </div>
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
