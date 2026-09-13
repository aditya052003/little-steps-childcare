import React from 'react';
import { ShieldCheck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function VerificationBadge({ type = 'verified', text = null }) {
  if (type === 'verified') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        {text || 'Verified Daycare'}
      </span>
    );
  }

  if (type === '24x7') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-200 border border-indigo-700 shadow-sm">
        <Clock className="w-3.5 h-3.5 text-indigo-400" />
        {text || '24×7 Active Care'}
      </span>
    );
  }

  if (type === 'pending') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
        {text || 'Pending Verification'}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
      <CheckCircle2 className="w-3 h-3 text-slate-500" />
      {text}
    </span>
  );
}
