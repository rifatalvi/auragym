'use client';

import { useEffect, useState, use, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MessageSquare, Clock, Tag, Heart,
  MoreVertical, Reply, Pencil, Trash2, X, Send,
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { fetchSecure } from '@/lib/fetchSecure';

// ── Role Badge ───────────────────────────────────────────────────────────────
const ROLE_CFG = {
  Author:  { bg: 'bg-amber-100  dark:bg-amber-500/20',  text: 'text-amber-700  dark:text-amber-400',  label: 'Author'  },
  admin:   { bg: 'bg-red-100    dark:bg-red-500/20',    text: 'text-red-700    dark:text-red-400',    label: 'Admin'   },
  trainer: { bg: 'bg-purple-100 dark:bg-purple-500/20', text: 'text-purple-700 dark:text-purple-400', label: 'Trainer' },
  member:  { bg: 'bg-green-100  dark:bg-green-500/20',  text: 'text-green-700  dark:text-green-400',  label: 'Member'  },
  user:    { bg: 'bg-gray-100   dark:bg-gray-700',      text: 'text-gray-600   dark:text-gray-400',   label: 'User'    },
};
function RoleBadge({ role }) {
  const c = ROLE_CFG[role] || ROLE_CFG.user;
  return (
    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

// ── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, size = 'md' }) {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11 text-base' };
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {name?.charAt(0)?.toUpperCase() ?? '?'}
    </div>
  );
}

// ── Comment Card ─────────────────────────────────────────────────────────────
function CommentCard({
  comment, isReply = false,
  postAuthorEmail, currentUserEmail, currentUserName,
  replies,
  // reply
  replyingTo, setReplyingTo, replyText, setReplyText, replySubmitting, onReplySubmit,
  // edit
  editingId, setEditingId, editText, setEditText, editSubmitting, onEditSubmit,
  // delete
  setDeleteTarget,
  // menu
  openMenu, setOpenMenu,
}) {
  const id = comment._id?.toString();
  const isOwn = comment.authorEmail === currentUserEmail;
  const isAuthor = comment.authorEmail === postAuthorEmail;
  const displayRole = isAuthor ? 'Author' : (comment.authorRole || 'user');
  const isMenuOpen = openMenu === id;
  const isEditing = editingId === id;

  return (
    <div className="group relative">
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar name={comment.authorName} size={isReply ? 'sm' : 'md'} />

        {/* Main body */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="font-semibold text-sm text-gray-900 dark:text-white">
              {comment.authorName || 'Anonymous'}
            </span>
            <RoleBadge role={displayRole} />
            {comment.isEdited && (
              <span className="text-[10px] text-gray-400 dark:text-gray-500 italic">Edited</span>
            )}
            <span className="ml-auto text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
              {new Date(comment.createdAt).toLocaleString(undefined, {
                dateStyle: 'medium', timeStyle: 'short',
              })}
            </span>
          </div>

          {/* Content / Edit input */}
          {isEditing ? (
            <div>
              <textarea
                autoFocus
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 border border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => onEditSubmit(id)}
                  disabled={editSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-indigo-500 text-white text-xs font-semibold hover:bg-indigo-600 disabled:opacity-60 transition"
                >
                  {editSubmitting ? 'Saving…' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditingId(null); setEditText(''); }}
                  className="px-4 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words whitespace-pre-wrap">
              {comment.content}
            </p>
          )}

          {/* Reply button (top-level only) */}
          {!isEditing && !isReply && currentUserEmail && (
            <button
              onClick={() => {
                setReplyingTo(replyingTo === id ? null : id);
                setReplyText('');
              }}
              className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 font-medium transition"
            >
              <Reply size={13} />
              Reply
              {replies?.length > 0 && (
                <span className="text-gray-400">· {replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span>
              )}
            </button>
          )}
        </div>

        {/* 3-dot menu (own comment only) */}
        {isOwn && !isEditing && (
          <div className="relative flex-shrink-0">
            <button
              id={`menu-btn-${id}`}
              onClick={(e) => { e.stopPropagation(); setOpenMenu(isMenuOpen ? null : id); }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <MoreVertical size={15} />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.88, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.88, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-8 z-50 w-36 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      setEditingId(id);
                      setEditText(comment.content);
                      setOpenMenu(null);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <div className="border-t border-gray-100 dark:border-gray-700" />
                  <button
                    onClick={() => { setDeleteTarget({ id }); setOpenMenu(null); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Reply textarea */}
      {!isReply && replyingTo === id && (
        <div className="ml-12 mt-3 flex gap-2">
          <Avatar name={currentUserName} size="sm" />
          <div className="flex-1">
            <textarea
              autoFocus
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${comment.authorName}…`}
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none transition"
            />
            <div className="flex gap-2 mt-1.5">
              <button
                onClick={() => onReplySubmit(id)}
                disabled={replySubmitting || !replyText.trim()}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-500 text-white text-xs font-semibold hover:bg-indigo-600 disabled:opacity-50 transition"
              >
                <Send size={12} />
                {replySubmitting ? 'Posting…' : 'Post Reply'}
              </button>
              <button
                onClick={() => { setReplyingTo(null); setReplyText(''); }}
                className="px-4 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nested replies */}
      {!isReply && replies?.length > 0 && (
        <div className="ml-12 mt-3 border-l-2 border-gray-100 dark:border-gray-800 pl-4 space-y-4">
          {replies.map((reply) => (
            <CommentCard
              key={reply._id?.toString()}
              comment={reply}
              isReply
              postAuthorEmail={postAuthorEmail}
              currentUserEmail={currentUserEmail}
              currentUserName={currentUserName}
              replies={[]}
              replyingTo={null} setReplyingTo={() => {}}
              replyText="" setReplyText={() => {}}
              replySubmitting={false} onReplySubmit={() => {}}
              editingId={editingId} setEditingId={setEditingId}
              editText={editText} setEditText={setEditText}
              editSubmitting={editSubmitting} onEditSubmit={onEditSubmit}
              setDeleteTarget={setDeleteTarget}
              openMenu={openMenu} setOpenMenu={setOpenMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function PostDetailsPage({ params }) {
  const unwrappedParams = use(params);
  const postId = unwrappedParams.id;

  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const userName  = session?.user?.name;

  // Post
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Like
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showLoginHint, setShowLoginHint] = useState(false);

  // Comments
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Reply
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);

  // Edit
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // 3-dot menu
  const [openMenu, setOpenMenu] = useState(null);

  // Close menu on outside click
  useEffect(() => {
    if (!openMenu) return;
    const handler = () => setOpenMenu(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [openMenu]);

  // Fetch post
  useEffect(() => {
    fetch(`/api/forum/${postId}`)
      .then((r) => r.json())
      .then((data) => {
        setPost(data);
        setLikeCount(data.upvotes ?? 0);
        if (userEmail && Array.isArray(data.likedBy)) {
          setLiked(data.likedBy.includes(userEmail));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [postId, userEmail]);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    try {
      const r = await fetch(`/api/forum/${postId}/comments`);
      const data = await r.json();
      setComments(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
    finally { setCommentsLoading(false); }
  }, [postId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  // Like toggle
  const handleLike = async () => {
    if (!session?.user) {
      setShowLoginHint(true);
      setTimeout(() => setShowLoginHint(false), 2500);
      return;
    }
    if (likeLoading) return;
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((p) => wasLiked ? p - 1 : p + 1);
    setLikeLoading(true);
    try {
      const r = await fetchSecure(`/api/forum/${postId}/like`, { method: 'PATCH' });
      if (r.ok) { const d = await r.json(); setLiked(d.liked); setLikeCount(d.upvotes); }
      else { setLiked(wasLiked); setLikeCount((p) => wasLiked ? p + 1 : p - 1); }
    } catch { setLiked(wasLiked); setLikeCount((p) => wasLiked ? p + 1 : p - 1); }
    finally { setLikeLoading(false); }
  };

  // Post comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || commentSubmitting) return;
    setCommentSubmitting(true);
    try {
      const r = await fetchSecure(`/api/forum/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment.trim(), parentId: null, authorName: userName }),
      });
      if (r.ok) { setNewComment(''); await fetchComments(); }
    } catch { /* ignore */ }
    finally { setCommentSubmitting(false); }
  };

  // Post reply
  const handleReplySubmit = async (parentId) => {
    if (!replyText.trim() || replySubmitting) return;
    setReplySubmitting(true);
    try {
      const r = await fetchSecure(`/api/forum/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyText.trim(), parentId, authorName: userName }),
      });
      if (r.ok) { setReplyText(''); setReplyingTo(null); await fetchComments(); }
    } catch { /* ignore */ }
    finally { setReplySubmitting(false); }
  };

  // Edit comment
  const handleEditSubmit = async (commentId) => {
    if (!editText.trim() || editSubmitting) return;
    setEditSubmitting(true);
    try {
      const r = await fetchSecure(
        `/api/forum/${postId}/comments/${commentId}`,
        { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: editText.trim() }) }
      );
      if (r.ok) { setEditingId(null); setEditText(''); await fetchComments(); }
    } catch { /* ignore */ }
    finally { setEditSubmitting(false); }
  };

  // Delete comment
  const handleDelete = async () => {
    if (!deleteTarget || deleteSubmitting) return;
    setDeleteSubmitting(true);
    try {
      const r = await fetchSecure(
        `/api/forum/${postId}/comments/${deleteTarget.id}`,
        { method: 'DELETE' }
      );
      if (r.ok) { setDeleteTarget(null); await fetchComments(); }
    } catch { /* ignore */ }
    finally { setDeleteSubmitting(false); }
  };

  const getImage = (category) => {
    const images = {
      Nutrition: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
      'Training Tips': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
      Recovery: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
      Motivation: 'https://images.unsplash.com/photo-1526506114642-5445539d8bc3?auto=format&fit=crop&w=1200&q=80',
    };
    return images[category] || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80';
  };

  const topComments = comments.filter((c) => !c.parentId);
  const getReplies = (cid) => comments.filter((c) => c.parentId === cid.toString());
  const totalCount = comments.length;

  // ── Loading ──
  if (loading) return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#060b13] pt-24 pb-12 flex justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mt-20" />
    </main>
  );

  if (!post || post.error) return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#060b13] pt-24 pb-12 flex flex-col items-center justify-center text-center px-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Post not found</h2>
      <Link href="/forum">
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors">
          <ArrowLeft size={20} /> Back to Forum
        </button>
      </Link>
    </main>
  );

  const postAuthorEmail = post.authorEmail;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#060b13] pt-24 pb-20 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6">

        {/* Back */}
        <Link href="/forum">
          <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors mb-8 font-semibold">
            <ArrowLeft size={20} /> Back to Discussions
          </button>
        </Link>

        {/* Post card */}
        <motion.article
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-none"
        >
          {/* Hero */}
          <div className="relative h-64 md:h-96 w-full">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent z-10" />
            <img src={getImage(post.category)} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute bottom-8 left-8 right-8 z-20">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full text-xs font-bold bg-indigo-500/20 backdrop-blur-md text-indigo-200 border border-indigo-500/30">
                <Tag size={12} /> {post.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-300 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                    {post.author?.charAt(0)?.toUpperCase() ?? post.authorName?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>
                  <span className="text-white">{post.author ?? post.authorName ?? 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-indigo-400" />
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 md:p-12">
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {(post.content ?? post.description ?? '').split('\n').map((p, i) => (
                <p key={i} className="mb-4">{p}</p>
              ))}
            </div>

            {/* Action bar */}
            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between flex-wrap gap-4">
              <div className="flex gap-4 items-center">

                {/* Like */}
                <div className="relative">
                  <motion.button
                    id="like-button"
                    onClick={handleLike}
                    whileTap={{ scale: 0.9 }}
                    disabled={likeLoading}
                    className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold transition-all duration-200 select-none
                      ${liked ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30 hover:bg-pink-600'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-500/10 hover:text-pink-500 dark:hover:text-pink-400'}
                      ${likeLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <AnimatePresence mode="wait">
                      <motion.span key={liked ? 'l' : 'u'} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
                        <Heart size={20} className={liked ? 'fill-white' : ''} />
                      </motion.span>
                    </AnimatePresence>
                    <AnimatePresence mode="wait">
                      <motion.span key={likeCount} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }} transition={{ duration: 0.15 }} className="min-w-[1.5rem] text-center tabular-nums">
                        {likeCount}
                      </motion.span>
                    </AnimatePresence>
                    <span>{liked ? 'Liked' : 'Like'}</span>
                  </motion.button>

                  <AnimatePresence>
                    {showLoginHint && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 whitespace-nowrap bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl pointer-events-none">
                        Please <Link href="/auth/signin" className="text-indigo-400 underline pointer-events-auto">sign in</Link> to like
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Comment count */}
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-500 transition-colors">
                  <MessageSquare size={20} />
                  <span>{totalCount} Comment{totalCount !== 1 ? 's' : ''}</span>
                </button>
              </div>

              {likeCount > 0 && (
                <motion.div key={likeCount} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Heart size={14} className="fill-pink-400 text-pink-400" />
                  <span><span className="font-bold text-gray-700 dark:text-gray-200">{likeCount}</span> {likeCount === 1 ? 'person liked this' : 'people liked this'}</span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.article>

        {/* ── Comments section ── */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <MessageSquare size={20} className="text-indigo-500" />
            Comments
            {totalCount > 0 && (
              <span className="text-sm font-semibold text-white bg-indigo-500 rounded-full px-2.5 py-0.5">
                {totalCount}
              </span>
            )}
          </h2>

          {/* New comment box */}
          {session?.user ? (
            <form onSubmit={handleCommentSubmit} className="mb-8 bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex gap-3">
                <Avatar name={userName} />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment…"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none transition"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={!newComment.trim() || commentSubmitting}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-500 text-white font-semibold text-sm hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <Send size={15} />
                      {commentSubmitting ? 'Posting…' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-8 py-6 text-center bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <Link href="/auth/signin" className="text-indigo-500 font-semibold hover:underline">Sign in</Link> to join the discussion
              </p>
            </div>
          )}

          {/* Comment list */}
          {commentsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
            </div>
          ) : topComments.length === 0 ? (
            <div className="text-center py-14 text-gray-400 dark:text-gray-600">
              <MessageSquare size={44} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No comments yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topComments.map((comment) => (
                <motion.div
                  key={comment._id?.toString()}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm"
                >
                  <CommentCard
                    comment={comment}
                    postAuthorEmail={postAuthorEmail}
                    currentUserEmail={userEmail}
                    currentUserName={userName}
                    replies={getReplies(comment._id?.toString())}
                    replyingTo={replyingTo} setReplyingTo={setReplyingTo}
                    replyText={replyText} setReplyText={setReplyText}
                    replySubmitting={replySubmitting} onReplySubmit={handleReplySubmit}
                    editingId={editingId} setEditingId={setEditingId}
                    editText={editText} setEditText={setEditText}
                    editSubmitting={editSubmitting} onEditSubmit={handleEditSubmit}
                    setDeleteTarget={setDeleteTarget}
                    openMenu={openMenu} setOpenMenu={setOpenMenu}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => !deleteSubmitting && setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 320 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-7 shadow-2xl border border-gray-200 dark:border-gray-800 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon + close */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                  <Trash2 size={20} className="text-red-500" />
                </div>
                <button
                  onClick={() => !deleteSubmitting && setDeleteTarget(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-400"
                >
                  <X size={18} />
                </button>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Comment?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                This will permanently delete the comment and all its replies. This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleteSubmitting}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteSubmitting}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 disabled:opacity-60 transition"
                >
                  {deleteSubmitting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
