import React, { useState } from 'react';
import type { QuoteRequest, QuoteStatus } from '../../lib/types/database';
import { updateQuoteStatus, deleteQuoteRequest, submitQuoteRequest } from '../../lib/supabase/repository';
import { Search, Eye, Trash2, X, Phone,  MessageSquare,  Download, RefreshCw, Plus, CheckCircle2 } from 'lucide-react';

interface AdminQuotesProps {
  quotes: QuoteRequest[];
  onRefresh: () => Promise<void>;
}

export const AdminQuotes: React.FC<AdminQuotesProps> = ({ quotes, onRefresh }) => {
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  const statuses: { label: string; value: string; color: string }[] = [
    { label: 'All', value: 'all', color: 'text-neutral-300' },
    { label: 'New', value: 'new', color: 'text-amber-400' },
    { label: 'Contacted', value: 'contacted', color: 'text-sky-400' },
    { label: 'In Progress', value: 'in_progress', color: 'text-purple-400' },
    { label: 'Completed', value: 'completed', color: 'text-emerald-400' },
    { label: 'Rejected', value: 'rejected', color: 'text-neutral-500' }
  ];

  const filtered = quotes.filter((q) => {
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    const matchesSearch =
      q.full_name.toLowerCase().includes(search.toLowerCase()) ||
      q.phone.toLowerCase().includes(search.toLowerCase()) ||
      q.email.toLowerCase().includes(search.toLowerCase()) ||
      q.project_type.toLowerCase().includes(search.toLowerCase()) ||
      q.location.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateTestQuote = async () => {
    try {
      await submitQuoteRequest({
        full_name: 'Dawit Mengistu (Test Client)',
        phone: '+251 91 199 8877',
        email: 'dawit.m@example.com',
        project_type: 'Commercial Storefront & Entrance',
        location: 'Bole Medhanialem, Addis Ababa',
        message: 'Looking for a quotation on 14 double-glazed sliding window panels and 2 commercial pivot glass entrance doors.',
        project_size: 'Approximately 65 sqm of glazing',
        preferred_contact_method: 'phone'
      });
      setTestSuccess(true);
      await onRefresh();
      setTimeout(() => setTestSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = async (id: string, newStatus: QuoteStatus) => {
    await updateQuoteStatus(id, newStatus);
    if (selectedQuote && selectedQuote.id === id) {
      setSelectedQuote({ ...selectedQuote, status: newStatus });
    }
    await onRefresh();
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete quote request from "${name}"?`)) {
      await deleteQuoteRequest(id);
      if (selectedQuote?.id === id) setSelectedQuote(null);
      await onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Test Success Banner */}
      {testSuccess && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-800 rounded text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Test quote request created and loaded into table successfully!</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Pills / Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-sm whitespace-nowrap transition-colors ${
                statusFilter === s.value
                  ? 'bg-amber-400 text-neutral-950 font-bold'
                  : 'bg-[#14181e] text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by client, phone, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#14181e] border border-neutral-800 rounded-sm pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            onClick={handleManualRefresh}
            title="Refresh Quotes"
            disabled={isRefreshing}
            className="p-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded text-neutral-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          <button
            onClick={handleCreateTestQuote}
            className="px-3 py-2 text-xs font-semibold bg-neutral-900 border border-amber-400/40 text-amber-400 hover:bg-amber-400/10 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate Test Quote</span>
          </button>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-[#14181e] border border-neutral-800 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] font-semibold tracking-wider bg-neutral-900/60">
              <tr>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Project Type</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Contact Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500">
                    No quote requests match the current criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((q) => (
                  <tr key={q.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{q.full_name}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">{q.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-neutral-200">{q.project_type}</td>
                    <td className="py-3 px-4 text-neutral-400">{q.location}</td>
                    <td className="py-3 px-4 capitalize">
                      <span className="text-amber-400 font-medium">{q.preferred_contact_method}</span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={q.status}
                        onChange={(e) => handleStatusChange(q.id, e.target.value as QuoteStatus)}
                        className={`text-[11px] font-semibold rounded px-2 py-1 bg-neutral-900 border border-neutral-800 focus:outline-none ${
                          q.status === 'new'
                            ? 'text-amber-400 border-amber-800/50'
                            : q.status === 'completed'
                            ? 'text-emerald-400 border-emerald-800/50'
                            : 'text-neutral-300'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-neutral-400 font-mono text-[11px]">
                      {new Date(q.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedQuote(q)}
                          title="View Full Brief"
                          className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded hover:border-neutral-700 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(q.id, q.full_name)}
                          title="Delete Request"
                          className="p-1.5 text-red-400 hover:text-red-300 bg-neutral-900 border border-neutral-800 rounded hover:border-red-900/60 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quote Details Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-[#14181e] border border-neutral-800 rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-800">
              <div>
                <span className="text-[11px] font-mono text-amber-400">QUOTE BRIEF</span>
                <h3 className="text-lg font-bold font-display text-white">
                  {selectedQuote.full_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#0c0f12] border border-neutral-800 rounded">
                <div>
                  <span className="text-neutral-500 block text-[11px] uppercase">Phone</span>
                  <a href={`tel:${selectedQuote.phone}`} className="text-white font-mono hover:text-amber-400">
                    {selectedQuote.phone}
                  </a>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px] uppercase">Email</span>
                  <a href={`mailto:${selectedQuote.email}`} className="text-white hover:text-amber-400">
                    {selectedQuote.email}
                  </a>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px] uppercase">Location</span>
                  <span className="text-neutral-200">{selectedQuote.location}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px] uppercase">Preferred Channel</span>
                  <span className="text-amber-400 capitalize font-medium">
                    {selectedQuote.preferred_contact_method}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-neutral-500 block text-[11px] uppercase mb-1">Project Typology</span>
                <p className="text-white font-semibold">{selectedQuote.project_type}</p>
              </div>

              <div>
                <span className="text-neutral-500 block text-[11px] uppercase mb-1">Estimated Size / Scope</span>
                <p className="text-neutral-200">{selectedQuote.project_size}</p>
              </div>

              <div>
                <span className="text-neutral-500 block text-[11px] uppercase mb-1">Project Description & Requirements</span>
                <div className="p-4 bg-[#0c0f12] border border-neutral-800 rounded text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {selectedQuote.message}
                </div>
              </div>

              {selectedQuote.attachment_url && (
                <div>
                  <span className="text-neutral-500 block text-[11px] uppercase mb-1">Attached Architectural Document</span>
                  <a
                    href={selectedQuote.attachment_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-amber-400 hover:text-amber-300 text-xs font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    <span>View / Download Attachment</span>
                  </a>
                </div>
              )}

              <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">Status:</span>
                  <select
                    value={selectedQuote.status}
                    onChange={(e) => handleStatusChange(selectedQuote.id, e.target.value as QuoteStatus)}
                    className="text-xs bg-neutral-900 border border-neutral-700 text-white rounded px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${selectedQuote.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedQuote.full_name)}%2C%20this%20is%20Abdi%20Aluminum%20%26%20Glass%20following%20up%20on%20your%20quote%20request.`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-[#25D366] text-neutral-950 text-xs font-semibold rounded hover:bg-[#20ba59] transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${selectedQuote.phone}`}
                    className="px-3 py-1.5 bg-neutral-800 text-white text-xs font-semibold rounded hover:bg-neutral-700 transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
