"use client";

import React, { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2, PlusCircle, CheckCircle, MessageSquarePlus } from "lucide-react";

export default function AddForumPostPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user) {
      setError("You must be logged in to post to the forum.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let imageUrl = "";

      if (imageFile) {
        const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
        const uploadData = new FormData();
        uploadData.append("image", imageFile);

        const uploadRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: "POST",
          body: uploadData,
        });

        const uploadResult = await uploadRes.json();
        if (uploadResult.success) {
          imageUrl = uploadResult.data.display_url;
        } else {
          throw new Error("Failed to upload image.");
        }
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        image: imageUrl,
        authorName: session.user.name,
        authorEmail: session.user.email,
        role: session.user.role || "admin",
      };

      const res = await fetch(process.env.NEXT_PUBLIC_API_URL/api/forum", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to add forum post.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/forum"); // Redirect to community forum
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Post Published!</h2>
        <p className="text-gray-500 dark:text-gray-400">Your post has been successfully added to the community forum.</p>
        <p className="text-sm text-gray-400 mt-2">Redirecting to forum...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-50 dark:bg-pink-500/10 border border-pink-100 dark:border-pink-500/20 mb-4">
          <MessageSquarePlus className="text-pink-600 dark:text-pink-400" size={16} />
          <span className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">Community</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Add New Forum Post</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">
          Share tips, guides, and thoughts with the gym community.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-sm text-red-600 dark:text-red-400 font-medium">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#0d1421] border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-xl">
        
        <div className="space-y-6">
          {/* Post Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Post Title <span className="text-pink-500">*</span></label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. 5 Tips for Better Recovery"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Cover Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100 dark:file:bg-pink-500/10 dark:file:text-pink-400"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description <span className="text-pink-500">*</span></label>
            <textarea
              name="description"
              required
              rows="8"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write your post content here..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <PlusCircle size={18} />}
            Publish Post
          </button>
        </div>

      </form>
    </div>
  );
}
