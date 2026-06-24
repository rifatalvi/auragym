"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { 
  Clock, Flame, Activity, DollarSign, CalendarDays, 
  User, Heart, Dumbbell, Zap, ArrowRight, Loader2, Bookmark, ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function ClassDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const [cls, setCls] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/classes/${id}`);
        if (!res.ok) throw new Error("Failed to fetch class details");
        const data = await res.json();
        setCls(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchClassDetails();
  }, [id]);

  useEffect(() => {
    const fetchUserStatus = async () => {
      if (!session?.user?.id || !id) return;
      try {
        const [bookingRes, favRes] = await Promise.all([
          fetch(`http://localhost:5000/api/bookings/check?classId=${id}&userId=${session.user.id}`),
          fetch(`http://localhost:5000/api/favorites/check?classId=${id}&userId=${session.user.id}`)
        ]);
        
        if (bookingRes.ok) {
          const bookingData = await bookingRes.json();
          setIsBooked(bookingData.isBooked);
        }
        
        if (favRes.ok) {
          const favData = await favRes.json();
          setIsFavorited(favData.isFavorited);
        }
      } catch (err) {
        console.error("Error fetching user status:", err);
      }
    };
    
    fetchUserStatus();
  }, [id, session?.user?.id]);

  const handleBookNow = () => {
    if (!session?.user) {
      showMessage("Please log in to book classes.", "error");
      setTimeout(() => router.push("/auth/signup"), 1500);
      return;
    }
    if (isBooked) {
      showMessage("You have already booked this class.", "error");
      return;
    }
    router.push(`/classes/${id}/payment`);
  };

  const handleToggleFavorite = async () => {
    if (!session?.user) {
      showMessage("Please log in to save favorites.", "error");
      setTimeout(() => router.push("/auth/signup"), 1500);
      return;
    }
    
    setActionLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: id, userId: session.user.id })
      });
      
      if (!res.ok) throw new Error("Failed to toggle favorite");
      
      const data = await res.json();
      setIsFavorited(data.isFavorited);
      showMessage(data.isFavorited ? "Saved to Favorites" : "Removed from Favorites", "success");
    } catch (err) {
      console.error(err);
      showMessage("Something went wrong.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0007] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-700 dark:text-rose-400 animate-spin" />
      </div>
    );
  }

  if (!cls) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0007] flex flex-col items-center justify-center p-6 text-center">
        <Dumbbell className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Class Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The class you're looking for doesn't exist.</p>
        <Link href="/classes" className="px-6 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors">
          Browse Classes
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0007] pb-24 font-sans text-gray-900 dark:text-gray-100">
      {/* Toast Message */}
      {message.text && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`px-6 py-3 rounded-full shadow-lg font-bold text-sm text-white ${message.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}
          >
            {message.text}
          </motion.div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        {/* Breadcrumb / Back Link */}
        <Link href="/classes" className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-rose-400 hover:text-orange-600 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Classes
        </Link>

        {/* Title & Badge */}
        <div className="mb-8">
          <div className="inline-block px-3 py-1 mb-4 text-[10px] font-black tracking-widest uppercase bg-red-700/10 text-red-700 dark:text-rose-400 rounded-full border border-orange-500/20">
            {cls.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
            {cls.className || cls.name}
          </h1>
        </div>

        {/* Main Image */}
        <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12 shadow-2xl relative">
          <img 
            src={cls.image || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200"} 
            alt={cls.className || cls.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* ─── LEFT COLUMN: Details ─── */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: Clock, label: "Duration", value: cls.duration || "60 min" },
                { icon: Zap, label: "Level", value: cls.intensity || cls.level || "All Levels" },
                { icon: Activity, label: "Focus", value: cls.focus || "Full Body" },
                { icon: Flame, label: "Est. Burn", value: cls.caloriesBurn || "500 cal" },
                { icon: CalendarDays, label: "Schedule", value: (cls.schedule?.days || ["Mon", "Wed"]).join(", ") },
                { icon: User, label: "Status", value: cls.status || "Open", highlight: true }
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white dark:bg-[#0e0005] border border-gray-200 dark:border-white/[0.05] flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-red-700/10 flex items-center justify-center flex-shrink-0">
                    <stat.icon className="w-5 h-5 text-red-700 dark:text-rose-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">{stat.label}</p>
                    <p className={`text-sm font-bold ${stat.highlight ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* About Class */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-6 bg-red-700 rounded-full" />
                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">About This Class</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {cls.aboutClass || cls.description || "Join us for an intense and rewarding session designed to push your limits."}
              </p>
            </div>

            {/* Coach */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-6 bg-red-700 rounded-full" />
                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Your Coach</h2>
              </div>
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0e0005] border border-gray-200 dark:border-white/[0.05] flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-red-700/20 flex-shrink-0">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(cls.coach?.name || cls.trainer || "Coach")}&background=f97316&color=fff&size=128`} alt="Coach" className="w-full h-full object-cover" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-[10px] font-black text-red-700 dark:text-rose-400 uppercase tracking-widest mb-1">{cls.coach?.role || "Lead Coach"}</p>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">{cls.coach?.name || cls.trainer || "Expert Trainer"}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {cls.coach?.bio || "Certified fitness expert dedicated to helping you achieve your physical goals."}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* ─── RIGHT COLUMN: Sticky Booking Card ─── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-8 rounded-3xl bg-white dark:bg-[#0e0005] border border-gray-200 dark:border-white/[0.05] shadow-2xl">
              
              <div className="text-center pb-6 border-b border-gray-100 dark:border-white/[0.05] mb-6">
                <span className="inline-block px-3 py-1 mb-4 text-[10px] font-black tracking-widest uppercase bg-red-700/10 text-red-700 dark:text-rose-400 rounded-full">
                  {cls.passType || "Class Pass"}
                </span>
                <div className="flex justify-center items-start text-gray-900 dark:text-white">
                  <span className="text-2xl font-bold mt-1">$</span>
                  <span className="text-6xl font-black tracking-tighter">{cls.price}</span>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                  {cls.paymentType || "One-Time Payment"}
                </p>
              </div>

              <div className="space-y-5 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/[0.02] flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Schedule</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{(cls.schedule?.days || []).join(", ")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/[0.02] flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Time</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{cls.schedule?.time || "TBA"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleBookNow}
                  disabled={isBooked}
                  className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-300 ${
                    isBooked 
                      ? "bg-gray-100 dark:bg-white/[0.05] text-gray-400 cursor-not-allowed" 
                      : "bg-red-700 hover:bg-red-800 text-white shadow-lg shadow-red-700/25 hover:shadow-red-700/40 hover:-translate-y-1"
                  }`}
                >
                  {isBooked ? "Already Booked" : "Book This Class"}
                </button>

                <button 
                  onClick={handleToggleFavorite}
                  disabled={actionLoading}
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 border flex justify-center items-center gap-2 ${
                    isFavorited
                      ? "bg-orange-50 dark:bg-red-700/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400"
                      : "bg-transparent border-gray-200 dark:border-white/[0.1] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  }`}
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} /> 
                      {isFavorited ? "Saved to Favorites" : "Add to Favorites"}
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}