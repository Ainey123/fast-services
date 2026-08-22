'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/db/data-store';
import { Service } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import {
  Wrench,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Layers,
} from 'lucide-react';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Electrical Engineering');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(25000);
  const [imageUrl, setImageUrl] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const list = await db.getServices(false);
    setServices(list);
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    setName('');
    setCategory('Electrical Engineering');
    setShortDesc('');
    setDescription('');
    setPrice(25000);
    setImageUrl('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80');
    setFeaturesText('Feature item 1\nFeature item 2\nFeature item 3');
    setShowAddModal(true);
  };

  const handleOpenEdit = (s: Service) => {
    setEditingService(s);
    setName(s.name);
    setCategory(s.category);
    setShortDesc(s.short_description);
    setDescription(s.description);
    setPrice(s.price_starting_at || 0);
    setImageUrl(s.image_url);
    setFeaturesText(s.features?.join('\n') || '');
    setShowAddModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const featuresArray = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const slugVal = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    try {
      if (editingService) {
        await db.updateService(editingService.id, {
          name,
          slug: slugVal,
          category,
          short_description: shortDesc,
          description,
          price_starting_at: price,
          image_url: imageUrl,
          features: featuresArray,
        });
      } else {
        await db.createService({
          name,
          slug: slugVal,
          category,
          short_description: shortDesc,
          description,
          price_starting_at: price,
          image_url: imageUrl,
          features: featuresArray,
          is_active: true,
        });
      }
      setShowAddModal(false);
      await loadServices();
    } catch (err) {
      alert('Error saving service');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    await db.updateService(id, { is_active: !current });
    await loadServices();
  };

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
            Service Catalog & Engineering Scope
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Service Catalog Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic database-backed offerings, scope descriptions, features, and pricing tiers.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services by title or domain..."
          className="bg-transparent text-white text-xs w-full focus:outline-none placeholder:text-slate-600"
        />
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div className="h-44 w-full bg-slate-900 relative">
              <img
                src={service.image_url}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                {service.category}
              </div>
              <button
                onClick={() => handleToggleActive(service.id, service.is_active)}
                className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full shadow ${
                  service.is_active ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                }`}
              >
                {service.is_active ? 'ACTIVE' : 'DISABLED'}
              </button>
            </div>

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold text-white line-clamp-1">{service.name}</h2>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {service.short_description}
                </p>

                {service.price_starting_at && (
                  <div className="mt-3 text-xs text-amber-400 font-mono font-bold">
                    Est. Price: {formatCurrency(service.price_starting_at)}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-900 flex items-center justify-between">
                <button
                  onClick={() => handleOpenEdit(service)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-800"
                >
                  <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Edit Scope</span>
                </button>

                <button
                  onClick={() => handleToggleActive(service.id, service.is_active)}
                  className="text-xs font-bold text-slate-400 hover:text-white"
                >
                  {service.is_active ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-500" />
                <span>{editingService ? 'Edit Engineering Service' : 'Add New Service Offering'}</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Industrial Electrical & Power Distribution"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. Electrical Engineering"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Starting Price (PKR)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Hero Image URL
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Summary shown on cards..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Comprehensive Technical Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Full scope of engineering..."
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Included Technical Features (One per line)
                </label>
                <textarea
                  rows={3}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md"
                >
                  {loading ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
