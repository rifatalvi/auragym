"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "@/lib/auth-client";
import { MdDashboard, MdOutlineClass, MdPeopleOutline, MdVerifiedUser, MdWallet, MdTrendingUp } from 'react-icons/md';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function TrainerOverviewPage() {
  const { data: session, isPending } = useSession();
  const [classes, setClasses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session?.user?.email) return;
      try {
        const [classesRes, bookingsRes] = await Promise.all([
          fetch(`$\{process.env.NEXT_PUBLIC_API_URL\}/api/trainer/${session.user.email}/classes`),
          fetch(`$\{process.env.NEXT_PUBLIC_API_URL\}/api/trainer/${session.user.email}/bookings`)
        ]);

        if (classesRes.ok) {
          const classesData = await classesRes.json();
          setClasses(classesData);
        }

        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData);
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

  // ── Chart 1: Earnings per Class (Bar chart – inspired by chart-07) ──────────
  const earningsByClass = classes.map(cls => ({
    name: (cls.className || cls.name || "Class").slice(0, 18),
    earnings: bookings
      .filter(b => b.classId === cls._id.toString())
      .reduce((s, b) => s + (Number(b.amount) || 0), 0),
    students: cls.bookingCount || 0,
  })).filter(c => c.students > 0 || c.earnings > 0);

  // If no real data, show placeholder
  const chartData = earningsByClass.length > 0 ? earningsByClass : [
    { name: "No classes yet", earnings: 0, students: 0 },
  ];

  // ── Chart 2: Daily Bookings (Area chart – inspired by chart-26) ──────────────
  const dailyBookingMap = {};
  bookings.forEach(b => {
    const date = new Date(b.bookingDate || b.createdAt);
    const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!dailyBookingMap[key]) dailyBookingMap[key] = { date: key, bookings: 0, revenue: 0 };
    dailyBookingMap[key].bookings += 1;
    dailyBookingMap[key].revenue += Number(b.amount) || 0;
  });

  // Sort by date and get last 14 days
  const dailyChartData = Object.values(dailyBookingMap)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-14);

  const hasDailyData = dailyChartData.length > 0;
  if (!hasDailyData) {
    dailyChartData.push(
      { date: "Today", bookings: 0, revenue: 0 },
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="mb-2">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-red-500 to-rose-600 dark:from-red-900 dark:to-rose-900 rounded-2xl p-6 shadow-lg shadow-red-500/20 text-white flex items-center justify-between">
          <div>
            <p className="text-red-100 font-medium text-sm mb-1">Total Classes</p>
            <h3 className="text-5xl font-black">{totalClasses}</h3>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-md">
            <MdOutlineClass size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 rounded-2xl p-6 shadow-lg shadow-blue-500/20 text-white flex items-center justify-between">
          <div>
            <p className="text-blue-100 font-medium text-sm mb-1">Students Enrolled</p>
            <h3 className="text-5xl font-black">{totalStudents}</h3>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-md">
            <MdPeopleOutline size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-900 dark:to-teal-900 rounded-2xl p-6 shadow-lg shadow-emerald-500/20 text-white flex items-center justify-between">
          <div>
            <p className="text-emerald-100 font-medium text-sm mb-1">Total Earnings</p>
            <h3 className="text-5xl font-black">${earnings.toFixed(2)}</h3>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-md">
            <MdWallet size={32} />
          </div>
        </div>
      </div>

      {/* ── CHART 1: Earnings per Class + Summary (chart-07 style) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 bg-white dark:bg-[#120010] border border-gray-100 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm">
        {/* Area/Bar Chart */}
        <div className="lg:col-span-2 p-6 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-white/[0.06]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Income by Class</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Earnings breakdown per class</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.15)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `$${v}`}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a0020',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(value, name) => [`$${Number(value).toFixed(2)}`, 'Earnings']}
              />
              <Bar dataKey="earnings" fill="url(#earningsGrad)" radius={[6, 6, 0, 0]} maxBarSize={50} />
              <defs>
                <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.5} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Side Panel */}
        <div className="p-6 flex flex-col gap-4 justify-center">
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Report</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Earnings overview</p>
          </div>
          <div className="flex-1 flex flex-col gap-3">
            <div className="bg-gray-50 dark:bg-white/[0.04] rounded-xl px-4 py-3 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <MdWallet className="text-emerald-600 dark:text-emerald-400" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Earned</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">${earnings.toFixed(2)}</p>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-white/[0.04] rounded-xl px-4 py-3 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <MdPeopleOutline className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Students</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{totalStudents}</p>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-white/[0.04] rounded-xl px-4 py-3 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <MdOutlineClass className="text-red-600 dark:text-rose-400" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Active Classes</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{totalClasses}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CHART 2: Daily Bookings & Revenue (chart-26 style) ── */}
      <div className="bg-white dark:bg-[#120010] border border-gray-100 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm">
        {/* Header with summary metrics */}
        <div className="p-6 border-b border-gray-100 dark:border-white/[0.06]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Booking Activity</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Bookings and revenue per day</p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="flex items-center gap-2">
                <span className="w-1 h-14 rounded-sm bg-rose-500 flex-shrink-0"></span>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{bookings.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Bookings</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1 h-14 rounded-sm bg-emerald-500 flex-shrink-0"></span>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">${earnings.toFixed(0)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1 h-14 rounded-sm bg-indigo-400 flex-shrink-0"></span>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{totalClasses}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Classes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Area Chart */}
        <div className="p-6">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dailyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="bookingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.1)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `$${v}`}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a0020',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', color: '#9ca3af', paddingTop: '16px' }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="bookings"
                stroke="#f43f5e"
                strokeWidth={2}
                fill="url(#bookingsGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#f43f5e' }}
                name="Bookings"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#revenueGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#10b981' }}
                name="Revenue ($)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}