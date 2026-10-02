import React from 'react';
import {
  FolderKanban,
  Package,
  Wrench,
  Inbox,
  MessageSquare,
  ArrowUpRight,
  TrendingUp,
  Database
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import type { Product, Service, Project, QuoteRequest, ContactMessage } from '../../lib/types/database';

interface AdminOverviewProps {
  products: Product[];
  services: Service[];
  projects: Project[];
  quotes: QuoteRequest[];
  messages: ContactMessage[];
  onTabChange: (tab: string) => void;
  onOpenSqlModal: () => void;
  onOpenSupabaseModal?: () => void;
  isSupabaseConfigured: boolean;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  products,
  services,
  projects,
  quotes,
  messages,
  onTabChange,
  onOpenSqlModal,
  onOpenSupabaseModal,
  isSupabaseConfigured
}) => {
  const newQuotesCount = quotes.filter((q) => q.status === 'new').length;
  const newMessagesCount = messages.filter((m) => m.status === 'new').length;

  const statCards = [
    {
      title: 'Total Projects',
      value: projects.length,
      sub: `${projects.filter((p) => p.featured).length} featured showcase`,
      icon: FolderKanban,
      tab: 'projects',
      color: 'text-sky-400'
    },
    {
      title: 'Active Products',
      value: products.filter((p) => p.is_active).length,
      sub: `${products.length} catalog items total`,
      icon: Package,
      tab: 'products',
      color: 'text-emerald-400'
    },
    {
      title: 'Active Services',
      value: services.filter((s) => s.is_active).length,
      sub: `${services.length} offerings listed`,
      icon: Wrench,
      tab: 'services',
      color: 'text-purple-400'
    },
    {
      title: 'New Quote Requests',
      value: newQuotesCount,
      sub: `${quotes.length} total submissions`,
      icon: Inbox,
      tab: 'quotes',
      color: 'text-amber-400',
      badge: newQuotesCount > 0 ? `${newQuotesCount} pending` : undefined
    },
    {
      title: 'New Messages',
      value: newMessagesCount,
      sub: `${messages.length} total inquiries`,
      icon: MessageSquare,
      tab: 'messages',
      color: 'text-rose-400',
      badge: newMessagesCount > 0 ? `${newMessagesCount} unread` : undefined
    }
  ];

  // Chart data: Quotes by Status
  const statusData = [
    { name: 'New', count: quotes.filter((q) => q.status === 'new').length, fill: '#f59e0b' },
    { name: 'Contacted', count: quotes.filter((q) => q.status === 'contacted').length, fill: '#38bdf8' },
    { name: 'In Progress', count: quotes.filter((q) => q.status === 'in_progress').length, fill: '#818cf8' },
    { name: 'Completed', count: quotes.filter((q) => q.status === 'completed').length, fill: '#34d399' },
    { name: 'Rejected', count: quotes.filter((q) => q.status === 'rejected').length, fill: '#64748b' }
  ];

  // Projects by Category for Pie Chart
  const categoryCounts: Record<string, number> = {};
  projects.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });
  const projectCatData = Object.entries(categoryCounts).map(([cat, count]) => ({
    name: cat,
    value: count
  }));

  const PIE_COLORS = ['#f59e0b', '#38bdf8', '#34d399', '#a78bfa', '#fb7185', '#94a3b8'];

  return (
    <div className="space-y-8">
      {/* Backend Status Banner */}
      <div className="p-4 bg-[#14181e] border border-neutral-800 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center">
            <Database className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <span>Database & Cloud Engine:</span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                  isSupabaseConfigured
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                }`}
              >
                {isSupabaseConfigured ? 'Supabase Connected' : 'Local Storage Mode (Ready for Supabase)'}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              All records, quotes, and settings are fully reactive. You can inspect or copy the full Supabase SQL schema anytime.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          {onOpenSupabaseModal && (
            <button
              onClick={onOpenSupabaseModal}
              className="px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors whitespace-nowrap shadow-sm"
            >
              {isSupabaseConfigured ? 'Manage Supabase Connection' : 'Connect Real Supabase'}
            </button>
          )}
          <button
            onClick={onOpenSqlModal}
            className="px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded transition-colors whitespace-nowrap"
          >
            View SQL & RLS
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => onTabChange(card.tab)}
              className="group cursor-pointer p-5 bg-[#14181e] border border-neutral-800 rounded-sm hover:border-neutral-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-neutral-400 mb-2">
                  <span className="text-xs font-medium">{card.title}</span>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-white tabular-nums">
                    {card.value}
                  </span>
                  {card.badge && (
                    <span className="text-[11px] font-semibold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                      {card.badge}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400 group-hover:text-amber-400 transition-colors">
                <span>{card.sub}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quote Inquiries by Status (Bar Chart) */}
        <div className="lg:col-span-7 p-6 bg-[#14181e] border border-neutral-800 rounded-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold font-display text-white">
                Quote Request Status Pipeline
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Distribution across lead qualification stages
              </p>
            </div>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#525252" fontSize={11} tickLine={false} />
                <YAxis stroke="#525252" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c0f12',
                    borderColor: '#262626',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#f59e0b' }}
                />
                <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Distribution (Pie Chart) */}
        <div className="lg:col-span-5 p-6 bg-[#14181e] border border-neutral-800 rounded-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold font-display text-white">
                Project Categories
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Completed architectural jobs by typology
              </p>
            </div>
            <FolderKanban className="w-4 h-4 text-amber-400" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {projectCatData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectCatData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {projectCatData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c0f12',
                      borderColor: '#262626',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-neutral-500">No project data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Submissions Quick Table */}
      <div className="p-6 bg-[#14181e] border border-neutral-800 rounded-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold font-display text-white">
              Latest Inbound Quote Requests
            </h3>
            <p className="text-xs text-neutral-400">
              Direct inquiries from potential clients
            </p>
          </div>
          <button
            onClick={() => onTabChange('quotes')}
            className="text-xs font-semibold text-amber-400 hover:underline"
          >
            View All Quotes
          </button>
        </div>

        {quotes.length === 0 ? (
          <p className="text-xs text-neutral-500 py-6 text-center">No quote requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3">Project Type</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                {quotes.slice(0, 4).map((q) => (
                  <tr key={q.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-white">{q.full_name}</td>
                    <td className="py-2.5 px-3">{q.project_type}</td>
                    <td className="py-2.5 px-3">{q.location}</td>
                    <td className="py-2.5 px-3 font-mono">{q.phone}</td>
                    <td className="py-2.5 px-3">
                      <span className="capitalize px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-800 text-amber-400">
                        {q.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-neutral-500">
                      {new Date(q.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
