'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileQuickBar } from '@/components/layout/MobileQuickBar';
import { getCustomerReviews, getReviewStats, getServices, getCompanySettings } from '@/lib/actions/db';
import { CustomerReview, ReviewStats, Service, CompanySettings } from '@/types/database';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { ReviewStatsOverview } from '@/components/reviews/ReviewStatsOverview';
import { ReviewFormModal } from '@/components/reviews/ReviewFormModal';
import { StarRating } from '@/components/reviews/StarRating';
import {
  Star,
  ShieldCheck,
  Award,
  Search,
  Filter,
  Edit3,
  MessageSquare,
  Phone,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Building2,
  RefreshCw,
} from 'lucide-react';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStar, setSelectedStar] = useState<number | 'ALL'>('ALL');
  const [selectedService, setSelectedService] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'HIGHEST' | 'FEATURED'>('FEATURED');

  const loadData = async () => {
    setLoading(true);
    try {
      const [revs, st, srvs, setts] = await Promise.all([
        getCustomerReviews({ limit: 100 }),
        getReviewStats(),
        getServices(true).catch(() => []),
        getCompanySettings().catch(() => null),
      ]);
      setReviews(revs);
      setStats(st);
      setServices(srvs);
      setSettings(setts);
    } catch (e) {
      console.error('Error loading reviews:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReviewSubmitted = (newReview: CustomerReview) => {
    setReviews((prev) => [newReview, ...prev]);
    if (stats) {
      setStats({
        ...stats,
        totalReviews: stats.totalReviews + 1,
      });
    }
  };

  // Filter & Sort Logic
  const filteredReviews = reviews
    .filter((r) => {
      // Star Filter
      if (selectedStar !== 'ALL' && r.rating !== selectedStar) return false;

      // Service Filter
      if (selectedService !== 'ALL') {
        const matchesId = r.service_id === selectedService;
        const matchesName = r.service_name.toLowerCase().includes(selectedService.toLowerCase());
        if (!matchesId && !matchesName) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = r.customer_name.toLowerCase().includes(q);
        const inCompany = r.company_name?.toLowerCase().includes(q) || false;
        const inRole = r.customer_role?.toLowerCase().includes(q) || false;
        const inTitle = r.review_title.toLowerCase().includes(q);
        const inComment = r.comment.toLowerCase().includes(q);
        const inService = r.service_name.toLowerCase().includes(q);
        const inLocation = r.location?.toLowerCase().includes(q) || false;
        if (!inName && !inCompany && !inRole && !inTitle && !inComment && !inService && !inLocation) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'FEATURED') {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === 'HIGHEST') {
        return b.rating - a.rating;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const cleanPhone = settings?.phone || '+92 300 4545280';
  const cleanWhatsApp = (settings?.whatsapp || '+923004545280').replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* Hero Header */}
        <section className="relative bg-slate-950 text-white overflow-hidden py-16 border-b border-slate-800">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Verified Customer Ratings & Reviews Registry</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                  Customer Reviews & Engineering Ratings
                </h1>

                <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                  Discover genuine reviews from property owners, industrial plants, commercial towers, and plot developers who rely on <strong>Fast Engineering Solutions</strong>.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-105"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Write a Customer Review</span>
                  </button>

                  <Link
                    href="/request"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm transition-all"
                  >
                    <span>Request Engineering Service</span>
                    <ArrowRight className="w-4 h-4 text-blue-400" />
                  </Link>
                </div>
              </div>

              {/* Quick Trust Pill */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-md max-w-sm w-full space-y-3 shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Satisfaction Index</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                    99% High Approval
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">
                    {stats?.averageRating ? stats.averageRating.toFixed(1) : '4.9'}
                  </span>
                  <span className="text-slate-400 text-sm font-semibold">/ 5.0 Rating</span>
                </div>

                <StarRating rating={stats?.averageRating || 4.9} size="sm" />

                <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
                  Certified PEC standards, transparent billing, and digital GPS on-site verification.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Overview Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <ReviewStatsOverview
            stats={
              stats || {
                averageRating: 5.0,
                totalReviews: reviews.length,
                ratingCounts: { 5: reviews.length, 4: 0, 3: 0, 2: 0, 1: 0 },
                recommendationPercentage: 99,
                verifiedPercentage: 100,
              }
            }
            onOpenReviewModal={() => setIsModalOpen(true)}
          />
        </div>

        {/* Filter, Search & Directory Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Search Bar */}
              <div className="md:col-span-4 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reviews by client, service, city, keyword..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Service Filter */}
              <div className="md:col-span-3">
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  aria-label="Filter by Service"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="ALL">All Services & Departments</option>
                  <option value="plot">Plot & Real Estate Hub</option>
                  <option value="electrical">Electrical & Substation</option>
                  <option value="solar">Solar Energy EPC</option>
                  <option value="construction">Turnkey Construction</option>
                  <option value="generator">Generator Overhauling</option>
                  <option value="hvac">HVAC & Chiller Plants</option>
                  <option value="plumbing">Plumbing & Drainage</option>
                </select>
              </div>

              {/* Star Rating Filter */}
              <div className="md:col-span-3">
                <select
                  value={selectedStar}
                  onChange={(e) => setSelectedStar(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                  aria-label="Filter by Star Rating"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="ALL">All Star Ratings</option>
                  <option value="5">⭐⭐⭐⭐⭐ 5 Stars Only</option>
                  <option value="4">⭐⭐⭐⭐ 4 Stars Only</option>
                  <option value="3">⭐⭐⭐ 3 Stars Only</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="md:col-span-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Sort Reviews"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="FEATURED">Featured First</option>
                  <option value="NEWEST">Newest First</option>
                  <option value="HIGHEST">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Filter Pills Summary */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
              <span className="font-semibold text-slate-500">
                Showing <strong className="text-slate-900">{filteredReviews.length}</strong> verified customer reviews
              </span>

              <div className="flex items-center gap-2">
                {(searchQuery || selectedStar !== 'ALL' || selectedService !== 'ALL') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedStar('ALL');
                      setSelectedService('ALL');
                    }}
                    className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                  >
                    <span>Reset Filters</span>
                  </button>
                )}
                <button
                  onClick={loadData}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                  title="Refresh Reviews"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Grid */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm font-semibold text-slate-500 mt-3">Loading verified customer reviews...</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="py-20 bg-white rounded-3xl border border-slate-200 text-center p-8 max-w-xl mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No matching reviews found</h3>
              <p className="text-sm text-slate-500 mt-2">
                Try adjusting your search criteria or write the first review for this service.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-md shadow-blue-500/20"
              >
                <Edit3 className="w-4 h-4" />
                <span>Write a Customer Review</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}

          {/* Bottom Help & Inquiry Banner */}
          <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Experience the Fast Services Difference</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Ready to Start Your Construction or Engineering Project?
              </h3>
              <p className="text-slate-300 text-sm">
                Get a transparent quotation, certified engineering consultation, and 24/7 SLA response.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <Link
                href="/request"
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-105"
              >
                <span>Request Service</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                  'Hello Fast Services, I saw your customer reviews and want to inquire about your engineering services.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-105"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Desk</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileQuickBar />

      {/* Review Submission Modal */}
      <ReviewFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
}
