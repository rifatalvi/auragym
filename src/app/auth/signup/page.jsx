'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dumbbell, Mail, Lock, ArrowRight, Loader2, User, Phone, Image as ImageIcon, Eye, EyeOff, Activity, BarChart3, Users } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const SignUpPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }

    setIsUploading(true);
    setError('');
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY; 
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: uploadFormData
      });
      const data = await response.json();
      
      if (data.success) {
        setImageUrl(data.data.url);
      } else {
        setError("Image upload failed. Try again.");
      }
    } catch (err) {
      setError("Network error during profile image upload");
    } finally {
      setIsUploading(false);
    }
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 6;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    return minLength && hasUpper && hasLower;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!imageUrl) {
      setError("Please upload a profile image first.");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError("Password must be at least 6 characters and include one uppercase & one lowercase letter.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.fullName,
        phone: formData.phone,
        image: imageUrl,
        role: "user", 
      });

      if (authError) {
        setError(authError.message || 'Something went wrong during signup.');
      } else {
        setSuccess('Welcome to AuraGym! Your account is ready.');
        setTimeout(() => {
          router.push('/auth/signin');
        }, 1500);
      }
    } catch (err) {
      setError('An unexpected network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/'
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
    <div className="min-h-screen w-full flex bg-[#050505] font-sans">
      
      {/* Left Panel - Branding & Features (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#000000] via-[#0a0a0a] to-[#111111] border-r border-white/5 p-12 flex-col justify-between relative overflow-hidden">
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
            Elevate Your <br />
            <span className="text-[#FF6600]">Fitness Journey</span>
          </h1>
          <p className="text-gray-400 text-lg mb-12 max-w-md leading-relaxed">
            Experience a premium, distraction-free workout environment with state-of-the-art equipment.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-[#121212]/80 p-4 rounded-2xl border border-white/5 backdrop-blur-md w-max pr-8 transition-colors hover:border-[#FF6600]/30">
              <div className="p-2.5 bg-[#FF6600]/10 rounded-lg text-[#FF6600]">
                <Activity size={20} />
              </div>
              <span className="text-gray-200 font-medium text-sm">Premium minimal aesthetics</span>
            </div>
            <div className="flex items-center gap-4 bg-[#121212]/80 p-4 rounded-2xl border border-white/5 backdrop-blur-md w-max pr-8 transition-colors hover:border-[#FF6600]/30">
              <div className="p-2.5 bg-[#FF6600]/10 rounded-lg text-[#FF6600]">
                <BarChart3 size={20} />
              </div>
              <span className="text-gray-200 font-medium text-sm">Top-tier modern equipment</span>
            </div>
            <div className="flex items-center gap-4 bg-[#121212]/80 p-4 rounded-2xl border border-white/5 backdrop-blur-md w-max pr-8 transition-colors hover:border-[#FF6600]/30">
              <div className="p-2.5 bg-[#FF6600]/10 rounded-lg text-[#FF6600]">
                <Users size={20} />
              </div>
              <span className="text-gray-200 font-medium text-sm">Exclusive member privileges</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-gray-600 font-medium">
          © 2026 AuraGym. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 bg-[#0a0a0a] overflow-y-auto">
        
        {/* Mobile Header (Shows only on small screens) */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-[#FF6600] p-2 rounded-lg text-white">
              <Dumbbell size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl text-white">Aura<span className="text-[#FF6600]">Gym</span></span>
          </Link>
        </div>

        <div className="w-full max-w-md flex flex-col my-auto py-10 lg:py-0">
          
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Create Account</h2>
            <p className="text-gray-400 text-sm">
              Already a member?{' '}
              <Link href="/auth/signin" className="text-[#FF6600] font-semibold hover:text-[#e65c00] transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-[#FF6600]/10 border border-[#FF6600]/30 rounded-xl text-[#FF6600] text-sm font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleSignup} className="flex flex-col gap-5 w-full">
            
            {/* Image Upload Field */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Profile Image</label>
              <div className="w-full bg-[#121212] border border-white/5 rounded-xl p-3 flex items-center gap-4">
                <div className="h-12 w-12 bg-[#1a1a1a] border border-white/10 rounded-lg flex items-center justify-center text-gray-500 shrink-0 overflow-hidden relative">
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  ) : imageUrl ? (
                    <img src={imageUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={20} />
                  )}
                </div>
                <div className="flex flex-col items-start gap-1">
                  <label className={`cursor-pointer bg-[#1a1a1a] border border-white/10 px-3 py-1.5 rounded-md text-xs font-semibold text-gray-300 hover:bg-[#222222] transition-colors shadow-sm ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isUploading ? 'Uploading...' : 'Choose Image'}
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/webp" 
                      className="hidden" 
                      onChange={handleImageUpload} 
                      disabled={isUploading} 
                    />
                  </label>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {isUploading ? 'Uploading to ImageBB...' : 'Required (JPEG, PNG, WEBP up to 5MB)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Full Name Input */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium text-gray-300">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <User size={16} />
                </div>
                <input
                  name="fullName"
                  placeholder="John Doe"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-[#121212] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-gray-300">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Mail size={16} />
                  </div>
                  <input
                    name="email"
                    placeholder="you@example.com"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#121212] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-gray-300">Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Phone size={16} />
                  </div>
                  <input
                    name="phone"
                    placeholder="+880 1..."
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-[#121212] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Passwords Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Lock size={16} />
                  </div>
                  <input
                    name="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-[#121212] border border-white/5 rounded-xl py-3 pl-11 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-all shadow-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none text-gray-500 hover:text-gray-300 transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Lock size={16} />
                  </div>
                  <input
                    name="confirmPassword"
                    placeholder="••••••••"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-[#121212] border border-white/5 rounded-xl py-3 pl-11 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-all shadow-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="focus:outline-none text-gray-500 hover:text-gray-300 transition-colors">
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-[10px] text-gray-500 font-medium -mt-2">
              Password must be at least 6 characters, with 1 uppercase and 1 lowercase letter.
            </p>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading || isUploading}
              className="w-full mt-2 py-3.5 flex items-center justify-center gap-2 font-bold text-white rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed bg-[#FF6600] hover:bg-[#e65c00] shadow-[0_4px_14px_rgba(255,102,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,102,0,0.4)]"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>Sign Up <ArrowRight size={18} /></>
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
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3.5 flex items-center justify-center gap-3 font-semibold text-gray-300 bg-[#121212] border border-white/5 rounded-xl hover:bg-[#1a1a1a] hover:border-white/10 hover:text-white transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
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

export default SignUpPage;