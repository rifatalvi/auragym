"use client";

import React, { useState, useEffect, useCallback } from "react";
import CustomPagination from "@/componet/Sheard/CustomPagination";
import {
  Users, UserCheck, UserX, Search, Filter,
  Shield, Ban, ChevronLeft, ChevronRight, HelpCircle,
  X, CheckCircle, AlertCircle, ChevronDown
} from "lucide-react";
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
              : t.type === "error"
              ? "bg-red-100 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400"
              : "bg-cyan-100 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-400"
            }`}
        >
          {t.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
          >
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
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center">
            <AlertCircle size={20} className="text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{data.title}</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{data.message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-sm font-semibold border border-gray-200 dark:border-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white text-sm font-bold shadow-md transition-opacity"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function RoleDropdown({ user, onChangeRole }) {
  const [open, setOpen] = useState(false);
  const roles = [
    { key: "admin", label: "Admin", color: "text-purple-600 dark:text-purple-400" },
    { key: "trainer", label: "Trainer", color: "text-cyan-600 dark:text-cyan-400" },
    { key: "user", label: "User", color: "text-gray-700 dark:text-gray-300" },
  ];
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-semibold transition-all"
      >
        <Shield size={12} />
        Change Role
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[5]" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#0d1421] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[10]">
            {roles.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => { setOpen(false); onChangeRole(user._id, r.key); }}
                className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-white/10 transition-colors flex items-center gap-2
                  ${user.role === r.key ? r.color + " bg-gray-50 dark:bg-white/5" : "text-gray-600 dark:text-gray-400"}`}
              >
                {user.role === r.key && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                {r.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [stats, setStats] = useState({ total: 0, active: 0, blocked: 0 });
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [confirmData, setConfirmData] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
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
  const handleCancel = () => { setConfirmData(null); setPendingAction(null); };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/admin/users?page=${page}&limit=5&search=${search}&role=${roleFilter}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setStats(data.summaryStats);
    } catch (err) {
      console.error("Error fetching users:", err);
      setFetchError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, search]);

  useEffect(() => { fetchUsers(); }, [page, roleFilter]);
  useEffect(() => {
    const handler = setTimeout(() => { setPage(1); fetchUsers(); }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const handleBlockToggle = (userId, currentStatus) => {
    const newStatus = currentStatus === "blocked" ? "active" : "blocked";
    const action = currentStatus === "blocked" ? "Unblock" : "Block";
    showConfirm(
      `${action} User`,
      `Are you sure you want to ${action.toLowerCase()} this user?`,
      async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
          const res = await fetch(`${apiUrl}/api/admin/users/${userId}/block`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          });
          if (!res.ok) throw new Error();
          addToast(`User ${newStatus === "blocked" ? "blocked" : "unblocked"} successfully`, "success");
          fetchUsers();
        } catch {
          addToast("Failed to update user status", "error");
        }
      }
    );
  };

  const handleChangeRole = (userId, newRole) => {
    showConfirm(
      "Change Role",
      `Are you sure you want to change this user's role to "${newRole}"?`,
      async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
          const res = await fetch(`${apiUrl}/api/admin/users/${userId}/role`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: newRole }),
          });
          if (!res.ok) throw new Error("Failed to change role");
          addToast(`User role updated to "${newRole}" successfully`, "success");
          fetchUsers();
        } catch (err) {
          console.error("Error changing role:", err);
          addToast("Failed to update user role", "error");
        }
      }
    );
  };

  if (fetchError) {
    return (
      <div className="text-center p-8 m-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl">
        <AlertCircle size={40} className="text-red-500 dark:text-red-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-red-600 dark:text-red-400">{fetchError}</h3>
        <button onClick={fetchUsers} className="mt-4 px-6 py-2 rounded-xl bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 text-red-700 dark:text-red-300 font-semibold border border-red-200 dark:border-red-500/30 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />
      <ConfirmModal data={confirmData} onConfirm={handleConfirm} onCancel={handleCancel} />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header & Stats */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center bg-white dark:bg-[#0d1421] p-6 rounded-2xl border border-gray-200 dark:border-white/8 gap-6 shadow-sm dark:shadow-xl">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-md text-sm leading-relaxed">
              Monitor, manage, and secure your platform&apos;s user base.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {[
              { label: "Total Users", value: stats.total, icon: <Users size={22} />, color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20" },
              { label: "Active", value: stats.active, icon: <UserCheck size={22} />, color: "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-100 dark:border-green-500/20" },
              { label: "Blocked", value: stats.blocked, icon: <UserX size={22} />, color: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20" },
            ].map((s) => (
              <div key={s.label} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${s.color} min-w-[130px]`}>
                <div className="opacity-80">{s.icon}</div>
                <div>
                  <p className="text-xs opacity-70 font-semibold uppercase tracking-wide">{s.label}</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-[#0d1421] p-4 rounded-2xl border border-gray-200 dark:border-white/8 shadow-sm dark:shadow-xl">
          <div className="relative w-full sm:w-96">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto items-center">
            <div className="relative w-full sm:w-44">
              <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
              <select
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-200 text-sm font-medium focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none"
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              >
                <option value="all" className="bg-white dark:bg-[#0d1421]">All Roles</option>
                <option value="user" className="bg-white dark:bg-[#0d1421]">User</option>
                <option value="trainer" className="bg-white dark:bg-[#0d1421]">Trainer</option>
                <option value="admin" className="bg-white dark:bg-[#0d1421]">Admin</option>
              </select>
            </div>
            <button
              onClick={() => setShowHelpModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md hover:opacity-90 transition-opacity bg-gradient-to-r from-pink-500 to-purple-600 shrink-0"
            >
              <HelpCircle size={16} />
              Help
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#0d1421] rounded-2xl border border-gray-200 dark:border-white/8 overflow-hidden shadow-sm dark:shadow-xl">
          <div className="overflow-x-auto min-h-[380px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/8">
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">User</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Role & Status</th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {loading && users.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
                        <span className="text-gray-500 text-sm">Loading users...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <Search size={44} className="text-gray-300 dark:text-gray-600" />
                        <p className="text-gray-500 dark:text-gray-400 font-semibold">No users found</p>
                        <p className="text-gray-400 dark:text-gray-600 text-sm">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-11 w-11 rounded-full overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 shrink-0">
                            {user.image ? (
                              <Image src={user.image} alt={user.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500/20 to-purple-500/20 text-pink-600 dark:text-pink-400 font-bold text-lg">
                                {(user.name || user.email).charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#0d1421] ${user.status === "blocked" ? "bg-red-500" : "bg-green-500"}`} />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white text-sm">{user.name || "N/A"}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                            <div className="text-xs text-gray-400 dark:text-gray-600 mt-0.5 uppercase tracking-wider font-medium">
                              {new Date(user.createdAt || Date.now()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold self-start border
                            ${user.role === "admin" ? "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20"
                              : user.role === "trainer" ? "bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20"
                              : "bg-gray-100 dark:bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-500/20"}`}>
                            {user.role === "admin" && <Shield size={11} />}
                            {user.role === "trainer" && <Users size={11} />}
                            {user.role === "user" && <UserCheck size={11} />}
                            <span className="capitalize">{user.role || "user"}</span>
                          </span>
                          <div className="flex items-center gap-1.5 text-xs font-medium">
                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === "blocked" ? "bg-red-500" : "bg-green-500"}`} />
                            <span className={user.status === "blocked" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}>
                              {user.status === "blocked" ? "Blocked" : "Active"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2 items-center">
                          <RoleDropdown user={user} onChangeRole={handleChangeRole} />
                          <button
                            type="button"
                            onClick={() => handleBlockToggle(user._id, user.status)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all
                              ${user.status === "blocked"
                                ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20"
                                : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20"
                              }`}
                          >
                            {user.status === "blocked"
                              ? <><UserCheck size={13} /> Unblock</>
                              : <><Ban size={13} /> Block</>
                            }
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
              <span className="text-xs text-gray-500 font-medium">
                Page <span className="text-gray-900 dark:text-white font-bold">{page}</span> of <span className="text-gray-900 dark:text-white font-bold">{totalPages}</span>
              </span>
              <CustomPagination totalPages={totalPages} page={page} onChange={(p) => setPage(p)} />
            </div>
          )}
        </div>

        {/* Help Modal */}
        {showHelpModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#0d1421] border border-gray-200 dark:border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-600" />
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Shield size={20} className="text-pink-500 dark:text-pink-400" /> Admin Guidelines
                  </h3>
                  <button
                    onClick={() => setShowHelpModal(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="space-y-5">
                  <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 p-4 rounded-xl">
                    <h4 className="text-sm font-bold text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2">
                      <Users size={14} /> Role Permissions
                    </h4>
                    <p className="text-sm text-purple-700 dark:text-purple-200/70 leading-relaxed">
                      Be cautious! Only grant <strong className="text-purple-800 dark:text-purple-300">Admin</strong> roles to trusted staff. Admins have full access to platform data.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Ban size={14} className="text-red-500 dark:text-red-400" /> Blocked Users Restrictions
                    </h4>
                    <div className="bg-gray-50 dark:bg-white/3 rounded-xl p-4 border border-gray-100 dark:border-white/8 space-y-4">
                      <div>
                        <p className="text-xs font-bold text-red-500 dark:text-red-400 uppercase tracking-wider mb-2">Cannot:</p>
                        <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                          {["Access their Dashboard", "Book any classes", "Apply to be a trainer", "Write comments or forum posts"].map((item) => (
                            <li key={item} className="flex items-center gap-2"><UserX size={14} className="text-red-500 shrink-0" />{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="border-t border-gray-200 dark:border-white/8 pt-4">
                        <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">Can Only:</p>
                        <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                          {["Login to their account", "Browse classes publicly"].map((item) => (
                            <li key={item} className="flex items-center gap-2"><UserCheck size={14} className="text-green-500 shrink-0" />{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowHelpModal(false)}
                    className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white text-sm font-bold shadow-md transition-opacity"
                  >
                    Got it!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1);    }
        }
        .animate-slide-in  { animation: slide-in  0.25s ease forwards; }
        .animate-scale-in  { animation: scale-in  0.2s  ease forwards; }
      `}</style>
    </>
  );
}


