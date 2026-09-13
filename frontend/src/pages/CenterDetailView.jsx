import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import VerificationBadge from '../components/VerificationBadge';
import BookingModal from '../components/BookingModal';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Clock,
  Baby,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  MessageSquare,
  Send
} from 'lucide-react';

export default function CenterDetailView({ centerId, onBack, onNavigate }) {
  const { currentUser, showToast } = useAuth();
  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchCenter = async () => {
    setLoading(true);
    try {
      const res = await api.getCenterById(centerId);
      if (res.success) {
        setCenter(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch center detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenter();
  }, [centerId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await api.submitReview({
        centerId: center.id,
        parentName: currentUser?.name || 'Verified Parent',
        rating: newRating,
        comment: newComment,
        childAgeGroup: currentUser?.children?.[0]?.ageGroup || 'Toddler'
      });
      if (res.success) {
        showToast('Thank you! Your verified review has been published.', 'success');
        setNewComment('');
        fetchCenter(); // reload reviews and rating
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-slate-500 text-xs">Loading daycare details & safety profile...</p>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-lg font-bold text-slate-800">Daycare Center Not Found</h2>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-brand-500 text-white rounded-xl text-xs font-bold"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* Back Button & Top Meta */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Daycares</span>
        </button>
        <div className="flex items-center gap-2">
          {center.is24x7 && <VerificationBadge type="24x7" text="24×7 Day & Night Active" />}
          {center.verificationStatus === 'verified' && <VerificationBadge type="verified" />}
        </div>
      </div>

      {/* Main Header & Image Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-200 h-80 sm:h-96 relative bg-slate-100">
            <img
              src={center.images?.[0] || 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80'}
              alt={center.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
              <div className="flex items-center gap-2 mb-1">
                <StarRating rating={center.rating} reviewCount={center.reviewCount} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black">{center.name}</h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
                {center.tagline}
              </p>
            </div>
          </div>

          {/* Small Thumbnails Row */}
          {center.images && center.images.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {center.images.map((img, idx) => (
                <div key={idx} className="h-24 rounded-2xl overflow-hidden border border-slate-200">
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sticky Booking & Quick Info Box */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-24 space-y-6">
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Transparent Pricing
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-slate-900">${center.pricing?.hourly}</span>
                <span className="text-xs text-slate-500 font-bold">/ hour</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Day pass: <strong>${center.pricing?.daily}/day</strong> • Monthly:{' '}
                <strong>${center.pricing?.monthly}/mo</strong>
              </div>
            </div>

            {/* Room Capacity Status */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
              <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Real-Time Room Capacity</span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  Live Tracking
                </span>
              </div>
              {center.capacity &&
                Object.entries(center.capacity).map(([room, cap]) => {
                  const pct = Math.round((cap.occupied / cap.total) * 100);
                  return (
                    <div key={room} className="text-xs">
                      <div className="flex justify-between text-slate-600 mb-1">
                        <span className="capitalize">{room} Room:</span>
                        <span className="font-semibold">
                          {cap.occupied} / {cap.total} spots ({cap.total - cap.occupied} left)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            pct >= 90 ? 'bg-rose-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Book Slot Button */}
            <button
              type="button"
              onClick={() => setIsBookingOpen(true)}
              className="w-full py-3.5 px-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/25 transition-all text-sm flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Childcare Slot</span>
            </button>

            {/* Operating Hours & Contact */}
            <div className="text-xs space-y-2 text-slate-600 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                <span><strong>Hours:</strong> {center.operatingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{center.address}</span>
              </div>
              {center.contact?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{center.contact.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Facility Highlights & Amenities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Safety & Verification Standards
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-600">
            {center.safetyFeatures?.map((f, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Infrastructure & Amenities
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-600">
            {center.amenities?.map((a, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Caregiver Roster Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-500" />
            Verified Caregivers & Night Nannies on Roster
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Caregivers assigned to your child have completed thorough police verification, pediatric CPR, and background clearance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {center.caregivers?.map((cg) => (
            <div
              key={cg.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={cg.avatar}
                  alt={cg.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div>
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1">
                    <span>{cg.name}</span>
                    {cg.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />}
                  </div>
                  <div className="text-[11px] text-brand-600 font-medium">{cg.roleTitle}</div>
                  <div className="text-[10px] text-slate-400">{cg.shift}</div>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 italic">"{cg.bio}"</p>

              <div className="pt-2 border-t border-slate-200/60">
                <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Certifications
                </div>
                <div className="flex flex-wrap gap-1">
                  {cg.certifications?.map((c, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-medium"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Parent Reviews & Feedback */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-500" />
              Verified Parent Reviews ({center.reviews?.length || 0})
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Authentic reviews from parents who booked and completed childcare stays.
            </p>
          </div>
          <div className="text-right">
            <StarRating rating={center.rating} reviewCount={center.reviewCount} size="w-5 h-5" />
          </div>
        </div>

        {/* Existing Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {center.reviews?.map((r) => (
            <div key={r.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs text-slate-900">{r.parentName}</div>
                <StarRating rating={r.rating} />
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span>{r.date}</span>
                <span>•</span>
                <span>Child: {r.childAgeGroup}</span>
                {r.verifiedStay && (
                  <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">
                    Verified Stay
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">"{r.comment}"</p>
            </div>
          ))}
        </div>

        {/* Add Review Form */}
        <form onSubmit={handleReviewSubmit} className="pt-6 border-t border-slate-100 space-y-3">
          <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
            Leave a Verified Parent Review
          </h4>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-600">Your Rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className={`text-base ${
                    star <= newRating ? 'text-amber-400' : 'text-slate-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your experience regarding facility hygiene, sleep quality, and caregiver attention..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submittingReview ? 'Submitting...' : 'Post'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <BookingModal
          center={center}
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          onSuccess={() => onNavigate('parent_dashboard')}
        />
      )}
    </div>
  );
}
