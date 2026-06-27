"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { Loader2, Trash2, MessageSquare, AlertCircle } from "lucide-react";
import { CardSkeleton } from "@/componet/Sheard/Skeleton";

export default function MyForumPostsPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchPosts = useCallback(async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum?all=true`);
      const data = await res.json();

      const myPosts = (data.posts || []).filter(
        (post) => post.authorEmail === session.user.email || post.author === session.user.name
      );

      setPosts(myPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchPosts();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchPosts]);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post? This action cannot be undone.");
    if (!confirmDelete) return;

    setDeleteLoading(postId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",

        }
      });

      if (res.ok) {
        setPosts(posts.filter((post) => post._id !== postId));
      } else {
        alert("Failed to delete the post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Something went wrong while deleting.");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full space-y-6">
        <div className="mb-8">
          <div className="h-5 w-32 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse mb-4" />
          <div className="h-8 w-64 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-80 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 mb-4">
          <MessageSquare className="text-red-700 dark:text-rose-400" size={16} />
          <span className="text-xs font-bold text-red-700 dark:text-rose-400 uppercase tracking-wider">My Forum Posts</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Manage Your Forum Posts</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">
          View and manage the tips, guides, and discussions you have shared with the community.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white dark:bg-[#120010] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">No Posts Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            You haven&apos;t published any forum posts yet. Share your fitness knowledge and connect with members!
          </p>
          <a
            href="/dashboard/trainer/add-forum-post"
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors"
          >
            Create Your First Post
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white dark:bg-[#120010] rounded-xl border border-gray-100 dark:border-white/[0.06] shadow-sm overflow-hidden flex flex-row h-32 hover:shadow-md transition-shadow"
            >
              {post.image ? (
                <div className="h-full w-32 shrink-0 relative">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-full w-32 shrink-0 bg-gradient-to-br from-red-100 to-orange-50 dark:from-red-900/40 dark:to-orange-900/20 flex items-center justify-center relative">
                  <MessageSquare className="w-8 h-8 text-red-300 dark:text-red-800" />
                </div>
              )}
              <div className="p-4 flex flex-col flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                    {post.title}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white shrink-0 ${post.status === 'Approved' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                    {post.status || 'Pending'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 flex-1 mb-2">
                  {post.content || post.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-medium text-gray-400">
                    {new Date(post.createdAt || new Date()).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(post._id)}
                    disabled={deleteLoading === post._id}
                    className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors disabled:opacity-50"
                  >
                    {deleteLoading === post._id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
