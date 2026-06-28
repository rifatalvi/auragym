'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const SignInPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await authClient.signIn.email({ email, password });
      if (error) {
        setError(error.message || 'Invalid email or password');
        setLoading(false);
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await authClient.signIn.social({
        provider: 'google',
        callbackURL: callbackUrl
      });
      if (error) {
        setError(error.message || 'Google sign-in failed');
        setLoading(false);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50 dark:bg-[#060b13] transition-colors duration-300">
      
      {/* Left Panel - Image Cover */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-gray-900/60 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80" 
          alt="Gym background" 
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-14">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="relative w-12 h-12 bg-white/10 backdrop-blur-md rounded-full overflow-hidden p-2">
              <Image src="/logo-ag.png" alt="AuraGym Logo" fill className="object-contain mix-blend-screen invert" style={{ filter: 'contrast(1.2)' }} priority />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              Aura<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400">Gym</span>
            </span>
          </Link>

          <div>
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
              Push your limits.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400">Transform your life.</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-md font-medium">
              Join the elite fitness community. Access world-class equipment and top-tier trainers today.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white dark:bg-[#060b13] transition-colors duration-300">
        
        {/* Mobile Logo */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden p-1.5">
              <Image src="/logo-ag.png" alt="AuraGym Logo" fill className="object-contain dark:mix-blend-screen dark:invert" priority />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">Aura<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">Gym</span></span>
          </Link>
        </div>

        <div className="w-full max-w-md my-auto pt-16 lg:pt-0">
          
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Welcome back</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-rose-600 dark:text-rose-400 font-bold hover:underline transition-colors">
                Sign up free
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="flex flex-col gap-5">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3.5 pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
                <Link href="/auth/forgot-password" className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3.5 pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-sm"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-2 py-3.5 flex items-center justify-center gap-2 font-bold text-white rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/20"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">Or continue with</span>
              <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3.5 flex items-center justify-center gap-3 font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;