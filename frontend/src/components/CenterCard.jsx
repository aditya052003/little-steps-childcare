import React from 'react';
import StarRating from './StarRating';
import VerificationBadge from './VerificationBadge';
import { MapPin, Users, Sparkles, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CenterCard({ center, onSelect, onBookNow }) {
  // calculate total capacity
  let totalCap = 0;
  let occCap = 0;
  if (center.capacity) {
    Object.values(center.capacity).forEach(c => {
      totalCap += (c.total || 0);
      occCap += (c.occupied || 0);
    });
  }
  const spotsLeft = Math.max(0, totalCap - occCap);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Card Image Banner */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={center.images && center.images[0] ? center.images[0] : 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80'}
          alt={center.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Badges on image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {center.is24x7 && <VerificationBadge type="24x7" text="24×7 Day & Night" />}
          {center.verificationStatus === 'verified' && <VerificationBadge type="verified" />}
          {center.verificationStatus === 'pending_verification' && <VerificationBadge type="pending" />}
        </div>

        {/* Distance pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
          <MapPin className="w-3 h-3 text-brand-400" />
          <span>{center.distance || center.city}</span>
        </div>

        {/* Real-time Spots Left */}
        <div className="absolute bottom-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-sm flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          <span>{spotsLeft > 0 ? `${spotsLeft} Spots Open` : 'Waitlist Only'}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Address */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <StarRating rating={center.rating} reviewCount={center.reviewCount} />
            <span className="text-[11px] text-slate-400 font-mono">
              {center.licenseNumber || 'Licensed'}
            </span>
          </div>

          {/* Center Name */}
          <h3
            onClick={() => onSelect(center)}
            className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors cursor-pointer line-clamp-1"
          >
            {center.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            {center.tagline || center.address}
          </p>

          {/* Age Group Pills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {center.ageGroups?.map((ag) => (
              <span
                key={ag}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 capitalize"
              >
                {ag}
              </span>
            ))}
            {center.timingTypes?.includes('night') && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                Night Snooze Pods
              </span>
            )}
          </div>

          {/* Safety highlight */}
          {center.safetyFeatures && center.safetyFeatures.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{center.safetyFeatures[0]}</span>
            </div>
          )}
        </div>

        {/* Pricing & Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Starting from</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">
                ${center.pricing?.hourly || 18}
              </span>
              <span className="text-xs text-slate-500 font-medium">/hr</span>
              <span className="text-xs text-slate-400 ml-1">(${center.pricing?.daily || 90}/day)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelect(center)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => onBookNow(center)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1"
            >
              <span>Book Slot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
