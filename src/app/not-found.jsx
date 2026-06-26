"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#060b13] flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div
          className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full opacity-[0.07] dark:opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #e11d48, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.06] dark:opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #f97316, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(225,29,72,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(225,29,72,0.8) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">

        {/* SVG Illustration */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-8 w-full max-w-xs"
        >
          <svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            {/* Floor shadow */}
            <ellipse cx="200" cy="255" rx="120" ry="12" className="fill-gray-200 dark:fill-white/5" />

            {/* Barbell bar */}
            <rect x="60" y="130" width="280" height="12" rx="6" className="fill-gray-300 dark:fill-white/20" />

            {/* Left weight plate */}
            <rect x="60" y="105" width="28" height="62" rx="8" className="fill-gray-800 dark:fill-white/30" />
            <rect x="68" y="110" width="12" height="52" rx="5" className="fill-gray-600 dark:fill-white/20" />

            {/* Right weight plate */}
            <rect x="312" y="105" width="28" height="62" rx="8" className="fill-gray-800 dark:fill-white/30" />
            <rect x="320" y="110" width="12" height="52" rx="5" className="fill-gray-600 dark:fill-white/20" />

            {/* 404 text on barbell */}
            <text
              x="200"
              y="142"
              textAnchor="middle"
              fontSize="36"
              fontWeight="900"
              fontFamily="system-ui, sans-serif"
              letterSpacing="-1"
              className="fill-gray-900 dark:fill-white"
            >
              404
            </text>

            {/* Stick figure - body */}
            <circle cx="200" cy="62" r="18" className="fill-none stroke-red-500" strokeWidth="4" />
            <line x1="200" y1="80" x2="200" y2="115" className="stroke-gray-700 dark:stroke-white/60" strokeWidth="4" strokeLinecap="round" />

            {/* Arms - lifting barbell */}
            <line x1="200" y1="90" x2="150" y2="115" className="stroke-gray-700 dark:stroke-white/60" strokeWidth="4" strokeLinecap="round" />
            <line x1="200" y1="90" x2="250" y2="115" className="stroke-gray-700 dark:stroke-white/60" strokeWidth="4" strokeLinecap="round" />

            {/* Legs */}
            <line x1="200" y1="115" x2="180" y2="155" className="stroke-gray-700 dark:stroke-white/60" strokeWidth="4" strokeLinecap="round" />
            <line x1="200" y1="115" x2="220" y2="155" className="stroke-gray-700 dark:stroke-white/60" strokeWidth="4" strokeLinecap="round" />
            <line x1="180" y1="155" x2="170" y2="175" className="stroke-gray-700 dark:stroke-white/60" strokeWidth="4" strokeLinecap="round" />
            <line x1="220" y1="155" x2="230" y2="175" className="stroke-gray-700 dark:stroke-white/60" strokeWidth="4" strokeLinecap="round" />

            {/* Sweat drop */}
            <ellipse cx="232" cy="52" rx="5" ry="7" className="fill-blue-400 dark:fill-blue-500" opacity="0.8" />

            {/* Question marks floating */}
            <text x="60" y="80" fontSize="24" fontFamily="system-ui" className="fill-gray-300 dark:fill-white/15">?</text>
            <text x="320" y="70" fontSize="20" fontFamily="system-ui" className="fill-gray-300 dark:fill-white/15">?</text>
            <text x="280" y="50" fontSize="16" fontFamily="system-ui" className="fill-gray-300 dark:fill-white/15">?</text>
          </svg>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
            Page Not{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              Found
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg leading-relaxed max-w-sm mx-auto mb-8">
            Looks like this page skipped leg day — it doesn&apos;t exist. Let&apos;s get you back on track.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-200 hover:scale-[1.03]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back to Home
          </Link>

          <Link
            href="/classes"
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-200 hover:scale-[1.03]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            Browse Classes
          </Link>
        </motion.div>

        {/* Error code badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-semibold text-red-600 dark:text-red-400 tracking-wider uppercase">
            Error 404 — AuraGym
          </span>
        </motion.div>

      </div>
    </div>
  );
}
