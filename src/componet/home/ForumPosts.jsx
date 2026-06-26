'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, Clock, Tag, ArrowUpRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { ForumPostSkeleton } from '../Sheard/Skeleton';

const categoryColors = {
  Nutrition: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'Training Tips': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Recovery: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  Motivation: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
};
const defaultCategoryColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function ForumPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/forum/latest')
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white dark:bg-[#060b13] py-24 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-4 rounded-full text-xs font-bold tracking-widest uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">
              💬 Community
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Latest{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
                Forum Posts
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg text-base">
              Join the conversation. Share your journey, get tips, and support fellow gym-goers.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/forum">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/10 transition-colors whitespace-nowrap"
              >
                View All Posts
                <ArrowUpRight size={16} />
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <ForumPostSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {posts.map((post, i) => {
              const catColor = categoryColors[post.category] || defaultCategoryColor;
              return (
                <motion.div
                  key={post._id || i}
                  variants={itemVariants}
                  whileHover={{ x: 6, borderColor: 'rgba(99,102,241,0.4)' }}
                  className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 backdrop-blur-sm cursor-pointer transition-colors"
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-pink-500/20 border border-indigo-500/20 flex items-center justify-center font-black text-indigo-400 text-sm">
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${catColor}`}>
                        <Tag size={10} className="inline mr-1" />
                        {post.category}
                      </span>
                      {i === 0 && (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center gap-1">
                          <TrendingUp size={10} />
                          Trending
                        </span>
                      )}
                    </div>
                    <h3 className="text-gray-900 dark:text-white font-bold text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors truncate">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                      by{' '}
                      <span className="text-gray-700 dark:text-gray-300 font-semibold">{post.author}</span>
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 flex-shrink-0">
                    <span className="flex items-center gap-1.5">
                      <ThumbsUp size={14} className="text-pink-400" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageSquare size={14} className="text-indigo-400" />
                      {post.replies}
                    </span>
                    <span className="flex items-center gap-1.5 hidden sm:flex">
                      <Clock size={13} />
                      {timeAgo(post.createdAt)}
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="text-gray-600 group-hover:text-indigo-400 transition-colors ml-2"
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Join Discussion CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 p-8 rounded-3xl bg-gradient-to-r from-indigo-500/10 to-pink-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Have something to share?</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Join thousands of fitness enthusiasts in our vibrant community forum.
            </p>
          </div>
          <Link href="/forum">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}
              whileTap={{ scale: 0.97 }}
              className="flex-shrink-0 px-8 py-3.5 rounded-2xl font-bold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}
            >
              Start a Discussion
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
