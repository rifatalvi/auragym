'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Flame, Dumbbell, Shield, Zap, Droplets } from 'lucide-react';
import { ClassCard } from '../Sheard/ClassicCard';
import { CardSkeleton } from '../Sheard/Skeleton';


const categoryConfig = {
  Yoga: { icon: Heart },
  Cardio: { icon: Flame },
  Strength: { icon: Dumbbell },
  Pilates: { icon: Shield },
  'Martial Arts': { icon: Zap },
  Aqua: { icon: Droplets },
};

export default function FeaturedClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/featured-classes`)
      .then((r) => r.json())
      .then((data) => { setClasses(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white dark:bg-[#060b13] py-24 px-6 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col mb-16">
          <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-4">Featured Classes</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg">Elite programs designed to push your limits. Choose your path and start your transformation today.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {classes.map((cls) => (
              <ClassCard 
                key={cls._id} 
                cls={cls} 
                icon={categoryConfig[cls.category]?.icon || Dumbbell} 
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}