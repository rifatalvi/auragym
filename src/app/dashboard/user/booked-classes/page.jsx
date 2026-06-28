"use client";

import React, { useState, useEffect } from "react";
import fetchSecure from '../../../../lib/fetchSecure';
import { useSession } from "@/lib/auth-client";
import {
  MdFitnessCenter,
  MdArrowForward,
  MdCalendarToday,
  MdAccessTime,
  MdPerson,
  MdOutlineLibraryBooks
} from "react-icons/md";
import Link from "next/link";
import Image from "next/image";
import { TableRowSkeleton } from "@/componet/Sheard/Skeleton";

export default function BookedClassesPage() {
  const { data: session, isPending } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetchSecure(`/api/users/${session.user.id}/bookings`);
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    if (!isPending) fetchBookings();
  }, [session, isPending]);


  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 mb-4">
          <MdOutlineLibraryBooks className="text-red-700 dark:text-rose-400" size={16} />
          <span className="text-xs font-bold text-red-700 dark:text-rose-400 uppercase tracking-wider">My Classes</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Booked Classes</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">
          Review all the classes you&apos;ve registered and paid for. Get ready to sweat!
        </p>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-[#120010] border border-gray-100 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/80 dark:bg-white/[0.02]">
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Class Details</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Trainer</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Schedule</th>
                <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
              {(isPending || loading) ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={4} />
                ))
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="w-14 h-14 bg-gray-100 dark:bg-white/[0.04] rounded-full flex items-center justify-center mx-auto mb-3">
                      <MdFitnessCenter className="text-2xl text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No classes booked yet</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 mb-6">You haven&apos;t registered for any classes.</p>
                    <Link
                      href="/classes"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-600 text-white text-sm font-bold transition-all shadow-md shadow-red-700/20"
                    >
                      Browse Classes <MdArrowForward size={16} />
                    </Link>
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  const cls = booking.classDetails;
                  
                  return (
                    <tr key={booking._id} className="hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors group">
                      
                      {/* Class Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-[#1C1C1F] border border-gray-200 dark:border-white/[0.05]">
                            {cls?.image ? (
                              <img src={cls.image} alt={cls.className} className="w-full h-full object-cover" />
                            ) : (
                              <MdFitnessCenter className="w-full h-full p-3 text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                              {cls?.className || cls?.name || "Unknown Class"}
                            </p>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5">
                              {cls?.category || "General"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Trainer */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex items-center justify-center text-red-700 dark:text-rose-400 text-xs font-bold overflow-hidden">
                            {cls?.coach?.name ? (
                              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(cls.coach.name)}&background=random`} alt={cls.coach.name} className="w-full h-full object-cover" />
                            ) : (
                              <MdPerson size={16} />
                            )}
                          </div>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {cls?.coach?.name || cls?.trainer || "TBA"}
                          </p>
                        </div>
                      </td>

                      {/* Schedule */}
                      <td className="px-6 py-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 font-medium">
                            <MdCalendarToday className="text-gray-400 dark:text-gray-500" size={14} />
                            {cls?.schedule?.days?.join(", ") || "TBA"}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 font-medium">
                            <MdAccessTime className="text-gray-400 dark:text-gray-500" size={14} />
                            {cls?.schedule?.time || "TBA"}
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/classes/${booking.classId}`}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/[0.08] text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-red-700 hover:border-red-700 hover:text-white dark:hover:bg-red-700 dark:hover:border-red-700 transition-all shadow-sm group-hover:shadow-md"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && bookings.length > 0 && (
          <div className="px-6 py-3.5 border-t border-gray-100 dark:border-white/[0.05] bg-gray-50/50 dark:bg-white/[0.01]">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              You have <span className="font-bold text-gray-700 dark:text-gray-300">{bookings.length}</span> booked {bookings.length === 1 ? 'class' : 'classes'}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
