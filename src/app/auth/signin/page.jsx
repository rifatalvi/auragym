'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dumbbell, Mail, Lock, ArrowRight, Loader2, User, Crown, Activity, BarChart3, Users } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const SignInPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        role,
      });

      if (error) {
        setError(error.message || 'Invalid email or password');
        setLoading(false);
        return;
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#050505] font-sans">
      
      {/* Left Panel - Branding & Features (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#000000] via-[#0a0a0a] to-[#111111] border-r border-white/5 p-12 flex-col justify-between relative overflow-hidden">
        {/* Abstract Background Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FF6600]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#FF6600]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-16 w-fit group">
            <div className="bg-[#FF6600] p-2.5 rounded-xl text-white shadow-[0_0_15px_rgba(255,102,0,0.3)]">
              <Dumbbell size={24} strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              Aura<span className="text-[#FF6600]">Gym</span>
            </span>
          </Link>

          <h1 className="text-5xl font-black text-white mb-6 leading-tight tracking-tight">
            Master Your <br />
            <span className="text-[#FF6600]">Physical Aura</span>
          </h1>
          <p className="text-gray-400 text-lg mb-12 max-w-md leading-relaxed">
            Join elite athletes and fitness professionals who train smarter, track harder, and push further — every single day.
          </p>

          {/* Feature List */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-[#121212]/80 p-4 rounded-2xl border border-white/5 backdrop-blur-md w-max pr-8 transition-colors hover:border-[#FF6600]/30">
              <div className="p-2.5 bg-[#FF6600]/10 rounded-lg text-[#FF6600]">
                <Activity size={20} />
              </div>
              <span className="text-gray-200 font-medium text-sm">500+ Expert-Curated Workouts</span>
            </div>
            <div className="flex items-center gap-4 bg-[#121212]/80 p-4 rounded-2xl border border-white/5 backdrop-blur-md w-max pr-8 transition-colors hover:border-[#FF6600]/30">
              <div className="p-2.5 bg-[#FF6600]/10 rounded-lg text-[#FF6600]">
                <BarChart3 size={20} />
              </div>
              <span className="text-gray-200 font-medium text-sm">Real-Time Progress Analytics</span>
            </div>
            <div className="flex items-center gap-4 bg-[#121212]/80 p-4 rounded-2xl border border-white/5 backdrop-blur-md w-max pr-8 transition-colors hover:border-[#FF6600]/30">
              <div className="p-2.5 bg-[#FF6600]/10 rounded-lg text-[#FF6600]">
                <Users size={20} />
              </div>
              <span className="text-gray-200 font-medium text-sm">Elite Trainer Community</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-gray-600 font-medium">
          © 2026 AuraGym. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 bg-[#0a0a0a]">
        
        {/* Mobile Header (Shows only on small screens) */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-[#FF6600] p-2 rounded-lg text-white">
              <Dumbbell size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl text-white">Aura<span className="text-[#FF6600]">Gym</span></span>
          </Link>
        </div>

        <div className="w-full max-w-md flex flex-col">
          
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Welcome back</h2>
            <p className="text-gray-400 text-sm">
              Don t have an account?{' '}
              <Link href="/auth/signup" className="text-[#FF6600] font-semibold hover:text-[#e65c00] transition-colors">
                Sign up free
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="flex flex-col gap-6">
            
            {/* Role Selection (Fixed with standard buttons) */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quick Login Role</label>
              <div className="flex flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-all cursor-pointer outline-none focus:ring-2 focus:ring-[#FF6600]/50 ${
                    role === 'user' 
                      ? 'border-[#FF6600] bg-[#FF6600]/10 text-[#FF6600]' 
                      : 'border-white/10 bg-[#121212] text-gray-400 hover:border-white/20 hover:text-gray-300'
                  }`}
                >
                  <User size={16} />
                  <span className="text-sm font-semibold">User</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('trainer')}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-all cursor-pointer outline-none focus:ring-2 focus:ring-[#FF6600]/50 ${
                    role === 'trainer' 
                      ? 'border-[#FF6600] bg-[#FF6600]/10 text-[#FF6600]' 
                      : 'border-white/10 bg-[#121212] text-gray-400 hover:border-white/20 hover:text-gray-300'
                  }`}
                >
                  <Crown size={16} />
                  <span className="text-sm font-semibold">Trainer</span>
                </button>
              </div>
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#121212] border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <Link href="/auth/forgot-password" className="text-xs font-medium text-[#FF6600] hover:text-[#e65c00] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#121212] border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-2 py-3.5 flex items-center justify-center gap-2 font-bold text-white rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed bg-[#FF6600] hover:bg-[#e65c00] shadow-[0_4px_14px_rgba(255,102,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,102,0,0.4)]"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-gray-600 text-xs font-semibold uppercase tracking-wider">Or</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* Google Sign In Button */}
            <button 
              type="button"
              className="w-full py-3.5 flex items-center justify-center gap-3 font-semibold text-gray-300 bg-[#121212] border border-white/5 rounded-xl hover:bg-[#1a1a1a] hover:border-white/10 hover:text-white transition-all active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;