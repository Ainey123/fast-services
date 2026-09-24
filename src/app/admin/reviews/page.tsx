'use client';

import React, { useState, useEffect } from 'react';
import {
  getAllCustomerReviewsAdmin,
  updateCustomerReview,
  deleteCustomerReview,
  getReviewStats,
} from '@/lib/actions/db';
import { CustomerReview, ReviewStats } from '@/types/database';
import { StarRating } from '@/components/reviews/StarRating';
import { ReviewFormModal } from '@/components/reviews/ReviewFormModal';
import {
  Star,
  ShieldCheck,
  Award,
  Search,
  Filter,
  Trash2,
  CheckCircle,
  XCircle,
  Sparkles,
  Plus,
  RefreshCw,
  Eye,
  Building2,
  MapPin,
  Clock,
  AlertCircle,
} from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED'>('ALL');
  const [ratingFilter, setRatingFilter] = useState<number | 'ALL'>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<CustomerReview | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [revs, st] = await Promise.all([
        getAllCustomerReviewsAdmin(),
        getReviewStats(),
      ]);
      setReviews(revs);
      setStats(st);
    } catch (e) {
      console.error('Error loading admin reviews:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const notify = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleToggleFeatured = async (review: CustomerReview) => {
    try {
      const newFeatured = !review.is_featured;
      await updateCustomerReview(review.id, { is_featured: newFeatured });
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, is_featured: newFeatured } : r))
      );
      notify(`Review by ${review.customer_name} is now ${newFeatured ? 'featured on homepage' : 'unfeatured'}.`);
    } catch (e) {
      notify('Failed to update featured status.');
    }
  };

  const handleStatusChange = async (
    review: CustomerReview,
    newStatus: 'APPROVED' | 'PENDING' | 'REJECTED'
  ) => {
    try {
      await updateCustomerReview(review.id, { status: newStatus });
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, status: newStatus } : r))
      );
      notify(`Review status updated to ${newStatus}.`);
    } catch (e) {
      notify('Failed to update review status.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete the review from "${name}"?`)) {
      return;
    }
    try {
      await deleteCustomerReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      notify(`Review by ${name} has been deleted.`);
      if (selectedReview?.id === id) {
        setSelectedReview(null);
      }
    } catch (e) {
      notify('Failed to delete review.');
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (ratingFilter !== 'ALL' && r.rating !== ratingFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inName = r.customer_name.toLowerCase().includes(q);
      const inTitle = r.review_title.toLowerCase().includes(q);
      const inComment = r.comment.toLowerCase().includes(q);
      const inService = r.service_name.toLowerCase().includes(q);
      const inCompany = r.company_name?.toLowerCase().includes(q) || false;
      if (!inName && !inTitle && !inComment && !inService && !inCompany) return false;
    }
    return true;
  });

  const featuredCount = reviews.filter((r) => r.is_featured).length;
  const approvedCount = reviews.filter((r) => r.status === 'APPROVED').length;

  return (
    <div className="p-6 lg:p-10 space-y-8">
      {/* Toast Notification */}
      {actionMessage && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-blue-600 text-white text-xs font-bold shadow-xl animate-in slide-in-from-top-2 duration-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Review Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Customer Reviews & Ratings Management
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Moderate, feature, and review authentic client ratings from all engineering departments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Refresh database"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client Review</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Average Public Rating</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {stats?.averageRating ? stats.averageRating.toFixed(1) : '5.0'}
            </span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <StarRating rating={stats?.averageRating || 5.0} size="xs" />
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Total Reviews in DB</div>
          <div className="text-3xl font-black text-blue-400">{reviews.length}</div>
          <div className="text-[11px] text-slate-400">{approvedCount} Active Approved</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Featured On Homepage</div>
          <div className="text-3xl font-black text-amber-400">{featuredCount}</div>
          <div className="text-[11px] text-slate-400">Shown on landing carousel</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Satisfaction Index</div>
          <div className="text-3xl font-black text-emerald-400">
            {stats?.recommendationPercentage || 99}%
          </div>
          <div className="text-[11px] text-slate-400">Recommended by clients</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reviews by client, company, service, text..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="ALL">All Moderation Statuses</option>
              <option value="APPROVED">Approved Only</option>
              <option value="PENDING">Pending Approval</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="ALL">All Ratings (1 - 5 Stars)</option>
              <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
              <option value="4">⭐⭐⭐⭐ 4 Stars</option>
              <option value="3">⭐⭐⭐ 3 Stars</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-slate-950/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-xs text-slate-400 mt-2">Loading reviews data...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="font-bold">No customer reviews found matching filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-bold text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Client & Details</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Review Content</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredReviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 px-4 align-top max-w-[200px]">
                      <div className="font-bold text-white text-sm">{rev.customer_name}</div>
                      {rev.customer_role && (
                        <div className="text-[11px] text-blue-400">{rev.customer_role}</div>
                      )}
                      {rev.company_name && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                          <Building2 className="w-3 h-3" />
                          <span>{rev.company_name}</span>
                        </div>
                      )}
                      {rev.location && (
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-rose-400" />
                          <span>{rev.location}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 align-top max-w-[180px]">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-blue-300 font-semibold text-[11px] truncate max-w-full">
                        {rev.service_name}
                      </span>
                    </td>

                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <StarRating rating={rev.rating} size="xs" />
                        <span className="font-black text-white">{rev.rating}.0</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 align-top max-w-[320px]">
                      <div className="font-bold text-white text-xs mb-1">
                        &ldquo;{rev.review_title}&rdquo;
                      </div>
                      <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                        {rev.comment}
                      </p>
                    </td>

                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <button
                        onClick={() => handleToggleFeatured(rev)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors flex items-center gap-1 ${
                          rev.is_featured
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                        }`}
                      >
                        <Star className={`w-3 h-3 ${rev.is_featured ? 'fill-amber-400 text-amber-400' : ''}`} />
                        <span>{rev.is_featured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </td>

                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          rev.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : rev.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {rev.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {rev.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleStatusChange(rev, 'APPROVED')}
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                            title="Approve Review"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {rev.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleStatusChange(rev, 'REJECTED')}
                            className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors"
                            title="Reject Review"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(rev.id, rev.customer_name)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Admin Review Creation Modal */}
      <ReviewFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onReviewSubmitted={(newRev) => {
          setReviews((prev) => [newRev, ...prev]);
          notify(`Review from "${newRev.customer_name}" added successfully.`);
        }}
      />
    </div>
  );
}
