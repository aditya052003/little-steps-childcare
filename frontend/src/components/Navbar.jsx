import React from 'react';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, Shield, Sparkles, User, Calendar, LayoutDashboard, Settings } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView }) {
  const { currentUser, users, switchPersona } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Demo Persona Switcher Banner */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500 text-white uppercase tracking-wider">
              Prototype Persona Switcher
            </span>
            <span className="hidden sm:inline text-slate-400">
              Test platform as different stakeholders:
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {users.map((u) => {
              const isActive = currentUser?.id === u.id;
              const roleLabel =
                u.role === 'parent'
                  ? '👩‍👧 Parent (Sarah)'
                  : u.role === 'provider'
                  ? '🏫 Provider (Starlight 24/7)'
                  : '🛡️ Admin (Compliance)';
              return (
                <button
                  key={u.id}
                  onClick={() => switchPersona(u.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-brand-500 text-white shadow font-semibold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {roleLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Little<span className="text-brand-500">Steps</span>
                </span>
                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-indigo-200">
                  24×7
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:block">
                Trusted Round-the-Clock Childcare Network
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'home'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Explore Daycares
            </button>
            <button
              onClick={() => setCurrentView('subscriptions')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'subscriptions'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              24×7 Plans & Subscriptions
            </button>
            <button
              onClick={() => setCurrentView('feedback')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'feedback'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Project Feedback & Demo
            </button>

            {/* Role-Specific Direct Dashboards */}
            {currentUser?.role === 'parent' && (
              <button
                onClick={() => setCurrentView('parent_dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  currentView === 'parent_dashboard'
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-4 h-4 text-brand-500" />
                My Bookings & Family
              </button>
            )}

            {currentUser?.role === 'provider' && (
              <button
                onClick={() => setCurrentView('provider_dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  currentView === 'provider_dashboard'
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                Daycare Operations
              </button>
            )}

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setCurrentView('admin_dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  currentView === 'admin_dashboard'
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Shield className="w-4 h-4 text-emerald-600" />
                Admin & Verification
              </button>
            )}
          </nav>

          {/* User Profile Pill & Quick Actions */}
          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="flex items-center gap-2.5 bg-slate-100/80 hover:bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 transition-colors">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-white shadow-xs"
                />
                <div className="text-left hidden lg:block leading-tight">
                  <div className="text-xs font-semibold text-slate-800">{currentUser.name}</div>
                  <div className="text-[10px] font-medium text-slate-500 capitalize">
                    {currentUser.role}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
