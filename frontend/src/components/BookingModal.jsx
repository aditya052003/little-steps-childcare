import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { X, Calendar, Clock, Baby, CheckCircle, AlertTriangle, ShieldCheck, Moon, Sparkles } from 'lucide-react';

export default function BookingModal({ center, isOpen, onClose, onSuccess }) {
  const { currentUser, showToast } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [userSubs, setUserSubs] = useState([]);

  // Form State
  const [childId, setChildId] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [ageGroup, setAgeGroup] = useState('toddler');
  const [slotType, setSlotType] = useState('hourly');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('13:00');
  const [totalHours, setTotalHours] = useState(4);
  const [useSubscription, setUseSubscription] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [error, setError] = useState('');

  // Prepopulate child if parent has registered children
  useEffect(() => {
    if (currentUser?.children && currentUser.children.length > 0) {
      const first = currentUser.children[0];
      setChildId(first.id);
      setChildName(first.name);
      setChildAge(first.age);
      setAgeGroup(first.ageGroup || 'toddler');
      setSpecialInstructions(`Allergies: ${first.allergies || 'None'}`);
    } else {
      setChildName('Alex Jenkins');
      setChildAge('2 years');
      setAgeGroup('toddler');
    }

    // Load active subscriptions for this user
    if (currentUser?.id) {
      api.getUserSubscriptions(currentUser.id)
        .then(res => {
          if (res.success) {
            setUserSubs(res.data.filter(s => s.status === 'active'));
          }
        })
        .catch(console.error);
    }
  }, [currentUser, isOpen]);

  // Adjust hours when slotType or times change
  useEffect(() => {
    if (slotType === 'night_shift') {
      setStartTime('19:00');
      setEndTime('07:00 (Next Day)');
      setTotalHours(12);
    } else if (slotType === 'daily') {
      setStartTime('08:00');
      setEndTime('17:00');
      setTotalHours(9);
    } else if (slotType === 'emergency') {
      setStartTime('14:00');
      setEndTime('18:00');
      setTotalHours(4);
    } else {
      // standard hourly
      setStartTime('09:00');
      setEndTime('13:00');
      setTotalHours(4);
    }
  }, [slotType]);

  if (!isOpen || !center) return null;

  const hourlyRate = center.pricing?.hourly || 18;
  let totalCost = hourlyRate * totalHours;
  if (slotType === 'daily') {
    totalCost = center.pricing?.daily || 95;
  } else if (slotType === 'night_shift') {
    totalCost = (center.pricing?.nightShiftHourly || 22) * 12;
  }

  // Active subscription applicability
  const activeSub = userSubs.length > 0 ? userSubs[0] : null;
  const canUseSub = activeSub && activeSub.hoursRemaining >= totalHours;

  const handleChildSelect = (e) => {
    const selectedId = e.target.value;
    setChildId(selectedId);
    const c = currentUser?.children?.find(ch => ch.id === selectedId);
    if (c) {
      setChildName(c.name);
      setChildAge(c.age);
      setAgeGroup(c.ageGroup);
      setSpecialInstructions(`Allergies: ${c.allergies || 'None'}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const finalAmount = useSubscription && canUseSub ? 0 : totalCost;
      const subDeduction = useSubscription && canUseSub
        ? `${activeSub.planName} (${totalHours} hrs applied)`
        : null;

      const payload = {
        userId: currentUser?.id || 'user-parent-1',
        parentName: currentUser?.name || 'Sarah Jenkins',
        parentPhone: currentUser?.phone || '+1 (555) 234-5678',
        childId: childId || 'child-default',
        childName,
        childAge,
        ageGroup,
        centerId: center.id,
        centerName: center.name,
        slotType,
        date,
        startTime,
        endTime,
        totalHours,
        ratePerHour: hourlyRate,
        totalAmount: finalAmount,
        appliedSubscription: subDeduction,
        specialInstructions
      };

      const res = await api.createBooking(payload);
      if (res.success) {
        showToast('Childcare slot request confirmed with center!', 'success');
        onSuccess(res.data);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit booking request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Book Verified Childcare Slot
          </div>
          <h2 className="text-xl font-bold text-white">{center.name}</h2>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span>{center.address}</span>
            {center.is24x7 && (
              <span className="bg-indigo-950 text-indigo-300 border border-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                24×7 Ready
              </span>
            )}
          </p>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* Child Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Baby className="w-3.5 h-3.5 text-brand-500" />
              Select Child for Care
            </label>
            {currentUser?.children && currentUser.children.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {currentUser.children.map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => {
                      setChildId(ch.id);
                      setChildName(ch.name);
                      setChildAge(ch.age);
                      setAgeGroup(ch.ageGroup);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      childId === ch.id
                        ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/20 font-semibold text-brand-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="font-bold">{ch.name}</div>
                    <div className="text-[11px] text-slate-500">{ch.age} • <span className="capitalize">{ch.ageGroup}</span></div>
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="text"
                required
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Child's full name"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            )}
          </div>

          {/* Slot Type Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Choose Care Timing & Plan
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'hourly', label: 'Hourly Drop-in', desc: 'Flexible hours', badge: `$${hourlyRate}/hr` },
                { id: 'daily', label: 'Full Day Care', desc: '8 AM - 5 PM', badge: `$${center.pricing?.daily || 95}/day` },
                { id: 'night_shift', label: 'Night Shift Care', desc: '7 PM - 7 AM', badge: 'Snooze Pod' },
                { id: 'emergency', label: 'Emergency', desc: 'Immediate slot', badge: 'Priority' }
              ].map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSlotType(slot.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    slotType === slot.id
                      ? 'border-brand-500 bg-brand-50 text-brand-900 font-bold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <div className="font-bold">{slot.label}</div>
                  <div className="text-[10px] text-slate-500">{slot.desc}</div>
                  <div className="text-[10px] font-semibold text-brand-600 mt-1">{slot.badge}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Date and Timing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Start Time</label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">End Time</label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          {/* Subscription perk banner */}
          {activeSub && (
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-indigo-950 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Active Plan: {activeSub.planName}
                </div>
                <div className="text-[11px] text-indigo-700">
                  {activeSub.hoursRemaining} hours remaining this month
                </div>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useSubscription}
                  onChange={(e) => setUseSubscription(e.target.checked)}
                  className="accent-indigo-600 rounded"
                />
                <span className="font-bold text-indigo-900 text-xs">Apply Free Hours</span>
              </label>
            </div>
          )}

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Caregiver Instructions & Diet/Sleep Notes
            </label>
            <textarea
              rows="2"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Favorite bedtime toy, formula schedule, nap requirements..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            ></textarea>
          </div>

          {/* Price Breakdown & Instant Checkout */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">Total Care Estimate</div>
              <div className="text-lg font-black text-slate-900">
                {useSubscription && canUseSub ? (
                  <div className="flex items-center gap-2">
                    <span className="line-through text-slate-400 text-sm">${totalCost}</span>
                    <span className="text-emerald-600">$0.00 (Covered by Plan)</span>
                  </div>
                ) : (
                  `$${totalCost}.00`
                )}
              </div>
              <div className="text-[10px] text-slate-400">
                {totalHours} hours • Includes caregiver ratio guarantee & insurance
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-md shadow-brand-500/20 disabled:opacity-50 flex items-center gap-1.5 transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{submitting ? 'Confirming...' : 'Confirm Booking'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
