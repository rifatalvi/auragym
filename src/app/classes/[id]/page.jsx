"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import {
  Clock, Flame, Zap, ArrowRight, Loader2, Heart, ArrowLeft,
  Calendar, MapPin, Plus, Check
} from "lucide-react";
import Link from "next/link";
import fetchSecure from "@/lib/fetchSecure";

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
        const res = await fetch(`/api/classes/${id}`);
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
      if (!session?.user?.email || !id) return;
      try {
        const [bookingRes, favRes] = await Promise.all([
          fetch(`/api/bookings/check?classId=${id}&userId=${session.user.email}`),
          fetch(`/api/favorites/check?classId=${id}&userId=${session.user.email}`)
        ]);
        if (bookingRes.ok) setIsBooked((await bookingRes.json()).isBooked);
        if (favRes.ok) setIsFavorited((await favRes.json()).isFavorited);
      } catch (err) {
        console.error("Error fetching user status:", err);
      }
    };
    fetchUserStatus();
  }, [id, session?.user?.email]);

  const handleBookNow = async (e) => {
    if (e) e.preventDefault();
    if (!session?.user) {
      showMessage("Please log in to book classes.", "error");
      setTimeout(() => router.push("/auth/signup"), 1500);
      return;
    }
    if (isBooked) { showMessage("You have already booked this class.", "error"); return; }
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
      const res = await fetchSecure(`${process.env.NEXT_PUBLIC_API_URL}/api/favorites/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: id, userId: session.user.email })
      });
      if (!res.ok) throw new Error("Failed to toggle favorite");
      const data = await res.json();
      setIsFavorited(data.isFavorited);
      showMessage(data.isFavorited ? "Successfully added to your favorites!" : "Successfully removed from your favorites!", "success");
    } catch {
      showMessage("Something went wrong.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0B0B0D] flex items-center justify-center pt-16">
        <Loader2 className="w-10 h-10 text-red-600 dark:text-[#C8102E] animate-spin" />
      </div>
    );
  }

  // ── Not found ───────────────────────────────────────────────────────────────
  if (!cls) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0B0B0D] flex flex-col items-center justify-center p-6 text-center pt-16">
        <p className="text-gray-400 dark:text-[#8A8A8E] font-mono text-sm uppercase tracking-widest mb-3">404 / not found</p>
        <h1 className="text-3xl font-black uppercase text-gray-900 dark:text-[#EDEAE3] mb-2">Class not found</h1>
        <p className="text-gray-500 dark:text-[#8A8A8E] mb-6 max-w-sm">This session doesn&apos;t exist or has been removed from the schedule.</p>
        <Link href="/classes" className="px-6 py-3 rounded-lg bg-red-700 dark:bg-[#C8102E] text-white font-bold uppercase tracking-wider text-sm hover:bg-red-800 dark:hover:bg-[#a30d25] transition-colors">
          Browse classes
        </Link>
      </div>
    );
  }

  const plates = [
    { label: "Duration", value: cls.duration || "60 min", icon: Clock, weight: 25 },
    { label: "Intensity", value: cls.intensity || cls.level || "All levels", icon: Zap, weight: 35 },
    { label: "Est. burn", value: cls.caloriesBurn || "500 cal", icon: Flame, weight: 45 },
  ];
  const days = cls.schedule?.days || [];
  const time = cls.schedule?.time || "TBA";

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0B0D] text-gray-900 dark:text-[#EDEAE3] pb-24 pt-16 transition-colors duration-300">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;700;900&family=Roboto+Mono:wght@400;500&display=swap');
        .display { font-family: 'Oswald', sans-serif; }
        .mono    { font-family: 'Roboto Mono', monospace; }
        .plate-card { transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease; }
        .plate-card:hover { transform: translateY(-6px); box-shadow: 0 12px 24px -8px rgba(200,16,46,0.35); }
        .book-btn { transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease, background-color 0.25s ease; }
        .book-btn:not(:disabled):hover  { transform: translateY(-2px); box-shadow: 0 10px 24px -6px rgba(200,16,46,0.45); }
        .book-btn:not(:disabled):active { transform: translateY(0); }
        .fav-btn { transition: transform 0.2s ease, border-color 0.25s ease, background-color 0.25s ease; }
        .fav-btn:not(:disabled):hover  { transform: translateY(-1px); }
        .fav-btn:not(:disabled):active { transform: scale(0.98); }
        @media (prefers-reduced-motion: reduce) {
          .plate-card, .book-btn, .fav-btn { transition: none !important; }
        }
      `}</style>

      {/* ── Toast ── */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
          >
            <div className={`px-5 py-3 rounded-lg font-semibold text-sm text-white border-l-4 shadow-lg ${message.type === "error"
              ? "bg-gray-900 dark:bg-[#1C1C1F] border-red-600"
              : "bg-gray-900 dark:bg-[#1C1C1F] border-yellow-500"
              }`}>
              {message.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="border-b border-gray-200 dark:border-white/10"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-6">
          <Link
            href="/classes"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-[#8A8A8E] hover:text-gray-900 dark:hover:text-[#EDEAE3] mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Schedule
          </Link>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="mono text-xs text-yellow-600 dark:text-[#D4AF37] tracking-widest">
                  {String(cls.bookingCount ?? 0).padStart(3, "0")} LIFTERS BOOKED
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-[#8A8A8E]" />
                <span className="mono text-xs text-gray-500 dark:text-[#8A8A8E] tracking-widest uppercase">{cls.category}</span>
              </div>
              <h1 className="display text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[0.95] text-gray-900 dark:text-[#EDEAE3]">
                {cls.className || cls.name}
              </h1>
            </div>
            <div className="hidden sm:flex flex-col items-end mono text-xs text-gray-500 dark:text-[#8A8A8E] uppercase tracking-widest">
              <span>Status</span>
              <span className={`text-sm font-medium ${cls.status === "Open" ? "text-yellow-600 dark:text-[#D4AF37]" : "text-gray-500 dark:text-[#8A8A8E]"}`}>
                {cls.status || "Open"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ─── LEFT ─── */}
          <div className="lg:col-span-2 space-y-14">

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-[340px] sm:h-[440px] overflow-hidden rounded-xl border border-gray-100 dark:border-white/[0.06] shadow-lg dark:shadow-none"
            >
              <img
                src={cls.image || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200"}
                alt={cls.className || cls.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent dark:from-[#0B0B0D] dark:via-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-700 dark:bg-[#C8102E]" />
            </motion.div>

            {/* Loadout bar */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="display text-lg font-bold uppercase tracking-wide text-gray-900 dark:text-[#EDEAE3]">The loadout</h2>
                <span className="mono text-[11px] text-gray-500 dark:text-[#8A8A8E] uppercase tracking-widest">What you&apos;re lifting today</span>
              </div>

              <div className="relative py-10 px-4 overflow-x-auto">
                {/* bar */}
                <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[6px] bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-[#3a3a3e] dark:via-[#5a5a5e] dark:to-[#3a3a3e] rounded-full" />

                <div className="relative flex items-center justify-center gap-6 sm:gap-10 min-w-max mx-auto">
                  {/* left collar */}
                  <div className="w-3 h-10 bg-gray-300 dark:bg-[#2c2c2f] rounded-sm flex-shrink-0" />

                  {plates.map((p, i) => {
                    const size = 96 + p.weight * 1.4;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.45, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col items-center gap-3 flex-shrink-0"
                      >
                        <div
                          className="plate-card rounded-full border-[3px] border-red-700 dark:border-[#C8102E] bg-gray-100 dark:bg-[#1C1C1F] flex flex-col items-center justify-center shadow-md dark:shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] cursor-default"
                          style={{ width: size, height: size }}
                        >
                          <p.icon className="w-5 h-5 text-yellow-600 dark:text-[#D4AF37] mb-1" />
                          <span className="display text-xl font-black text-gray-900 dark:text-[#EDEAE3]">{p.weight}</span>
                          <span className="mono text-[9px] text-gray-500 dark:text-[#8A8A8E] uppercase">kg plate</span>
                        </div>
                        <div className="text-center">
                          <p className="mono text-[10px] text-gray-500 dark:text-[#8A8A8E] uppercase tracking-widest">{p.label}</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-[#EDEAE3] mt-0.5">{p.value}</p>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* right collar */}
                  <div className="w-3 h-10 bg-gray-300 dark:bg-[#2c2c2f] rounded-sm flex-shrink-0" />
                </div>
              </div>
            </motion.div>

            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-4 border-b border-gray-200 dark:border-white/10 pb-3">
                <h2 className="display text-lg font-bold uppercase tracking-wide text-gray-900 dark:text-[#EDEAE3]">About this class</h2>
              </div>
              <p className="text-gray-600 dark:text-[#b8b6ae] leading-relaxed text-base">
                {cls.aboutClass || cls.description || "Join us for an intense and rewarding session designed to push your limits."}
              </p>
            </motion.div>

            {/* Coach */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-4 border-b border-gray-200 dark:border-white/10 pb-3">
                <h2 className="display text-lg font-bold uppercase tracking-wide text-gray-900 dark:text-[#EDEAE3]">Your coach</h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-20 h-20 overflow-hidden rounded-xl border-2 border-yellow-500 dark:border-[#D4AF37] flex-shrink-0">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(cls.coach?.name || cls.trainer || "Coach")}&background=1C1C1F&color=EDEAE3&size=128`}
                    alt="Coach"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="mono text-[10px] text-red-700 dark:text-[#C8102E] uppercase tracking-widest mb-1">{cls.coach?.role || "Lead coach"}</p>
                  <h3 className="display text-xl font-bold uppercase tracking-tight mb-2 text-gray-900 dark:text-[#EDEAE3]">{cls.coach?.name || cls.trainer || "Expert trainer"}</h3>
                  <p className="text-gray-600 dark:text-[#b8b6ae] text-sm leading-relaxed max-w-md">
                    {cls.coach?.bio || "Certified fitness expert dedicated to helping you achieve your physical goals."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ─── RIGHT: Booking card ─── */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="sticky top-24 bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-lg dark:shadow-none"
            >
              {/* Ticket header */}
              <div className="px-6 pt-6 pb-5 border-b border-dashed border-gray-200 dark:border-white/15">
                <div className="flex items-center justify-between mb-4">
                  <span className="mono text-[10px] uppercase tracking-widest text-gray-500 dark:text-[#8A8A8E]">{cls.passType || "Class pass"}</span>
                  <span className="mono text-[10px] uppercase tracking-widest text-gray-500 dark:text-[#8A8A8E]">No. {(id || "000").toString().slice(-4)}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="display text-2xl font-bold text-yellow-600 dark:text-[#D4AF37]">$</span>
                  <span className="display text-6xl font-black tracking-tight text-gray-900 dark:text-[#EDEAE3]">{cls.price}</span>
                </div>
                <p className="mono text-[10px] text-gray-500 dark:text-[#8A8A8E] uppercase tracking-widest mt-2">
                  {cls.paymentType || "One-time payment"}
                </p>
              </div>

              {/* Ticket body */}
              <div className="px-6 py-5 space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 dark:text-[#8A8A8E] mt-0.5" />
                  <div>
                    <p className="mono text-[10px] text-gray-500 dark:text-[#8A8A8E] uppercase tracking-widest">Days</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-[#EDEAE3]">{days.length ? days.join(" · ") : "TBA"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-gray-400 dark:text-[#8A8A8E] mt-0.5" />
                  <div>
                    <p className="mono text-[10px] text-gray-500 dark:text-[#8A8A8E] uppercase tracking-widest">Time</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-[#EDEAE3]">{time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 dark:text-[#8A8A8E] mt-0.5" />
                  <div>
                    <p className="mono text-[10px] text-gray-500 dark:text-[#8A8A8E] uppercase tracking-widest">Focus</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-[#EDEAE3]">{cls.focus || "Full body"}</p>
                  </div>
                </div>
              </div>

              {/* Perforation */}
              <div className="relative h-0 border-t border-dashed border-gray-200 dark:border-white/15">
                <div className="absolute -left-[1px] -top-3 w-6 h-6 rounded-full bg-gray-50 dark:bg-[#0B0B0D] border border-gray-200 dark:border-transparent" />
                <div className="absolute -right-[1px] -top-3 w-6 h-6 rounded-full bg-gray-50 dark:bg-[#0B0B0D] border border-gray-200 dark:border-transparent" />
              </div>

              {/* Actions */}
              <div className="px-6 pt-6 pb-6 space-y-3">

                {/* Spots remaining indicator */}
                {cls.maxStudents && (
                  <div className="mb-1">
                    {(() => {
                      const booked = cls.bookingCount || 0;
                      const max = cls.maxStudents;
                      const remaining = Math.max(0, max - booked);
                      const pct = Math.min(100, Math.round((booked / max) * 100));
                      const isFull = remaining === 0;
                      return (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className={isFull ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}>
                              {isFull ? '🔴 Class Full' : `${remaining} spot${remaining !== 1 ? 's' : ''} left`}
                            </span>
                            <span className="text-gray-400">{booked}/{max} enrolled</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${isFull ? 'bg-red-500' : pct >= 80 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {(() => {
                  const isFull = cls.maxStudents && (cls.bookingCount || 0) >= cls.maxStudents;
                  const isOwnClass = session?.user?.email && cls.trainerEmail && session.user.email === cls.trainerEmail;

                  return (
                    <button
                      onClick={(e) => {
                        if (isOwnClass) {
                          e.preventDefault();
                          showMessage("You cannot book your own class.", "error");
                          return;
                        }
                        handleBookNow(e);
                      }}
                      disabled={isBooked || isFull || isOwnClass}
                      className={`book-btn w-full py-4 rounded-lg font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 ${isBooked || isFull || isOwnClass
                        ? "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-[#5a5a5e] cursor-not-allowed"
                        : "bg-red-700 dark:bg-[#C8102E] hover:bg-red-800 dark:hover:bg-[#a30d25] text-white"
                        }`}
                    >
                      {isBooked ? (
                        <><Check className="w-4 h-4" /> Already booked</>
                      ) : isFull ? (
                        <><Check className="w-4 h-4" /> Class Full</>
                      ) : isOwnClass ? (
                        <><Check className="w-4 h-4" /> Your Class</>
                      ) : (
                        <>Book this class <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  );
                })()}

                <button
                  onClick={handleToggleFavorite}
                  disabled={actionLoading}
                  className={`fav-btn w-full py-3.5 rounded-lg font-semibold text-sm border flex justify-center items-center gap-2 transition-all ${isFavorited
                    ? "bg-yellow-50 dark:bg-[#D4AF37]/10 border-yellow-400 dark:border-[#D4AF37]/40 text-yellow-700 dark:text-[#D4AF37]"
                    : "bg-transparent border-gray-200 dark:border-white/15 text-gray-600 dark:text-[#b8b6ae] hover:border-gray-400 dark:hover:border-white/30"
                    }`}
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {isFavorited ? <Heart className="w-4 h-4 fill-current" /> : <Plus className="w-4 h-4" />}
                      {isFavorited ? "Saved to favorites" : "Add to favorites"}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}