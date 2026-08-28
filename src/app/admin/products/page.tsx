'use client';

import React, { useState, useEffect } from 'react';
import {
  getProducts,
  getProjects,
  createProduct,
  addProductUsage,
  deleteProduct,
} from '@/lib/actions/db';
import { Product, Project } from '@/types/database';
import { formatCurrency, formatDate, getStatusBadgeClass } from '@/lib/utils';
import {
  Package,
  Plus,
  Search,
  CheckCircle2,
  Wrench,
  X,
  Layers,
  ArrowRight,
  TrendingDown,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New Product Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Electrical Wiring');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('meters');
  const [price, setPrice] = useState<number>(1500);
  const [stock, setStock] = useState<number>(500);

  // Usage Form
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [quantityUsed, setQuantityUsed] = useState<number>(10);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setError(null);
    try {
      const prds = await getProducts();
      const prjs = await getProjects();
      setProducts(prds);
      setProjects(prjs);
      if (prds.length > 0 && !selectedProductId) setSelectedProductId(prds[0].id);
      if (prjs.length > 0 && !selectedProjectId) setSelectedProjectId(prjs[0].id);
    } catch (err: any) {
      console.error(err);
      setError('Unable to load products from database.');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProduct({
        name,
        category,
        description,
        unit,
        price,
        stock,
        status: 'ACTIVE',
      });
      setShowAddModal(false);
      setName('');
      setDescription('');
      setFeedback('Product added to enterprise inventory in Neon PostgreSQL.');
      setTimeout(() => setFeedback(null), 4000);
      await loadAll();
    } catch (err: any) {
      alert(err.message || 'Error creating product in database.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogUsage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addProductUsage({
        project_id: selectedProjectId,
        product_id: selectedProductId,
        quantity: quantityUsed,
      });
      setShowUsageModal(false);
      setFeedback('Product consumption successfully recorded and stock deducted in PostgreSQL.');
      setTimeout(() => setFeedback(null), 4000);
      await loadAll();
    } catch (err: any) {
      alert(err.message || 'Error logging product usage in database.');
    } finally {
      setLoading(false);
    }
  };


  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.product_code.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Inventory & Project Materials
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Products & Materials Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track warehouse inventory, unit costs, and record material consumption across projects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUsageModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 text-xs font-bold transition-all"
          >
            <TrendingDown className="w-4 h-4" />
            <span>Log Product Usage in Project</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Search */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by SKU code, name, category..."
          className="bg-transparent text-white text-xs w-full focus:outline-none placeholder:text-slate-600"
        />
      </div>

      {/* Products Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px] bg-slate-900/60">
                <th className="py-4 px-6">SKU Code & Product</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Unit Price</th>
                <th className="py-4 px-6">Current Stock</th>
                <th className="py-4 px-6">Inventory Value</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-white text-sm">{p.name}</div>
                    <div className="font-mono text-[10px] text-amber-400">{p.product_code}</div>
                  </td>
                  <td className="py-4 px-6 text-slate-300">{p.category}</td>
                  <td className="py-4 px-6 font-mono font-bold text-slate-200">
                    {formatCurrency(p.price)} / {p.unit}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`font-mono font-bold ${
                        p.stock < 50 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {p.stock} {p.unit}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-300">
                    {formatCurrency(p.stock * p.price)}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${getStatusBadgeClass(
                        p.status
                      )}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={async () => {
                        if (window.confirm(`Permanently delete product "${p.name}"?`)) {
                          try {
                            await deleteProduct(p.id);
                            await loadAll();
                            setFeedback(`Product "${p.name}" deleted from database.`);
                            setTimeout(() => setFeedback(null), 3000);
                          } catch {
                            alert('Failed to delete product from database.');
                          }
                        }
                      }}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 transition-all inline-flex items-center"
                      title="Delete Product"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Usage in Project Modal */}
      {showUsageModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-amber-400" />
                <span>Log Product Usage in Project</span>
              </h2>
              <button
                onClick={() => setShowUsageModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogUsage} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Select Project
                </label>
                <select
                  required
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {projects.map((pr) => (
                    <option key={pr.id} value={pr.id}>
                      {pr.project_code} - {pr.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Select Material / Product
                </label>
                <select
                  required
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name} (Stock: {prod.stock} {prod.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Quantity Consumed
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantityUsed}
                  onChange={(e) => setQuantityUsed(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUsageModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md"
                >
                  {loading ? 'Deducting...' : 'Record Consumption'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-500" />
                <span>Add Product to Inventory</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Product Name / Specification
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. 4-Core 16mm² XLPE Copper Armoured Cable"
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
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Measurement Unit
                  </label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="meters, pieces, panels..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Unit Price (PKR)
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Initial Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
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
                  {loading ? 'Saving...' : 'Add to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
