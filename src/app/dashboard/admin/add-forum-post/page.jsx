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
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Motivation",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
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
        category: formData.category,
        image: imageUrl,
        authorName: session.user.name,
        authorEmail: session.user.email,
        role: session.user.role || "admin",
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum`, {
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

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Category <span className="text-pink-500">*</span></label>
            <select
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
            >
              <option value="Nutrition">Nutrition</option>
              <option value="Training Tips">Training Tips</option>
              <option value="Recovery">Recovery</option>
              <option value="Motivation">Motivation</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Cover Image</label>
            {imagePreview ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-white/10 shadow-sm group">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label
                    htmlFor="image-upload-admin"
                    className="cursor-pointer px-5 py-2.5 bg-white/90 text-gray-900 text-sm font-bold rounded-xl hover:bg-white transition-colors shadow-lg"
                  >
                    Change Image
                  </label>
                </div>
                <input id="image-upload-admin" type="file" name="image" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>
            ) : (
              <label
                htmlFor="image-upload-admin"
                className="flex flex-col items-center justify-center w-full h-52 rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/[0.04] hover:border-pink-400 dark:hover:border-pink-500/60 transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <PlusCircle size={28} className="text-pink-500 dark:text-pink-400" />
                </div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Click to upload cover image</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
                <input id="image-upload-admin" type="file" name="image" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            )}
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
