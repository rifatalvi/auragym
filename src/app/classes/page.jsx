"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import CustomPagination from "@/componet/Sheard/CustomPagination";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ClassCard } from "../../componet/Sheard/ClassicCard";
import {
  Dumbbell,
  Heart,
  Flame,
  Sparkles,
  Activity,
  Search,
  SlidersHorizontal,
  X,

  Zap,
} from "lucide-react";


const categoryConfig = {
  Yoga:     { icon: Sparkles, color: "#f97316" },
  Cardio:   { icon: Heart,    color: "#ef4444" },
  Strength: { icon: Dumbbell, color: "#a855f7" },
  Pilates:  { icon: Activity, color: "#06b6d4" },
  Zumba:    { icon: Flame,    color: "#22c55e" },
};

const CATEGORIES = Object.keys(categoryConfig);
const LIMIT = 6;


const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#0e1117] border border-gray-200/80 dark:border-white/[0.06] animate-pulse">
    <div className="h-52 bg-gray-200 dark:bg-white/5" />
    <div className="p-5 space-y-3">
      <div className="flex gap-3">
        <div className="w-11 h-11 rounded-xl bg-gray-200 dark:bg-white/5" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 bg-gray-200 dark:bg-white/5 rounded-full w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-white/5 rounded-full w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-gray-200 dark:bg-white/5 rounded-full" />
      <div className="h-3 bg-gray-200 dark:bg-white/5 rounded-full w-5/6" />
      <div className="pt-2 flex justify-between items-center">
        <div className="h-4 bg-gray-200 dark:bg-white/5 rounded-full w-1/4" />
        <div className="h-8 bg-gray-200 dark:bg-white/5 rounded-lg w-1/3" />
      </div>
    </div>
  </div>
);


const ClassesPageInner = () => {
  const router        = useRouter();
  const pathname      = usePathname();
  const searchParams  = useSearchParams();

 
  const [searchInput, setSearchInput]       = useState(searchParams.get("search") || "");
  const [classes, setClasses]               = useState([]);
  const [totalPages, setTotalPages]         = useState(1);
  const [totalClasses, setTotalClasses]     = useState(0);
  const [loading, setLoading]               = useState(true);
  const debounceRef                         = useRef(null);

  // Derived values directly from URL (single source of truth)
  const urlSearch   = searchParams.get("search")   || "";
  const urlCategory = searchParams.get("category") || "";
  const urlPage     = parseInt(searchParams.get("page") || "1", 10);


  const pushURL = useCallback(
    ({ search, category, page }) => {
      const params = new URLSearchParams();
      if (search)   params.set("search",   search);
      if (category) params.set("category", category);
      if (page && page !== 1) params.set("page", String(page));

      const query = params.toString();
      router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
    },
    [router, pathname]
  );


  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushURL({ search: searchInput, category: urlCategory, page: 1 });
    }, 420);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);  // eslint-disable-line react-hooks/exhaustive-deps

  
  const handleCategoryClick = (cat) => {
    const next = urlCategory === cat ? "" : cat;
    pushURL({ search: urlSearch, category: next, page: 1 });
  };

  
  const handlePageChange = (p) => {
    pushURL({ search: urlSearch, category: urlCategory, page: p });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const clearAll = () => {
    setSearchInput("");
    router.push(pathname, { scroll: false });
  };

  const clearSearch = () => {
    setSearchInput("");
    pushURL({ search: "", category: urlCategory, page: 1 });
  };

  const clearCategory = () => {
    pushURL({ search: urlSearch, category: "", page: 1 });
  };

  
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: urlPage, limit: LIMIT });
        if (urlSearch)   params.set("search",   urlSearch);
        if (urlCategory) params.set("category", urlCategory);

        const res  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/classes?${params}`);
        const data = await res.json();

        if (res.ok) {
          setClasses(data.classes     || []);
          setTotalPages(data.totalPages   || 1);
          setTotalClasses(data.totalClasses || 0);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [urlSearch, urlCategory, urlPage]);

  // Keep input in sync when URL changes externally (browser back/forward)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchInput(urlSearch);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [urlSearch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#060b13] transition-colors duration-300">


      <section className="relative overflow-hidden bg-white dark:bg-[#060b13] pt-24 pb-20">

        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(249,115,22,0.12), transparent 70%)", filter: "blur(60px)" }}
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.55, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-24 right-0 w-[450px] h-[450px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(168,85,247,0.10), transparent 70%)", filter: "blur(60px)" }}
          />
          <div
            className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(249,115,22,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.8) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">

            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 dark:bg-orange-500/[0.08] border border-orange-500/20 mb-6"
            >
              <Zap size={14} className="text-orange-500" />
              <span className="text-xs font-bold tracking-widest uppercase text-orange-500">
                {totalClasses > 0 ? `${totalClasses} Classes Available` : "Elite Fitness Programs"}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-[0.9] mb-5"
            >
              Browse{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                Fitness
              </span>
              <br />
              Classes
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
            >
              Discover world-class workouts led by elite trainers. Search, filter, and
              book the perfect session for your fitness goals.
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative mt-10 max-w-xl mx-auto"
            >
              <div className="relative flex items-center">
                <Search
                  size={18}
                  className="absolute left-4 text-gray-400 dark:text-gray-500 pointer-events-none z-10"
                />
                <input
                  type="text"
                  id="class-search"
                  placeholder="Search by class nameâ€¦"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-11 pr-12 py-4 text-sm font-medium rounded-2xl bg-white dark:bg-[#0e1117] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/60 shadow-lg dark:shadow-black/30 transition-all duration-200"
                />
                {searchInput && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Live URL preview */}
              {(urlSearch || urlCategory) && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-[11px] text-gray-400 dark:text-gray-600 font-mono text-left px-1 truncate"
                >
                  — /classes
                  {urlSearch   && <span className="text-orange-500">?search=<span className="text-orange-400">{urlSearch}</span></span>}
                  {urlCategory && <span className="text-purple-500">{urlSearch ? "&" : "?"}category=<span className="text-purple-400">{urlCategory}</span></span>}
                  {urlPage > 1  && <span className="text-blue-400">page=<span className="text-blue-300">{urlPage}</span></span>}
                </motion.p>
              )}
            </motion.div>

            {/* â”€â”€ Category Pill Filters â”€â”€ */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-2.5 mt-6"
            >
              {/* All */}
              <button
                onClick={clearAll}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                  urlCategory === "" && !urlSearch
                    ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105"
                    : "bg-white dark:bg-[#0e1117] border-gray-200 dark:border-white/[0.07] text-gray-600 dark:text-gray-400 hover:border-orange-400 hover:text-orange-500"
                }`}
              >
                <SlidersHorizontal size={12} />
                All
              </button>

              {CATEGORIES.map((cat) => {
                const { icon: CatIcon, color } = categoryConfig[cat];
                const active = urlCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    style={active ? { background: color, borderColor: color, boxShadow: `0 8px 24px ${color}44` } : {}}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                      active
                        ? "text-white scale-105"
                        : "bg-white dark:bg-[#0e1117] border-gray-200 dark:border-white/[0.07] text-gray-600 dark:text-gray-400 hover:border-orange-400 hover:text-orange-500"
                    }`}
                  >
                    <CatIcon size={12} />
                    {cat}
                  </button>
                );
              })}
            </motion.div>

          </div>
        </div>
      </section>


      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Results meta row */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {loading ? (
              <span className="inline-block w-36 h-4 bg-gray-200 dark:bg-white/5 rounded-full animate-pulse" />
            ) : totalClasses === 0 ? (
              "No classes found"
            ) : (
              <>
                Showing{" "}
                <span className="font-bold text-gray-900 dark:text-white">
                  {(urlPage - 1) * LIMIT + 1}â€“{Math.min(urlPage * LIMIT, totalClasses)}
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-900 dark:text-white">{totalClasses}</span> classes
                {(urlSearch || urlCategory) && (
                  <span className="text-orange-500"> (filtered)</span>
                )}
              </>
            )}
          </p>

          {/* Active filter chips */}
          {(urlSearch || urlCategory) && !loading && (
            <div className="flex items-center gap-2 flex-wrap">
              {urlSearch && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-semibold text-orange-500">
                  <Search size={10} />
                 {urlSearch};
                  <button onClick={clearSearch} className="ml-0.5 hover:text-orange-700"><X size={10} /></button>
                </span>
              )}
              {urlCategory && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-500">
                  {urlCategory}
                  <button onClick={clearCategory} className="ml-0.5 hover:text-purple-700"><X size={10} /></button>
                </span>
              )}
              <button
                onClick={clearAll}
                className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors underline underline-offset-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* â”€â”€ Class Grid â”€â”€ */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {Array.from({ length: LIMIT }).map((_, i) => <SkeletonCard key={i} />)}
            </motion.div>
          ) : classes.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-28 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center mb-5">
                <Search size={32} className="text-orange-500/60" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No classes found</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs leading-relaxed">
                We could nt find any classes matching your criteria. Try different keywords or remove the active filters.
              </p>
              <button
                onClick={clearAll}
                className="mt-6 px-6 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition-colors"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`${urlPage}-${urlSearch}-${urlCategory}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {classes.map((cls, i) => (
                <motion.div
                  key={cls._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07, ease: "easeOut" }}
                >
                  <ClassCard
                    cls={cls}
                    icon={categoryConfig[cls.category]?.icon || Dumbbell}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* â”€â”€ Pagination â”€â”€ */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center mt-14">
            <CustomPagination 
              page={urlPage} 
              totalPages={totalPages} 
              totalItems={totalClasses} 
              itemsPerPage={LIMIT} 
              onChange={handlePageChange} 
            />
          </div>
        )}
      </section>
    </div>
  );
};

// Suspense wrapper â€” required by Next.js when using useSearchParams in a client component
export default function ClassesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-[#060b13] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ClassesPageInner />
    </Suspense>
  );
}
