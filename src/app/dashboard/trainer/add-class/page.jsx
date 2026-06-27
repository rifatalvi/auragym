"use client";

import React, { useState } from "react";
import fetchSecure from '../../../../lib/fetchSecure';
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2, PlusCircle, CheckCircle, UploadCloud, Calendar } from "lucide-react";

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
    maxStudents: "20",
    days: ["Mon", "Wed"],
    startTime: "10:00",
    endTime: "11:00",
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

  const toggleDay = (day) => {
    setFormData((prev) => {
      const currentDays = Array.isArray(prev.days) ? prev.days : [];
      if (currentDays.includes(day)) {
        return { ...prev, days: currentDays.filter((d) => d !== day) };
      } else {
        return { ...prev, days: [...currentDays, day] };
      }
    });
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
          days: Array.isArray(formData.days) ? formData.days : [],
          time: `${formData.startTime} - ${formData.endTime}`,
        },
        price: formData.price,
        description: formData.description,
        trainerEmail: session.user.email,
        maxStudents: parseInt(formData.maxStudents) || 20,
        status: "Pending",
      };

      const res = await fetchSecure(`${process.env.NEXT_PUBLIC_API_URL}/api/classes`, {
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
    <div className="w-full mx-auto space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 mb-4">
          <PlusCircle className="text-red-700 dark:text-rose-400" size={16} />
          <span className="text-xs font-bold text-red-700 dark:text-rose-400 uppercase tracking-wider">New Class</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Add a New Class</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">
          Create a new class for members. Note: New classes require admin approval and will start as Pending.
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
            <div className="w-full flex items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-white/[0.15] rounded-xl bg-gray-50 dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors cursor-pointer relative min-h-[160px]">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    {imageFile ? (
                        <div className="text-center">
                           <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                           <p className="font-medium text-green-600 dark:text-green-400">{imageFile.name}</p>
                        </div>
                    ) : (
                        <>
                            <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Click or drag image to upload</p>
                            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
                        </>
                    )}
                </div>
            </div>
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

          {/* Max Students */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Max Students <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="maxStudents"
              required
              min="1"
              max="500"
              value={formData.maxStudents}
              onChange={handleChange}
              placeholder="e.g. 20"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.10] bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
            <p className="text-[11px] text-gray-400">Booking will be closed automatically when this limit is reached.</p>
          </div>

          {/* Schedule: Days */}
          <div className="space-y-4 md:col-span-2 mt-2">
            <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Weekly Schedule (Select Days) <span className="text-red-500">*</span></label>
            </div>
            <div className="flex flex-wrap gap-3">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                const isSelected = Array.isArray(formData.days) && formData.days.includes(day);
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-6 py-2.5 rounded-full border text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-600/20"
                        : "bg-white dark:bg-[#120010] border-gray-200 dark:border-white/[0.10] text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

           {/* Schedule: Start Time */}
           <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Start Time <span className="text-red-500">*</span></label>
            <input
              type="time"
              name="startTime"
              required
              value={formData.startTime}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.10] bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>

           {/* Schedule: End Time */}
           <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">End Time <span className="text-red-500">*</span></label>
            <input
              type="time"
              name="endTime"
              required
              value={formData.endTime}
              onChange={handleChange}
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
