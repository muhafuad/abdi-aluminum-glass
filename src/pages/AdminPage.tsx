import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';
import {
  getQuoteRequests,
  getContactMessages,
  getProducts,
  getServices,
  getProjects,
  getTestimonials
} from '../lib/supabase/repository';
import type { Product, Service, Project, QuoteRequest, ContactMessage, Testimonial } from '../lib/types/database';
import { AdminOverview } from '../components/admin/AdminOverview';
import { AdminProducts } from '../components/admin/AdminProducts';
import { AdminServices } from '../components/admin/AdminServices';
import { AdminProjects } from '../components/admin/AdminProjects';
import { AdminQuotes } from '../components/admin/AdminQuotes';
import { AdminMessages } from '../components/admin/AdminMessages';
import { AdminTestimonials } from '../components/admin/AdminTestimonials';
import { AdminSettings } from '../components/admin/AdminSettings';
import { AdminSupabaseConsole } from '../components/admin/AdminSupabaseConsole';
import { AdminSqlSchemaModal } from '../components/admin/AdminSqlSchemaModal';
import { SupabaseConnectionModal } from '../components/admin/SupabaseConnectionModal';
import {
  LayoutDashboard,
  Package,
  Wrench,
  FolderKanban,
  Inbox,
  MessageSquare,
  Star,
  Settings,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  Lock,
  Code2,
  Database
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (path: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { user, isAuthenticated, login, logout, isSupabaseConfigured } = useAuth();
  const { settings, refreshData: refreshPublicData } = useSite();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin data sets
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const fetchAdminData = async () => {
    setIsLoadingData(true);
    try {
      const [p, s, prj, q, m, t] = await Promise.all([
        getProducts(true),
        getServices(true),
        getProjects(true),
        getQuoteRequests(),
        getContactMessages(),
        getTestimonials(true)
      ]);
      setProducts(p);
      setServices(s);
      setProjects(prj);
      setQuotes(q);
      setMessages(m);
      setTestimonials(t);
    } catch (err) {
      console.error('Failed to load admin datasets:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated]);

  const handleRefresh = async () => {
    await fetchAdminData();
    await refreshPublicData();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await login(loginEmail, loginPassword);
      if (!res.success) {
        setLoginError(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login error occurred.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // If not authenticated, render authentic admin login screen
  if (!isAuthenticated) {
    return (
      <div className="bg-[#0c0f12] min-h-screen text-neutral-100 flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-[#14181e] border border-neutral-800 rounded-sm p-8 sm:p-10 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Website</span>
            </button>
            <div className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold font-display text-white mb-1">
            Admin Authentication
          </h1>
          <p className="text-xs text-neutral-400 mb-6">
            Sign in to manage {settings.company_name} projects, products, quotations, and settings.
          </p>

          {loginError && (
            <div className="p-3 bg-red-950/40 border border-red-800 rounded text-xs text-red-300 mb-6">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Administrator Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@abdi-aluminum.com"
                className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 px-4 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded transition-colors shadow-sm"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-800/80 text-center">
            <p className="text-[11px] text-neutral-400">
              {isSupabaseConfigured
                ? 'Protected by Supabase Row Level Security & Authentication.'
                : 'Demo credentials: enter admin@abdi-aluminum.com to access local portal mode.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'supabase', label: 'Supabase Database', icon: Database, isLive: isSupabaseConfigured },
    { id: 'quotes', label: 'Quote Requests', icon: Inbox, count: quotes.filter((q) => q.status === 'new').length },
    { id: 'messages', label: 'Contact Messages', icon: MessageSquare, count: messages.filter((m) => m.status === 'new').length },
    { id: 'projects', label: 'Projects & Portfolio', icon: FolderKanban },
    { id: 'products', label: 'Products & Systems', icon: Package },
    { id: 'services', label: 'Services & Scope', icon: Wrench },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'settings', label: 'Site Settings', icon: Settings }
  ];

  return (
    <div className="bg-[#0c0f12] min-h-screen text-neutral-100 flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 bg-[#11151a] border-b border-neutral-800 flex items-center justify-between px-4 sm:px-6 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="lg:hidden p-1.5 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => onNavigate('/')}
            className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Public Website</span>
          </button>

          <span className="text-neutral-700 hidden sm:inline">/</span>

          <span className="text-xs font-bold text-white font-display hidden sm:inline">
            {settings.company_name} Management Portal
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors shadow-sm"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase Connection</span>
          </button>

          <button
            onClick={() => setIsSqlModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-700 rounded transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            <span>SQL Schema</span>
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-neutral-800 text-xs">
            <span className="hidden md:inline text-neutral-400">
              {user?.email}
            </span>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 text-neutral-400 hover:text-red-400 bg-neutral-900 border border-neutral-800 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-[#11151a] border-r border-neutral-800 hidden lg:flex flex-col justify-between p-4">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              Content & Operations
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-400/10 text-amber-400 border border-amber-500/20'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.isLive !== undefined ? (
                    <span
                      className={`px-1.5 py-0.2 text-[9px] font-bold uppercase rounded font-mono ${
                        item.isLive
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {item.isLive ? 'LIVE' : 'LOCAL'}
                    </span>
                  ) : item.count && item.count > 0 ? (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-neutral-950 font-mono">
                      {item.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-[#14181e] border border-neutral-800/80 rounded text-[11px] text-neutral-400">
            <div className="flex items-center gap-2 text-white font-semibold mb-1">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>Backend Engine</span>
            </div>
            <p className="text-[10px] text-neutral-400">
              {isSupabaseConfigured
                ? 'Connected to live Supabase project with RLS enabled.'
                : 'Local browser storage. Enter credentials in Settings to sync.'}
            </p>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <div
              className="w-64 h-full bg-[#11151a] border-r border-neutral-800 p-4 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 mb-4">
                  <span className="text-xs font-bold text-white font-display">Navigation</span>
                  <button onClick={() => setIsMobileSidebarOpen(false)}>
                    <X className="w-5 h-5 text-neutral-400" />
                  </button>
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-amber-400/10 text-amber-400 border border-amber-500/20'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.count && item.count > 0 ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-neutral-950 font-mono">
                          {item.count}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <button
                  onClick={() => {
                    setIsSqlModalOpen(true);
                    setIsMobileSidebarOpen(false);
                  }}
                  className="w-full py-2 text-xs text-neutral-300 bg-neutral-900 border border-neutral-800 rounded flex items-center justify-center gap-2"
                >
                  <Code2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>View SQL Schema</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0c0f12]">
          <div className="max-w-7xl mx-auto">
            {isLoadingData ? (
              <div className="py-24 text-center text-neutral-500">
                Loading dashboard metrics and records...
              </div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <AdminOverview
                    products={products}
                    services={services}
                    projects={projects}
                    quotes={quotes}
                    messages={messages}
                    onTabChange={setActiveTab}
                    onOpenSqlModal={() => setIsSqlModalOpen(true)}
                    onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
                    isSupabaseConfigured={isSupabaseConfigured}
                  />
                )}

                {activeTab === 'supabase' && (
                  <AdminSupabaseConsole
                    onRefresh={handleRefresh}
                    onOpenSqlModal={() => setIsSqlModalOpen(true)}
                  />
                )}

                {activeTab === 'quotes' && (
                  <AdminQuotes quotes={quotes} onRefresh={handleRefresh} />
                )}

                {activeTab === 'messages' && (
                  <AdminMessages messages={messages} onRefresh={handleRefresh} />
                )}

                {activeTab === 'projects' && (
                  <AdminProjects projects={projects} onRefresh={handleRefresh} />
                )}

                {activeTab === 'products' && (
                  <AdminProducts products={products} onRefresh={handleRefresh} />
                )}

                {activeTab === 'services' && (
                  <AdminServices services={services} onRefresh={handleRefresh} />
                )}

                {activeTab === 'testimonials' && (
                  <AdminTestimonials testimonials={testimonials} onRefresh={handleRefresh} />
                )}

                {activeTab === 'settings' && <AdminSettings />}
              </>
            )}
          </div>
        </main>
      </div>

      {/* SQL Schema Modal */}
      <AdminSqlSchemaModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />

      {/* Supabase Real Connection & Diagnostics Modal */}
      <SupabaseConnectionModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConnected={handleRefresh}
      />
    </div>
  );
};
