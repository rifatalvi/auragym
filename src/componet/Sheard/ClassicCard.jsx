'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Heart, Clock, Zap, Flame, Activity, User, CalendarDays, ArrowUpRight } from 'lucide-react';
import { useSession } from '@/lib/auth-client';

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 70, damping: 14 },
  },
};

export const ClassCard = ({ cls }) => {
  const { data: session } = useSession();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session?.user) {
      alert("Please log in to save favorites.");
      return;
    }
    setIsFavorited(!isFavorited);
  };

  const coachName = cls.coach?.name || cls.trainer || 'Expert Coach';
  const durationNum = String(cls.duration).replace(/[^0-9]/g, '') || '60';

  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white dark:bg-[#0e0005] border border-gray-100 dark:border-red-950/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-red-950/20 transition-all duration-500"
    >
      {/* ── Image Section ── */}
      <div className="relative h-52 w-full overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-900">
        <img
          src={cls.image || `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800`}
          alt={cls.className || cls.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-100'}`}
        />

        {/* Dark gradient overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

        {/* Category pill – top left */}
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/70 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
          <span className="text-[10px] font-black tracking-widest uppercase text-gray-800 dark:text-white">
            {cls.category || 'Class'}
          </span>
        </div>

        {/* Price – top right */}
        <div className="absolute top-3 right-3 bg-red-700 text-white px-2.5 py-1 rounded-full shadow-sm">
          <span className="text-[11px] font-black">${cls.price || 0}</span>
        </div>

        {/* Favorite – bottom right, appears on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              onClick={handleFavoriteClick}
              className="absolute bottom-3 right-3 w-9 h-9 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            >
              <Heart size={15} className={`${isFavorited ? 'fill-rose-400 text-rose-400' : 'text-white'}`} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* "View Details" button – appears on hover, slides up from bottom */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute bottom-3 left-3"
            >
              <Link href={`/classes/${cls._id}`}>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-[11px] font-black uppercase tracking-widest rounded-full transition-colors shadow-lg">
                  View Details <ArrowUpRight size={12} />
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-5">

        {/* Title */}
        <h3 className="text-base font-black text-gray-900 dark:text-white leading-snug group-hover:text-red-700 dark:group-hover:text-rose-400 transition-colors line-clamp-1 mb-1">
          {cls.className || cls.name}
        </h3>

        {/* Coach row */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(coachName)}&background=8B0000&color=fff&size=48`}
              alt={coachName}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">
            <span className="text-gray-400 mr-1">by</span>{coachName}
          </span>
          <span className="ml-auto text-[10px] font-bold text-gray-400 flex items-center gap-1">
            <User size={10} /> {cls.bookingCount || 0}
          </span>
        </div>

        {/* 4-item stats grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { icon: Clock, label: 'Duration', value: `${durationNum} min` },
            { icon: Flame, label: 'Burn', value: cls.caloriesBurn || '500 cal' },
            { icon: Zap, label: 'Level', value: cls.intensity || cls.level || 'All Levels' },
            { icon: Activity, label: 'Focus', value: cls.focus || 'Full Body' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-red-950/10 rounded-xl border border-gray-100 dark:border-red-900/15">
              <Icon size={12} className="text-red-700 dark:text-rose-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-0.5">{label}</p>
                <p className="text-[11px] font-bold text-gray-900 dark:text-white truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Schedule row */}
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100 dark:border-red-900/15">
          <CalendarDays size={13} className="text-gray-400 flex-shrink-0" />
          <span className="text-sm font-black text-gray-900 dark:text-white">
            {cls.schedule?.time || '06:00 PM'}
          </span>
          <div className="flex gap-1 ml-auto">
            {(cls.schedule?.days || ['Mon', 'Wed']).map(day => (
              <span key={day} className="text-[9px] font-bold bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-rose-400 border border-red-100 dark:border-red-900/20 px-1.5 py-0.5 rounded-md uppercase">
                {day.slice(0, 3)}
              </span>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
};