'use client';

import React from 'react';
import { CustomerReview } from '@/types/database';
import { StarRating } from './StarRating';
import { ShieldCheck, MapPin, Building2, Quote } from 'lucide-react';

interface ReviewCardProps {
  review: CustomerReview;
  compact?: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, compact = false }) => {
  // Generate consistent avatar background based on initial
  const initials = review.customer_name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const formattedDate = review.created_at
    ? new Date(review.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between ${
        compact ? 'p-5' : 'p-6'
      } relative overflow-hidden group`}
    >
      {/* Subtle top decorative bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-amber-400 to-emerald-500 opacity-80 group-hover:h-1.5 transition-all"></div>

      <div>
        {/* Header: User Info & Verified Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-sm flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-slate-900 text-base leading-tight">
                  {review.customer_name}
                </h4>
                {review.is_verified && (
                  <span
                    className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200/60"
                    title="Verified Customer Order"
                  >
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500 mt-0.5">
                {review.customer_role && (
                  <span className="font-medium text-slate-700">
                    {review.customer_role}
                  </span>
                )}
                {review.customer_role && (review.company_name || review.location) && (
                  <span>•</span>
                )}
                {review.company_name && (
                  <span className="flex items-center gap-1 text-slate-600 truncate max-w-[180px]">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    {review.company_name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <span className="text-[11px] font-medium text-slate-400 flex-shrink-0">
            {formattedDate}
          </span>
        </div>

        {/* Rating & Service Tag */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-xs font-black text-slate-800">
              {review.rating}.0 / 5.0
            </span>
          </div>

          {review.service_name && (
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50/90 border border-blue-200/60 px-2.5 py-0.5 rounded-full truncate max-w-[220px]">
              {review.service_name}
            </span>
          )}
        </div>

        {/* Review Title */}
        <h5 className="font-bold text-slate-900 text-sm mb-2 group-hover:text-blue-600 transition-colors">
          &ldquo;{review.review_title}&rdquo;
        </h5>

        {/* Review Comment */}
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-4">
          {review.comment}
        </p>
      </div>

      {/* Footer info: Location */}
      {review.location && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-500" />
            <span>{review.location}</span>
          </span>
          <Quote className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
        </div>
      )}
    </div>
  );
};
