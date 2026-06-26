"use client";

import { useTheme } from "next-themes";
import { useSession } from "@/lib/auth-client";
import { MdSearch, MdNotifications, MdOutlineLightMode, MdOutlineDarkMode, MdFavorite, MdSettings, MdLogout, MdDashboard, MdKeyboardArrowDown, MdArrowBack } from "react-icons/md";
import { useState, useEffect, useRef } from "react";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";

// All menu items from all roles - for search suggestions
const ALL_MENU_ITEMS = [
  { label: "Overview", href: "/dashboard/user", role: "user" },
  { label: "Booked Classes", href: "/dashboard/user/booked-classes", role: "user" },
  { label: "Apply as Trainer", href: "/dashboard/user/apply-trainer", role: "user" },
  { label: "Favorite Classes", href: "/dashboard/user/favorite-classes", role: "user" },
  { label: "Transactions", href: "/dashboard/user/transactions", role: "user" },

  { label: "Overview", href: "/dashboard/trainer", role: "trainer" },
  { label: "Add Class", href: "/dashboard/trainer/add-class", role: "trainer" },
  { label: "My Classes", href: "/dashboard/trainer/my-classes", role: "trainer" },
  { label: "Add Forum Post", href: "/dashboard/trainer/add-forum-post", role: "trainer" },
  { label: "My Forum Posts", href: "/dashboard/trainer/my-forum-posts", role: "trainer" },

  { label: "Overview", href: "/dashboard/admin", role: "admin" },
  { label: "Manage Users", href: "/dashboard/admin/users", role: "admin" },
  { label: "Applied Trainers", href: "/dashboard/admin/applied-trainers", role: "admin" },
  { label: "Manage Trainers", href: "/dashboard/admin/manage-trainers", role: "admin" },
  { label: "Manage Classes", href: "/dashboard/admin/manage-classes", role: "admin" },
  { label: "Add Forum Post", href: "/dashboard/admin/add-forum-post", role: "admin" },
  { label: "Transactions", href: "/dashboard/admin/transactions", role: "admin" },
  { label: "Forum Post Manage", href: "/dashboard/admin/manage-forum-posts", role: "admin" },
];

export default function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const router = useRouter();

  const userRole = session?.user?.role || "user";

  useEffect(() => {
    setMounted(true);

    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
        setIsSearchExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter suggestions based on search query and user role
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const effectiveRole = userRole === "member" ? "user" : userRole;
    const roleItems = ALL_MENU_ITEMS.filter((item) => item.role === effectiveRole);
    const filtered = roleItems.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const handleSuggestionClick = () => {
    setSearchQuery("");
    setSuggestions([]);
    setIsSearchFocused(false);
  };

  const handleSignout = async () => {
    await authClient.signOut();
    router.push('/auth/signin');
  };

  return (
    <header className="h-16 border-b border-gray-200 dark:border-white/[0.08] bg-white/50 dark:bg-[#0a0007]/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Left side: Back Button and Welcome Text */}
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors text-gray-600 dark:text-gray-300 flex items-center gap-2"
        >
          <MdArrowBack size={20} />
          <span className="hidden sm:inline-block text-sm font-medium">Back</span>
        </button>
        
        <div className="flex flex-col">
          <h2 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-100">
            Welcome, {session?.user?.name || "User"}
          </h2>
          <p className="text-xs text-red-500 font-medium capitalize">
            {session?.user?.role || "Member"}
          </p>
        </div>
      </div>

      {/* Right Side Icons & Search */}
      <div className="flex items-center gap-3 ml-4 justify-end flex-1">
        
        {/* Expandable Search */}
        <div className="relative flex items-center justify-end" ref={searchRef}>
          <div className={`flex items-center bg-gray-100/80 dark:bg-white/[0.04] rounded-full transition-all duration-300 ease-in-out border ${isSearchExpanded ? "w-64 px-3 py-1.5 border-red-400 dark:border-rose-500/50" : "w-9 h-9 justify-center border-transparent cursor-pointer hover:bg-gray-200 dark:hover:bg-white/[0.08]"}`}
               onClick={() => { if(!isSearchExpanded) setIsSearchExpanded(true) }}>
            <MdSearch className={`text-xl flex-shrink-0 transition-colors ${isSearchExpanded ? "text-red-500 dark:text-rose-400" : "text-gray-500 dark:text-gray-400"}`} />
            
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => { setIsSearchFocused(true); setIsSearchExpanded(true); }}
              placeholder="Search..."
              className={`bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 transition-all duration-300 ${isSearchExpanded ? "w-full ml-2 opacity-100" : "w-0 opacity-0"}`}
              style={{ padding: 0 }}
            />
            {isSearchExpanded && searchQuery && (
              <button
                onClick={(e) => { e.stopPropagation(); setSearchQuery(""); setSuggestions([]); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ml-1 flex-shrink-0 transition-colors text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

        {/* Suggestions Dropdown */}
        {isSearchFocused && suggestions.length > 0 && (
          <div className="absolute top-full right-0 mt-1.5 w-64 bg-white dark:bg-[#120010] border border-gray-200 dark:border-white/[0.10] rounded-xl shadow-xl dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-2 border-b border-gray-100 dark:border-white/[0.06]">
              <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Menu Items</p>
            </div>
            <ul className="py-1 max-h-60 overflow-y-auto">
              {suggestions.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    onMouseDown={(e) => {
                      e.preventDefault(); // prevent input blur before navigation
                    }}
                    onClick={() => handleSuggestionClick()}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.05] hover:text-red-600 dark:hover:text-rose-400 transition-colors text-left group"
                  >
                    <MdSearch className="text-base text-gray-400 group-hover:text-red-500 dark:group-hover:text-rose-400 flex-shrink-0 transition-colors" />
                    <span>
                      {/* Highlight matching part */}
                      {item.label.split(new RegExp(`(${searchQuery})`, "gi")).map((part, i) =>
                        part.toLowerCase() === searchQuery.toLowerCase() ? (
                          <mark key={i} className="bg-red-100 dark:bg-rose-900/40 text-red-700 dark:text-rose-300 rounded px-0.5">{part}</mark>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* No suggestions found */}
        {isSearchFocused && searchQuery.trim().length > 0 && suggestions.length === 0 && (
          <div className="absolute top-full right-0 mt-1.5 w-64 bg-white dark:bg-[#120010] border border-gray-200 dark:border-white/[0.10] rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">No items found for <span className="font-semibold text-gray-700 dark:text-gray-200">&quot;{searchQuery}&quot;</span></p>
            </div>
          </div>
        )}
      </div>

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
            className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-all ml-1 border border-transparent hover:border-gray-200 dark:hover:border-white/[0.08]"
          >
            <div className="h-8 w-8 rounded-md border border-red-200 dark:border-rose-700/30 bg-red-50 dark:bg-rose-950/40 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {session?.user?.image ? (
                <img src={session.user.image} alt={session.user.name || "User"} className="object-cover w-full h-full" />
              ) : (
                <span className="text-xs font-bold text-red-700 dark:text-rose-400 uppercase">
                  {session?.user?.name?.[0] || session?.user?.email?.[0] || "U"}
                </span>
              )}
            </div>
            {/* Down Arrow indicator */}
            <MdKeyboardArrowDown
              size={16}
              className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : "rotate-0"}`}
            />
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
