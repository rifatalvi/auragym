'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Avatar } from '@heroui/react';
import { LayoutDashboard, LogOut, Bell, Sun, Moon, Dumbbell, Menu, X } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Better Auth Session Logic
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Handle scroll effect for glassmorphism
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
            ? 'bg-white/80 dark:bg-[#0a0f16]/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent border border-transparent'
        }`}
      >
        {/* Left: Logo & Brand Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-2 rounded-xl text-[#0a0f16] shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] transition-all">
            <Dumbbell size={22} strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-2xl tracking-tight hidden sm:block text-gray-900 dark:text-white">
            Aura<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Gym</span>
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 bg-gray-100/80 dark:bg-gray-900/50 px-6 py-2 rounded-full border border-gray-200 dark:border-gray-800 backdrop-blur-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`font-medium text-sm transition-all relative py-1 ${
                  isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 w-1/2 h-[2px] bg-cyan-400 -translate-x-1/2 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: Actions, Dashboard, and Profile */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-400/50 transition-all"
            aria-label="Toggle Theme"
          >
            {mounted && theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          {isPending ? (
             <div className="h-10 w-24 bg-gray-800/50 animate-pulse rounded-xl hidden sm:block"></div>
          ) : user ? (
            <>
              <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-400/50 transition-all hidden sm:block">
                <Bell size={18} />
              </button>

              <Link
                href={authLinks[user?.role?.toLowerCase()] || '/dashboard/user'}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-900 border border-cyan-500/30 text-cyan-400 rounded-xl font-semibold hover:bg-cyan-500/10 hover:border-cyan-400 transition-all text-sm"
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>

              <div className="hidden sm:block w-[1px] h-6 bg-gray-800 mx-1" />

              <div className="hidden md:flex items-center gap-3">
                <div className="flex flex-col text-right text-sm">
                  <span className="font-semibold text-white leading-tight">{user.name}</span>
                  <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">{user.role || 'USER'}</span>
                </div>
                
                <Avatar className="h-10 w-10 border-2 border-transparent bg-gradient-to-r from-cyan-400 to-blue-500 p-[2px] rounded-full overflow-hidden cursor-pointer">
                  <div className="bg-gray-900 h-full w-full rounded-full overflow-hidden">
                    <Avatar.Image src={user.image} alt={user.name} className="object-cover h-full w-full" />
                    <Avatar.Fallback className="flex items-center justify-center h-full w-full text-sm font-bold text-gray-300">
                      {user?.name?.charAt(0) || 'U'}
                    </Avatar.Fallback>
                  </div>
                </Avatar>

                <button onClick={handleSignout} className="ml-1 text-gray-500 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-500/10" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/auth/signin" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/auth/signup">
                <button className="h-9 px-5 text-sm font-bold text-[#0a0f16] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl hover:opacity-90 shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all active:scale-95">
                  Get Started
                </button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* MOBILE DROP-DOWN MENU */}
      {isOpen && (
        <div className="absolute top-24 left-4 right-4 bg-white/95 dark:bg-[#0a0f16]/95 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col gap-6 lg:hidden shadow-2xl animate-in fade-in slide-in-from-top-5 duration-200">
          <ul className="flex flex-col gap-4 text-base font-medium text-gray-600 dark:text-gray-400">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className="hover:text-white block py-2"
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
                  className="hover:text-cyan-400 py-2 flex items-center gap-2 text-cyan-400"
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
              </li>
            )}
          </ul>

          <div className="h-[1px] w-full bg-gray-800" />

          <div className="flex flex-col gap-4">
            {user ? (
              <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-xl border border-gray-800">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-cyan-400 bg-gray-800">
                    <Avatar.Image src={user.image} alt={user.name} />
                  </Avatar>
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold text-white">{user.name}</span>
                    <span className="text-xs text-cyan-500 uppercase">{user.role}</span>
                  </div>
                </div>
                <button onClick={handleSignout} className="text-red-400 hover:text-red-300 p-2 bg-red-500/10 rounded-lg">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/auth/signin" onClick={() => setIsOpen(false)} className="text-center font-medium text-cyan-400 py-2 hover:text-cyan-300 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                  Sign In
                </Link>
                <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                  <button className="w-full py-3 font-bold text-[#0a0f16] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.2)]">
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