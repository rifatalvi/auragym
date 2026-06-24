"use client";

import { useSession } from "@/lib/auth-client";
import { 
  House, 
  CalendarCheck, 
  GraduationCap, 
  Heart, 
  PlusCircle, 
  Dumbbell, 
  MessageSquarePlus, 
  MessageSquare, 
  Users, 
  UserPlus, 
  UserCheck, 
  CreditCard, 
  MessageSquareCog,
  LogOut,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBarManu() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  
  // Default to 'user' if not defined, to match requested fallback pattern
  const userRole = session?.user?.role || "user";

  const userNavItems = [
    { icon: House, href: "/dashboard/user", label: "Overview" },
    { icon: CalendarCheck, href: "/dashboard/user/booked-classes", label: "Booked Classes" },
    { icon: GraduationCap, href: "/dashboard/user/apply-trainer", label: "Apply as Trainer" },
    { icon: Heart, href: "/dashboard/user/favorite-classes", label: "Favorite Classes" },
  ];

  const trainerNavItems = [
    { icon: House, href: "/dashboard/trainer", label: "Overview" },
    { icon: PlusCircle, href: "/dashboard/trainer/add-class", label: "Add Class" },
    { icon: Dumbbell, href: "/dashboard/trainer/my-classes", label: "My Classes" },
    { icon: MessageSquarePlus, href: "/dashboard/trainer/add-forum-post", label: "Add Forum Post" },
    { icon: MessageSquare, href: "/dashboard/trainer/my-forum-posts", label: "My Forum Posts" },
  ];

  const adminNavItems = [
    { icon: House, href: "/dashboard/admin", label: "Overview" },
    { icon: Users, href: "/dashboard/admin/users", label: "Manage Users" },
    { icon: UserPlus, href: "/dashboard/admin/applied-trainers", label: "Applied Trainers" },
    { icon: UserCheck, href: "/dashboard/admin/manage-trainers", label: "Manage Trainers" },
    { icon: Dumbbell, href: "/dashboard/admin/manage-classes", label: "Manage Classes" },
    { icon: MessageSquarePlus, href: "/dashboard/admin/add-forum-post", label: "Add Forum Post" },
    { icon: CreditCard, href: "/dashboard/admin/transactions", label: "Transactions" },
    { icon: MessageSquareCog, href: "/dashboard/admin/manage-forum-posts", label: "Forum Post Manage" },
  ];

  const sidebarItems = {
    user: userNavItems,
    trainer: trainerNavItems,
    admin: adminNavItems,
  };

  const navItems = sidebarItems[userRole] || [];

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-white/[0.05] bg-white dark:bg-[#060b13] flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-white/[0.05]">
        <Link href="/" className="flex items-center gap-2">
          <Dumbbell className="size-6 text-orange-500" />
          <span className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            Aura<span className="text-orange-500">Gym</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        {isPending ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="size-6 animate-spin text-orange-500" />
          </div>
        ) : (
          <nav className="flex flex-col gap-1.5">
            <div className="px-3 mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {userRole} Dashboard
              </p>
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.04] hover:text-gray-900 dark:hover:text-white font-medium"
                  }`}
                >
                  <item.icon className={`size-5 ${isActive ? "text-orange-600 dark:text-orange-400" : "text-gray-400 dark:text-gray-500"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-white/[0.05]">
        {!isPending && session?.user && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="size-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-600 font-bold uppercase">
              {session.user.name?.[0] || session.user.email?.[0] || "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {session.user.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session.user.email}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}