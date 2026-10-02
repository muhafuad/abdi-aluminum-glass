import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext';
import { getSupabaseCredentials, updateSupabaseCredentials, clearSupabaseCredentials, testSupabaseConnection } from '../../lib/supabase/client';
import { seedSupabaseDatabase } from '../../lib/supabase/repository';
import { Save, CheckCircle, Database } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useSite();
  const [formData, setFormData] = useState({ ...settings });
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Supabase credentials state
  const { url: initialUrl, key: initialKey, isConfigured } = getSupabaseCredentials();
  const [supabaseUrl, setSupabaseUrl] = useState(initialUrl);
  const [supabaseKey, setSupabaseKey] = useState(initialKey);
  const [supabaseMessage, setSupabaseMessage] = useState('');
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [isSeedingSupabase, setIsSeedingSupabase] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestSupabase = async () => {
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      setSupabaseMessage('Please enter both Supabase URL and Anon Key to test.');
      return;
    }
    setIsTestingSupabase(true);
    try {
      const res = await testSupabaseConnection(supabaseUrl.trim(), supabaseKey.trim());
      setSupabaseMessage(res.message + (res.latencyMs ? ` (${res.latencyMs}ms)` : ''));
    } finally {
      setIsTestingSupabase(false);
    }
  };

  const handleSeedSupabase = async () => {
    setIsSeedingSupabase(true);
    try {
      const res = await seedSupabaseDatabase();
      setSupabaseMessage(res.message);
    } finally {
      setIsSeedingSupabase(false);
    }
  };

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      setSupabaseMessage('Please enter both Supabase Project URL and Anon API Key.');
      return;
    }
    updateSupabaseCredentials(supabaseUrl.trim(), supabaseKey.trim());
    setSupabaseMessage('Supabase credentials saved successfully. Reloading client...');
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  const handleDisconnectSupabase = () => {
    if (window.confirm('Disconnect custom Supabase credentials and return to local mode?')) {
      clearSupabaseCredentials();
      setSupabaseUrl('');
      setSupabaseKey('');
      setSupabaseMessage('Supabase disconnected. Reloading in local mode...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="space-y-10">
      {/* 1. Supabase Backend Connection Panel */}
      <div className="p-6 bg-[#14181e] border border-neutral-800 rounded-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-display text-white">
              Supabase Backend Connection
            </h3>
            <p className="text-xs text-neutral-400">
              Configure your live Supabase project URL and Anon public key to sync tables, Auth, and Storage.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveSupabase} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Supabase Anon Public API Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {supabaseMessage && (
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded text-xs text-amber-300">
              {supabaseMessage}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">Status:</span>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                  isConfigured
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {isConfigured ? 'Connected & Active' : 'Operating in Local Storage Mode'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleTestSupabase}
                disabled={isTestingSupabase}
                className="px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-700 rounded transition-colors"
              >
                {isTestingSupabase ? 'Testing Ping...' : 'Test Connection'}
              </button>

              {isConfigured && (
                <button
                  type="button"
                  onClick={handleSeedSupabase}
                  disabled={isSeedingSupabase}
                  className="px-3 py-1.5 text-xs text-amber-400 hover:text-amber-300 bg-neutral-900 border border-amber-500/40 rounded transition-colors"
                >
                  {isSeedingSupabase ? 'Seeding...' : 'Seed Data to Supabase'}
                </button>
              )}

              {isConfigured && (
                <button
                  type="button"
                  onClick={handleDisconnectSupabase}
                  className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 bg-neutral-900 border border-neutral-800 rounded"
                >
                  Reset to Local
                </button>
              )}

              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors shadow-sm"
              >
                Save Credentials & Sync
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 2. Business Coordinates & Information */}
      <form onSubmit={handleSaveSettings} className="space-y-8">
        <div className="p-6 bg-[#14181e] border border-neutral-800 rounded-sm space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="text-sm font-bold font-display text-white">
              Company Information & Contact Coordinates
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              These details populate the navbar, footer, contact page, and WhatsApp dispatch button.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Company Legal Name
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Phone Number (Public & Quotations)
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                WhatsApp Dispatch Number
              </label>
              <input
                type="text"
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleChange}
                placeholder="e.g. +251 91 123 4567"
                className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Official Business Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Workshop & Office Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Operating / Working Hours
              </label>
              <input
                type="text"
                name="working_hours"
                value={formData.working_hours}
                onChange={handleChange}
                className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* 3. Hero Content Configuration */}
        <div className="p-6 bg-[#14181e] border border-neutral-800 rounded-sm space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="text-sm font-bold font-display text-white">
              Homepage Hero Section Messaging
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Control the primary headline, architectural label, and positioning statement.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Hero Architectural Label
              </label>
              <input
                type="text"
                name="hero_label"
                value={formData.hero_label}
                onChange={handleChange}
                className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Main Headline
              </label>
              <input
                type="text"
                name="hero_headline"
                value={formData.hero_headline}
                onChange={handleChange}
                className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-display"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Hero Subtext / Positioning Statement
              </label>
              <textarea
                rows={3}
                name="hero_subtext"
                value={formData.hero_subtext}
                onChange={handleChange}
                className="w-full bg-[#0c0f12] border border-neutral-800 rounded p-3 text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 4. Social Media Links */}
        <div className="p-6 bg-[#14181e] border border-neutral-800 rounded-sm space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="text-sm font-bold font-display text-white">
              Social Media Channels
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Optional links to company social channels.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Telegram Channel / Bot
              </label>
              <input
                type="text"
                name="telegram"
                placeholder="https://t.me/yourcompany"
                value={formData.telegram}
                onChange={handleChange}
                className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                TikTok Handle / URL
              </label>
              <input
                type="text"
                name="tiktok"
                placeholder="https://tiktok.com/@yourcompany"
                value={formData.tiktok}
                onChange={handleChange}
                className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Facebook Page URL
              </label>
              <input
                type="text"
                name="facebook"
                placeholder="https://facebook.com/yourcompany"
                value={formData.facebook}
                onChange={handleChange}
                className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Instagram URL
              </label>
              <input
                type="text"
                name="instagram"
                placeholder="https://instagram.com/yourcompany"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between p-4 bg-[#14181e] border border-neutral-800 rounded-sm">
          {isSaved ? (
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              <span>All changes saved and synchronized.</span>
            </div>
          ) : (
            <span className="text-xs text-neutral-500">Unsaved modifications exist.</span>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded transition-colors flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Settings...' : 'Save Site Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
