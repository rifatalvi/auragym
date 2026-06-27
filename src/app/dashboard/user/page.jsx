"use client";

import React, { useState, useEffect } from 'react';
import fetchSecure from '../../../lib/fetchSecure';
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { 
  MdOutlineLibraryBooks, 
  MdFavorite, 
  MdVerifiedUser, 
  MdPendingActions, 
  MdCancel,
  MdMail,
  MdBadge,
  MdWorkspacePremium,
  MdArrowForward
} from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { StatCardSkeleton } from "@/componet/Sheard/Skeleton";

export default function UserOverviewPage() {
  const { data: session, isPending } = useSession();
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalFavorites: 0,
    applicationStatus: null,
    applicationFeedback: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetchSecure(`$\{process.env.NEXT_PUBLIC_API_URL\}/api/users/${session.user.email}/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isPending) {
      fetchStats();
    }
  }, [session, isPending]);

  if (isPending || loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <StatCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  const user = session?.user;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* ── Page Header ── */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">Here whats happening with your fitness journey today.</p>
      </motion.div>

      {/* ── Member Upgrade Banner (for plain users) ── */}
      {user?.role === 'user' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700/40 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <MdWorkspacePremium className="text-amber-600 dark:text-amber-400" size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Upgrade to Member</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                Book at least <span className="font-bold">1 class</span> to unlock your Member status and full benefits!
              </p>
            </div>
          </div>
          <Link
            href="/classes"
            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/20"
          >
            Browse Classes <MdArrowForward size={14} />
          </Link>
        </motion.div>
      )}

      {/* ── Member Badge Banner (for members) ── */}
      {user?.role === 'member' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-700/40 rounded-2xl px-6 py-4 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <MdWorkspacePremium className="text-emerald-600 dark:text-emerald-400" size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Active Member</p>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider">VERIFIED</span>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
              You&apos;re an AuraGym member! Enjoy full access to all your booked classes.
            </p>
          </div>
        </motion.div>
      )}

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-12 gap-6"
      >
        
        {/* ── Statistics Section (Left Column) ── */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 h-fit">
          
          {/* Total Booked Classes Card */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-[#120010] p-6 rounded-2xl border border-gray-100 dark:border-white/[0.05] shadow-sm hover:shadow-md dark:shadow-none transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300">
              <MdOutlineLibraryBooks className="text-6xl text-red-500/10 dark:text-rose-500/10" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-red-50 dark:bg-rose-500/10 rounded-xl flex items-center justify-center mb-4">
                <MdOutlineLibraryBooks className="text-2xl text-red-600 dark:text-rose-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.totalBookings}</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Booked Classes</p>
              
              <Link href="/dashboard/user/booked-classes" className="inline-block mt-4 text-xs font-semibold text-red-600 hover:text-red-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors">
                View Bookings →
              </Link>
            </div>
          </motion.div>

          {/* Total Favorites Card */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-[#120010] p-6 rounded-2xl border border-gray-100 dark:border-white/[0.05] shadow-sm hover:shadow-md dark:shadow-none transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300">
              <MdFavorite className="text-6xl text-purple-500/10" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                <MdFavorite className="text-2xl text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.totalFavorites}</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Saved Favorites</p>

              <Link href="/dashboard/user/favorite-classes" className="inline-block mt-4 text-xs font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors">
                View Favorites →
              </Link>
            </div>
          </motion.div>

          {/* ── Trainer Application Status ── */}
          <motion.div variants={itemVariants} className="col-span-1 sm:col-span-2 mt-2">
            <div className="bg-gradient-to-br from-gray-900 to-black dark:from-[#1a0016] dark:to-[#0a0007] p-6 rounded-2xl border border-gray-800 dark:border-rose-900/30 shadow-xl overflow-hidden relative">
              {/* Background accent */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Trainer Application</h3>
                  <p className="text-sm text-gray-400 max-w-md">
                    Want to become an elite trainer at AuraGym? Apply now to lead your own fitness classes.
                  </p>
                </div>
                
                <div className="flex-shrink-0">
                  {!stats.applicationStatus ? (
                    <Link 
                      href="/dashboard/user/apply-trainer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all shadow-lg shadow-red-600/20 hover:scale-105 active:scale-95"
                    >
                      <MdVerifiedUser size={18} />
                      Apply Now
                    </Link>
                  ) : (
                    <div className="flex flex-col items-end gap-2">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border ${
                        stats.applicationStatus === 'Pending' 
                          ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
                          : stats.applicationStatus === 'Rejected'
                          ? 'bg-red-500/10 border-red-500/30 text-red-500'
                          : 'bg-green-500/10 border-green-500/30 text-green-500'
                      }`}>
                        {stats.applicationStatus === 'Pending' && <MdPendingActions size={18} />}
                        {stats.applicationStatus === 'Rejected' && <MdCancel size={18} />}
                        {stats.applicationStatus === 'Accepted' && <MdVerifiedUser size={18} />}
                        Status: {stats.applicationStatus}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Feedback Message if Rejected */}
              {stats.applicationStatus === 'Rejected' && stats.applicationFeedback && (
                <div className="mt-5 p-4 bg-red-500/10 border border-red-500/20 rounded-xl relative z-10">
                  <div className="flex items-start gap-3">
                    <MdMail className="text-red-400 mt-0.5 flex-shrink-0" size={18} />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-1">Admin Feedback</h4>
                      <p className="text-sm text-gray-300 italic">{stats.applicationFeedback}</p>
                      
                      <Link 
                        href="/dashboard/user/apply-trainer"
                        className="inline-block mt-3 text-xs font-bold text-white bg-red-600/80 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Re-apply
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Profile Details Section (Right Column) ── */}
        <motion.div variants={itemVariants} className="md:col-span-4 h-full">
          <div className="bg-white dark:bg-[#120010] p-6 rounded-2xl border border-gray-100 dark:border-white/[0.05] shadow-sm flex flex-col h-full items-center text-center">
            
            {/* Profile Avatar */}
            <div className="relative mb-5 mt-2">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white dark:border-[#0a0007] shadow-xl relative z-10 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                {user?.image ? (
                  <Image 
                    src={user.image} 
                    alt={user?.name || "Profile"} 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-gray-400">
                    {user?.name?.[0] || user?.email?.[0] || 'U'}
                  </span>
                )}
              </div>
              <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20 -z-10 rounded-full scale-150"></div>
            </div>

            {/* Profile Info */}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name || "Fitness Enthusiast"}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>

            {/* Role Badge */}
            <div className="mt-4 mb-6">
              {user?.role === 'member' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-500/20 dark:to-teal-500/20 border border-emerald-300 dark:border-emerald-500/40 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  <MdWorkspacePremium size={14} className="text-emerald-500" />
                  Member
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.10] text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  <MdBadge size={14} className="text-gray-400" />
                  {user?.role || "User"}
                </span>
              )}
            </div>

            <div className="w-full h-px bg-gray-100 dark:bg-white/[0.05] my-2"></div>

            {/* Quick Actions / Meta */}
            <div className="w-full mt-4 space-y-3">
              <div className="flex justify-between items-center text-sm px-2">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Account Status</span>
                <span className="text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Active
                </span>
              </div>
              <div className="flex justify-between items-center text-sm px-2">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Member Since</span>
                <span className="text-gray-700 dark:text-gray-300 font-bold">2026</span>
              </div>
            </div>

          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}