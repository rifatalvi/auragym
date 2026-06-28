'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, Calendar, Heart } from 'lucide-react';
import Link from 'next/link';

export default function CommunityForumPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getImage = (category) => {
    const images = {
      Nutrition: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
      'Training Tips': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
      Recovery: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
      Motivation: 'https://images.unsplash.com/photo-1526506114642-5445539d8bc3?auto=format&fit=crop&w=800&q=80',
    };
    return images[category] || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80';
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#060b13] pt-24 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 mb-4 rounded-full text-sm font-bold tracking-widest uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">
            AuraGym Community
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Forum <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">Discussions</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Connect with trainers, admins, and fellow fitness enthusiasts. Share your journey, ask questions, and get inspired.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[450px] rounded-3xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col bg-white dark:bg-[#16161a] rounded-2xl overflow-hidden border border-gray-100 dark:border-white/[0.05] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={post.image || getImage(post.category)} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                  {/* Category Badge over image */}
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-white text-gray-900 shadow-md lowercase tracking-wide">
                      {post.category || 'motivation'}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-grow p-6">
                  {/* Meta (Read time & Date) */}
                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1.5 text-emerald-500">
                      <Clock size={14} /> 15 read
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3 line-clamp-2 leading-tight">
                    {post.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-5 line-clamp-2 leading-relaxed">
                    {post.content || post.description || "No description provided."}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                     <span className="px-4 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-semibold text-slate-600 dark:text-slate-300">gym</span>
                     <span className="px-4 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-semibold text-slate-600 dark:text-slate-300">fitness</span>
                  </div>

                  <div className="border-t border-gray-100 dark:border-white/5 my-4" />

                  {/* Footer / Author Row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                        {(post.author || post.authorName || 'A').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[15px] font-bold text-slate-900 dark:text-slate-100">{post.author || post.authorName || 'Anonymous'}</span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 w-fit mt-0.5 lowercase tracking-wider">
                          {post.role?.toLowerCase() === 'admin' ? 'admin' : (post.role?.toLowerCase() === 'trainer' ? 'trainer' : 'member')}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-sm font-semibold text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Heart size={15} className="text-emerald-500 fill-emerald-500" />
                        <span>{post.upvotes || 0}</span>
                      </div>
                      <div className="w-px h-3 bg-gray-300 dark:bg-gray-600" />
                      <div className="flex items-center gap-1.5">
                        <MessageSquare size={15} className="text-slate-400 fill-slate-400" />
                        <span>{post.commentCount || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Read More Button */}
                  <Link href={`/forum/${post._id}`} className="mt-auto block">
                    <button className="w-full flex items-center justify-center py-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors duration-300">
                      Read More
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
