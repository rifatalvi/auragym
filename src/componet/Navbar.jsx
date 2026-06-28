'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Avatar } from '@heroui/react';
import NotificationDropdown from "@/componet/NotificationDropdown";
import { LayoutDashboard, LogOut, Bell, Sun, Moon, Menu, X } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Hide navbar on auth routes
  if (pathname?.startsWith('/auth')) {
    return null;
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const authLinks = {
    user: '/dashboard/user',
    trainer: '/dashboard/trainer',
    admin: '/dashboard/admin',
  };

  const handleSignout = async () => {
    await authClient.signOut();
    router.push('/auth/signin');
    setIsOpen(false);
  };

  // Hide Navbar on dashboard routes
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Classes', path: '/classes' },
    { name: 'Community Forum', path: '/forum' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 px-4 sm:px-6 py-4 flex justify-center">
      <nav
        className={`w-full max-w-7xl h-16 px-4 sm:px-6 rounded-2xl flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-[#0a0007]/90 backdrop-blur-md border border-gray-200 dark:border-red-950/60 shadow-sm dark:shadow-[0_4px_30px_rgba(139,0,0,0.2)]'
            : 'bg-transparent border border-transparent'
        }`}
      >
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image
              src="/logo-ag.png"
              alt="AuraGym Logo"
              fill
              className="object-contain mix-blend-multiply dark:mix-blend-screen dark:invert"
              style={{ filter: 'contrast(1.2)' }}
              priority
            />
          </div>
          <span className="font-extrabold text-2xl tracking-tight hidden sm:block text-gray-900 dark:text-white">
            Aura<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-rose-500">Gym</span>
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 bg-gray-100/80 dark:bg-red-950/20 px-6 py-2 rounded-full border border-gray-200 dark:border-red-900/30 backdrop-blur-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`font-medium text-sm transition-all relative py-1 ${
                  isActive ? 'text-red-700 dark:text-rose-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 w-1/2 h-[2px] bg-red-700 dark:bg-rose-500 -translate-x-1/2 rounded-full shadow-[0_0_8px_rgba(185,28,28,0.6)]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full bg-gray-100 dark:bg-red-950/30 border border-gray-200 dark:border-red-900/30 text-gray-600 dark:text-gray-400 hover:text-red-700 dark:hover:text-rose-400 hover:border-red-400/50 transition-all"
            aria-label="Toggle Theme"
          >
            {mounted && theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isPending ? (
            <div className="h-10 w-24 bg-gray-200 dark:bg-red-950/30 animate-pulse rounded-xl hidden sm:block" />
          ) : user ? (
            <>
              <div className="hidden sm:block">
                <NotificationDropdown />
              </div>

              <Link
                href={authLinks[user?.role?.toLowerCase()] || '/dashboard/user'}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-red-700 border border-red-600 text-white rounded-xl font-semibold hover:bg-red-800 transition-all text-sm"
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>

              <div className="hidden sm:block w-[1px] h-6 bg-gray-200 dark:bg-red-900/50 mx-1" />

              <div className="hidden md:flex items-center gap-3">
                <div className="flex flex-col text-right text-sm">
                  <span className="font-semibold text-gray-900 dark:text-white leading-tight">{user.name}</span>
                  <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{user.role || 'USER'}</span>
                </div>

                <Avatar className="h-10 w-10 border-2 border-red-700/40 rounded-full overflow-hidden cursor-pointer">
                  <div className="bg-red-50 dark:bg-gray-900 h-full w-full rounded-full overflow-hidden">
                    <Avatar.Image src={user.image} alt={user.name} className="object-cover h-full w-full" />
                    <Avatar.Fallback className="flex items-center justify-center h-full w-full text-sm font-bold text-red-700">
                      {user?.name?.charAt(0) || 'U'}
                    </Avatar.Fallback>
                  </div>
                </Avatar>

                <button onClick={handleSignout} className="ml-1 text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-500/10" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/auth/signin" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/auth/signup">
                <button className="h-9 px-5 text-sm font-bold text-white bg-gradient-to-r from-red-700 to-rose-600 rounded-xl hover:opacity-90 shadow-[0_0_15px_rgba(185,28,28,0.3)] transition-all active:scale-95">
                  Get Started
                </button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none bg-gray-100 dark:bg-red-950/30 rounded-lg border border-gray-200 dark:border-red-900/30"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* MOBILE DROP-DOWN MENU */}
      {isOpen && (
        <div className="absolute top-24 left-4 right-4 bg-white/95 dark:bg-[#0a0007]/95 backdrop-blur-xl border border-gray-200 dark:border-red-900/40 rounded-2xl p-6 flex flex-col gap-6 lg:hidden shadow-2xl animate-in fade-in slide-in-from-top-5 duration-200">
          <ul className="flex flex-col gap-4 text-base font-medium text-gray-600 dark:text-gray-400">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className="hover:text-red-700 dark:hover:text-rose-400 block py-2 transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {user && (
              <li>
                <Link
                  href={authLinks[user?.role?.toLowerCase()] || '/dashboard/user'}
                  onClick={() => setIsOpen(false)}
                  className="hover:text-rose-400 py-2 flex items-center gap-2 text-rose-500"
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
              </li>
            )}
          </ul>

          <div className="h-[1px] w-full bg-gray-200 dark:bg-red-900/30" />

          <div className="flex flex-col gap-4">
            {user ? (
              <div className="flex items-center justify-between bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-red-700/40 bg-red-100 dark:bg-gray-800">
                    <Avatar.Image src={user.image} alt={user.name} />
                  </Avatar>
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold text-gray-900 dark:text-white">{user.name}</span>
                    <span className="text-xs text-rose-500 uppercase">{user.role}</span>
                  </div>
                </div>
                <button onClick={handleSignout} className="text-red-500 hover:text-red-400 p-2 bg-red-500/10 rounded-lg">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/auth/signin" onClick={() => setIsOpen(false)} className="text-center font-medium text-rose-500 py-2 hover:text-rose-400 bg-red-500/10 rounded-xl border border-red-500/20 transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                  <button className="w-full py-3 font-bold text-white bg-gradient-to-r from-red-700 to-rose-600 rounded-xl shadow-[0_0_15px_rgba(185,28,28,0.2)]">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;