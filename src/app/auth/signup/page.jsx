'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2, User, Phone, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
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
        await authClient.signOut();
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
        callbackURL: '/auth/signin'
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
          src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80" 
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
              Start your journey.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400">Join AuraGym today.</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-md font-medium">
              Create an account to track your progress, book classes, and connect with elite trainers.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto bg-white dark:bg-[#060b13] transition-colors duration-300">
        
        {/* Mobile Logo */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden p-1.5">
              <Image src="/logo-ag.png" alt="AuraGym Logo" fill className="object-contain dark:mix-blend-screen dark:invert" priority />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">Aura<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">Gym</span></span>
          </Link>
        </div>

        <div className="w-full max-w-md my-auto pt-16 lg:pt-0 pb-8">
          
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Create Account</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Already a member?{' '}
              <Link href="/auth/signin" className="text-rose-600 dark:text-rose-400 font-bold hover:underline transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl text-green-600 dark:text-green-400 text-sm font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleSignup} className="flex flex-col gap-5">
            
            {/* Image Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Profile Image</label>
              <div className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-3 flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center text-gray-400 shrink-0 overflow-hidden relative">
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : imageUrl ? (
                    <img src={imageUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={20} />
                  )}
                </div>
                <div className="flex flex-col items-start gap-1">
                  <label className={`cursor-pointer bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-md text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
                    Required (JPEG, PNG, WEBP up to 5MB)
                  </span>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <User size={16} />
                </div>
                <input
                  name="fullName"
                  placeholder="John Doe"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Mail size={16} />
                  </div>
                  <input
                    name="email"
                    placeholder="you@example.com"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Phone size={16} />
                  </div>
                  <input
                    name="phone"
                    placeholder="+880 1..."
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Lock size={16} />
                  </div>
                  <input
                    name="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-11 pr-12 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Lock size={16} />
                  </div>
                  <input
                    name="confirmPassword"
                    placeholder="••••••••"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-11 pr-12 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="focus:outline-none text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-[10px] text-gray-500 font-medium -mt-2">
              Password must be at least 6 characters, with 1 uppercase and 1 lowercase letter.
            </p>

            <button 
              type="submit" 
              disabled={loading || isUploading}
              className="w-full mt-2 py-3.5 flex items-center justify-center gap-2 font-bold text-white rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/20"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>Sign Up <ArrowRight size={18} /></>
              )}
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">Or</span>
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
              Continue with Google
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;