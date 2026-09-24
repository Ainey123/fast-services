'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CustomerReview, ReviewStats } from '@/types/database';
import { getCustomerReviews, getReviewStats } from '@/lib/actions/db';
import { ReviewCard } from './ReviewCard';
import { StarRating } from './StarRating';
import { ReviewFormModal } from './ReviewFormModal';
import {
  Star,
  ShieldCheck,
  Award,
  ArrowRight,
  Edit3,
  ThumbsUp,
  MessageSquareQuote,
  Sparkles,
} from 'lucide-react';

export const ReviewsHomeSection: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    async function loadReviewsData() {
      try {
        const [revs, st] = await Promise.all([
          getCustomerReviews({ limit: 6, featuredOnly: true }),
          getReviewStats(),
        ]);
        setReviews(revs);
        setStats(st);
      } catch (e) {
        console.error('Error loading homepage reviews:', e);
      } finally {
        setLoading(false);
      }
    }
    loadReviewsData();
  }, []);

  const categories = [
    { id: 'ALL', label: 'All Reviews' },
    { id: 'ELECTRICAL', label: 'Electrical & HV Substation' },
    { id: 'PLOT', label: 'Plot & Real Estate' },
    { id: 'SOLAR', label: 'Solar Power EPC' },
    { id: 'CONSTRUCTION', label: 'Turnkey Construction' },
  ];

  const filteredReviews = reviews.filter((r) => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'ELECTRICAL')
      return r.service_name.toLowerCase().includes('electr') || r.service_name.toLowerCase().includes('substation');
    if (selectedCategory === 'PLOT')
      return (
        r.service_name.toLowerCase().includes('plot') ||
        r.service_name.toLowerCase().includes('boundary') ||
        r.service_name.toLowerCase().includes('demarcation')
      );
    if (selectedCategory === 'SOLAR')
      return r.service_name.toLowerCase().includes('solar');
    if (selectedCategory === 'CONSTRUCTION')
      return (
        r.service_name.toLowerCase().includes('construction') ||
        r.service_name.toLowerCase().includes('grey') ||
        r.service_name.toLowerCase().includes('building')
      );
    return true;
  });

  const handleReviewSubmitted = (newReview: CustomerReview) => {
    setReviews((prev) => [newReview, ...prev]);
    if (stats) {
      setStats({
        ...stats,
        totalReviews: stats.totalReviews + 1,
      });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-slate-200 relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 text-xs font-bold uppercase tracking-wider mb-3">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Verified Customer Ratings & Testimonials</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Trusted by Industrial Leaders & Property Owners Across Pakistan
            </h2>

            <p className="mt-3 text-slate-600 text-base">
              Real reviews from commercial facilities, factory directors, residential clients, and plot owners in Lahore, Islamabad, and nationwide.
            </p>
          </div>

          {/* Quick Rating Summary Card on Top Right */}
          <div className="flex-shrink-0 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
            <div className="text-center border-r border-slate-100 pr-4">
              <div className="text-3xl font-black text-slate-900">
                {stats?.averageRating ? stats.averageRating.toFixed(1) : '5.0'}
              </div>
              <StarRating rating={stats?.averageRating || 5.0} size="xs" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Verified Clients</span>
              </div>
              <div className="text-[11px] text-slate-500">
                {stats?.totalReviews || 8} Active Public Reviews
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Edit3 className="w-3 h-3" />
                <span>Submit Your Review →</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-xs text-slate-500 mt-2">Loading customer ratings...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center p-6">
            <MessageSquareQuote className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700">No reviews found in this category.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm"
            >
              Be the first to review this service
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.slice(0, 6).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {/* Bottom CTA Row */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <ThumbsUp className="w-4 h-4 text-emerald-600" />
            <span>Over 99% satisfaction rate across 500+ executed engineering jobs.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all hover:scale-105"
            >
              <Edit3 className="w-4 h-4 text-amber-400" />
              <span>Write a Review</span>
            </button>

            <Link
              href="/reviews"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-all hover:scale-105"
            >
              <span>View All Customer Reviews</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
            </Link>
          </div>
        </div>
      </div>

      {/* Review Submission Modal */}
      <ReviewFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </section>
  );
};
