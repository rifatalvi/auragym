"use client";

import { useTheme } from "next-themes";
import { useSession } from "@/lib/auth-client";
import { MdSearch, MdNotifications, MdOutlineLightMode, MdOutlineDarkMode, MdFavorite, MdSettings, MdLogout, MdDashboard } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { Avatar } from '@heroui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";

export default function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignout = async () => {
    await authClient.signOut();
    router.push('/auth/signin');
  };

  return (
    <header className="h-16 border-b border-gray-200 dark:border-white/[0.08] bg-white/50 dark:bg-[#0a0007]/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Search Bar */}
      <div className="flex items-center w-full max-w-xl bg-gray-100/80 dark:bg-white/[0.04] rounded-lg px-3 py-2 border border-transparent focus-within:border-gray-300 dark:focus-within:border-white/[0.08] transition-colors shadow-sm">
        <MdSearch className="text-gray-400 text-xl" />
        <input
          type="text"
          placeholder="Search courses, users, or classes..."
          className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-200 ml-2 w-full placeholder-gray-400"
        />
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/[0.04] text-gray-500 dark:text-gray-400 transition-colors"
          title="Toggle Theme"
        >
          {mounted && theme === "dark" ? <MdOutlineLightMode size={20} /> : <MdOutlineDarkMode size={20} />}
        </button>

        {/* Notification */}
        <button 
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/[0.04] text-gray-500 dark:text-gray-400 transition-colors relative"
          title="Notifications"
        >
          <MdNotifications size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full border border-white dark:border-[#0a0007]"></span>
        </button>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-gray-200 dark:bg-white/[0.08] mx-1"></div>

        {/* Profile with Dropdown */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 cursor-pointer p-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors ml-1"
          >
            <Avatar className="h-8 w-8 border-2 border-red-700/20 rounded-md overflow-hidden cursor-pointer">
              <div className="bg-red-50 dark:bg-gray-900 h-full w-full overflow-hidden flex items-center justify-center">
                <Avatar.Image src={session?.user?.image} alt={session?.user?.name || "User"} className="object-cover h-full w-full" />
                <Avatar.Fallback className="flex items-center justify-center h-full w-full text-xs font-bold text-red-700 dark:text-rose-400 uppercase">
                  {session?.user?.name?.[0] || session?.user?.email?.[0] || "U"}
                </Avatar.Fallback>
              </div>
            </Avatar>
          </div>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0a0007] border border-gray-200 dark:border-white/[0.08] rounded-xl shadow-lg dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-white/[0.08]">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{session?.user?.name || "User"}</p>
                <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
              </div>
              <div className="p-1">
                <Link 
                  href={`/dashboard/${session?.user?.role || 'user'}`}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.04] rounded-lg transition-colors"
                >
                  <MdDashboard className="text-lg text-gray-400" />
                  Dashboard
                </Link>
                <Link 
                  href={`/dashboard/${session?.user?.role || 'user'}/favorite-classes`}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.04] rounded-lg transition-colors"
                >
                  <MdFavorite className="text-lg text-gray-400" />
                  Favorite Classes
                </Link>
                <Link 
                  href="#"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.04] rounded-lg transition-colors"
                >
                  <MdSettings className="text-lg text-gray-400" />
                  Settings
                </Link>
              </div>
              <div className="p-1 border-t border-gray-200 dark:border-white/[0.08]">
                <button 
                  onClick={() => {
                    setIsProfileOpen(false);
                    handleSignout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                >
                  <MdLogout className="text-lg" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
