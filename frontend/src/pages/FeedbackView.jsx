import React from 'react';
import {
  Video,
  Award,
  Sparkles,
  CheckCircle2,
  Code2,
  Cpu,
  ShieldCheck,
  HeartHandshake,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export default function FeedbackView({ onNavigate }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl border border-slate-800 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold">
          <Video className="w-3.5 h-3.5 text-brand-400" />
          <span>Project Evaluation & Feedback Presentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Little Steps Platform: Experience & Learnings
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Comprehensive project walkthrough, technical architecture reflection, and learning takeaways developed by <strong>Aditya</strong>.
        </p>
        <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-400">
          <div>Developer: <strong className="text-white">Aditya</strong></div>
          <div>•</div>
          <div>Domain: <strong className="text-white">24×7 Childcare & Shift-Work Infrastructure</strong></div>
          <div>•</div>
          <div>Status: <strong className="text-emerald-400">Deployed & Verified</strong></div>
        </div>
      </div>

      {/* Video Presentation Guide & Highlights */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500" />
              Project Walkthrough Key Topics
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              The 4 core demonstration pillars showcased in the project feedback video.
            </p>
          </div>
          <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
            3-Minute Presentation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-bold">1</span>
              Problem Statement & 24×7 Need
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Addressing the critical gap faced by night-shift healthcare workers, emergency personnel, and single parents who are shut out by traditional 9-to-5 daycares.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-bold">2</span>
              Parent Discovery & Slot Booking
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Multi-faceted filtering by 24×7 availability, age group (infant/toddler), timing shift, transparent pricing, and instant booking with plan hour deductions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-bold">3</span>
              Provider Room Capacity Controls
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enforcing statutory child-to-caregiver ratios (1:3 for infants) with automated anti-overbooking concurrency guards and a digital check-in/out desk.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-bold">4</span>
              Admin Regulatory Compliance
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Document inspection modal for auditing state licenses, fire safety certificates, and police clearances before granting accredited platform badges.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Learnings & Experience */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          Key Technical Learnings & Takeaways
        </h2>

        <div className="space-y-4 text-xs">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
            <Code2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-slate-900">Decoupled Full-Stack Architecture</div>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Learned to architect a responsive Single Page Application (React 18, Vite 6, Tailwind CSS) cleanly interfaced with an Express.js REST API server with atomic JSON persistence and modular domain routing.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-slate-900">Concurrency & Anti-Overbooking Safeguards</div>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Implemented capacity verification logic ensuring room capacity cannot be exceeded even under rapid simultaneous reservation requests, critical for child safety compliance.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
            <HeartHandshake className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-slate-900">Multi-Persona UX Design & Role Switching</div>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Designed a frictionless prototype persona switcher that allows stakeholders and evaluators to test as a Parent (Sarah), Daycare Director (Elena), or System Compliance Admin (Marcus) in a single click without repeated logins.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-brand-500 shrink-0" />
          <div>
            <div className="font-bold text-slate-900">Want to inspect the detailed documentation?</div>
            <div className="text-slate-500">View the complete 9-chapter Detailed Project Report and PRD on GitHub.</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('home')}
            className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold transition-colors"
          >
            Explore Live App
          </button>
        </div>
      </div>
    </div>
  );
}
