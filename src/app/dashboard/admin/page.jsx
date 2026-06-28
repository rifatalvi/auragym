"use client";

import React, { useState, useEffect } from "react";
import fetchSecure from '../../../lib/fetchSecure';
import { Users, CalendarDays, CheckCircle, ShieldCheck, TrendingUp, Activity } from "lucide-react";
import { Avatar } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/componet/Sheard/Skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";

// Default/mock data for charts to make them look nice
const revenueData = [
  { name: "Jan", revenue: 4000, bookings: 2400 },
  { name: "Feb", revenue: 3000, bookings: 1398 },
  { name: "Mar", revenue: 2000, bookings: 9800 },
  { name: "Apr", revenue: 2780, bookings: 3908 },
  { name: "May", revenue: 1890, bookings: 4800 },
  { name: "Jun", revenue: 2390, bookings: 3800 },
  { name: "Jul", revenue: 3490, bookings: 4300 },
];

const userGrowthData = [
  { name: "Week 1", newUsers: 40, activeUsers: 24 },
  { name: "Week 2", newUsers: 30, activeUsers: 13 },
  { name: "Week 3", newUsers: 20, activeUsers: 98 },
  { name: "Week 4", newUsers: 27, activeUsers: 39 },
];

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({ totalUsers: 0, totalClasses: 0, totalBookings: 0 });
  const [loading, setLoading] = useState(true);

  // Fetch Session
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Fetch real stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL;
        const res = await fetchSecure(`/api/admin/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner / Profile Section */}
      <div className="bg-gradient-to-r from-red-900 to-rose-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-white/20 shadow-xl bg-white text-rose-600 text-3xl font-bold">
              {user?.image ? (
                <Avatar.Image src={user.image} alt={user?.name} className="object-cover" />
              ) : (
                <Avatar.Fallback>{user?.name?.charAt(0) || 'A'}</Avatar.Fallback>
              )}
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.name || 'Admin'}!</h1>
              <p className="text-rose-100 mb-3">{user?.email || 'admin@auragym.com'}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-sm font-semibold shadow-sm">
                <ShieldCheck size={16} className="text-green-300" />
                <span className="uppercase tracking-widest text-xs">Admin Access</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block text-right">
            <p className="text-sm text-rose-200 uppercase tracking-widest font-semibold mb-1">System Status</p>
            <div className="flex items-center gap-2 text-green-300 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
              All Systems Operational
            </div>
          </div>
        </div>
      </div>

      {/* High-Level Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow group">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Users</p>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <h3 className="text-4xl font-extrabold text-gray-800">{stats.totalUsers}</h3>
            )}
          </div>
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <Users size={28} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow group">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Classes</p>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <h3 className="text-4xl font-extrabold text-gray-800">{stats.totalClasses}</h3>
            )}
          </div>
          <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
            <CalendarDays size={28} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow group">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Bookings</p>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <h3 className="text-4xl font-extrabold text-gray-800">{stats.totalBookings}</h3>
            )}
          </div>
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
            <CheckCircle size={28} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Area Chart: Revenue & Bookings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" /> Revenue & Bookings Trend
              </h3>
              <p className="text-sm text-gray-500">Performance over the last 7 months</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ($)" />
                <Area type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" name="Bookings" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: User Growth */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Activity size={20} className="text-primary" /> User Engagement Growth
              </h3>
              <p className="text-sm text-gray-500">New vs Active users over the last 4 weeks</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="activeUsers" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Active Users" maxBarSize={40} />
                <Bar dataKey="newUsers" fill="#10b981" radius={[4, 4, 0, 0]} name="New Registrations" maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}