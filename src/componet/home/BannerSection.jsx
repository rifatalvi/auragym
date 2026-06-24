'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Users, Zap, Trophy } from 'lucide-react';

const bgImages = [
  '/gym-banner-model.png',
  '/gym-banner-slide2.png',
  '/gym-banner-slide3.png',
];

const floatingOrbs = [
  { width: 450, height: 450, top: '-5%', left: '-5%', color: 'rgba(249,115,22,0.08)', duration: 8 },
  { width: 350, height: 350, top: '40%', right: '-5%', color: 'rgba(217,119,6,0.06)', duration: 10 },
  { width: 300, height: 300, bottom: '-5%', left: '25%', color: 'rgba(239,68,68,0.04)', duration: 12 },
];

const stats = [
  { icon: Users, value: '12K+', label: 'Active Athletes' },
  { icon: Zap, value: '80+', label: 'Weekly Classes' },
  { icon: Trophy, value: '95%', label: 'Transformation Rate' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 60, damping: 14 },
  },
};

export default function BannerSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % bgImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + bgImages.length) % bgImages.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % bgImages.length);
  };

  return (
    <section className="relative min-h-screen pt-24 pb-12 flex flex-col justify-between overflow-hidden bg-gray-50 dark:bg-[#060b13] select-none">
      
      {/* 1. Background Gym Images (Stacked for smooth cross-fade, no AnimatePresence bugs) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-gray-50 dark:bg-[#060b13]">
        {bgImages.map((src, i) => (
          <motion.img
            key={src}
            src={src}
            alt={`Gym Slide ${i + 1}`}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ 
              opacity: index === i ? 1 : 0,
              scale: index === i ? 1 : 1.08
            }}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0 w-full h-full object-cover object-left md:object-[25%_center] filter brightness-[0.5] contrast-[1.15]"
          />
        ))}

        {/* Dark overlay gradients to blend it perfectly */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/80 to-gray-50 dark:from-black/40 dark:via-black/60 dark:to-[#060b13] md:block hidden z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 via-transparent to-gray-50 dark:from-[#060b13]/80 dark:via-transparent dark:to-[#060b13] z-10" />
        <div className="absolute inset-0 bg-white/80 dark:bg-black/60 md:hidden block z-10" />
      </div>

      {/* 2. Decorative Diagonal Panels in the background (Right side, behind text) */}
      <div className="absolute right-0 top-0 h-full w-[55%] pointer-events-none hidden md:block overflow-hidden z-10">
        <div className="absolute inset-0 bg-gray-50/55 dark:bg-[#060b13]/55 backdrop-blur-[1px]" />
        <div className="absolute -right-1/4 top-0 h-full w-[80%] bg-gradient-to-r from-transparent via-orange-950/10 to-orange-950/20 transform -skew-x-12 border-l border-orange-500/10" />
        <div className="absolute -right-10 top-0 h-full w-40 bg-orange-500/5 transform -skew-x-12 border-l border-r border-orange-500/15" />
      </div>

      {/* 3. Floating Neon Orbs */}
      {floatingOrbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none z-10"
          style={{
            width: orb.width,
            height: orb.height,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            filter: 'blur(60px)',
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: orb.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* 4. Left & Right Slider Arrows */}
      <button 
        onClick={handlePrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3.5 rounded-none bg-white/40 dark:bg-black/40 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-orange-600 dark:hover:bg-orange-600 hover:border-orange-600 transition-all duration-300 hidden md:block active:scale-95 cursor-pointer"
      >
        <ChevronLeft size={20} />
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3.5 rounded-none bg-white/40 dark:bg-black/40 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-orange-600 dark:hover:bg-orange-600 hover:border-orange-600 transition-all duration-300 hidden md:block active:scale-95 cursor-pointer"
      >
        <ChevronRight size={20} />
      </button>

      {/* 5. Main Content Layout with Staggered Entrance Animations */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 w-full my-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Empty left side on desktop to show the muscular athlete */}
          <div className="hidden md:block md:col-span-5 lg:col-span-6" />

          {/* Text Content on the Right */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="col-span-1 md:col-span-7 lg:col-span-6 text-left md:pl-8"
          >
            
            {/* Shape Your Body Subtitle */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-10 h-[2px] bg-orange-600" />
              <span className="text-orange-500 font-extrabold tracking-[0.25em] text-xs sm:text-sm uppercase">
                Shape Your Body
              </span>
            </motion.div>

            {/* Main Title: BE STRONG TRAINING HARD */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl md:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-[0.95] mb-6 font-sans"
            >
              Be <span className="text-orange-500 font-black">Strong</span> <br />
              Training Hard
            </motion.h1>

            {/* Brief Description */}
            <motion.p
              variants={itemVariants}
              className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-lg mb-8 leading-relaxed font-normal"
            >
              Stop exercising. Start transforming. Master your physical aura alongside world-class elite trainers. Elevate your limits with custom workout programs.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <Link href="/classes">
                <button className="px-8 py-4 bg-orange-600 hover:bg-orange-500 font-extrabold text-sm sm:text-base text-white uppercase tracking-widest transition-all duration-300 active:scale-95 shadow-[0_4px_25px_rgba(234,88,12,0.35)] rounded-none cursor-pointer">
                  Get Info
                </button>
              </Link>
              <Link href="/auth/signup">
                <button className="px-8 py-4 border border-gray-300 dark:border-gray-700 hover:border-orange-500/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md font-extrabold text-sm sm:text-base text-gray-900 dark:text-white uppercase tracking-widest transition-all duration-300 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 active:scale-95 rounded-none cursor-pointer">
                  Join Forum
                </button>
              </Link>
            </motion.div>

          </motion.div>

        </div>
      </div>

      {/* 6. Stats Row at the bottom */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="relative z-20 border-t border-gray-200/60 dark:border-gray-800/60 bg-white/90 dark:bg-[#060b13]/90 backdrop-blur-lg py-6 px-4 w-full mt-auto"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200/80 dark:divide-gray-800/80">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div key={i} className="flex flex-col items-center justify-center pt-4 sm:pt-0 group">
              <div className="flex items-center gap-2.5 mb-1">
                <Icon size={18} className="text-orange-500 group-hover:scale-110 transition-transform" />
                <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{value}</span>
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

    </section>
  );
}