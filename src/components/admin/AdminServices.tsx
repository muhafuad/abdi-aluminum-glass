import React, { useState } from 'react';
import type { Service } from '../../lib/types/database';
import { saveService, deleteService, uploadFile } from '../../lib/supabase/repository';
import { Plus, Edit, Trash2, X, Upload, Star, Search, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AdminServicesProps {
  services: Service[];
  onRefresh: () => Promise<void>;
}

export const AdminServices: React.FC<AdminServicesProps> = ({ services, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null);
  const [editingService, setEditingService] = useState<Partial<Service>>({
    name: '',
    short_description: '',
    description: '',
    image_url: '/src/assets/images/service_glass_partition_office_1790866970041.jpg',
    featured: false,
    is_active: true,
    sort_order: services.length + 1,
    deliverables: []
  });

  const [search, setSearch] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deliverableInput, setDeliverableInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.short_description.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingService({
      name: '',
      short_description: '',
      description: '',
      image_url: '/src/assets/images/service_glass_partition_office_1790866970041.jpg',
      featured: false,
      is_active: true,
      sort_order: services.length + 1,
      deliverables: []
    });
    setSelectedFile(null);
    setIsEditing(true);
  };

  const handleOpenEdit = (serv: Service) => {
    setEditingService({ ...serv });
    setSelectedFile(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the service "${name}"?`)) {
      await deleteService(id);
      await onRefresh();
    }
  };

  const handleAddDeliverable = () => {
    if (!deliverableInput.trim()) return;
    setEditingService((prev) => ({
      ...prev,
      deliverables: [...(prev.deliverables || []), deliverableInput.trim()]
    }));
    setDeliverableInput('');
  };

  const handleRemoveDeliverable = (idx: number) => {
    setEditingService((prev) => ({
      ...prev,
      deliverables: (prev.deliverables || []).filter((_, i) => i !== idx)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService.name?.trim()) return;

    setIsSaving(true);
    setNotification(null);
    try {
      let imageUrl = editingService.image_url || '';
      if (selectedFile) {
        imageUrl = await uploadFile('services', selectedFile);
      }

      const saved = await saveService({
        ...editingService,
        image_url: imageUrl,
        name: editingService.name.trim()
      });

      await onRefresh();
      setIsEditing(false);

      if (saved.supabaseError) {
        setNotification({
          type: 'warning',
          message: `Service "${saved.name}" is now live on public website and saved locally. Note from Supabase: ${saved.supabaseError}.`
        });
      } else {
        setNotification({
          type: 'success',
          message: `Service "${saved.name}" was saved and published successfully to the database and live website!`
        });
      }
    } catch (err: any) {
      console.error('Failed to save service:', err);
      setNotification({
        type: 'error',
        message: err.message || 'Failed to save service.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded text-xs flex items-center justify-between border ${
            notification.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
              : notification.type === 'warning'
              ? 'bg-amber-950/40 border-amber-800 text-amber-300'
              : 'bg-red-950/40 border-red-800 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#14181e] border border-neutral-800 rounded-sm pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="bg-[#14181e] border border-neutral-800 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] font-semibold tracking-wider bg-neutral-900/60">
              <tr>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Deliverables</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {filtered.map((serv) => (
                <tr key={serv.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={serv.image_url}
                        alt={serv.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-cover rounded bg-neutral-900 border border-neutral-800"
                      />
                      <div>
                        <div className="font-semibold text-white">{serv.name}</div>
                        <div className="text-[11px] text-neutral-500 font-mono">/services/{serv.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-neutral-400">
                    {serv.deliverables ? `${serv.deliverables.length} items defined` : 'None'}
                  </td>
                  <td className="py-3 px-4">
                    {serv.featured ? (
                      <span className="flex items-center gap-1 text-amber-400 text-[11px]">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        Featured
                      </span>
                    ) : (
                      <span className="text-neutral-500 text-[11px]">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        serv.is_active
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {serv.is_active ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">{serv.sort_order}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(serv)}
                        title="Edit Service"
                        className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded hover:border-neutral-700 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(serv.id, serv.name)}
                        title="Delete Service"
                        className="p-1.5 text-red-400 hover:text-red-300 bg-neutral-900 border border-neutral-800 rounded hover:border-red-900/60 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Service Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-[#14181e] border border-neutral-800 rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-800">
              <h3 className="text-lg font-bold font-display text-white">
                {editingService.id ? 'Edit Architectural Service' : 'Create New Service'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.name || ''}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  placeholder="e.g. Curtain Wall Systems"
                  className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingService.sort_order ?? 1}
                    onChange={(e) => setEditingService({ ...editingService, sort_order: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={editingService.short_description || ''}
                  onChange={(e) => setEditingService({ ...editingService, short_description: e.target.value })}
                  placeholder="Brief summary for listings..."
                  className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Full Service Scope & Methodology
                </label>
                <textarea
                  rows={4}
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  placeholder="Detailed engineering and site procedure..."
                  className="w-full bg-[#0c0f12] border border-neutral-800 rounded p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Image Upload */}
              <div className="p-3 bg-[#0c0f12] border border-neutral-800 rounded">
                <label className="block text-xs font-medium text-neutral-300 mb-2">
                  Service Cover Image
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={editingService.image_url}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 object-cover rounded border border-neutral-800"
                  />
                  <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-xs text-neutral-200 hover:border-neutral-500">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>Upload New Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
                        }}
                      />
                    </label>
                    {selectedFile && (
                      <span className="block text-[11px] text-amber-300 mt-1">
                        File selected: {selectedFile.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Deliverables checklist */}
              <div className="p-3 bg-[#0c0f12] border border-neutral-800 rounded">
                <label className="block text-xs font-medium text-neutral-300 mb-2">
                  Key Scope Deliverables
                </label>
                <div className="space-y-1.5 mb-3">
                  {(editingService.deliverables || []).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-neutral-900 px-3 py-1.5 rounded">
                      <span className="text-neutral-200">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(idx)}
                        className="text-neutral-500 hover:text-red-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Structural silicone glazing and weather sealing"
                    value={deliverableInput}
                    onChange={(e) => setDeliverableInput(e.target.value)}
                    className="flex-1 bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-xs text-white rounded"
                  >
                    Add Scope
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={editingService.is_active ?? true}
                    onChange={(e) => setEditingService({ ...editingService, is_active: e.target.checked })}
                    className="rounded border-neutral-800 text-amber-500 focus:ring-0"
                  />
                  <span>Active in Services List</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={editingService.featured ?? false}
                    onChange={(e) => setEditingService({ ...editingService, featured: e.target.checked })}
                    className="rounded border-neutral-800 text-amber-500 focus:ring-0"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
