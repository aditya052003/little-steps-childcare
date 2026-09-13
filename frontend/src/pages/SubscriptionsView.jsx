import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  CheckCircle2,
  Moon,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

export default function SubscriptionsView({ onNavigate }) {
  const { currentUser, showToast } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribingId, setSubscribingId] = useState(null);

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await api.getSubscriptionPlans();
        if (res.success) setPlans(res.data);
      } catch (err) {
        console.error('Failed to load plans:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  const handleSubscribe = async (plan) => {
    setSubscribingId(plan.id);
    try {
      const res = await api.subscribe({
        userId: currentUser?.id || 'user-parent-1',
        planId: plan.id,
        centerId: 'center-1'
      });
      if (res.success) {
        showToast(`Congratulations! You have enrolled in the "${plan.name}" plan.`, 'success');
        onNavigate('parent_dashboard');
      }
    } catch (err) {
      showToast(err.message || 'Failed to enroll in subscription', 'error');
    } finally {
      setSubscribingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
          <Moon className="w-3.5 h-3.5 text-indigo-600" />
          <span>Flexible 24×7 Childcare Subscriptions</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Childcare That Matches Your <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-brand-500">
            Real Work Schedule
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          No rigid 9-to-5 contracts. Get monthly banked hours for night shifts, weekend calls, and spontaneous emergency drop-ins across our verified network.
        </p>
      </div>

      {/* Subscription Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-3xl p-8 flex flex-col justify-between border transition-all duration-300 relative ${
              plan.id === 'plan-1'
                ? 'bg-slate-900 text-white border-indigo-500/50 shadow-xl ring-2 ring-indigo-500/30'
                : 'bg-white text-slate-900 border-slate-200 shadow-sm hover:shadow-md'
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-rose-500 text-white text-[11px] font-black uppercase px-3 py-0.5 rounded-full shadow-md tracking-wider">
                {plan.badge}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-xl font-bold">{plan.name}</h3>
              </div>

              <p className={`text-xs mb-6 ${plan.id === 'plan-1' ? 'text-slate-400' : 'text-slate-500'}`}>
                {plan.target}
              </p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black">${plan.monthlyPrice}</span>
                <span className={`text-xs font-semibold ${plan.id === 'plan-1' ? 'text-slate-400' : 'text-slate-500'}`}>
                  / month
                </span>
                <span className={`text-xs font-bold ml-2 ${plan.id === 'plan-1' ? 'text-indigo-300' : 'text-indigo-600'}`}>
                  ({plan.hoursIncluded} hrs included)
                </span>
              </div>

              {/* Feature bullets */}
              <ul className="space-y-3 text-xs mb-8">
                {plan.features?.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        plan.id === 'plan-1' ? 'text-brand-400' : 'text-emerald-500'
                      }`}
                    />
                    <span className={plan.id === 'plan-1' ? 'text-slate-300' : 'text-slate-700'}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe(plan)}
              disabled={subscribingId === plan.id}
              className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                plan.id === 'plan-1'
                  ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <span>{subscribingId === plan.id ? 'Activating...' : 'Select Plan & Enroll'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand-500" />
          Frequently Asked Questions on 24×7 Care Plans
        </h2>

        <div className="space-y-4 text-xs text-slate-600">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <div className="font-bold text-slate-900">How do night shift hours work?</div>
            <p className="leading-relaxed">
              When booking a night shift (e.g. 7:00 PM to 7:00 AM), your active subscription hours are automatically debited so you pay $0 at booking checkout. Your child receives a reserved soundproof snooze pod and a certified night nanny.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <div className="font-bold text-slate-900">Can unused care hours roll over to the next month?</div>
            <p className="leading-relaxed">
              Yes! On the "Flexi-Drop-In" and "Night Shift Guardian" plans, up to 10 unused care hours automatically roll over to the subsequent billing period.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <div className="font-bold text-slate-900">What if my shift gets cancelled at the hospital or office?</div>
            <p className="leading-relaxed">
              We know shift work is unpredictable. You can cancel your booked slot up to 2 hours before start time without losing your banked subscription hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
