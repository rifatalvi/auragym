"use client";

import React, { useState, useEffect, useCallback } from "react";
import CustomPagination from "@/componet/Sheard/CustomPagination";
import { Search, Trash2, MessageSquare, CheckCircle, AlertCircle, X } from "lucide-react";
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

export default function ManageForumPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  
  // Client-side pagination since API returns all posts
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 8;

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

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/forum");
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
    fetchPosts();
  }, [fetchPosts]);

  // Reset to page 1 only when search query changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleDelete = (postId) => {
    showConfirm(
      "Delete Post",
      "Are you sure you want to delete this forum post? This action cannot be undone and the post will be permanently removed.",
      async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/forum/${postId}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Failed to delete post");
          addToast("Post deleted successfully", "success");
          fetchPosts(); // Refresh list after deletion
        } catch (err) {
          console.error(err);
          addToast("Failed to delete post", "error");
        }
      }
    );
  };

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    (post.title || "").toLowerCase().includes(search.toLowerCase()) || 
    (post.author || "").toLowerCase().includes(search.toLowerCase()) ||
    (post.authorEmail || "").toLowerCase().includes(search.toLowerCase())
  );

  // Pagination calculation
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const currentPosts = filteredPosts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

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

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-[#0d1421] p-6 rounded-2xl border border-gray-200 dark:border-white/8 gap-6 shadow-sm dark:shadow-xl">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Forum Posts</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-md text-sm leading-relaxed">
              Moderate community posts. Remove any inappropriate or spam content from the platform.
            </p>
          </div>
          <div className="flex items-center gap-3 px-5 py-4 rounded-xl border bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-500/20 min-w-[160px]">
            <div className="opacity-80"><MessageSquare size={24} /></div>
            <div>
              <p className="text-xs opacity-70 font-semibold uppercase tracking-wide">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-[#0d1421] p-4 rounded-2xl border border-gray-200 dark:border-white/8 shadow-sm dark:shadow-xl">
          <div className="relative w-full md:w-96">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search posts by title or author..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
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
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Post Details</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Author</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {loading && posts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                        <span className="text-gray-500 text-sm">Loading posts...</span>
                      </div>
                    </td>
                  </tr>
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
                            {post.image ? (
                              <Image src={post.image} alt={post.title} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-white/5 text-gray-400">
                                <MessageSquare size={20} />
                              </div>
                            )}
                          </div>
                          <div className="max-w-[300px]">
                            <div className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1 mb-1">{post.title || "Untitled"}</div>
                            <div className="text-xs text-gray-500 line-clamp-2">{post.content || post.description || "No description provided."}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">{post.author || "Unknown"}</div>
                        <div className="text-xs text-gray-500">{post.authorEmail || "No email"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end items-center">
                          <button
                            type="button"
                            onClick={() => handleDelete(post._id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20"
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
