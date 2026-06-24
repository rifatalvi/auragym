'use client';

import { motion } from 'framer-motion';
import { UserPlus, Search, CalendarCheck, Rocket } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Create Your Account',
    description:
      'Sign up in seconds — no credit card required. Choose your fitness goals and we will tailor the experience just for you.',
    gradient: 'from-cyan-500 to-blue-600',
    glow: 'rgba(34,211,238,0.3)',
  },
  {
    step: '02',
    icon: Search,
    title: 'Explore Classes',
    description:
      'Browse 80+ classes across yoga, HIIT, strength, pilates, martial arts and more. Filter by trainer, duration, or intensity.',
    gradient: 'from-violet-500 to-indigo-600',
    glow: 'rgba(139,92,246,0.3)',
  },
  {
    step: '03',
    icon: CalendarCheck,
    title: 'Book Instantly',
    description:
      'Reserve your spot with one click. Get automated reminders so you never miss a session. Cancel up to 4 hours before.',
    gradient: 'from-pink-500 to-rose-600',
    glow: 'rgba(236,72,153,0.3)',
  },
  {
    step: '04',
    icon: Rocket,
    title: 'Transform & Thrive',
    description:
      'Track your progress, earn badges, and share your wins with the community. Your best self is just getting started.',
    gradient: 'from-orange-500 to-yellow-500',
    glow: 'rgba(249,115,22,0.3)',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 dark:bg-[#070c15] py-24 px-6 relative overflow-hidden transition-colors duration-300">
      {/* Subtle background line */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%)',
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
          <span className="inline-block px-4 py-1.5 mb-4 rounded-full text-xs font-bold tracking-widest uppercase text-violet-400 bg-violet-500/10 border border-violet-500/20">
            ✨ Simple Process
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4">
            How It{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500">
              Works
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-base">
            Getting started is effortless. Four simple steps stand between you and your dream physique.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                variants={cardVariants}
                whileHover={{ y: -10, boxShadow: `0 20px 50px ${s.glow}` }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative flex flex-col p-7 rounded-3xl bg-white/60 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 backdrop-blur-sm group"
              >
                {/* Step number watermark */}
                <span
                  className="absolute top-4 right-5 text-7xl font-black leading-none select-none pointer-events-none text-black/5 dark:text-white/5"
                >
                  {s.step}
                </span>

                {/* Icon */}
                <div
                  className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${s.gradient} mb-5 shadow-xl`}
                >
                  <Icon size={26} className="text-white" strokeWidth={2} />
                </div>

                {/* Step Label */}
                <span className={`text-xs font-bold tracking-widest uppercase mb-2 bg-gradient-to-r ${s.gradient} text-transparent bg-clip-text`}>
                  Step {s.step}
                </span>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-200 transition-colors">
                  {s.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{s.description}</p>

                {/* Bottom accent line */}
                <div
                  className={`absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r ${s.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
