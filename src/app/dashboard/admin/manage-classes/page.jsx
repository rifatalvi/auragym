"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import {
  MdLibraryBooks, MdCheckCircle, MdCancel, MdDelete,
  MdPendingActions, MdChevronLeft, MdChevronRight,
  MdLockOpen, MdLock
} from "react-icons/md";
import Image from "next/image";

const LIMIT = 10;

const STATUS_FILTERS = [
  { label: "All",      value: "all",      color: "gray"   },
  { label: "Pending",  value: "pending",  color: "yellow" },
  { label: "Approved", value: "approved", color: "green"  },
  { label: "Rejected", value: "rejected", color: "red"    },
];

const VISIBILITY_FILTERS = [
  { label: "Any",    value: "all"    },
  { label: "Open",   value: "open"   },
  { label: "Closed", value: "closed" },
];

export default function ManageClassesPage() {
  const { data: session, isPending } = useSession();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filter state
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");

  const fetchClasses = useCallback(async (pageNum = 1, status = statusFilter, visibility = visibilityFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pageNum, limit: LIMIT });
      if (status !== "all") params.set("status", status);
      if (visibility !== "all") params.set("visibility", visibility);

      const res = await fetch(`http://localhost:5000/api/admin/classes?${params}`);
      if (res.ok) {
        const data = await res.json();
        setClasses(data.classes);
        setTotalPages(data.totalPages);
        setTotal(data.total);
        setPage(data.currentPage);
      }
    } catch (err) {
      console.error("Failed to fetch classes:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, visibilityFilter]);

  useEffect(() => {
    if (!isPending) fetchClasses(1);
  }, [isPending, fetchClasses]);

  const handleAction = async (id, action) => {
    setActionLoading(`${id}-${action}`);
    try {
      const method = action === "delete" ? "DELETE" : "PATCH";
      const url = action === "delete"
        ? `http://localhost:5000/api/admin/classes/${id}`
        : `http://localhost:5000/api/admin/classes/${id}/${action}`;

      const res = await fetch(url, { method });

      if (res.ok) {
        if (action === "delete") {
          setClasses(prev => prev.filter(c => c._id !== id));
          setTotal(t => t - 1);
        } else if (action === "toggle-visibility") {
          const data = await res.json();
          setClasses(prev =>
            prev.map(c => c._id === id ? { ...c, isOpen: data.isOpen } : c)
          );
        } else {
          setClasses(prev =>
            prev.map(c =>
              c._id === id
                ? { ...c, status: action === "approve" ? "Approved" : "Rejected", isOpen: action === "approve" ? true : false }
                : c
            )
          );
        }
      }
    } catch (err) {
      console.error(`Failed to ${action} class:`, err);
    } finally {
      setActionLoading(null);
    }
  };

  const isApproved = (cls) => cls.status === "Approved" || cls.status === "approved";
  const isRejected = (cls) => cls.status === "Rejected" || cls.status === "rejected";

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 mb-4">
          <MdLibraryBooks className="text-red-700 dark:text-rose-400" size={16} />
          <span className="text-xs font-bold text-red-700 dark:text-rose-400 uppercase tracking-wider">Manage Classes</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">All Classes</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Review, approve, or reject classes submitted by trainers.
            </p>
          </div>
          {!loading && (
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              {total} total class{total !== 1 ? "es" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#120010] border border-gray-100 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/80 dark:bg-white/[0.02]">
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Class</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Trainer</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Category</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Visibility</th>
                <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : classes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No classes found.</p>
                  </td>
                </tr>
              ) : (
                classes.map((cls) => (
                  <tr key={cls._id} className="hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors">

                    {/* Class Name + Image */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {cls.image ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-white/[0.1] relative">
                            <Image src={cls.image} alt={cls.className || "class"} fill sizes="40px" className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/[0.05] flex-shrink-0 flex items-center justify-center border border-gray-200 dark:border-white/[0.1]">
                            <MdLibraryBooks className="text-gray-400" size={18} />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{cls.className || cls.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{cls.duration} • ${cls.price}</p>
                        </div>
                      </div>
                    </td>

                    {/* Trainer */}
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 max-w-[150px] truncate">{cls.trainerEmail || "—"}</p>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.1] text-xs font-medium text-gray-600 dark:text-gray-300">
                        {cls.category}
                      </span>
                    </td>

                    {/* Approval Status */}
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold uppercase tracking-wider ${
                        isApproved(cls)
                          ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400"
                          : isRejected(cls)
                          ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400"
                          : "bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                      }`}>
                        {isApproved(cls) ? <MdCheckCircle size={13} /> : isRejected(cls) ? <MdCancel size={13} /> : <MdPendingActions size={13} />}
                        {cls.status || "Pending"}
                      </div>
                    </td>

                    {/* Open / Closed Toggle — only for Approved classes */}
                    <td className="px-6 py-4">
                      {isApproved(cls) ? (
                        <button
                          onClick={() => handleAction(cls._id, "toggle-visibility")}
                          disabled={actionLoading === `${cls._id}-toggle-visibility`}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-60 ${
                            cls.isOpen
                              ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100"
                              : "bg-gray-100 dark:bg-white/[0.04] border-gray-200 dark:border-white/[0.08] text-gray-500 dark:text-gray-400 hover:bg-gray-200"
                          }`}
                          title={cls.isOpen ? "Click to Close (hide from users)" : "Click to Open (show to users)"}
                        >
                          {cls.isOpen ? <MdLockOpen size={14} /> : <MdLock size={14} />}
                          {cls.isOpen ? "Open" : "Closed"}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-600 italic">—</span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleAction(cls._id, "approve")}
                          disabled={!!actionLoading || isApproved(cls)}
                          className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-500/10 transition-colors disabled:opacity-40"
                          title="Approve"
                        >
                          <MdCheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleAction(cls._id, "reject")}
                          disabled={!!actionLoading || isRejected(cls)}
                          className="p-1.5 rounded-lg text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-500/10 transition-colors disabled:opacity-40"
                          title="Reject"
                        >
                          <MdCancel size={18} />
                        </button>
                        <button
                          onClick={() => handleAction(cls._id, "delete")}
                          disabled={!!actionLoading}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors disabled:opacity-40"
                          title="Delete"
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-white/[0.05] bg-gray-50/50 dark:bg-white/[0.01] flex items-center justify-between">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Page <span className="font-bold text-gray-700 dark:text-gray-300">{page}</span> of{" "}
              <span className="font-bold text-gray-700 dark:text-gray-300">{totalPages}</span> &nbsp;·&nbsp;{" "}
              <span className="font-bold text-gray-700 dark:text-gray-300">{total}</span> total classes
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchClasses(page - 1)}
                disabled={page <= 1 || loading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-400 bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.1] hover:bg-gray-100 dark:hover:bg-white/[0.08] disabled:opacity-40 transition-colors"
              >
                <MdChevronLeft size={18} /> Prev
              </button>

              {/* Page number pills */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, idx) =>
                    p === "..." ? (
                      <span key={`dot-${idx}`} className="text-gray-400 text-xs px-1">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => fetchClasses(p)}
                        className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${
                          p === page
                            ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.08]"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
              </div>

              <button
                onClick={() => fetchClasses(page + 1)}
                disabled={page >= totalPages || loading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-400 bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.1] hover:bg-gray-100 dark:hover:bg-white/[0.08] disabled:opacity-40 transition-colors"
              >
                Next <MdChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
