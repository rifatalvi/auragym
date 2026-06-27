"use client";

import { useState, useEffect, useCallback } from "react";
import fetchSecure from '../../../../lib/fetchSecure';
import {
  MdVerifiedUser,
  MdCancel,
  MdPendingActions,
  MdClose,
  MdPerson,
  MdFitnessCenter,
  MdStar,
  MdAccessTime,
  MdCheckCircle,
  MdRefresh,
} from "react-icons/md";

const STATUS_FILTER = ["All", "Pending", "Accepted", "Rejected"];

function statusStyle(status) {
  if (status === "Pending")
    return {
      pill: "bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/[0.10]",
      icon: <MdPendingActions size={13} />,
    };
  if (status === "Accepted")
    return {
      pill: "bg-red-50 dark:bg-rose-900/20 text-red-700 dark:text-rose-400 border-red-200 dark:border-rose-800/30",
      icon: <MdCheckCircle size={13} />,
    };
  if (status === "Rejected")
    return {
      pill: "bg-gray-100 dark:bg-white/[0.05] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/[0.08]",
      icon: <MdCancel size={13} />,
    };
  return { pill: "", icon: null };
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ── Details Modal ─────────────────────────────────────────────────────────────
function DetailsModal({ app, onClose, onApprove, onReject }) {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(null); // 'approve' | 'reject'

  const handleApprove = async () => {
    setLoading("approve");
    await onApprove(app._id);
    setLoading(null);
  };

  const handleReject = async () => {
    if (!feedback.trim()) return;
    setLoading("reject");
    await onReject(app._id, feedback);
    setLoading(null);
  };

  const isPending = app.status === "Pending";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-[#0e000b] border border-gray-100 dark:border-white/[0.07] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <MdFitnessCenter className="text-red-700 dark:text-rose-400 text-xl" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Trainer Application</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{app.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-400 transition-colors"
          >
            <MdClose size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Applicant info */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-xl p-3 text-center">
              <div className="flex justify-center mb-1.5">
                <MdPerson className="text-gray-400 text-lg" />
              </div>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Applicant</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{app.name || "—"}</p>
            </div>
            <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-xl p-3 text-center">
              <div className="flex justify-center mb-1.5">
                <MdStar className="text-red-500 dark:text-rose-400 text-lg" />
              </div>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Experience</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{app.experience} yrs</p>
            </div>
            <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-xl p-3 text-center">
              <div className="flex justify-center mb-1.5">
                <MdFitnessCenter className="text-red-500 dark:text-rose-400 text-lg" />
              </div>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Specialty</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{app.specialty}</p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <MdAccessTime size={14} />
            Applied {app.createdAt ? timeAgo(app.createdAt) : "—"}
            <span className="text-gray-300 dark:text-white/20 mx-1">·</span>
            {app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
          </div>

          {/* Bio */}
          {app.bio && (
            <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">About</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{app.bio}</p>
            </div>
          )}

          {/* Current status (non-pending) */}
          {!isPending && (
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold ${statusStyle(app.status).pill}`}>
              {statusStyle(app.status).icon}
              Status: {app.status}
              {app.feedback && <span className="font-normal ml-1">{app.feedback}</span>}
            </div>
          )}

          {/* Feedback input (only for pending) */}
          {isPending && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Feedback <span className="text-gray-400 font-normal text-xs">(required for rejection)</span>
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Write a reason or feedback for the applicant..."
                  className="w-full px-4 py-3 rounded-xl text-sm bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-red-500 dark:focus:border-rose-600 focus:ring-2 focus:ring-red-100 dark:focus:ring-rose-500/10 resize-none transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={handleReject}
                  disabled={!feedback.trim() || !!loading}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 dark:border-white/[0.10] text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading === "reject" ? (
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MdCancel size={18} />
                  )}
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  disabled={!!loading}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-700 hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-600 text-white text-sm font-bold transition-all shadow-md shadow-red-700/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading === "approve" ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MdVerifiedUser size={18} />
                  )}
                  Approve
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AppliedTrainersPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Pending");
  const [actionMsg, setActionMsg] = useState(null); // { type: 'success'|'error', text }

  const showMsg = (type, text) => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg(null), 3500);
  };

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const status = activeFilter === "All" ? "" : activeFilter;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetchSecure(`${baseUrl}/api/admin/trainer-applications${status ? `?status=${status}` : ""}`);
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchApplications();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchApplications]);

  const handleApprove = async (id) => {
    try {
      const res = await fetchSecure(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/trainer-applications/${id}/approve`, {
        method: "POST",
      });
      if (res.ok) {
        showMsg("success", "Application approved! User is now a Trainer.");
        setSelectedApp(null);
        fetchApplications();
      } else {
        showMsg("error", "Failed to approve application.");
      }
    } catch {
      showMsg("error", "Network error. Try again.");
    }
  };

  const handleReject = async (id, feedback) => {
    try {
      const res = await fetchSecure(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/trainer-applications/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
      });
      if (res.ok) {
        showMsg("success", "Application rejected with feedback saved.");
        setSelectedApp(null);
        fetchApplications();
      } else {
        showMsg("error", "Failed to reject application.");
      }
    } catch {
      showMsg("error", "Network error. Try again.");
    }
  };

  return (
    <div className="space-y-6">

      {/* Toast notification */}
      {actionMsg && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-sm font-semibold border transition-all animate-in fade-in slide-in-from-top-2 duration-300 ${
          actionMsg.type === "success"
            ? "bg-white dark:bg-[#0e000b] border-red-200 dark:border-rose-800/40 text-red-700 dark:text-rose-400"
            : "bg-white dark:bg-[#0e000b] border-gray-200 dark:border-white/[0.10] text-gray-700 dark:text-gray-300"
        }`}>
          {actionMsg.type === "success" ? <MdCheckCircle size={18} /> : <MdCancel size={18} />}
          {actionMsg.text}
        </div>
      )}

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Applied Trainers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Review and manage trainer applications</p>
        </div>
        <button
          onClick={fetchApplications}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/[0.08] text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors self-start"
        >
          <MdRefresh size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTER.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              activeFilter === f
                ? "bg-red-700 dark:bg-red-700 border-red-700 text-white shadow-md shadow-red-700/20"
                : "bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.07] text-gray-600 dark:text-gray-400 hover:border-red-300 dark:hover:border-rose-700/40"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#120010] border border-gray-100 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/80 dark:bg-white/[0.02]">
                <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">#</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Applicant</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Specialty</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Experience</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Applied</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th className="text-right px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
              {loading ? (
                // Skeleton rows
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-3 w-5 bg-gray-100 dark:bg-white/[0.05] rounded" /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/[0.05]" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-28 bg-gray-100 dark:bg-white/[0.05] rounded" />
                          <div className="h-2.5 w-36 bg-gray-100 dark:bg-white/[0.05] rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-3 w-16 bg-gray-100 dark:bg-white/[0.05] rounded" /></td>
                    <td className="px-6 py-4"><div className="h-3 w-12 bg-gray-100 dark:bg-white/[0.05] rounded" /></td>
                    <td className="px-6 py-4"><div className="h-3 w-20 bg-gray-100 dark:bg-white/[0.05] rounded" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-100 dark:bg-white/[0.05] rounded-full" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 w-20 bg-gray-100 dark:bg-white/[0.05] rounded-xl ml-auto" /></td>
                  </tr>
                ))
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="w-14 h-14 bg-gray-100 dark:bg-white/[0.04] rounded-full flex items-center justify-center mx-auto mb-3">
                      <MdPendingActions className="text-2xl text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No applications found</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">No {activeFilter !== "All" ? activeFilter.toLowerCase() : ""} trainer applications yet.</p>
                  </td>
                </tr>
              ) : (
                applications.map((app, idx) => {
                  const { pill, icon } = statusStyle(app.status);
                  return (
                    <tr key={app._id} className="hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4 text-xs text-gray-400 dark:text-gray-600 font-medium">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-700 dark:text-rose-400 font-bold text-sm flex-shrink-0">
                            {app.name?.[0] || app.email?.[0] || "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{app.name || "—"}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{app.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">{app.specialty}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{app.experience} yrs</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {app.createdAt ? timeAgo(app.createdAt) : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${pill}`}>
                          {icon}
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/[0.08] text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-red-700 hover:border-red-700 hover:text-white dark:hover:bg-red-700 dark:hover:border-red-700 transition-all"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer count */}
        {!loading && applications.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 dark:border-white/[0.05] bg-gray-50/50 dark:bg-white/[0.01]">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Showing <span className="font-bold text-gray-600 dark:text-gray-300">{applications.length}</span> {activeFilter !== "All" ? activeFilter.toLowerCase() : ""} application{applications.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedApp && (
        <DetailsModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
