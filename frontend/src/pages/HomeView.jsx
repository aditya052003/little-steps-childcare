import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import CenterCard from '../components/CenterCard';
import BookingModal from '../components/BookingModal';
import { api } from '../services/api';
import { ShieldCheck, Moon, Clock, Heart, Users, Sparkles, Award, CheckCircle2 } from 'lucide-react';

export default function HomeView({ onSelectCenter, onNavigate }) {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCenterForBooking, setSelectedCenterForBooking] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    is24x7: '',
    ageGroup: '',
    timingType: '',
    maxPrice: ''
  });

  const loadCenters = async () => {
    setLoading(true);
    try {
      const res = await api.getCenters(filters);
      if (res.success) {
        setCenters(res.data);
      }
    } catch (err) {
      console.error('Failed to load centers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCenters();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      is24x7: '',
      ageGroup: '',
      timingType: '',
      maxPrice: ''
    });
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-white to-slate-50 pt-10 pb-14 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-4 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>India & Global 24×7 Childcare Safe Network</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight sm:leading-tight">
              Loving, Verified Childcare <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-rose-500">
                Any Hour, Day or Night.
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              Designed for shift workers, healthcare heroes, and working parents. Instant slot booking, verified pediatric caregivers, soundproof snooze pods, and transparent pricing.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200/80 max-w-2xl mx-auto text-left">
              <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100">
                <div className="text-xl font-extrabold text-slate-900">24 / 7</div>
                <div className="text-xs text-slate-500 font-medium">Continuous Care</div>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100">
                <div className="text-xl font-extrabold text-emerald-600">100%</div>
                <div className="text-xs text-slate-500 font-medium">Police & CPR Verified</div>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100">
                <div className="text-xl font-extrabold text-indigo-600">1:3</div>
                <div className="text-xs text-slate-500 font-medium">Infant Care Ratio</div>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100">
                <div className="text-xl font-extrabold text-brand-600">&lt; 3 min</div>
                <div className="text-xs text-slate-500 font-medium">Instant Slot Confirmation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory Section with Multi-Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Verified Daycare & Crèche Centers
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Explore accredited centers with live capacity, infant snooze pods, and transparent hourly rates.
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            Showing {centers.length} Available Centers
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          onReset={handleResetFilters}
        />

        {/* Center Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : centers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <Moon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No daycare centers match your criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Try relaxing your filters or search keywords to view other centers across Metro City.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-brand-500 text-white rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centers.map((center) => (
              <CenterCard
                key={center.id}
                center={center}
                onSelect={(c) => onSelectCenter(c.id)}
                onBookNow={(c) => setSelectedCenterForBooking(c)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trust & Safety Features Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              The Little Steps Safety Manifesto
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Safety isn't a feature. <br />It's our absolute foundation.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every crèche on Little Steps undergoes stringent 5-point verification including state child licensing, pediatric nurse certifications, 24×7 CCTV monitoring, and sanitized sleeping hygiene.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Police criminal background clearance</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pediatric CPR & first aid certified</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Strict anti-overbooking capacity guards</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tamper-proof digital biometric check-ins</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedCenterForBooking && (
        <BookingModal
          center={selectedCenterForBooking}
          isOpen={!!selectedCenterForBooking}
          onClose={() => setSelectedCenterForBooking(null)}
          onSuccess={() => onNavigate('parent_dashboard')}
        />
      )}
    </div>
  );
}
