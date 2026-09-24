'use client';

import React, { useState, useEffect } from 'react';
import { StarRating } from './StarRating';
import { addCustomerReview, getServices } from '@/lib/actions/db';
import { Service, CustomerReview } from '@/types/database';
import { X, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: (newReview: CustomerReview) => void;
  defaultServiceId?: string;
  defaultServiceName?: string;
}

export const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
  isOpen,
  onClose,
  onReviewSubmitted,
  defaultServiceId,
  defaultServiceName,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [customerName, setCustomerName] = useState('');
  const [customerRole, setCustomerRole] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [serviceId, setServiceId] = useState(defaultServiceId || '');
  const [serviceName, setServiceName] = useState(defaultServiceName || '');
  const [reviewTitle, setReviewTitle] = useState('');
  const [comment, setComment] = useState('');
  const [location, setLocation] = useState('Lahore, Pakistan');
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getServices(true)
      .then((srvs) => {
        setServicesList(srvs);
        if (!serviceName && defaultServiceId) {
          const match = srvs.find((s) => s.id === defaultServiceId);
          if (match) setServiceName(match.name);
        } else if (!serviceName && srvs.length > 0) {
          setServiceId(srvs[0].id);
          setServiceName(srvs[0].name);
        }
      })
      .catch(() => null);
  }, [defaultServiceId, defaultServiceName, serviceName]);

  if (!isOpen) return null;

  const ratingDescriptions: Record<number, string> = {
    5: '⭐⭐⭐⭐⭐ 5 Stars — Outstanding Engineering & Flawless Execution',
    4: '⭐⭐⭐⭐ 4 Stars — Very Good Service & Professional Team',
    3: '⭐⭐⭐ 3 Stars — Satisfactory Work & Met Requirements',
    2: '⭐⭐ 2 Stars — Needed Improvement in Certain Areas',
    1: '⭐ 1 Star — Poor Experience',
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'custom') {
      setServiceId('');
      setServiceName('');
    } else {
      setServiceId(val);
      const match = servicesList.find((s) => s.id === val);
      if (match) setServiceName(match.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const finalServiceName = serviceName.trim() || 'General Engineering & Construction';
    if (!reviewTitle.trim()) {
      setError('Please provide a brief title for your review.');
      return;
    }

    if (!comment.trim() || comment.trim().length < 15) {
      setError('Please share at least a couple of sentences detailing your experience (minimum 15 characters).');
      return;
    }

    setSubmitting(true);

    try {
      const createdReview = await addCustomerReview({
        customer_name: customerName,
        customer_role: customerRole || undefined,
        company_name: companyName || undefined,
        service_id: serviceId || undefined,
        service_name: finalServiceName,
        rating,
        review_title: reviewTitle,
        comment,
        location: location || 'Lahore, Pakistan',
      });

      setSuccess(true);
      if (onReviewSubmitted) {
        onReviewSubmitted(createdReview);
      }

      setTimeout(() => {
        setSuccess(false);
        onClose();
        // Reset form
        setReviewTitle('');
        setComment('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-7 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Customer Feedback</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Write a Review & Rating
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Share your on-site engineering or construction experience with Fast Services
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {success ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-slate-900">
                Thank You for Your Review!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your feedback has been verified and recorded directly into our customer ratings database. We appreciate your partnership!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Star Rating Picker */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center sm:text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Overall Rating Score <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <StarRating
                    rating={rating}
                    size="xl"
                    interactive
                    onRatingChange={(r) => setRating(r)}
                  />
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200/80">
                    {ratingDescriptions[rating] || `${rating} Stars`}
                  </span>
                </div>
              </div>

              {/* Service Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Engineering Service / Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={serviceId || (serviceName ? 'custom' : '')}
                    onChange={handleServiceChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    {servicesList.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {srv.name} ({srv.category})
                      </option>
                    ))}
                    <option value="custom">Other / Custom Plot or Service</option>
                  </select>
                </div>

                {(!serviceId || serviceId === 'custom') && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Service Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      placeholder="e.g. LDA Avenue Plot Demarcation"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Lahore, Islamabad, Multan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Customer Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Engr. Tariq Mahmood"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Designation / Role
                  </label>
                  <input
                    type="text"
                    value={customerRole}
                    onChange={(e) => setCustomerRole(e.target.value)}
                    placeholder="e.g. Director, Plot Owner, Resident"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Company / Society Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Crescent Mills, LDA Avenue"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Review Headline / Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Review Headline / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Rapid 45-min mobilization and superb quality electrical work"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              {/* Review Comment Textarea */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Detailed Experience & Comments <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Please describe how Fast Engineering Solutions executed your project, communication quality, timelines, safety compliance, and overall results..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"
                ></textarea>
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all"
                >
                  {submitting ? 'Submitting Review...' : 'Publish Customer Review'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
