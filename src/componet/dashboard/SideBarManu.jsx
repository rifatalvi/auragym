"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
  MdHome,
  MdCalendarToday,
  MdSchool,
  MdFavorite,
  MdAddCircle,
  MdFitnessCenter,
  MdPostAdd,
  MdForum,
  MdGroup,
  MdPersonAdd,
  MdVerifiedUser,
  MdCreditCard,
  MdManageAccounts,
  MdLogout,
  MdMoreVert,
} from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SideBarManu() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const userRole = session?.user?.role || "user";

  const userNavItems = [
    { icon: MdHome, href: "/dashboard/user", label: "Overview" },
    { icon: MdCalendarToday, href: "/dashboard/user/booked-classes", label: "Booked Classes" },
    { icon: MdSchool, href: "/dashboard/user/apply-trainer", label: "Apply as Trainer" },
    { icon: MdFavorite, href: "/dashboard/user/favorite-classes", label: "Favorite Classes" },
  ];

  const trainerNavItems = [
    { icon: MdHome, href: "/dashboard/trainer", label: "Overview" },
    { icon: MdAddCircle, href: "/dashboard/trainer/add-class", label: "Add Class" },
    { icon: MdFitnessCenter, href: "/dashboard/trainer/my-classes", label: "My Classes" },
    { icon: MdPostAdd, href: "/dashboard/trainer/add-forum-post", label: "Add Forum Post" },
    { icon: MdForum, href: "/dashboard/trainer/my-forum-posts", label: "My Forum Posts" },
  ];

  const adminNavItems = [
    { icon: MdHome, href: "/dashboard/admin", label: "Overview" },
    { icon: MdGroup, href: "/dashboard/admin/users", label: "Manage Users" },
    { icon: MdPersonAdd, href: "/dashboard/admin/applied-trainers", label: "Applied Trainers" },
    { icon: MdVerifiedUser, href: "/dashboard/admin/manage-trainers", label: "Manage Trainers" },
    { icon: MdFitnessCenter, href: "/dashboard/admin/manage-classes", label: "Manage Classes" },
    { icon: MdPostAdd, href: "/dashboard/admin/add-forum-post", label: "Add Forum Post" },
    { icon: MdCreditCard, href: "/dashboard/admin/transactions", label: "Transactions" },
    { icon: MdManageAccounts, href: "/dashboard/admin/manage-forum-posts", label: "Forum Post Manage" },
  ];

  const sidebarItems = {
    user: userNavItems,
    trainer: trainerNavItems,
    admin: adminNavItems,
  };

  const navItems = sidebarItems[userRole] || [];

  const handleSignout = async () => {
    await authClient.signOut();
    router.push("/auth/signin");
  };

  return (
    <aside
      className={`border-r border-gray-200 dark:border-white/[0.08] bg-gray-50/30 dark:bg-[#0a0007]/50 flex flex-col h-screen sticky top-0 font-sans transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* ── Toggle Button ── */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-5 bg-white dark:bg-[#0a0007] border border-gray-200 dark:border-white/[0.08] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-1 rounded-md shadow-sm z-10 transition-colors"
        title="Toggle Sidebar"
      >
        {isCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
      </button>

      {/* ── Header / Brand ── */}
      <div className={`h-14 flex items-center mt-2 mb-2 ${isCollapsed ? "px-3" : "px-4"}`}>
        <Link
          href="/"
          className={`flex items-center gap-2 group w-full rounded-md py-1.5 hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors ${
            isCollapsed ? "justify-center px-1" : "px-2"
          }`}
        >
          <div className="relative w-7 h-7 flex-shrink-0 bg-white dark:bg-white/[0.05] rounded shadow-sm border border-gray-200 dark:border-white/[0.08] flex items-center justify-center p-1">
            <Image
              src="/logo-ag.png"
              alt="AuraGym"
              fill
              className="object-contain mix-blend-multiply dark:mix-blend-screen dark:invert p-1"
              style={{ filter: "contrast(1.2)" }}
            />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col whitespace-nowrap overflow-hidden transition-all duration-300">
              <span className="text-sm font-bold text-gray-900 dark:text-white leading-none">
                Aura<span className="text-red-700 dark:text-rose-500">Gym</span>
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 capitalize mt-0.5">
                {userRole} Portal
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* ── Navigation Items ── */}
      <div className={`flex-1 overflow-y-auto py-2 ${isCollapsed ? "px-2" : "px-4"}`}>
        {isPending ? (
          <div className="flex justify-center items-center h-32">
            <AiOutlineLoading3Quarters className="text-xl text-gray-400 animate-spin" />
          </div>
        ) : (
          <nav className="flex flex-col gap-1">
            {/* Group Label */}
            {!isCollapsed && (
              <div className="px-2 mb-1 mt-2 transition-all duration-300">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Main Menu</span>
              </div>
            )}

            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors group/link relative ${
                    isActive
                      ? "bg-gray-200/50 dark:bg-white/[0.08] text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.04] hover:text-gray-900 dark:hover:text-white"
                  } ${isCollapsed ? "justify-center" : ""}`}
                >
                  <item.icon
                    className={`text-lg flex-shrink-0 ${
                      isActive ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="whitespace-nowrap overflow-hidden transition-all duration-300">
                      {item.label}
                    </span>
                  )}

                  {/* Custom Tooltip for Collapsed State */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded shadow-lg opacity-0 pointer-events-none group-hover/link:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap flex items-center">
                      {item.label}
                      {/* Tooltip Arrow */}
                      <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-0 h-0 border-y-[4px] border-y-transparent border-r-[4px] border-r-gray-900 dark:border-r-white"></div>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {/* ── User Profile Footer ── */}
      <div className={`mt-auto ${isCollapsed ? "p-2" : "p-4"}`}>
        {!isPending && session?.user && (
          <div
            className={`flex items-center gap-3 rounded-md hover:bg-gray-100 dark:hover:bg-white/[0.04] border border-transparent hover:border-gray-200 dark:hover:border-white/[0.08] transition-all cursor-pointer group relative ${
              isCollapsed ? "justify-center px-1 py-1.5" : "px-3 py-2.5"
            }`}
          >
            <div className="w-8 h-8 rounded bg-gray-200 dark:bg-white/[0.08] flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold uppercase text-xs flex-shrink-0">
              {session.user.name?.[0] || session.user.email?.[0] || "U"}
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0 whitespace-nowrap overflow-hidden transition-all duration-300">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {session.user.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSignout();
                  }}
                  title="Sign Out"
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all flex-shrink-0 absolute right-2"
                >
                  <MdLogout className="text-base" />
                </button>
                <MdMoreVert className="text-gray-400 group-hover:opacity-0 transition-opacity flex-shrink-0" />
              </>
            )}
            {/* Show logout button in collapsed mode on hover */}
            {isCollapsed && (
               <button
               onClick={(e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 handleSignout();
               }}
               title="Sign Out"
               className="opacity-0 group-hover:opacity-100 absolute w-8 h-8 flex items-center justify-center rounded-md bg-red-100 dark:bg-red-950/80 text-red-600 transition-all"
             >
               <MdLogout className="text-lg" />
             </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}