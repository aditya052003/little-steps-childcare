import React from 'react';
import { HeartHandshake, PhoneCall, ShieldCheck, Clock, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Little<span className="text-brand-500">Steps</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering shift workers, healthcare professionals, single parents, and modern families with verified, round-the-clock childcare.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-400 font-medium bg-brand-950/50 border border-brand-800/40 p-2.5 rounded-lg">
              <PhoneCall className="w-4 h-4 text-brand-400 shrink-0" />
              <span>24×7 Parent Urgent Helpline: <strong>1-800-LIL-STEP</strong></span>
            </div>
          </div>

          {/* Quick Filters */}
          <div>
            <h4 className="text-xs font-bold uppercase text-white tracking-wider mb-3">Care Types</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="hover:text-white transition-colors cursor-pointer">24×7 Infant Crèche Care</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Night-Shift Roster Babysitting</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Toddler Drop-In Hourly Care</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Emergency Same-Day Booking</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Monthly Corporate Subscriptions</span></li>
            </ul>
          </div>

          {/* Safety Standards */}
          <div>
            <h4 className="text-xs font-bold uppercase text-white tracking-wider mb-3">Safety & Trust</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Background Check Verified</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pediatric First-Aid & CPR</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Strict Ratio Controls</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tamper-proof Biometric Check-in</span>
              </li>
            </ul>
          </div>

          {/* Coverage & Operating Hours */}
          <div>
            <h4 className="text-xs font-bold uppercase text-white tracking-wider mb-3">Availability</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Centers Open 365 Days / 24 Hours</span>
              </p>
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Metro City • Healthcare District • Tech Park</span>
              </p>
              <div className="pt-2">
                <span className="inline-block bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] px-2.5 py-1 rounded-md">
                  All Network Centers Active & Staffed
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div>© {new Date().getFullYear()} Little Steps 24×7 Childcare Network. All rights reserved.</div>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <span className="hover:text-slate-300 cursor-pointer">Child Safety Manifesto</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy & GDPR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
