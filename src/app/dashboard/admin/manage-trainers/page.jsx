"use client";

import React, { useState, useEffect, useCallback } from "react";
import CustomPagination from "@/componet/Sheard/CustomPagination";
import { Users, Search, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, X, ShieldOff } from "lucide-react";
import Image from "next/image";

function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border backdrop-blur-md text-sm font-semibold transition-all duration-300 animate-slide-in
            ${t.type === "success"
              ? "bg-green-100 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400"
              : "bg-red-100 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400"
            }`}
        >
          {t.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

function ConfirmModal({ data, onConfirm, onCancel }) {
  if (!data) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0d1421] border border-gray-200 dark:border-white/10 rounded-3xl w-full max-w-sm shadow-2xl p-6 animate-scale-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
            <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{data.title}</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{data.message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-sm font-semibold border border-gray-200 dark:border-white/10 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-md transition-colors">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ManageTrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ totalTrainers: 0 });

  const [toasts, setToasts] = useState([]);
  const [confirmData, setConfirmData] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  }, []);

  const showConfirm = (title, message, action) => {
    setConfirmData({ title, message });
    setPendingAction(() => action);
  };

  const handleConfirm = async () => {
    setConfirmData(null);
    if (pendingAction) await pendingAction();
    setPendingAction(null);
  };

  const fetchTrainers = useCallback(async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      // We assume passing role=trainer returns only trainers
      const res = await fetch(`${apiUrl}/api/admin/users?page=${page}&limit=5&search=${search}&role=trainer`);
      if (!res.ok) throw new Error("Failed to fetch trainers");
      const data = await res.json();
      setTrainers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setStats({ totalTrainers: data.summaryStats?.total || (data.users || []).length });
    } catch (err) {
      console.error(err);
      setFetchError("Failed to fetch trainers");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchTrainers(); }, [fetchTrainers]);

  useEffect(() => {
    const handler = setTimeout(() => { setPage(1); fetchTrainers(); }, 500);
    return () => clearTimeout(handler);
  }, [search, fetchTrainers]);

  const handleDemote = (userId) => {
    showConfirm(
      "Demote Trainer",
      "Are you sure you want to demote this trainer to a regular user? They will lose all trainer privileges.",
      async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
          const res = await fetch(`${apiUrl}/api/admin/users/${userId}/role`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: "user" }),
          });
          if (!res.ok) throw new Error("Failed to demote trainer");
          addToast("Trainer demoted to user successfully", "success");
          fetchTrainers();
        } catch (err) {
          console.error(err);
          addToast("Failed to demote trainer", "error");
        }
      }
    );
  };

  if (fetchError) {
    return (
      <div className="text-center p-8 m-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl">
        <AlertCircle size={40} className="text-red-500 dark:text-red-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-red-600 dark:text-red-400">{fetchError}</h3>
        <button onClick={fetchTrainers} className="mt-4 px-6 py-2 rounded-xl bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 text-red-700 dark:text-red-300 font-semibold border border-red-200 dark:border-red-500/30 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />
      <ConfirmModal data={confirmData} onConfirm={handleConfirm} onCancel={() => setConfirmData(null)} />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-[#0d1421] p-6 rounded-2xl border border-gray-200 dark:border-white/8 gap-6 shadow-sm dark:shadow-xl">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Trainers</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-md text-sm leading-relaxed">
              View and manage active trainers on the platform. You can demote them if necessary.
            </p>
          </div>
          <div className="flex items-center gap-3 px-5 py-4 rounded-xl border bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-100 dark:border-cyan-500/20 min-w-[160px]">
            <div className="opacity-80"><Users size={24} /></div>
            <div>
              <p className="text-xs opacity-70 font-semibold uppercase tracking-wide">Total Trainers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTrainers}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-[#0d1421] p-4 rounded-2xl border border-gray-200 dark:border-white/8 shadow-sm dark:shadow-xl">
          <div className="relative w-full md:w-96">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search trainers by name or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#0d1421] rounded-2xl border border-gray-200 dark:border-white/8 overflow-hidden shadow-sm dark:shadow-xl">
          <div className="overflow-x-auto min-h-[380px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/8">
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Trainer Details</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {loading && trainers.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
                        <span className="text-gray-500 text-sm">Loading trainers...</span>
                      </div>
                    </td>
                  </tr>
                ) : trainers.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <Search size={44} className="text-gray-300 dark:text-gray-600" />
                        <p className="text-gray-500 dark:text-gray-400 font-semibold">No trainers found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  trainers.map((trainer) => (
                    <tr key={trainer._id} className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-11 w-11 rounded-full overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 shrink-0">
                            {trainer.image ? (
                              <Image src={trainer.image} alt={trainer.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-600 dark:text-cyan-400 font-bold text-lg">
                                {(trainer.name || trainer.email).charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white text-sm">{trainer.name || "N/A"}</div>
                            <div className="text-xs text-gray-500">{trainer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20">
                          <Users size={11} />
                          Trainer
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2 items-center">
                          <button
                            type="button"
                            onClick={() => handleDemote(trainer._id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20"
                          >
                            <ShieldOff size={13} />
                            Demote to User
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-white/8 flex items-center justify-between bg-gray-50 dark:bg-white/2 rounded-b-2xl">
              <CustomPagination 
                page={page} 
                totalPages={totalPages} 
                totalItems={stats.totalTrainers}
                itemsPerPage={5}
                onChange={(p) => setPage(p)} 
              />
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        @keyframes slide-in { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
        .animate-slide-in { animation: slide-in 0.25s ease forwards; }
        .animate-scale-in { animation: scale-in 0.2s ease forwards; }
      `}</style>
    </>
  );
}

