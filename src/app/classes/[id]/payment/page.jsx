"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  Loader2, ArrowLeft, CreditCard, ShieldCheck, Clock,
  Flame, User, MapPin, CheckCircle, Lock, Zap
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PaymentPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [cls, setCls] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch class details
  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/classes/${id}`);
        if (!res.ok) throw new Error("Class not found");
        const data = await res.json();
        setCls(data);
      } catch (err) {
        setError("Failed to load class details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchClass();
  }, [id]);

  // Check if already booked
  useEffect(() => {
    const checkBooking = async () => {
      if (!session?.user?.id || !id) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/check?classId=${id}&userId=${session.user.id}`);
        if (res.ok) {
          const data = await res.json();
          setIsBooked(data.isBooked);
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (!isPending) checkBooking();
  }, [id, session?.user?.id, isPending]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/auth/signin");
    }
  }, [isPending, session, router]);

  const handleCheckout = async () => {
    if (!session?.user) {
      router.push("/auth/signin");
      return;
    }
    if (isBooked) {
      setError("You have already booked this class.");
      return;
    }

    setCheckoutLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: id,
          className: cls.className || cls.name,
          price: cls.price,
          email: session.user.email,
          userId: session.user.id,
          quantity: 1,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Failed to start checkout. Please try again.");
        setCheckoutLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setCheckoutLoading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0B0B0D]">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!cls) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0B0B0D] gap-4">
        <p className="text-gray-500 dark:text-gray-400">Class not found.</p>
        <Link href="/classes" className="text-red-600 font-bold hover:underline">Back to Classes</Link>
      </div>
    );
  }

  const trainerName = cls.coach?.name || cls.trainer || "Expert Trainer";
  const className = cls.className || cls.name || "Class";
  const category = cls.category || "General";
  const duration = cls.duration || "60 min";
  const level = cls.level || "All Levels";
  const price = Number(cls.price) || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0B0D] pt-24 pb-16 px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <Link
          href={`/classes/${id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Class Details
        </Link>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Complete Your Booking</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Review your selection and proceed to secure payment.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ─── Left: Class Summary ─── */}
          <div className="lg:col-span-3 space-y-5">

            {/* Class Card */}
            <div className="bg-white dark:bg-[#1C1C1F] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm">

              {/* Class Image */}
              {cls.image && (
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={cls.image}
                    alt={className}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-widest">
                    {category}
                  </span>
                </div>
              )}

              <div className="p-6 space-y-5">
                {/* Class Name */}
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">{className}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{cls.description || "Join us for an amazing fitness experience."}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-red-600 dark:text-rose-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Trainer</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{trainerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                      <Clock size={16} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Duration</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                      <Flame size={16} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Level</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{level}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                      <Zap size={16} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Schedule</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {cls.schedule?.days?.join(", ") || "Flexible"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* What's Included */}
                <div className="pt-2">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">What&apos;s Included</p>
                  <ul className="space-y-2">
                    {["Full class access", "Expert coaching", "Progress tracking", "Community support"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Right: Payment Summary ─── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-[#1C1C1F] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-6 shadow-sm sticky top-28">

              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-5">Order Summary</h3>

              {/* Booking for */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/[0.03] rounded-xl mb-5">
                <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-700 dark:text-rose-400 font-bold text-sm flex-shrink-0">
                  {session?.user?.name?.[0] || session?.user?.email?.[0] || "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Booking for</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{session?.user?.name || "You"}</p>
                  <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="space-y-3 border-t border-gray-100 dark:border-white/[0.05] pt-4 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{className}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Quantity</span>
                  <span className="font-semibold text-gray-900 dark:text-white">× 1</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Processing fee</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">Free</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] mb-5">
                <span className="text-sm font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white">${price.toFixed(2)}</span>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/40 rounded-xl text-xs text-red-700 dark:text-red-400 font-medium">
                  {error}
                </div>
              )}

              {/* Already Booked */}
              {isBooked ? (
                <div className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gray-100 dark:bg-white/[0.05] text-gray-400 font-bold text-sm cursor-not-allowed">
                  <CheckCircle size={16} className="text-green-500" />
                  Already Booked
                </div>
              ) : (
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white font-extrabold text-sm uppercase tracking-widest transition-all shadow-lg shadow-red-700/30 hover:shadow-red-700/50 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
                >
                  {checkoutLoading ? (
                    <><Loader2 size={16} className="animate-spin" /> Redirecting to Stripe...</>
                  ) : (
                    <><CreditCard size={16} /> Pay ${price.toFixed(2)} with Stripe</>
                  )}
                </button>
              )}

              {/* Security note */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <Lock size={12} />
                <span>Secured by Stripe — 256-bit SSL encryption</span>
              </div>

              <div className="mt-3 flex items-center justify-center gap-4 opacity-40 grayscale">
                <ShieldCheck size={16} className="text-gray-500" />
                <span className="text-[10px] text-gray-500 font-bold">VISA · MASTERCARD · AMEX</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
