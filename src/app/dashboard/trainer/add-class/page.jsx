"use client";

import React, { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2, PlusCircle, CheckCircle } from "lucide-react";

export default function AddClassPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    className: "",
    category: "Yoga",
    level: "Beginner",
    duration: "60",
    days: "Monday, Wednesday",
    time: "10:00 AM",
    price: "",
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
      setError("You must be logged in as a trainer to add a class.");
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
        className: formData.className,
        image: imageUrl,
        category: formData.category,
        level: formData.level,
        duration: `${formData.duration} mins`,
        schedule: {
          days: formData.days.split(",").map((d) => d.trim()),
          time: formData.time,
        },
        price: formData.price,
        description: formData.description,
        trainerEmail: session.user.email,
        status: "Pending", // explicitly set as per requirements
      };

      const res = await fetch("http://localhost:5000/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to add class.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/trainer/my-classes");
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Class Added Successfully!</h2>
        <p className="text-gray-500 dark:text-gray-400">Your class is currently <span className="font-bold text-amber-500">Pending</span> admin approval.</p>
        <p className="text-sm text-gray-400 mt-2">Redirecting to your classes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 mb-4">
          <PlusCircle className="text-red-700 dark:text-rose-400" size={16} />
          <span className="text-xs font-bold text-red-700 dark:text-rose-400 uppercase tracking-wider">New Class</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Add a New Class</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">
          Create a new class for members. Note: New classes require admin approval and will start as "Pending".
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/40 rounded-xl text-sm text-red-700 dark:text-red-400 font-medium">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#120010] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-6 sm:p-8 shadow-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Class Name */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Class Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="className"
              required
              value={formData.className}
              onChange={handleChange}
              placeholder="e.g. High Intensity Interval Training (HIIT)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.10] bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Class Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.10] bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 dark:file:bg-red-900/20 dark:file:text-rose-400"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Category <span className="text-red-500">*</span></label>
            <select
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.10] bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              <option value="Yoga">Yoga</option>
              <option value="Strength">Strength</option>
              <option value="Cardio">Cardio</option>
              <option value="CrossFit">CrossFit</option>
              <option value="Pilates">Pilates</option>
              <option value="Cycling">Cycling</option>
            </select>
          </div>

          {/* Difficulty Level */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Difficulty Level <span className="text-red-500">*</span></label>
            <select
              name="level"
              required
              value={formData.level}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.10] bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="All Levels">All Levels</option>
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Duration (minutes) <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="duration"
              required
              min="15"
              value={formData.duration}
              onChange={handleChange}
              placeholder="60"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.10] bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Price ($) <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="price"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="25.00"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.10] bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>

          {/* Schedule: Days */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Class Schedule (Days) <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="days"
              required
              value={formData.days}
              onChange={handleChange}
              placeholder="e.g. Monday, Wednesday, Friday"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.10] bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>

           {/* Schedule: Time */}
           <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Class Time <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="time"
              required
              value={formData.time}
              onChange={handleChange}
              placeholder="e.g. 10:00 AM"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.10] bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the class, what members will learn, etc."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.10] bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-red-600/20"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <PlusCircle size={18} />}
            Add Class (Pending)
          </button>
        </div>

      </form>
    </div>
  );
}
