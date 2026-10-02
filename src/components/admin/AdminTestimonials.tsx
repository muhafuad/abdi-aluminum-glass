import React, { useState } from 'react';
import type {Testimonial} from '../../lib/types/database';
import { saveTestimonial, deleteTestimonial } from '../../lib/supabase/repository';
import { Plus, Edit, Trash2, X, Star } from 'lucide-react';

interface AdminTestimonialsProps {
  testimonials: Testimonial[];
  onRefresh: () => Promise<void>;
}

export const AdminTestimonials: React.FC<AdminTestimonialsProps> = ({ testimonials, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial>>({
    customer_name: '',
    company: '',
    content: '',
    rating: 5,
    is_published: true
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenCreate = () => {
    setEditingTestimonial({
      customer_name: '',
      company: '',
      content: '',
      rating: 5,
      is_published: true
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (t: Testimonial) => {
    setEditingTestimonial({ ...t });
    setIsEditing(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete review from "${name}"?`)) {
      await deleteTestimonial(id);
      await onRefresh();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial.customer_name?.trim() || !editingTestimonial.content?.trim()) return;

    setIsSaving(true);
    try {
      await saveTestimonial({
        ...editingTestimonial,
        customer_name: editingTestimonial.customer_name.trim(),
        content: editingTestimonial.content.trim()
      });
      await onRefresh();
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save testimonial:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold font-display text-white">
            Client Testimonials & Verification
          </h2>
          <p className="text-xs text-neutral-400">
            Manage feedback shown in the verification section of the website.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="p-5 bg-[#14181e] border border-neutral-800 rounded-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    t.is_published
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {t.is_published ? 'Published' : 'Hidden'}
                </span>
              </div>
              <p className="text-xs text-neutral-300 italic mb-4 leading-relaxed line-clamp-4">
                "{t.content}"
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">{t.customer_name}</div>
                <div className="text-[11px] text-neutral-400">{t.company}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(t)}
                  title="Edit"
                  className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded hover:border-neutral-700"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(t.id, t.customer_name)}
                  title="Delete"
                  className="p-1.5 text-red-400 hover:text-red-300 bg-neutral-900 border border-neutral-800 rounded hover:border-red-900/60"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-[#14181e] border border-neutral-800 rounded-sm w-full max-w-lg p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-800">
              <h3 className="text-lg font-bold font-display text-white">
                {editingTestimonial.id ? 'Edit Testimonial' : 'Add Testimonial'}
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
                  Customer / Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingTestimonial.customer_name || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, customer_name: e.target.value })}
                  placeholder="e.g. Ato Yonas Kebede"
                  className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Organization / Role / Context
                </label>
                <input
                  type="text"
                  value={editingTestimonial.company || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })}
                  placeholder="e.g. Commercial Property Developer"
                  className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Star Rating (1 - 5)
                </label>
                <select
                  value={editingTestimonial.rating ?? 5}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value) || 5 })}
                  className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value={5}>5 Stars - Outstanding</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Satisfactory</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Review Content *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingTestimonial.content || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, content: e.target.value })}
                  placeholder="Client feedback regarding fabrication quality, installation speed, or project handover..."
                  className="w-full bg-[#0c0f12] border border-neutral-800 rounded p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={editingTestimonial.is_published ?? true}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, is_published: e.target.checked })}
                    className="rounded border-neutral-800 text-amber-500 focus:ring-0"
                  />
                  <span>Publish on Website</span>
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
                  {isSaving ? 'Saving...' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
