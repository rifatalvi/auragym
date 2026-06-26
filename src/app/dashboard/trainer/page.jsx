"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "@/lib/auth-client";
import { MdDashboard, MdTrendingUp, MdGroup, MdOutlineStar, MdOutlineClass, MdPeopleOutline, MdVerifiedUser } from 'react-icons/md';

export default function TrainerOverviewPage() {
  const { data: session, isPending } = useSession();
  const [classes, setClasses] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session?.user?.email) return;
      try {
        const [classesRes, bookingsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/trainer/${session.user.email}/classes`),
          fetch(`http://localhost:5000/api/trainer/${session.user.email}/bookings`)
        ]);

        if (classesRes.ok) {
          const classesData = await classesRes.json();
          setClasses(classesData);
        }

        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          const totalEarnings = bookingsData.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
          setEarnings(totalEarnings);
        }

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (!isPending) fetchDashboardData();
  }, [session, isPending]);

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalClasses = classes.length;
  const totalStudents = classes.reduce((sum, cls) => sum + (cls.bookingCount || 0), 0);

  return (
    <div className="w-full space-y-6">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 mb-4">
          <MdDashboard className="text-red-700 dark:text-rose-400" size={16} />
          <span className="text-xs font-bold text-red-700 dark:text-rose-400 uppercase tracking-wider">Overview</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Trainer Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">
          Welcome to your control center. Manage your classes, engage with students, and track your progress.
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-white dark:bg-[#120010] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-red-50 dark:bg-red-900/20 border-4 border-white dark:border-[#0a0007] shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0">
          {session?.user?.image ? (
            <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl font-bold text-red-700 dark:text-rose-400">
              {session?.user?.name?.[0] || "T"}
            </span>
          )}
        </div>
        <div className="text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row items-center gap-3 mb-2 justify-center md:justify-start">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{session?.user?.name || "Trainer Name"}</h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400">
              <MdVerifiedUser size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Trainer</span>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{session?.user?.email || "trainer@example.com"}</p>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-500 to-rose-600 dark:from-red-900 dark:to-rose-900 rounded-2xl p-6 sm:p-8 shadow-lg shadow-red-500/20 text-white flex items-center justify-between">
          <div>
            <p className="text-red-100 font-medium text-sm sm:text-base mb-1">Total Classes</p>
            <h3 className="text-4xl sm:text-5xl font-black">{totalClasses}</h3>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-md">
            <MdOutlineClass size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 rounded-2xl p-6 sm:p-8 shadow-lg shadow-blue-500/20 text-white flex items-center justify-between">
          <div>
            <p className="text-blue-100 font-medium text-sm sm:text-base mb-1">Students Enrolled</p>
            <h3 className="text-4xl sm:text-5xl font-black">{totalStudents}</h3>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-md">
            <MdPeopleOutline size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-900 dark:to-teal-900 rounded-2xl p-6 sm:p-8 shadow-lg shadow-emerald-500/20 text-white flex items-center justify-between">
          <div>
            <p className="text-emerald-100 font-medium text-sm sm:text-base mb-1">Total Earnings</p>
            <h3 className="text-4xl sm:text-5xl font-black">${earnings.toFixed(2)}</h3>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-md">
            <span className="text-3xl font-black">$</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#120010] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-8 text-center flex flex-col items-center justify-center mt-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">Quick Links</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
          <a href="/dashboard/trainer/add-class" className="bg-gray-50 dark:bg-white/[0.02] p-6 rounded-xl border border-gray-100 dark:border-white/[0.05] flex flex-col items-center text-center hover:border-red-300 transition-colors group">
             <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
               <MdTrendingUp size={24} />
             </div>
             <h4 className="font-bold text-gray-900 dark:text-white mb-2">Create Classes</h4>
             <p className="text-sm text-gray-500 dark:text-gray-400">Set up your schedule and start accepting bookings.</p>
          </a>
          
          <a href="/dashboard/trainer/add-forum-post" className="bg-gray-50 dark:bg-white/[0.02] p-6 rounded-xl border border-gray-100 dark:border-white/[0.05] flex flex-col items-center text-center hover:border-blue-300 transition-colors group">
             <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
               <MdGroup size={24} />
             </div>
             <h4 className="font-bold text-gray-900 dark:text-white mb-2">Engage Community</h4>
             <p className="text-sm text-gray-500 dark:text-gray-400">Share tips, diet plans, and workout routines.</p>
          </a>
          
          <a href="/dashboard/trainer/transactions" className="bg-gray-50 dark:bg-white/[0.02] p-6 rounded-xl border border-gray-100 dark:border-white/[0.05] flex flex-col items-center text-center hover:border-green-300 transition-colors group">
             <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
               <MdOutlineStar size={24} />
             </div>
             <h4 className="font-bold text-gray-900 dark:text-white mb-2">Track Earnings</h4>
             <p className="text-sm text-gray-500 dark:text-gray-400">Monitor your class bookings and payments.</p>
          </a>
        </div>
      </div>
    </div>
  );
}