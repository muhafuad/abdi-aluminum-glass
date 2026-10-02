import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  
  UploadCloud
} from 'lucide-react';
import {
  getSupabaseCredentials,
  updateSupabaseCredentials,
  clearSupabaseCredentials,
  testSupabaseConnection,
  type ConnectionTestResult
} from '../../lib/supabase/client';
import { getSupabaseTableStats, seedSupabaseDatabase } from '../../lib/supabase/repository';

interface SupabaseConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected?: () => void;
}

export const SupabaseConnectionModal: React.FC<SupabaseConnectionModalProps> = ({
  isOpen,
  onClose,
  onConnected
}) => {
  const { url: initialUrl, key: initialKey, isConfigured } = getSupabaseCredentials();

  const [url, setUrl] = useState(initialUrl);
  const [key, setKey] = useState(initialKey);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [tableStats, setTableStats] = useState<Record<string, number | 'error' | 'missing'>>({});
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      setUrl(creds.url);
      setKey(creds.key);
      if (creds.isConfigured) {
        testSupabaseConnection().then(setTestResult);
        getSupabaseTableStats().then(setTableStats);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestPing = async () => {
    setIsTesting(true);
    setSeedMessage(null);
    try {
      const res = await testSupabaseConnection(url, key);
      setTestResult(res);
      if (res.success) {
        const stats = await getSupabaseTableStats();
        setTableStats(stats);
      }
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveAndConnect = async () => {
    if (!url.trim() || !key.trim()) {
      setTestResult({
        success: false,
        message: 'Please provide both your Supabase URL and Anon Key.'
      });
      return;
    }

    updateSupabaseCredentials(url.trim(), key.trim());
    setIsTesting(true);
    try {
      const res = await testSupabaseConnection(url.trim(), key.trim());
      setTestResult(res);
      if (res.success) {
        const stats = await getSupabaseTableStats();
        setTableStats(stats);
        if (onConnected) onConnected();
      }
    } finally {
      setIsTesting(false);
    }
  };

  const handleDisconnect = () => {
    if (window.confirm('Disconnect from Supabase and use local demo storage?')) {
      clearSupabaseCredentials();
      setUrl('');
      setKey('');
      setTestResult(null);
      setTableStats({});
      setSeedMessage('Disconnected. Running in local storage mode.');
      if (onConnected) onConnected();
    }
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setSeedMessage(null);
    try {
      const res = await seedSupabaseDatabase();
      setSeedMessage(res.message);
      const stats = await getSupabaseTableStats();
      setTableStats(stats);
      if (onConnected) onConnected();
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCopySchema = () => {
    const sqlScript = `-- ABDI ALUMINUM & GLASS SUPABASE SCHEMA
-- Run this in Supabase SQL Editor:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    featured BOOLEAN DEFAULT false NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    specifications JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    featured BOOLEAN DEFAULT false NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    deliverables TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    featured BOOLEAN DEFAULT false NOT NULL,
    is_published BOOLEAN DEFAULT true NOT NULL,
    scope TEXT,
    completion_year TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.project_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.quote_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    project_type TEXT NOT NULL,
    location TEXT NOT NULL,
    message TEXT NOT NULL,
    project_size TEXT NOT NULL,
    preferred_contact_method TEXT NOT NULL CHECK (preferred_contact_method IN ('phone', 'email', 'whatsapp')),
    attachment_url TEXT,
    status TEXT DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'contacted', 'in_progress', 'completed', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'read', 'archived')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    company TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    rating INTEGER DEFAULT 5 NOT NULL CHECK (rating >= 1 AND rating <= 5),
    is_published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    company_name TEXT NOT NULL DEFAULT 'Abdi Aluminum & Glass',
    phone TEXT NOT NULL DEFAULT '[Phone Number — Configure in Admin]',
    whatsapp_number TEXT NOT NULL DEFAULT '[WhatsApp Number — Configure in Admin]',
    email TEXT NOT NULL DEFAULT '[email@example.com — Configure in Admin]',
    address TEXT NOT NULL DEFAULT '[Business Address, Addis Ababa, Ethiopia — Configure in Admin]',
    working_hours TEXT NOT NULL DEFAULT '[Monday – Saturday: 8:00 AM – 6:00 PM — Configure in Admin]',
    facebook TEXT DEFAULT '',
    instagram TEXT DEFAULT '',
    telegram TEXT DEFAULT '',
    tiktok TEXT DEFAULT '',
    logo TEXT DEFAULT '',
    favicon TEXT DEFAULT '',
    hero_headline TEXT NOT NULL DEFAULT 'Built With Precision. Designed to Last.',
    hero_label TEXT NOT NULL DEFAULT 'ALUMINUM & GLASS SOLUTIONS',
    hero_subtext TEXT NOT NULL DEFAULT 'Professional aluminum and glass fabrication, supply, and precision architectural installation.',
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON public.products FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Public read services" ON public.services FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Public read projects" ON public.projects FOR SELECT TO public USING (is_published = true);
CREATE POLICY "Public read project_images" ON public.project_images FOR SELECT TO public USING (true);
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT TO public USING (is_published = true);
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT TO public USING (true);
CREATE POLICY "Public insert quotes" ON public.quote_requests FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public insert contact" ON public.contact_messages FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public manage for admin" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public manage services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public manage projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public manage settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public) VALUES 
('projects', 'projects', true),
('products', 'products', true),
('services', 'services', true),
('testimonials', 'testimonials', true),
('site-assets', 'site-assets', true),
('quote-attachments', 'quote-attachments', false)
ON CONFLICT (id) DO NOTHING;`;

    navigator.clipboard.writeText(sqlScript);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const expectedTables = [
    { key: 'site_settings', name: 'Site Settings' },
    { key: 'products', name: 'Products' },
    { key: 'services', name: 'Services' },
    { key: 'projects', name: 'Projects' },
    { key: 'quote_requests', name: 'Quote Requests' },
    { key: 'contact_messages', name: 'Contact Messages' },
    { key: 'testimonials', name: 'Testimonials' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
      <div className="bg-[#14181e] border border-neutral-800 rounded-sm w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-display text-white">
                  Real Supabase Connection & Synchronization
                </h3>
                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                    isConfigured
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                  }`}
                >
                  {isConfigured ? 'LIVE CONNECTED' : 'LOCAL MODE'}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Connect your live Supabase project to persist quote requests, products, and images.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 rounded border border-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-neutral-300">
          {/* Credentials Inputs */}
          <div className="p-4 bg-[#0c0f12] border border-neutral-800 rounded space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white uppercase tracking-wider text-[11px]">
                Supabase API Credentials
              </span>
              <a
                href="https://database.new"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px] font-medium"
              >
                <span>Create Free Project at Supabase</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Project URL (e.g. https://your-project.supabase.co)
                </label>
                <input
                  type="text"
                  placeholder="https://xyzabcdefg.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-[#14181e] border border-neutral-800 rounded px-3 py-2 text-xs text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Anon Public API Key (safe for browser client)
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full bg-[#14181e] border border-neutral-800 rounded px-3 py-2 text-xs text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Test result status banner */}
            {testResult && (
              <div
                className={`p-3 rounded border text-xs flex items-start gap-2.5 ${
                  testResult.success
                    ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                    : 'bg-red-950/40 border-red-800/80 text-red-300'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">{testResult.message}</p>
                  {testResult.latencyMs && (
                    <span className="text-[10px] text-neutral-400 font-mono mt-0.5 block">
                      Roundtrip ping: {testResult.latencyMs}ms
                    </span>
                  )}
                </div>
              </div>
            )}

            {seedMessage && (
              <div className="p-3 bg-amber-950/40 border border-amber-800/80 text-amber-300 rounded text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{seedMessage}</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestPing}
                  disabled={isTesting}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 rounded flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Testing Ping...' : 'Test Connection'}</span>
                </button>

                {isConfigured && (
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-red-950 text-red-400 border border-neutral-800 rounded transition-colors"
                  >
                    Disconnect
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleSaveAndConnect}
                disabled={isTesting}
                className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Save & Connect Real Supabase</span>
              </button>
            </div>
          </div>

          {/* Quick Setup 3-Step Guide */}
          <div className="p-4 bg-[#14181e] border border-neutral-800 rounded space-y-3">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px] block">
              How to Connect Your Real Supabase Project (3 Easy Steps)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-[#0c0f12] border border-neutral-800/80 rounded">
                <div className="text-amber-400 font-mono font-bold mb-1">01. Create Project</div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Open <a href="https://database.new" target="_blank" rel="noreferrer" className="text-white underline">database.new</a> and create a free project in seconds.
                </p>
              </div>

              <div className="p-3 bg-[#0c0f12] border border-neutral-800/80 rounded">
                <div className="text-amber-400 font-mono font-bold mb-1">02. Run Schema</div>
                <p className="text-[11px] text-neutral-400 leading-relaxed mb-2">
                  Go to Supabase <strong>SQL Editor</strong>, paste the schema, and click Run.
                </p>
                <button
                  type="button"
                  onClick={handleCopySchema}
                  className="w-full py-1 text-[11px] font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded flex items-center justify-center gap-1 transition-colors"
                >
                  {copiedSchema ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSchema ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
                </button>
              </div>

              <div className="p-3 bg-[#0c0f12] border border-neutral-800/80 rounded">
                <div className="text-amber-400 font-mono font-bold mb-1">03. Copy API Keys</div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Go to <strong>Project Settings &gt; API</strong>, copy the URL and Anon Key, paste above, and click <strong>Save & Connect</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Live Table Health & Sync */}
          {isConfigured && (
            <div className="p-4 bg-[#14181e] border border-neutral-800 rounded space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white uppercase tracking-wider text-[11px] block">
                    Live Supabase Database Tables & Rows
                  </span>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Real-time inspection of database tables and record count in your Supabase project.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSeedDatabase}
                  disabled={isSeeding}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-amber-500/40 text-amber-400 font-semibold rounded flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <UploadCloud className={`w-3.5 h-3.5 ${isSeeding ? 'animate-bounce' : ''}`} />
                  <span>{isSeeding ? 'Seeding...' : 'Seed Initial Catalog to Supabase'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {expectedTables.map((t) => {
                  const stat = tableStats[t.key];
                  const isReady = typeof stat === 'number';
                  const isMissing = stat === 'missing';

                  return (
                    <div
                      key={t.key}
                      className="p-2.5 bg-[#0c0f12] border border-neutral-800/80 rounded flex items-center justify-between"
                    >
                      <div className="truncate">
                        <span className="text-[11px] font-medium text-neutral-300 block truncate">
                          {t.name}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {t.key}
                        </span>
                      </div>
                      <div className="text-right pl-2">
                        {isReady ? (
                          <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                            {stat} rows
                          </span>
                        ) : isMissing ? (
                          <span className="text-[10px] font-semibold text-amber-400">
                            Table Missing
                          </span>
                        ) : (
                          <span className="text-[10px] text-neutral-500">Checking</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
