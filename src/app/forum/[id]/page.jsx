'use client';

import { useEffect, useState, use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, ThumbsUp, Clock, User, Tag } from 'lucide-react';
import Link from 'next/link';

export default function PostDetailsPage({ params }) {
  const unwrappedParams = use(params);
  const postId = unwrappedParams.id;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/forum/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [postId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-[#060b13] pt-24 pb-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mt-20"></div>
      </main>
    );
  }

  if (!post || post.error) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-[#060b13] pt-24 pb-12 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Post not found</h2>
        <Link href="/forum">
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors">
            <ArrowLeft size={20} />
            Back to Forum
          </button>
        </Link>
      </main>
    );
  }

  const getImage = (category) => {
    const images = {
      Nutrition: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
      'Training Tips': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
      Recovery: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
      Motivation: 'https://images.unsplash.com/photo-1526506114642-5445539d8bc3?auto=format&fit=crop&w=1200&q=80',
    };
    return images[category] || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80';
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#060b13] pt-24 pb-20 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/forum">
          <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors mb-8 font-semibold">
            <ArrowLeft size={20} />
            Back to Discussions
          </button>
        </Link>

        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-none"
        >
          <div className="relative h-64 md:h-96 w-full">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent z-10" />
            <img 
              src={getImage(post.category)} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-8 left-8 right-8 z-20">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full text-xs font-bold bg-indigo-500/20 backdrop-blur-md text-indigo-200 border border-indigo-500/30">
                <Tag size={12} />
                {post.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-300 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                    {post.author.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white">{post.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-indigo-400" />
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {post.content.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">{paragraph}</p>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold hover:bg-pink-50 dark:hover:bg-pink-500/10 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                  <ThumbsUp size={20} />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                  <MessageSquare size={20} />
                  <span>{post.replies} Replies</span>
                </button>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </main>
  );
}
