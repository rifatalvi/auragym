"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { MdLibraryBooks, MdCheckCircle, MdCancel, MdDelete, MdPendingActions } from "react-icons/md";

export default function ManageClassesPage() {
  const { data: session, isPending } = useSession();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchClasses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/classes");
      if (res.ok) {
        const data = await res.json();
        setClasses(data);
      }
    } catch (err) {
      console.error("Failed to fetch classes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isPending) fetchClasses();
  }, [isPending]);

  const handleAction = async (id, action) => {
    setActionLoading(id);
    try {
      const method = action === "delete" ? "DELETE" : "PATCH";
      const res = await fetch(`http://localhost:5000/api/admin/classes/${id}${action !== 'delete' ? `/${action}` : ''}`, {
        method,
      });

      if (res.ok) {
        if (action === "delete") {
          setClasses(classes.filter((c) => c._id !== id));
        } else {
          setClasses(classes.map((c) =>
            c._id === id ? { ...c, status: action === "approve" ? "Approved" : "Rejected" } : c
          ));
        }
      }
    } catch (err) {
      console.error(`Failed to ${action} class:`, err);
    } finally {
      setActionLoading(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 mb-4">
          <MdLibraryBooks className="text-red-700 dark:text-rose-400" size={16} />
          <span className="text-xs font-bold text-red-700 dark:text-rose-400 uppercase tracking-wider">Manage Classes</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">All Classes</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">
          Review, approve, or reject classes submitted by trainers.
        </p>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-[#120010] border border-gray-100 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/80 dark:bg-white/[0.02]">
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Class Name</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Trainer</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Category</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
              {classes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No classes found.</p>
                  </td>
                </tr>
              ) : (
                classes.map((cls) => (
                  <tr key={cls._id} className="hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{cls.className || cls.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{cls.duration}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{cls.trainerEmail || "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.1] text-xs font-medium text-gray-600 dark:text-gray-300">
                        {cls.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold uppercase tracking-wider ${
                        cls.status === 'Approved' || cls.status === 'approved'
                          ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400'
                          : cls.status === 'Rejected' || cls.status === 'rejected'
                          ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400'
                          : 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                      }`}>
                        {cls.status === 'Approved' || cls.status === 'approved' ? <MdCheckCircle size={14} /> : cls.status === 'Rejected' || cls.status === 'rejected' ? <MdCancel size={14} /> : <MdPendingActions size={14} />}
                        {cls.status || 'Pending'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Approve */}
                        <button
                          onClick={() => handleAction(cls._id, 'approve')}
                          disabled={actionLoading === cls._id || cls.status === 'Approved' || cls.status === 'approved'}
                          className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-500/10 transition-colors disabled:opacity-50"
                          title="Approve"
                        >
                          <MdCheckCircle size={18} />
                        </button>
                        
                        {/* Reject */}
                        <button
                          onClick={() => handleAction(cls._id, 'reject')}
                          disabled={actionLoading === cls._id || cls.status === 'Rejected' || cls.status === 'rejected'}
                          className="p-1.5 rounded-lg text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-500/10 transition-colors disabled:opacity-50"
                          title="Reject"
                        >
                          <MdCancel size={18} />
                        </button>
                        
                        {/* Delete */}
                        <button
                          onClick={() => handleAction(cls._id, 'delete')}
                          disabled={actionLoading === cls._id}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
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
      </div>
    </div>
  );
}
