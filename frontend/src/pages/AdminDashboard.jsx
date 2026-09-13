import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  FileCheck,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  DollarSign,
  Eye,
  Check,
  FileText
} from 'lucide-react';

export default function AdminDashboard() {
  const { showToast } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [aRes, vRes, cRes] = await Promise.all([
        api.getAdminAnalytics(),
        api.getVerificationRequests(),
        api.getCenters()
      ]);

      if (aRes.success) setAnalytics(aRes.data);
      if (vRes.success) setVerificationRequests(vRes.data);
      if (cRes.success) setCenters(cRes.data);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleDecision = async (id, status) => {
    try {
      const res = await api.decideVerification(id, status, reviewNotes);
      if (res.success) {
        showToast(
          status === 'approved'
            ? 'Entity verified and granted accredited Little Steps badge!'
            : 'Verification request rejected',
          status === 'approved' ? 'success' : 'info'
        );
        setSelectedDoc(null);
        setReviewNotes('');
        loadAdminData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update decision', 'error');
    }
  };

  const pendingRequests = verificationRequests.filter(vr => vr.status === 'pending');
  const pastDecisions = verificationRequests.filter(vr => vr.status !== 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* Top Banner: Admin Regulatory Oversight */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-emerald-500/30">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">Trust, Safety & Regulatory Console</h1>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
                Platform Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Verifying childcare licenses, pediatric nurse certifications, and auditing platform safety compliance.
            </p>
          </div>
        </div>

        <div className="bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700 text-right">
          <div className="text-xs text-slate-400 font-medium">Compliance Audit Status</div>
          <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 justify-end mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            100% Policy Compliant
          </div>
        </div>
      </div>

      {/* Platform KPI Analytics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Total Users</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {analytics?.totalUsers || 3}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Parents & Providers</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Verified Centers</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {analytics?.verifiedCenters || 5}
          </div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Accredited Facilities</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Pending Audits</div>
          <div className="text-2xl font-black text-amber-500 mt-1">
            {pendingRequests.length}
          </div>
          <div className="text-[10px] text-amber-600 mt-0.5">Awaiting License Sign-off</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Caregivers</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {analytics?.totalCaregivers || 5}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Staff on Roster</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Utilization</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">
            {analytics?.averageUtilizationRate || 58}%
          </div>
          <div className="text-[10px] text-indigo-600 mt-0.5">Network Capacity Used</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Gross Revenue</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            ${analytics?.totalRevenue || 1900}
          </div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Bookings & Subs</div>
        </div>
      </div>

      {/* Verification Queue Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-600" />
              Document Verification & Accreditation Queue ({pendingRequests.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review official state licenses, fire department safety certificates, and caregiver police background checks.
            </p>
          </div>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl text-xs text-slate-500">
            No documents currently pending verification. All submitted providers are verified!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">{req.targetName}</span>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                      {req.type.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-indigo-700">
                    {req.documentType}
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div><strong>License / Document #:</strong> {req.documentNumber}</div>
                    <div><strong>Issuing Authority:</strong> {req.issueAuthority}</div>
                    <div><strong>Submitted Date:</strong> {req.submittedDate} (Valid until {req.expiryDate})</div>
                    <div className="text-slate-500 text-[11px] pt-1">Notes: {req.notes}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedDoc(req)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Document</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecision(req.id, 'rejected')}
                      className="px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleDecision(req.id, 'approved')}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Verify</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Network Daycare Centers Directory & Status */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-slate-700" />
            Network Daycare Directory & Status ({centers.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full inventory of daycare partners across Metro City and current verification status.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3">Center Name</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Hours</th>
                <th className="pb-3">License #</th>
                <th className="pb-3">Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {centers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="py-3 font-semibold text-slate-800">{c.name}</td>
                  <td className="py-3 text-slate-600">{c.city}</td>
                  <td className="py-3 text-slate-600">
                    {c.is24x7 ? (
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">
                        24×7
                      </span>
                    ) : (
                      'Standard'
                    )}
                  </td>
                  <td className="py-3 font-mono text-slate-500">{c.licenseNumber}</td>
                  <td className="py-3">
                    {c.verificationStatus === 'verified' ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                        Verified
                      </span>
                    ) : (
                      <span className="text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-bold">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Inspection Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Document Inspection: {selectedDoc.targetName}
              </h3>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={selectedDoc.documentUrl}
                alt="Document Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-xs space-y-1.5 text-slate-700">
              <div><strong>Document:</strong> {selectedDoc.documentType}</div>
              <div><strong>Registration Code:</strong> {selectedDoc.documentNumber}</div>
              <div><strong>Issuing Body:</strong> {selectedDoc.issueAuthority}</div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Audit / Feedback Notes</label>
              <input
                type="text"
                placeholder="Optional regulatory feedback or approval note..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => handleDecision(selectedDoc.id, 'rejected')}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
              >
                Reject
              </button>
              <button
                onClick={() => handleDecision(selectedDoc.id, 'approved')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                Approve & Accredit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
