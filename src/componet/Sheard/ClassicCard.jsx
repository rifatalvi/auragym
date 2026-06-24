'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, Users, Star, ArrowUpRight, Zap } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 70, damping: 14 },
  },
};

// Category colour palette
const categoryColors = {
  Yoga:     { from: '#f97316', to: '#ea580c', light: 'rgba(249,115,22,0.12)' },
  Cardio:   { from: '#ef4444', to: '#dc2626', light: 'rgba(239,68,68,0.12)'  },
  Strength: { from: '#a855f7', to: '#9333ea', light: 'rgba(168,85,247,0.12)' },
  Pilates:  { from: '#06b6d4', to: '#0891b2', light: 'rgba(6,182,212,0.12)'  },
  Zumba:    { from: '#22c55e', to: '#16a34a', light: 'rgba(34,197,94,0.12)'  },
};

export const ClassCard = ({ cls, icon: Icon }) => {
  const color = categoryColors[cls.category] || categoryColors.Cardio;
  const rating = cls.rating ?? (4.5 + Math.random() * 0.4).toFixed(1);

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative flex flex-col bg-white dark:bg-[#0e1117] border border-gray-200/80 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-orange-500/30 dark:hover:border-orange-500/20 transition-all duration-300"
    >
      {/* ── Image ── */}
      <div className="relative h-52 w-full overflow-hidden flex-shrink-0">
        <img
          src={
            cls.image ||
            `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800`
          }
          alt={cls.className || cls.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Category badge — top-left */}
        <span
          className="absolute top-3 left-3 text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full text-white backdrop-blur-sm"
          style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}
        >
          {cls.category}
        </span>

        {/* Price — top-right */}
        <span className="absolute top-3 right-3 text-sm font-black text-white bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
          ${cls.price}
        </span>

        {/* Bottom-left: duration & capacity */}
        <div className="absolute bottom-3 left-3 flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-white/90 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <Clock size={11} className="text-orange-400" />
            {cls.duration}m
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-white/90 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <Users size={11} className="text-orange-400" />
            {cls.bookingCount ?? cls.capacity ?? 0}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-5">

        {/* Icon + Title Row */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: color.light }}
          >
            <Icon size={20} style={{ color: color.from }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug group-hover:text-orange-500 transition-colors truncate">
              {cls.className || cls.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              by{' '}
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {cls.trainer}
              </span>
            </p>
          </div>
        </div>

        {/* Description */}
        {cls.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">
            {cls.description}
          </p>
        )}

        {/* ── Footer ── */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/[0.05] flex items-center justify-between gap-3">
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{rating}</span>
            <span className="text-[10px] text-gray-400">/ 5</span>
          </div>

          {/* Level badge */}
          {cls.level && (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              <Zap size={10} className="text-orange-400" />
              {cls.level}
            </span>
          )}

          {/* View Details button */}
          <Link href={`/classes/${cls._id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-extrabold uppercase tracking-wide text-white transition-all duration-300 shadow-md hover:shadow-orange-500/30"
              style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}
            >
              View Details <ArrowUpRight size={12} />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};