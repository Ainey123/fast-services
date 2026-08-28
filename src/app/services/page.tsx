'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileQuickBar } from '@/components/layout/MobileQuickBar';
import { getServices } from '@/lib/actions/db';
import { Service } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import {
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    getServices(true)
      .then((data) => {
        setServices(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Unable to load services from database.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);


  const categories = ['ALL', ...Array.from(new Set(services.map((s) => s.category)))];

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* Header Banner */}
        <section className="bg-slate-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Database-Backed Engineering Catalogue
            </div>
            <h1 className="text-3xl sm:text-4xl font-black">
              Engineering Services & Solutions
            </h1>
            <p className="text-slate-400 mt-2 max-w-2xl text-sm sm:text-base">
              Explore our turnkey services. Managed by certified engineers, backed by transparent pricing and rapid on-site deployment.
            </p>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services by keyword or category..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={service.image_url}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full">
                    {service.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {service.name}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                      {service.short_description}
                    </p>

                    {/* Features list mini */}
                    {service.features && service.features.length > 0 && (
                      <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                        {service.features.slice(0, 2).map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {service.price_starting_at && (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Estimated Starting Price</span>
                        <span className="text-sm font-bold text-slate-900">
                          {formatCurrency(service.price_starting_at)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center justify-center px-3 py-2 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold text-center transition-colors"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/request?service=${service.id}`}
                      className="inline-flex items-center justify-center px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center shadow-sm transition-colors"
                    >
                      Request Service
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {loading && (
            <div className="py-20 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-xs text-slate-500 mt-2">Loading services from database...</p>
            </div>
          )}

          {error && !loading && (
            <div className="py-16 text-center bg-rose-50 rounded-2xl border border-rose-200 mt-6 p-6">
              <p className="text-rose-700 font-medium text-base">{error}</p>
              <button
                onClick={loadData}
                className="mt-4 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && services.length === 0 && (
            <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 mt-6">
              <p className="text-slate-600 font-semibold text-lg">No services have been added yet.</p>
              <p className="text-slate-400 text-sm mt-1">Please check back later or contact administration.</p>
            </div>
          )}

          {!loading && !error && services.length > 0 && filteredServices.length === 0 && (
            <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 mt-6">
              <p className="text-slate-500 text-base">
                No services found matching your criteria.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
      <MobileQuickBar />
    </div>
  );
}
