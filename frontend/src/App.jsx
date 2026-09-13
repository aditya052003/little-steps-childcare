import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './pages/HomeView';
import CenterDetailView from './pages/CenterDetailView';
import ParentDashboard from './pages/ParentDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SubscriptionsView from './pages/SubscriptionsView';
import FeedbackView from './pages/FeedbackView';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

function AppContent() {
  const { toast } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [selectedCenterId, setSelectedCenterId] = useState('center-1');

  const handleSelectCenter = (id) => {
    setSelectedCenterId(id);
    setCurrentView('center_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-brand-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-3 text-xs max-w-md">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-brand-400 shrink-0" />}
            <span className="font-medium leading-tight">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar with Prototype Role Switcher */}
      <Navbar currentView={currentView} setCurrentView={handleNavigate} />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onSelectCenter={handleSelectCenter}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'center_detail' && (
          <CenterDetailView
            centerId={selectedCenterId}
            onBack={() => handleNavigate('home')}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'parent_dashboard' && (
          <ParentDashboard
            onNavigate={handleNavigate}
            onSelectCenter={handleSelectCenter}
          />
        )}

        {currentView === 'provider_dashboard' && (
          <ProviderDashboard />
        )}

        {currentView === 'admin_dashboard' && (
          <AdminDashboard />
        )}

        {currentView === 'subscriptions' && (
          <SubscriptionsView onNavigate={handleNavigate} />
        )}

        {currentView === 'feedback' && (
          <FeedbackView onNavigate={handleNavigate} />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
