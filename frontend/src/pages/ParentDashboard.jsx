import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Calendar,
  Clock,
  Baby,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Phone,
  ShieldCheck,
  PlusCircle,
  FileText,
  XCircle
} from 'lucide-react';

export default function ParentDashboard({ onNavigate, onSelectCenter }) {
  const { currentUser, showToast } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const [bRes, sRes] = await Promise.all([
        api.getBookings({ userId: currentUser.id }),
        api.getUserSubscriptions(currentUser.id)
      ]);
      if (bRes.success) setBookings(bRes.data);
      if (sRes.success) setSubscriptions(sRes.data);
    } catch (err) {
      console.error('Error loading parent dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this childcare reservation?')) return;
    try {
      const res = await api.updateBookingStatus(bookingId, 'cancelled', 'Parent requested cancellation');
      if (res.success) {
        showToast('Childcare reservation cancelled', 'info');
        loadData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to cancel booking', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            Confirmed by Center
          </span>
        );
      case 'checked_in':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Currently In Daycare
          </span>
        );
      case 'pending_provider_approval':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Awaiting Confirmation
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
            Completed Stay
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            Cancelled
          </span>
        );
      default:
        return <span className="text-xs text-slate-500 capitalize">{status}</span>;
    }
  };

  const activeBookings = bookings.filter(b => ['confirmed', 'checked_in', 'pending_provider_approval'].includes(b.status));
  const pastBookings = bookings.filter(b => ['completed', 'cancelled'].includes(b.status));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* Top Banner: Parent Welcome & Family Snapshot */}
      <div className="bg-gradient-to-r from-brand-50 via-white to-indigo-50/40 p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">{currentUser?.name}</h1>
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                Verified Parent
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
              <span>{currentUser?.email}</span>
              <span>•</span>
              <span>{currentUser?.phone}</span>
            </p>
          </div>
        </div>

        {/* Children Registered Pills */}
        <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
          <div className="text-xs">
            <div className="font-bold text-slate-800 flex items-center gap-1">
              <Baby className="w-3.5 h-3.5 text-brand-500" />
              Registered Children
            </div>
            <div className="text-slate-500 mt-1 flex gap-2">
              {currentUser?.children?.map(ch => (
                <span key={ch.id} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md text-[11px] font-semibold">
                  {ch.name} ({ch.age})
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors whitespace-nowrap"
          >
            + Book New Slot
          </button>
        </div>
      </div>

      {/* Subscription Active Banner */}
      {subscriptions.length > 0 && (
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-md border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-brand-400">
                <Sparkles className="w-4 h-4" />
                Active 24×7 Childcare Subscription
              </div>
              <h3 className="text-xl font-bold">{subscriptions[0].planName}</h3>
              <p className="text-xs text-slate-400">
                Center: <strong>{subscriptions[0].associatedCenterName}</strong> • Renews on {subscriptions[0].renewalDate}
              </p>
            </div>

            <div className="flex items-center gap-6 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <div>
                <div className="text-2xl font-black text-white">
                  {subscriptions[0].hoursRemaining} <span className="text-xs font-normal text-slate-400">/ {subscriptions[0].hoursTotal} hrs</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-medium">Care Hours Available</div>
              </div>

              <button
                onClick={() => onNavigate('subscriptions')}
                className="px-3.5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Manage Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active & Upcoming Bookings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-500" />
              Active & Upcoming Care Reservations ({activeBookings.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status of your booked childcare slots, night-shift stays, and drop-ins.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 animate-pulse">
            Loading reservations...
          </div>
        ) : activeBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No active reservations at this time</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Need immediate drop-in or night-shift support? Browse verified centers and book in under 3 minutes.
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Explore 24×7 Centers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="text-xs font-bold text-slate-400 font-mono">{b.bookingCode}</div>
                      <h3
                        onClick={() => onSelectCenter(b.centerId)}
                        className="text-base font-bold text-slate-900 hover:text-brand-600 transition-colors cursor-pointer"
                      >
                        {b.centerName}
                      </h3>
                    </div>
                    {getStatusBadge(b.status)}
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-700 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Baby className="w-3.5 h-3.5 text-brand-500" />
                        Child: <strong>{b.childName}</strong> ({b.childAge})
                      </span>
                      <span className="capitalize bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                        {b.slotType.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Date: {b.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {b.startTime} - {b.endTime}
                      </span>
                    </div>

                    {b.caregiverName && (
                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                        Assigned Caregiver: <strong className="text-slate-700">{b.caregiverName}</strong>
                      </div>
                    )}
                  </div>

                  {b.specialInstructions && (
                    <div className="text-[11px] text-slate-500 italic mt-2.5">
                      Notes: "{b.specialInstructions}"
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400 font-medium">Amount: </span>
                    <span className="font-bold text-slate-900">
                      {b.totalAmount === 0 ? 'Free (Covered by Plan)' : `$${b.totalAmount}.00`}
                    </span>
                  </div>

                  {b.status !== 'checked_in' && (
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Care History & Invoices */}
      {pastBookings.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            Completed Stays & History ({pastBookings.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3">Code</th>
                  <th className="pb-3">Center</th>
                  <th className="pb-3">Child</th>
                  <th className="pb-3">Date & Time</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pastBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="py-3 font-mono text-slate-500">{b.bookingCode}</td>
                    <td className="py-3 font-medium text-slate-800">{b.centerName}</td>
                    <td className="py-3 text-slate-600">{b.childName}</td>
                    <td className="py-3 text-slate-500">{b.date} ({b.totalHours} hrs)</td>
                    <td className="py-3 font-bold text-slate-800">${b.totalAmount}</td>
                    <td className="py-3">{getStatusBadge(b.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
