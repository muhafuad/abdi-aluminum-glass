import React, { useState } from 'react';
import type { Project } from '../../lib/types/database';
import { saveProject, deleteProject, uploadFile } from '../../lib/supabase/repository';
import { Plus, Edit, Trash2, X, Upload, Star, Search, MapPin,  Images, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AdminProjectsProps {
  projects: Project[];
  onRefresh: () => Promise<void>;
}

export const AdminProjects: React.FC<AdminProjectsProps> = ({ projects, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<Project>>({
    title: '',
    category: 'Commercial',
    location: 'Addis Ababa',
    short_description: '',
    description: '',
    cover_image: '/src/assets/images/project_commercial_storefront_1790866938051.jpg',
    featured: false,
    is_published: true,
    scope: '',
    completion_year: '2025'
  });

  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    'Residential',
    'Commercial',
    'Office',
    'Storefront',
    'Interior',
    'Custom Projects'
  ];

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingProject({
      title: '',
      category: 'Commercial',
      location: 'Addis Ababa',
      short_description: '',
      description: '',
      cover_image: '/src/assets/images/project_commercial_storefront_1790866938051.jpg',
      featured: false,
      is_published: true,
      scope: '',
      completion_year: '2025'
    });
    setGalleryUrls([]);
    setSelectedCoverFile(null);
    setIsEditing(true);
  };

  const handleOpenEdit = (proj: Project) => {
    setEditingProject({ ...proj });
    setGalleryUrls([]);
    setSelectedCoverFile(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the project "${title}"?`)) {
      await deleteProject(id);
      await onRefresh();
    }
  };

  const handleAddGalleryFiles = async (files: FileList) => {
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = await uploadFile('projects', files[i]);
      urls.push(url);
    }
    setGalleryUrls((prev) => [...prev, ...urls]);
  };

  const handleRemoveGalleryUrl = (idx: number) => {
    setGalleryUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject.title?.trim()) return;

    setIsSaving(true);
    setNotification(null);
    try {
      let coverImage = editingProject.cover_image || '';
      if (selectedCoverFile) {
        coverImage = await uploadFile('projects', selectedCoverFile);
      }

      const saved = await saveProject(
        {
          ...editingProject,
          cover_image: coverImage,
          title: editingProject.title.trim()
        },
        galleryUrls.length > 0 ? galleryUrls : undefined
      );

      await onRefresh();
      setIsEditing(false);

      if (saved.supabaseError) {
        setNotification({
          type: 'warning',
          message: `Project "${saved.title}" is now live on the public website and saved locally. Note from Supabase: ${saved.supabaseError}. (Review Supabase Database tab for one-click SQL policy fix).`
        });
      } else {
        setNotification({
          type: 'success',
          message: `Project "${saved.title}" was saved and published successfully to the database and live website!`
        });
      }
    } catch (err: any) {
      console.error('Failed to save project:', err);
      setNotification({
        type: 'error',
        message: err.message || 'Failed to save project.'
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
            placeholder="Search projects by title, category..."
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
          <span>Add New Project</span>
        </button>
      </div>

      <div className="bg-[#14181e] border border-neutral-800 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] font-semibold tracking-wider bg-neutral-900/60">
              <tr>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {filtered.map((proj) => (
                <tr key={proj.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={proj.cover_image}
                        alt={proj.title}
                        referrerPolicy="no-referrer"
                        className="w-12 h-10 object-cover rounded bg-neutral-900 border border-neutral-800"
                      />
                      <div>
                        <div className="font-semibold text-white">{proj.title}</div>
                        <div className="text-[11px] text-neutral-500 font-mono">/projects/{proj.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-neutral-300">{proj.category}</td>
                  <td className="py-3 px-4 text-neutral-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span>{proj.location}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {proj.featured ? (
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
                        proj.is_published
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {proj.is_published ? 'Published' : 'Hidden'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(proj)}
                        title="Edit Project"
                        className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded hover:border-neutral-700 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(proj.id, proj.title)}
                        title="Delete Project"
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

      {/* Edit / Create Project Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-[#14181e] border border-neutral-800 rounded-sm w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-800">
              <h3 className="text-lg font-bold font-display text-white">
                {editingProject.id ? 'Edit Architectural Case Study' : 'Create New Project'}
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
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  placeholder="e.g. Commercial Plaza Storefront & Entrance"
                  className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Site Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.location || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                    placeholder="e.g. Bole, Addis Ababa"
                    className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Completion Year
                  </label>
                  <input
                    type="text"
                    value={editingProject.completion_year || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, completion_year: e.target.value })}
                    placeholder="e.g. 2025"
                    className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Scope of Work Summary
                </label>
                <input
                  type="text"
                  value={editingProject.scope || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, scope: e.target.value })}
                  placeholder="e.g. Storefront framing, 12mm tempered safety glass, commercial pivot doors"
                  className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={editingProject.short_description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, short_description: e.target.value })}
                  placeholder="1-2 sentences for portfolio card..."
                  className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Full Project Case Study Description
                </label>
                <textarea
                  rows={4}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  placeholder="Describe architectural challenges, materials used, structural calculations, and client results..."
                  className="w-full bg-[#0c0f12] border border-neutral-800 rounded p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Cover Image */}
              <div className="p-3 bg-[#0c0f12] border border-neutral-800 rounded">
                <label className="block text-xs font-medium text-neutral-300 mb-2">
                  Primary Cover Image
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={editingProject.cover_image}
                    alt="Cover Preview"
                    referrerPolicy="no-referrer"
                    className="w-16 h-12 object-cover rounded border border-neutral-800"
                  />
                  <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-xs text-neutral-200 hover:border-neutral-500">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>Upload Cover Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setSelectedCoverFile(e.target.files[0]);
                        }}
                      />
                    </label>
                    {selectedCoverFile && (
                      <span className="block text-[11px] text-amber-300 mt-1">
                        File selected: {selectedCoverFile.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Gallery Images */}
              <div className="p-3 bg-[#0c0f12] border border-neutral-800 rounded">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-neutral-300">
                    Additional Gallery Images
                  </label>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 border border-neutral-700 rounded text-[11px] text-neutral-200 hover:border-neutral-500">
                    <Images className="w-3 h-3 text-amber-400" />
                    <span>Add Gallery Photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) handleAddGalleryFiles(e.target.files);
                      }}
                    />
                  </label>
                </div>

                {galleryUrls.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                    {galleryUrls.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded overflow-hidden border border-neutral-800 group">
                        <img src={url} alt="Gallery" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryUrl(idx)}
                          className="absolute top-1 right-1 p-1 bg-black/80 text-red-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-neutral-500 py-1">No extra gallery images uploaded.</p>
                )}
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={editingProject.is_published ?? true}
                    onChange={(e) => setEditingProject({ ...editingProject, is_published: e.target.checked })}
                    className="rounded border-neutral-800 text-amber-500 focus:ring-0"
                  />
                  <span>Published on Public Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={editingProject.featured ?? false}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    className="rounded border-neutral-800 text-amber-500 focus:ring-0"
                  />
                  <span>Feature on Homepage Showcase</span>
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
                  {isSaving ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
