'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, Clock, Tag, ArrowRight } from 'lucide-react';
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
                className="group flex flex-col bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10" />
                  <img 
                    src={getImage(post.category)} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/30">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col flex-grow p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3">
                    {post.content}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                          {post.author.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[100px]">{post.author}</span>
                      </div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <Link href={`/forum/${post._id}`}>
                      <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-indigo-500 dark:text-indigo-400 font-semibold text-sm group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                        Read More
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
