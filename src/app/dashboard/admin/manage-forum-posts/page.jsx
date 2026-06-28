"use client";

import React, { useState, useEffect, useCallback } from "react";
import fetchSecure from '../../../../lib/fetchSecure';
import CustomPagination from "@/componet/Sheard/CustomPagination";
import { ForumManageRowSkeleton } from "@/componet/Sheard/Skeleton";
import { Search, Trash2, MessageSquare, CheckCircle, AlertCircle, X, XCircle, User, Mail, Calendar, Tag } from "lucide-react";
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
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${data.isReject ? "bg-orange-100 dark:bg-orange-500/10" : "bg-red-100 dark:bg-red-500/10"}`}>
            <AlertCircle size={20} className={data.isReject ? "text-orange-600 dark:text-orange-400" : "text-red-600 dark:text-red-400"} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{data.title}</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{data.message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-sm font-semibold border border-gray-200 dark:border-white/10 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className={`px-5 py-2 rounded-xl text-white text-sm font-bold shadow-md transition-colors ${data.isReject ? "bg-orange-500 hover:bg-orange-600" : "bg-red-600 hover:bg-red-700"}`}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function AuthorModal({ post, onClose }) {
  if (!post) return null;
  const getImage = (category) => {
    const images = {
      Nutrition: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
      "Training Tips": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
      Recovery: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
      Motivation: "https://images.unsplash.com/photo-1526506114642-5445539d8bc3?auto=format&fit=crop&w=800&q=80",
    };
    return images[category] || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80";
  };
  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#0d1421] border border-gray-200 dark:border-white/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-32 w-full bg-gradient-to-br from-orange-400 to-red-500">
          <Image src={post.image || getImage(post.category)} alt={post.title || "Post"} fill className="object-cover opacity-60" />
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-end gap-4 mb-5 -mt-10 relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white dark:border-[#0d1421]">
              {(post.author || post.authorName || "?").charAt(0).toUpperCase()}
            </div>
            <div className="pb-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{post.author || post.authorName || "Unknown"}</h3>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white ${post.role === "Admin" ? "bg-purple-500" : "bg-cyan-500"}`}>
                {post.role || "Trainer"}
              </span>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5">
              <Mail size={15} className="text-gray-400 shrink-0" />
              <span className="text-gray-700 dark:text-gray-300 truncate">{post.authorEmail || "No email"}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5">
              <Tag size={15} className="text-gray-400 shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{post.category || "General"}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5">
              <Calendar size={15} className="text-gray-400 shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{new Date(post.createdAt || new Date()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20">
            <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">Post Title</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2">{post.title || "Untitled"}</p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-gray-400">Post Status</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${
              post.status === "Approved" ? "bg-emerald-500" : post.status === "Rejected" ? "bg-red-500" : "bg-amber-500"
            }`}>
              {post.status || "Pending"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const STATUS_TABS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];

export default function ManageForumPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState("all");
  const itemsPerPage = 8;

  const [toasts, setToasts] = useState([]);
  const [confirmData, setConfirmData] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [authorModalPost, setAuthorModalPost] = useState(null);

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  }, []);

  const showConfirm = (title, message, action, isReject = false) => {
    setConfirmData({ title, message, isReject });
    setPendingAction(() => action);
  };

  const handleConfirm = async () => {
    setConfirmData(null);
    if (pendingAction) await pendingAction();
    setPendingAction(null);
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchSecure(`/api/forum?all=true`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data.posts || data || []);
    } catch (err) {
      console.error(err);
      setFetchError("Failed to load forum posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchPosts(); }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchPosts]);

  useEffect(() => {
    const timer = window.setTimeout(() => { setPage(1); }, 0);
    return () => window.clearTimeout(timer);
  }, [search, statusTab]);

  const handleDelete = (postId) => {
    showConfirm(
      "Delete Post",
      "Permanently delete this post? This cannot be undone.",
      async () => {
        try {
          const res = await fetchSecure(`/api/forum/${postId}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed");
          addToast("Post deleted successfully", "success");
          void fetchPosts();
        } catch { addToast("Failed to delete post", "error"); }
      }
    );
  };

  const handleApprove = (postId) => {
    showConfirm(
      "Approve Post",
      "This post will become visible to all users on the public forum.",
      async () => {
        try {
          const res = await fetchSecure(`/api/forum/${postId}/approve`, { method: "PATCH" });
          if (!res.ok) throw new Error("Failed");
          addToast("Post approved successfully", "success");
          void fetchPosts();
        } catch { addToast("Failed to approve post", "error"); }
      }
    );
  };

  const handleReject = (postId) => {
    showConfirm(
      "Reject Post",
      "This post will remain hidden from public view.",
      async () => {
        try {
          const res = await fetchSecure(`/api/forum/${postId}/reject`, { method: "PATCH" });
          if (!res.ok) throw new Error("Failed");
          addToast("Post rejected", "success");
          void fetchPosts();
        } catch { addToast("Failed to reject post", "error"); }
      },
      true
    );
  };

  const getImage = (category) => {
    const images = {
      Nutrition: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
      "Training Tips": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
      Recovery: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
      Motivation: "https://images.unsplash.com/photo-1526506114642-5445539d8bc3?auto=format&fit=crop&w=800&q=80",
    };
    return images[category] || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80";
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      (post.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (post.author || "").toLowerCase().includes(search.toLowerCase()) ||
      (post.authorEmail || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusTab === "all" || (post.status || "Pending") === statusTab;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const currentPosts = filteredPosts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const statusCounts = {
    all: posts.length,
    Pending: posts.filter((p) => (p.status || "Pending") === "Pending").length,
    Approved: posts.filter((p) => p.status === "Approved").length,
    Rejected: posts.filter((p) => p.status === "Rejected").length,
  };

  if (fetchError) {
    return (
      <div className="text-center p-8 m-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl">
        <AlertCircle size={40} className="text-red-500 dark:text-red-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-red-600 dark:text-red-400">{fetchError}</h3>
        <button onClick={fetchPosts} className="mt-4 px-6 py-2 rounded-xl bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 text-red-700 dark:text-red-300 font-semibold border border-red-200 dark:border-red-500/30 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />
      <ConfirmModal data={confirmData} onConfirm={handleConfirm} onCancel={() => setConfirmData(null)} />
      <AuthorModal post={authorModalPost} onClose={() => setAuthorModalPost(null)} />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-[#0d1421] p-6 rounded-2xl border border-gray-200 dark:border-white/8 gap-6 shadow-sm dark:shadow-xl">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Forum Posts</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-md text-sm leading-relaxed">
              Review, approve, reject, or remove community posts.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {[
              { label: "Total", count: posts.length, color: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-500/20" },
              { label: "Pending", count: statusCounts.Pending, color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20" },
              { label: "Approved", count: statusCounts.Approved, color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20" },
              { label: "Rejected", count: statusCounts.Rejected, color: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20" },
            ].map((s) => (
              <div key={s.label} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border min-w-[90px] ${s.color}`}>
                <MessageSquare size={16} className="opacity-70" />
                <div>
                  <p className="text-[10px] opacity-70 font-bold uppercase tracking-wide">{s.label}</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white leading-none">{s.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search + Tabs */}
        <div className="bg-white dark:bg-[#0d1421] p-4 rounded-2xl border border-gray-200 dark:border-white/8 shadow-sm dark:shadow-xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title or author..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-200 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusTab(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
                  statusTab === tab.value
                    ? tab.value === "Approved" ? "bg-emerald-600 text-white border-emerald-600"
                      : tab.value === "Rejected" ? "bg-red-600 text-white border-red-600"
                      : tab.value === "Pending" ? "bg-amber-500 text-white border-amber-500"
                      : "bg-gray-700 text-white border-gray-700"
                    : "bg-gray-50 dark:bg-white/[0.03] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-gray-400"
                }`}
              >
                {tab.label} ({statusCounts[tab.value]})
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#0d1421] rounded-2xl border border-gray-200 dark:border-white/8 overflow-hidden shadow-sm dark:shadow-xl">
          <div className="overflow-x-auto min-h-[380px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/8">
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Post Details</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Author</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {loading && posts.length === 0 ? (
                  Array.from({ length: 6 }).map((_, i) => <ForumManageRowSkeleton key={i} />)
                ) : currentPosts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <Search size={44} className="text-gray-300 dark:text-gray-600" />
                        <p className="text-gray-500 dark:text-gray-400 font-semibold">No posts found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentPosts.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-4">
                          <div className="relative h-14 w-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 shrink-0">
                            <Image src={post.image || getImage(post.category)} alt={post.title || "post"} fill className="object-cover" />
                          </div>
                          <div className="max-w-[280px]">
                            <div className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1 mb-1">
                              {post.title || "Untitled"}
                              <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-white ${
                                post.status === "Approved" ? "bg-emerald-500" : post.status === "Rejected" ? "bg-red-500" : "bg-amber-500"
                              }`}>
                                {post.status || "Pending"}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-2">{post.content || post.description || "No description."}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setAuthorModalPost(post)}
                          className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left group/author"
                          title="View author info"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {(post.author || post.authorName || "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white text-sm group-hover/author:text-orange-500 dark:group-hover/author:text-orange-400 transition-colors">
                              {post.author || post.authorName || "Unknown"}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-[130px]">{post.authorEmail || "No email"}</div>
                          </div>
                          <User size={12} className="text-gray-400 opacity-0 group-hover/author:opacity-100 transition-opacity ml-1" />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(post.createdAt || new Date()).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end items-center gap-1.5">
                          {post.status !== "Approved" && (
                            <button
                              type="button"
                              onClick={() => handleApprove(post._id)}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
                            >
                              <CheckCircle size={13} />
                              Approve
                            </button>
                          )}
                          {post.status !== "Rejected" && (
                            <button
                              type="button"
                              onClick={() => handleReject(post._id)}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-500/20"
                            >
                              <XCircle size={13} />
                              Reject
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(post._id)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20"
                          >
                            <Trash2 size={13} />
                            Delete
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
                totalItems={filteredPosts.length}
                itemsPerPage={itemsPerPage}
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
