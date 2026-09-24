'use client';

import React from 'react';
import { ReviewStats } from '@/types/database';
import { StarRating } from './StarRating';
import { ShieldCheck, Award, ThumbsUp, Edit3 } from 'lucide-react';

interface ReviewStatsOverviewProps {
  stats: ReviewStats;
  onOpenReviewModal?: () => void;
  showWriteButton?: boolean;
}

export const ReviewStatsOverview: React.FC<ReviewStatsOverviewProps> = ({
  stats,
  onOpenReviewModal,
  showWriteButton = true,
}) => {
  const {
    averageRating = 5.0,
    totalReviews = 0,
    ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    recommendationPercentage = 100,
    verifiedPercentage = 100,
  } = stats;

  const total = Math.max(1, totalReviews);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Big Average Rating Score */}
        <div className="lg:col-span-4 text-center lg:text-left lg:border-r lg:border-slate-100 lg:pr-8 flex flex-col items-center lg:items-start justify-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Customer Satisfaction</span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-slate-400 font-bold text-lg">/ 5.0</span>
          </div>

          <div className="mt-2">
            <StarRating rating={averageRating} size="lg" />
          </div>

          <p className="mt-2 text-xs font-semibold text-slate-500">
            Based on <strong className="text-slate-900">{totalReviews}</strong> authentic client reviews
          </p>

          {showWriteButton && onOpenReviewModal && (
            <button
              onClick={onOpenReviewModal}
              className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              <Edit3 className="w-4 h-4" />
              <span>Write a Customer Review</span>
            </button>
          )}
        </div>

        {/* Center Column: Star Distribution Bars */}
        <div className="lg:col-span-5 space-y-2.5">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">
            Rating Breakdown
          </h4>

          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingCounts[stars as keyof typeof ratingCounts] || 0;
            const percentage = Math.round((count / total) * 100);

            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-bold text-slate-700 flex items-center gap-1">
                  <span>{stars}</span>
                  <span className="text-amber-400">★</span>
                </span>

                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stars >= 4
                        ? 'bg-amber-400'
                        : stars === 3
                        ? 'bg-blue-400'
                        : 'bg-slate-400'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <span className="w-10 text-right font-medium text-slate-500">
                  {count} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Column: Key Trust Highlights */}
        <div className="lg:col-span-3 space-y-3 lg:border-l lg:border-slate-100 lg:pl-8">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <ThumbsUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-black text-emerald-950">
                {recommendationPercentage}%
              </div>
              <div className="text-[11px] font-medium text-emerald-800">
                Recommended by clients
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-black text-blue-950">
                {verifiedPercentage}%
              </div>
              <div className="text-[11px] font-medium text-blue-800">
                Verified On-Site Handover
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
