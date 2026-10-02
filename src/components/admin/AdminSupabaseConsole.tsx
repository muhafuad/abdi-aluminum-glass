import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
 
  UploadCloud,
  
  Activity,
  Terminal,
  Server
} from 'lucide-react';
import {
  getSupabaseCredentials,
  updateSupabaseCredentials,
  clearSupabaseCredentials,
  testSupabaseConnection,
  type ConnectionTestResult
} from '../../lib/supabase/client';
import { getSupabaseTableStats, seedSupabaseDatabase } from '../../lib/supabase/repository';

interface AdminSupabaseConsoleProps {
  onRefresh?: () => void;
  onOpenSqlModal?: () => void;
}

export const AdminSupabaseConsole: React.FC<AdminSupabaseConsoleProps> = ({
  onRefresh,
  onOpenSqlModal
}) => {
  const { url: initialUrl, key: initialKey, isConfigured } = getSupabaseCredentials();

  const [url, setUrl] = useState(initialUrl);
  const [key, setKey] = useState(initialKey);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [tableStats, setTableStats] = useState<Record<string, number | 'error' | 'missing'>>({});
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    const creds = getSupabaseCredentials();
    setUrl(creds.url);
    setKey(creds.key);
    if (creds.isConfigured) {
      testSupabaseConnection().then(setTestResult);
      getSupabaseTableStats().then(setTableStats);
    }
  }, []);

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
        if (onRefresh) onRefresh();
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
      if (onRefresh) onRefresh();
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
      if (onRefresh) onRefresh();
    } finally {
      setIsSeeding(false);
    }
  };

  const tables = [
    { name: 'site_settings', desc: 'Configurable company contact info, phones & hero text' },
    { name: 'products', desc: 'Aluminum profiles, safety glass & hardware inventory' },
    { name: 'services', desc: 'Fabrication, installation & curtain wall services' },
    { name: 'projects', desc: 'Completed architectural installations & portfolio' },
    { name: 'quote_requests', desc: 'Customer quote requests and BoQ specifications' },
    { name: 'contact_messages', desc: 'General inquiries and workshop messages' },
    { name: 'testimonials', desc: 'Client reviews from developers and homeowners' }
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 bg-[#14181e] border border-neutral-800 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-display text-white">
                Supabase Live Database Connection
              </h2>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                  isConfigured
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}
              >
                {isConfigured ? 'Live Connection Active' : 'Local Storage Fallback'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Connect your live Supabase PostgreSQL backend with Row Level Security (RLS) and Storage buckets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onOpenSqlModal && (
            <button
              onClick={onOpenSqlModal}
              className="px-3.5 py-2 text-xs font-semibold text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded transition-colors flex items-center gap-2"
            >
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>SQL Schema & RLS</span>
            </button>
          )}
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded transition-colors flex items-center gap-1.5"
          >
            <span>Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Connection Form & Test Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Credentials Form */}
        <div className="lg:col-span-7 bg-[#14181e] border border-neutral-800 rounded-sm p-6 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="text-sm font-bold font-display text-white">
              Project API Credentials
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Found in your Supabase Project Settings &gt; API.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Supabase Project URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full bg-[#0c0f12] border border-neutral-800 rounded-sm px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Anon Public API Key
              </label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-[#0c0f12] border border-neutral-800 rounded-sm px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleSaveAndConnect}
              disabled={isTesting}
              className="px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded transition-colors flex items-center gap-2 shadow-sm"
            >
              {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Server className="w-3.5 h-3.5" />}
              <span>Save & Connect Real Supabase</span>
            </button>

            <button
              onClick={handleTestPing}
              disabled={isTesting || !url || !key}
              className="px-4 py-2.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-700 disabled:opacity-40 rounded transition-colors flex items-center gap-2"
            >
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <span>Test Live Ping</span>
            </button>

            {isConfigured && (
              <button
                onClick={handleDisconnect}
                className="px-3.5 py-2.5 text-xs font-semibold text-neutral-400 hover:text-red-400 transition-colors"
              >
                Disconnect
              </button>
            )}
          </div>

          {/* Test Result Callout */}
          {testResult && (
            <div
              className={`p-4 rounded border text-xs flex items-start gap-3 ${
                testResult.success
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  : 'bg-red-950/40 border-red-800 text-red-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-semibold">{testResult.message}</p>
                {testResult.latencyMs && (
                  <p className="text-[11px] text-neutral-400 font-mono">
                    Round-trip latency: {testResult.latencyMs}ms
                  </p>
                )}
                {testResult.missingTables && testResult.missingTables.length > 0 && (
                  <p className="text-[11px] text-amber-300">
                    Tables to create: {testResult.missingTables.join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Seeding Box */}
          <div className="p-4 bg-[#101418] border border-neutral-800 rounded-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Seed Live Supabase Database
                </h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Populates your Supabase database with all products, services, portfolio projects, and initial settings.
                </p>
              </div>
              <button
                onClick={handleSeedDatabase}
                disabled={isSeeding || !isConfigured}
                className="px-3 py-1.5 text-xs font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 rounded transition-colors flex items-center gap-1.5 shrink-0"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{isSeeding ? 'Seeding...' : 'Seed Now'}</span>
              </button>
            </div>
            {seedMessage && (
              <p className="text-xs text-amber-300 bg-amber-950/40 border border-amber-800/80 p-2.5 rounded">
                {seedMessage}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Live Table Status & Statistics */}
        <div className="lg:col-span-5 bg-[#14181e] border border-neutral-800 rounded-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <h3 className="text-sm font-bold font-display text-white">
                Live Tables & Row Counts
              </h3>
              <p className="text-[11px] text-neutral-400">
                Synchronized state of PostgreSQL database
              </p>
            </div>
            <button
              onClick={() => getSupabaseTableStats().then(setTableStats)}
              className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded"
              title="Refresh Stats"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-neutral-800/80">
            {tables.map((t) => {
              const stat = tableStats[t.name];
              return (
                <div key={t.name} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-mono font-medium text-white flex items-center gap-1.5">
                      <span>{t.name}</span>
                    </div>
                    <p className="text-[10px] text-neutral-400 line-clamp-1">{t.desc}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {stat === undefined ? (
                      <span className="text-neutral-500 font-mono text-[11px]">local</span>
                    ) : stat === 'missing' ? (
                      <span className="text-amber-400 font-mono text-[10px] px-1.5 py-0.5 bg-amber-950/80 rounded border border-amber-800">
                        run sql
                      </span>
                    ) : stat === 'error' ? (
                      <span className="text-red-400 font-mono text-[10px] px-1.5 py-0.5 bg-red-950/80 rounded border border-red-800">
                        auth error
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-mono text-[11px] font-bold px-2 py-0.5 bg-emerald-950/60 rounded border border-emerald-800">
                        {stat} rows
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Guide & RLS Fix */}
          <div className="pt-4 border-t border-neutral-800 text-xs space-y-3 text-neutral-400">
            <h4 className="font-bold text-white text-[11px] uppercase tracking-wider">
              Quick Setup Steps:
            </h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-[11px]">
              <li>Log in to <span className="text-amber-400">supabase.com</span> and create a project.</li>
              <li>Go to <span className="text-white">SQL Editor</span> and paste the schema from the <span className="text-amber-400">SQL Schema</span> button.</li>
              <li>Go to <span className="text-white">Project Settings &gt; API</span> and copy your Project URL & anon key.</li>
              <li>Paste above, click <span className="text-amber-400">Save & Connect Real Supabase</span>, then click <span className="text-amber-400">Seed Now</span>!</li>
            </ol>

            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-amber-400">RLS Permissions Quick Fix</span>
                <button
                  onClick={() => {
                    const rlsFixSql = `-- Enable full public/anon read and write for web application client:
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;`;
                    navigator.clipboard.writeText(rlsFixSql);
                    setCopiedKey(true);
                    setTimeout(() => setCopiedKey(false), 2000);
                  }}
                  className="px-2 py-1 text-[10px] font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded flex items-center gap-1 transition-colors"
                >
                  {copiedKey ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey ? 'Copied SQL!' : 'Copy RLS Fix SQL'}</span>
                </button>
              </div>
              <p className="text-[10px] text-neutral-400">
                If Supabase tables show "auth error" or submissions don't appear in the database, paste this into Supabase SQL Editor and run it once.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
