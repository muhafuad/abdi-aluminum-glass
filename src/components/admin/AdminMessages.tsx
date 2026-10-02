import React, { useState } from 'react';
import type { ContactMessage, MessageStatus } from '../../lib/types/database';
import { updateMessageStatus, deleteContactMessage } from '../../lib/supabase/repository';
import { Search, Eye, Trash2, X,  Mail,  RefreshCw } from 'lucide-react';

interface AdminMessagesProps {
  messages: ContactMessage[];
  onRefresh: () => Promise<void>;
}

export const AdminMessages: React.FC<AdminMessagesProps> = ({ messages, onRefresh }) => {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'archived'>('all');
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const filtered = messages.filter((m) => {
    const matchesFilter = filter === 'all' || m.status === filter;
    const matchesSearch =
      m.full_name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleOpen = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === 'new') {
      await updateMessageStatus(msg.id, 'read');
      await onRefresh();
    }
  };

  const handleStatusChange = async (id: string, newStatus: MessageStatus) => {
    await updateMessageStatus(id, newStatus);
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage({ ...selectedMessage, status: newStatus });
    }
    await onRefresh();
  };

  const handleDelete = async (id: string, sender: string) => {
    if (window.confirm(`Delete inquiry from "${sender}"?`)) {
      await deleteContactMessage(id);
      if (selectedMessage?.id === id) setSelectedMessage(null);
      await onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          {(['all', 'new', 'read', 'archived'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-sm capitalize transition-colors ${
                filter === s
                  ? 'bg-amber-400 text-neutral-950 font-bold'
                  : 'bg-[#14181e] text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search inquiries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#14181e] border border-neutral-800 rounded-sm pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>
          <button
            onClick={handleManualRefresh}
            title="Refresh Inquiries"
            disabled={isRefreshing}
            className="p-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded text-neutral-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-[#14181e] border border-neutral-800 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] font-semibold tracking-wider bg-neutral-900/60">
              <tr>
                <th className="py-3 px-4">Sender</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Received</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500">
                    No contact inquiries found.
                  </td>
                </tr>
              ) : (
                filtered.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`hover:bg-neutral-800/30 transition-colors ${
                      msg.status === 'new' ? 'bg-amber-500/5 font-medium' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{msg.full_name}</div>
                      <div className="text-[11px] text-neutral-500">{msg.email}</div>
                    </td>
                    <td className="py-3 px-4 text-neutral-200">{msg.subject}</td>
                    <td className="py-3 px-4 text-neutral-400 font-mono text-[11px]">{msg.phone}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
                          msg.status === 'new'
                            ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                            : msg.status === 'read'
                            ? 'bg-neutral-800 text-neutral-300'
                            : 'bg-neutral-900 text-neutral-500'
                        }`}
                      >
                        {msg.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-500 text-[11px]">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpen(msg)}
                          title="Open Message"
                          className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded hover:border-neutral-700 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(msg.id, msg.full_name)}
                          title="Delete Message"
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

      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-[#14181e] border border-neutral-800 rounded-sm w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-800">
              <div>
                <span className="text-[11px] font-mono text-amber-400">INBOUND INQUIRY</span>
                <h3 className="text-lg font-bold font-display text-white">
                  {selectedMessage.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 text-xs sm:text-sm">
              <div className="p-4 bg-[#0c0f12] border border-neutral-800 rounded grid grid-cols-2 gap-4">
                <div>
                  <span className="text-neutral-500 block text-[11px] uppercase">From</span>
                  <span className="text-white font-medium">{selectedMessage.full_name}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px] uppercase">Phone</span>
                  <a href={`tel:${selectedMessage.phone}`} className="text-amber-400 font-mono">
                    {selectedMessage.phone}
                  </a>
                </div>
                <div className="col-span-2">
                  <span className="text-neutral-500 block text-[11px] uppercase">Email</span>
                  <a href={`mailto:${selectedMessage.email}`} className="text-white hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
              </div>

              <div>
                <span className="text-neutral-500 block text-[11px] uppercase mb-1">Message Body</span>
                <div className="p-4 bg-[#0c0f12] border border-neutral-800 rounded text-neutral-200 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">Status:</span>
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value as MessageStatus)}
                    className="text-xs bg-neutral-900 border border-neutral-700 text-white rounded px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                    className="px-3 py-1.5 bg-amber-400 text-neutral-950 font-semibold rounded text-xs hover:bg-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Reply by Email</span>
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
