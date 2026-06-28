"use client";

import { useState, useEffect, useRef } from "react";
import fetchSecure from '../lib/fetchSecure';
import { MdNotifications, MdCheckCircle } from "react-icons/md";
import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationDropdown() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetchSecure(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${session.user.email}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Optional: Set up polling or listen to events
    const interval = setInterval(fetchNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [session?.user?.email]);

  const markAsRead = async (id) => {
    try {
      await fetchSecure(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${id}/mark-read`, {
        method: "PATCH"
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.04]"
      >
        <MdNotifications size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#1C1C1F]"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1C1C1F] rounded-xl shadow-xl border border-gray-100 dark:border-white/[0.06] overflow-hidden z-50"
          >
            <div className="p-4 border-b border-gray-100 dark:border-white/[0.06] flex justify-between items-center bg-gray-50 dark:bg-white/[0.02]">
              <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center">
                  <MdNotifications size={32} className="text-gray-300 dark:text-gray-600 mb-2" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100 dark:divide-white/[0.06]">
                  {notifications.map((notif) => (
                    <li 
                      key={notif._id} 
                      className={`p-4 transition-colors cursor-pointer ${notif.read ? 'bg-white dark:bg-[#1C1C1F]' : 'bg-red-50 dark:bg-red-900/10'}`}
                      onClick={() => { if(!notif.read) markAsRead(notif._id); }}
                    >
                      <div className="flex gap-3">
                        <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${notif.read ? 'bg-gray-100 dark:bg-white/5 text-gray-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                          {notif.read ? <MdCheckCircle size={16} /> : <MdNotifications size={16} />}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm ${notif.read ? 'text-gray-600 dark:text-gray-300' : 'text-gray-900 dark:text-white font-medium'}`}>
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
