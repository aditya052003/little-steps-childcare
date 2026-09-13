import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Building2,
  Users,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  Baby,
  Calendar,
  ShieldCheck,
  Plus,
  AlertCircle,
  Sliders,
  TrendingUp,
  UserCheck
} from 'lucide-react';

export default function ProviderDashboard() {
  const { currentUser, showToast } = useAuth();
  const [center, setCenter] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Caregiver Modal State
  const [showAddCaregiver, setShowAddCaregiver] = useState(false);
  const [newCgName, setNewCgName] = useState('');
  const [newCgRole, setNewCgRole] = useState('');
  const [newCgExp, setNewCgExp] = useState('');
  const [newCgShift, setNewCgShift] = useState('Night Shift (7:00 PM - 7:00 AM)');
  const [newCgBio, setNewCgBio] = useState('');

  const centerId = currentUser?.centerId || 'center-1';

  const loadProviderData = async () => {
    setLoading(true);
    try {
      const [cRes, aRes, bRes, cgRes] = await Promise.all([
        api.getCenterById(centerId),
        api.getProviderAnalytics(centerId),
        api.getBookings({ centerId }),
        api.getCaregivers(centerId)
      ]);

      if (cRes.success) setCenter(cRes.data);
      if (aRes.success) setAnalytics(aRes.data);
      if (bRes.success) setBookings(bRes.data);
      if (cgRes.success) setCaregivers(cgRes.data);
    } catch (err) {
      console.error('Failed to load provider dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviderData();
  }, [centerId]);

  const handleStatusChange = async (bookingId, newStatus, reason = '') => {
    try {
      const res = await api.updateBookingStatus(bookingId, newStatus, reason);
      if (res.success) {
        showToast(`Booking marked as ${newStatus.replace('_', ' ')}`, 'success');
        loadProviderData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleAddCaregiver = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createCaregiver({
        centerId,
        name: newCgName,
        roleTitle: newCgRole,
        experience: newCgExp,
        shift: newCgShift,
        bio: newCgBio,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        certifications: ['State Background Check Cleared', 'Pediatric CPR']
      });
      if (res.success) {
        showToast('New caregiver added to roster', 'success');
        setShowAddCaregiver(false);
        setNewCgName('');
        setNewCgRole('');
        setNewCgExp('');
        setNewCgBio('');
        loadProviderData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to add caregiver', 'error');
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending_provider_approval');
  const checkedInBookings = bookings.filter(b => b.status === 'checked_in');
  const upcomingConfirmed = bookings.filter(b => b.status === 'confirmed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* Top Banner: Daycare Facility Profile Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-md">
            🏫
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{center?.name || 'Starlight 24×7 Crèche'}</h1>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
                Licensed & Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Director: <strong>{currentUser?.name}</strong> • Operations Portal • {center?.address}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-indigo-950 text-indigo-200 border border-indigo-700 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            24×7 Operations Active
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center justify-between">
            <span>Pending Requests</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {pendingBookings.length}
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Requires Approval</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center justify-between">
            <span>Currently On-Site</span>
            <Baby className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            {checkedInBookings.length} Children
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Checked in right now</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center justify-between">
            <span>Occupancy Rate</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {analytics?.utilizationRate || 65}%
          </div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">Live Capacity Used</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center justify-between">
            <span>Monthly Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            ${analytics?.totalRevenue || 1450}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Bookings & Subscriptions</div>
        </div>
      </div>

      {/* Room Capacity & Schedule Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              Room Capacity & Anti-Overbooking Controls
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live capacity limits prevent overbooking and enforce statutory caregiver-to-child ratios.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {center?.capacity &&
            Object.entries(center.capacity).map(([room, cap]) => {
              const available = cap.total - cap.occupied;
              const pct = Math.round((cap.occupied / cap.total) * 100);
              return (
                <div key={room} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs capitalize text-slate-800">{room} Room</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {available} spots free
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {cap.occupied} <span className="text-xs text-slate-400 font-normal">/ {cap.total} Max</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        pct > 80 ? 'bg-rose-500' : 'bg-brand-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>Caregiver Ratio: {room === 'infant' ? '1:3' : room === 'toddler' ? '1:6' : '1:10'}</span>
                    <span>{pct}% Filled</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Incoming Requests Approval Queue */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              Incoming Booking Requests ({pendingBookings.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review parent reservation requests and confirm or decline based on floor capacity.
            </p>
          </div>
        </div>

        {pendingBookings.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl text-xs text-slate-500">
            No pending booking requests at this moment.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{b.parentName}</span>
                    <span className="text-[11px] text-slate-500 font-mono">({b.parentPhone})</span>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                      {b.slotType.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700">
                    Child: <strong>{b.childName}</strong> ({b.childAge} • <span className="capitalize">{b.ageGroup}</span>)
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Date: {b.date} ({b.startTime} - {b.endTime} • {b.totalHours} hrs)</span>
                  </div>
                  {b.specialInstructions && (
                    <div className="text-[11px] text-slate-500 italic">"{b.specialInstructions}"</div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => handleStatusChange(b.id, 'rejected', 'Capacity full for this specific room')}
                    className="px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 rounded-xl transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Decline</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange(b.id, 'confirmed')}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept & Confirm</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* On-Premise Children Check-In / Check-Out Manager */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              Active Daycare Attendance & Digital Check-In/Out
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live roster of confirmed and attending children currently in the building.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3">Child & Parent</th>
                <th className="pb-3">Room / Age</th>
                <th className="pb-3">Slot Time</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Attendance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...checkedInBookings, ...upcomingConfirmed].map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="py-3 font-semibold text-slate-900">
                    {b.childName}
                    <div className="text-[11px] text-slate-500 font-normal">{b.parentName}</div>
                  </td>
                  <td className="py-3 capitalize text-slate-700">{b.ageGroup} Room</td>
                  <td className="py-3 text-slate-600">{b.startTime} - {b.endTime}</td>
                  <td className="py-3">
                    {b.status === 'checked_in' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Attending Now
                      </span>
                    ) : (
                      <span className="text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full font-bold">
                        Confirmed Upcoming
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(b.id, 'checked_in')}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold rounded-lg text-xs"
                      >
                        Mark Check-In
                      </button>
                    )}
                    {b.status === 'checked_in' && (
                      <button
                        onClick={() => handleStatusChange(b.id, 'completed')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                      >
                        Check-Out Child
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Caregivers Roster Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-500" />
              Staff Caregivers & Night Nannies ({caregivers.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Assigned team members with verified credentials and shift rosters.
            </p>
          </div>
          <button
            onClick={() => setShowAddCaregiver(!showAddCaregiver)}
            className="px-3.5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Caregiver</span>
          </button>
        </div>

        {/* Add Caregiver Form Modal/Drawer */}
        {showAddCaregiver && (
          <form onSubmit={handleAddCaregiver} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">New Caregiver Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <input
                type="text"
                required
                placeholder="Caregiver Full Name"
                value={newCgName}
                onChange={(e) => setNewCgName(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl"
              />
              <input
                type="text"
                required
                placeholder="Role Title (e.g. Night Nanny)"
                value={newCgRole}
                onChange={(e) => setNewCgRole(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl"
              />
              <input
                type="text"
                required
                placeholder="Years Experience (e.g. 5 yrs)"
                value={newCgExp}
                onChange={(e) => setNewCgExp(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <input
                type="text"
                value={newCgShift}
                onChange={(e) => setNewCgShift(e.target.value)}
                placeholder="Assigned Shift"
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl"
              />
              <input
                type="text"
                value={newCgBio}
                onChange={(e) => setNewCgBio(e.target.value)}
                placeholder="Short bio..."
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddCaregiver(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-brand-500 text-white font-bold rounded-lg text-xs"
              >
                Save Caregiver
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {caregivers.map((cg) => (
            <div key={cg.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start gap-3">
              <img
                src={cg.avatar}
                alt={cg.name}
                className="w-10 h-10 rounded-full object-cover border border-white"
              />
              <div className="space-y-1">
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1">
                  <span>{cg.name}</span>
                  {cg.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <div className="text-[11px] text-brand-600">{cg.roleTitle}</div>
                <div className="text-[10px] text-slate-500">{cg.shift}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
