import React, { useState } from 'react';
import type { Product } from '../../lib/types/database';
import { saveProduct, deleteProduct, uploadFile } from '../../lib/supabase/repository';
import { Plus, Edit, Trash2,  X, Upload, Star, Search, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AdminProductsProps {
  products: Product[];
  onRefresh: () => Promise<void>;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({ products, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({
    name: '',
    category: 'Aluminum Profiles',
    short_description: '',
    description: '',
    image_url: '/src/assets/images/product_aluminum_profile_fabrication_1790866959417.jpg',
    featured: false,
    is_active: true,
    sort_order: products.length + 1,
    specifications: {}
  });

  const [search, setSearch] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [specKey, setSpecKey] = useState('');
  const [specVal, setSpecVal] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    'Aluminum Profiles',
    'Glass',
    'Aluminum Doors',
    'Aluminum Windows',
    'Glass Doors',
    'Accessories & Hardware'
  ];

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingProduct({
      name: '',
      category: 'Aluminum Profiles',
      short_description: '',
      description: '',
      image_url: '/src/assets/images/product_aluminum_profile_fabrication_1790866959417.jpg',
      featured: false,
      is_active: true,
      sort_order: products.length + 1,
      specifications: {}
    });
    setSelectedFile(null);
    setIsEditing(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct({ ...prod });
    setSelectedFile(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the product "${name}"?`)) {
      await deleteProduct(id);
      await onRefresh();
    }
  };

  const handleAddSpec = () => {
    if (!specKey.trim() || !specVal.trim()) return;
    setEditingProduct((prev) => ({
      ...prev,
      specifications: {
        ...(prev.specifications || {}),
        [specKey.trim()]: specVal.trim()
      }
    }));
    setSpecKey('');
    setSpecVal('');
  };

  const handleRemoveSpec = (key: string) => {
    setEditingProduct((prev) => {
      const next = { ...(prev.specifications || {}) };
      delete next[key];
      return { ...prev, specifications: next };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct.name?.trim()) return;

    setIsSaving(true);
    setNotification(null);
    try {
      let imageUrl = editingProduct.image_url || '';
      if (selectedFile) {
        imageUrl = await uploadFile('products', selectedFile);
      }

      const saved = await saveProduct({
        ...editingProduct,
        image_url: imageUrl,
        name: editingProduct.name.trim()
      });

      await onRefresh();
      setIsEditing(false);

      if (saved.supabaseError) {
        setNotification({
          type: 'warning',
          message: `Product "${saved.name}" is now live on the public website and saved locally. Note from Supabase: ${saved.supabaseError}. (If RLS is active, review the Supabase Database tab for one-click SQL policy fix).`
        });
      } else {
        setNotification({
          type: 'success',
          message: `Product "${saved.name}" was saved and published successfully to the database and live website!`
        });
      }
    } catch (err: any) {
      console.error('Failed to save product:', err);
      setNotification({
        type: 'error',
        message: err.message || 'Failed to save product.'
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

      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search products..."
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
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-[#14181e] border border-neutral-800 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] font-semibold tracking-wider bg-neutral-900/60">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image_url}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-cover rounded bg-neutral-900 border border-neutral-800"
                      />
                      <div>
                        <div className="font-semibold text-white">{prod.name}</div>
                        <div className="text-[11px] text-neutral-500 font-mono">/products/{prod.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-neutral-300">{prod.category}</td>
                  <td className="py-3 px-4">
                    {prod.featured ? (
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
                        prod.is_active
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {prod.is_active ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">{prod.sort_order}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        title="Edit Product"
                        className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded hover:border-neutral-700 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        title="Delete Product"
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

      {/* Product Edit / Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-[#14181e] border border-neutral-800 rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-800">
              <h3 className="text-lg font-bold font-display text-white">
                {editingProduct.id ? 'Edit Architectural Product' : 'Create New Product'}
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
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="e.g. Slim-Profile Sliding Window Systems"
                  className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingProduct.sort_order ?? 1}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sort_order: parseInt(e.target.value) || 1 })}
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
                  value={editingProduct.short_description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, short_description: e.target.value })}
                  placeholder="Summary for catalog cards..."
                  className="w-full bg-[#0c0f12] border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Full Technical Description
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Comprehensive technical details..."
                  className="w-full bg-[#0c0f12] border border-neutral-800 rounded p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Image Upload / URL */}
              <div className="p-3 bg-[#0c0f12] border border-neutral-800 rounded">
                <label className="block text-xs font-medium text-neutral-300 mb-2">
                  Product Image
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={editingProduct.image_url}
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

              {/* Technical Specifications Key-Value */}
              <div className="p-3 bg-[#0c0f12] border border-neutral-800 rounded">
                <label className="block text-xs font-medium text-neutral-300 mb-2">
                  Technical Specifications Table
                </label>
                <div className="space-y-2 mb-3">
                  {Object.entries(editingProduct.specifications || {}).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between text-xs bg-neutral-900 px-3 py-1.5 rounded">
                      <span className="text-neutral-400">{k}: <strong className="text-white">{v}</strong></span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(k)}
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
                    placeholder="Spec Name (e.g. Alloy Grade)"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    className="flex-1 bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 6063-T5)"
                    value={specVal}
                    onChange={(e) => setSpecVal(e.target.value)}
                    className="flex-1 bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-xs text-white rounded"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_active ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                    className="rounded border-neutral-800 text-amber-500 focus:ring-0"
                  />
                  <span>Publish / Active in Catalog</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="rounded border-neutral-800 text-amber-500 focus:ring-0"
                  />
                  <span>Mark as Featured Product</span>
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
                  {isSaving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
