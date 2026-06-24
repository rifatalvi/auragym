'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Lost 18kg in 4 months',
    avatar: 'PS',
    avatarGradient: 'from-pink-500 to-rose-600',
    rating: 5,
    text: "AuraGym transformed not just my body but my entire mindset. The HIIT Inferno class with Marcus is absolutely insane — I have never sweated this much in my life and I love every second of it.",
  },
  {
    name: 'Khalid Al-Rashid',
    role: 'Marathon Runner & Member',
    avatar: 'KA',
    avatarGradient: 'from-blue-500 to-violet-600',
    rating: 5,
    text: "The community here is everything. When I hit a plateau, the forum advice from fellow members and the trainers helped me push through. Signed up for 3 months, now I'm on my second year!",
  },
  {
    name: 'Lena Fischer',
    role: 'Yoga Enthusiast',
    avatar: 'LF',
    avatarGradient: 'from-emerald-500 to-teal-600',
    rating: 5,
    text: "Sophia's Power Yoga Flow is a spiritual experience. I came for the flexibility and left with a completely renewed sense of self. The booking system is super smooth and the classes are always on time.",
  },
  {
    name: 'Tomás Rivera',
    role: 'Gained 8kg Muscle',
    avatar: 'TR',
    avatarGradient: 'from-orange-500 to-yellow-500',
    rating: 5,
    text: "Strength & Sculpt with Elena is the real deal. Progressive overload, perfect form coaching, and a killer playlist. My bench press went from 60kg to 100kg in six months. Worth every penny.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Testimonials() {
  return (
    <section className="bg-gray-50 dark:bg-[#060b13] py-24 px-6 relative overflow-hidden transition-colors duration-300">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 mb-4 rounded-full text-xs font-bold tracking-widest uppercase text-yellow-400 bg-yellow-500/10 border border-yellow-500/20">
            ⭐ Member Stories
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Real Results,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Real People
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-base">
            Thousands of members have already transformed their lives. Here's what they have to say
            about their AuraGym journey.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -6, borderColor: 'rgba(234,179,8,0.3)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative p-7 rounded-3xl bg-white/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 backdrop-blur-sm group overflow-hidden"
            >
              {/* Quote Icon */}
              <div className="absolute top-5 right-6 text-gray-200 dark:text-gray-800 group-hover:text-yellow-500/20 dark:group-hover:text-yellow-900/30 transition-colors">
                <Quote size={48} fill="currentColor" />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Quote Text */}
              <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6 relative z-10">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${t.avatarGradient} flex items-center justify-center font-black text-white text-sm shadow-lg`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t.role}</p>
                </div>
              </div>

              {/* Bottom gradient line */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-500/50 to-orange-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Overall Rating Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left"
        >
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={24} className="text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <div>
            <span className="text-4xl font-black text-gray-900 dark:text-white">4.9</span>
            <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">/ 5.0 average rating</span>
          </div>
          <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Based on <span className="text-yellow-500 dark:text-yellow-400 font-bold">3,200+</span> verified reviews
          </p>
        </motion.div>
      </div>
    </section>
  );
}
