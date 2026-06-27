"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import {
  MdFavorite,
  MdArrowForward,
  MdFitnessCenter,
  MdDeleteOutline
} from "react-icons/md";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export default function FavoriteClassesPage() {
  const { data: session, isPending } = useSession();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${session.user.email}/favorites`);
        if (res.ok) {
          const data = await res.json();
          setFavorites(data);
        }
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      } finally {
        setLoading(false);
      }
    };
    if (!isPending) fetchFavorites();
  }, [session, isPending]);

  const handleRemove = async (classId) => {
    if (!session?.user?.id) return;
    setRemovingId(classId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/favorites/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId, userId: session.user.email })
      });
      if (res.ok) {
        setFavorites((prev) => prev.filter(f => f.classId !== classId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 mb-4">
          <MdFavorite className="text-red-700 dark:text-rose-400" size={16} />
          <span className="text-xs font-bold text-red-700 dark:text-rose-400 uppercase tracking-wider">My List</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Favorite Classes</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">
          Keep track of the classes you want to attend in the future.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white dark:bg-[#120010] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdFavorite className="text-3xl text-red-300 dark:text-red-900/40" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No favorites yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            You haven t saved any classes yet. Browse our schedule and click the heart icon to save classes here.
          </p>
          <Link
            href="/classes"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-700 hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-600 text-white text-sm font-bold transition-all shadow-md shadow-red-700/20"
          >
            Find Classes <MdArrowForward size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {favorites.map((fav) => {
              const cls = fav.classDetails;
              if (!cls) return null;
              
              return (
                <motion.div
                  key={fav._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-[#120010] border border-gray-100 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                    {cls.image ? (
                      <img src={cls.image} alt={cls.className} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MdFitnessCenter className="text-4xl text-gray-300 dark:text-gray-700" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={(e) => { e.preventDefault(); handleRemove(fav.classId); }}
                        disabled={removingId === fav.classId}
                        className="w-8 h-8 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur text-red-500 hover:text-red-700 dark:hover:text-red-400 flex items-center justify-center transition-colors shadow-sm"
                        title="Remove from favorites"
                      >
                        {removingId === fav.classId ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <MdDeleteOutline size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{cls.className || cls.name}</h3>
                      <span className="font-bold text-yellow-600 dark:text-[#D4AF37] whitespace-nowrap ml-2">${cls.price}</span>
                    </div>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 font-semibold">
                      {cls.category}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/[0.05]">
                      <Link
                        href={`/classes/${fav.classId}`}
                        className="flex items-center justify-center w-full py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors"
                      >
                        View Class
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
