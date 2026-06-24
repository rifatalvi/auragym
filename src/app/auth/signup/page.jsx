'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// React Icons
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaDumbbell, 
  FaCheckCircle, 
  FaImage, 
  FaPhoneAlt 
} from 'react-icons/fa';

import { signUp } from '@/lib/auth-client'; // আপনার প্রজেক্টের পাথ অনুযায়ী ঠিক করে নিবেন

export default function GymSignupPage() {
  const router = useRouter();

  // AuraGym Form States
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  // ImageBB Upload States
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ImageBB Cloud Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 5MB Size Validation
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
        setImageUrl(data.data.url); // ImageBB থেকে পাওয়া লাইভ URL সেট হচ্ছে
      } else {
        setError("Image upload failed. Try again.");
      }
    } catch (err) {
      setError("Network error during profile image upload");
    } finally {
      setIsUploading(false);
    }
  };

  // Password Validation Logic
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

    // Ensure Profile Image is uploaded to ImageBB
    if (!imageUrl) {
      setError("Please upload a profile image first.");
      return;
    }

    // Check Password Rules
    if (!validatePassword(formData.password)) {
      setError("Password must be at least 6 characters and include one uppercase & one lowercase letter.");
      return;
    }

    // Check Password Match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      // API Call with ImgBB Live URL
      const { data, error: authError } = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.fullName,
        phone: formData.phone,
        image: imageUrl, // ImageBB থেকে পাওয়া লাইভ লিঙ্ক পাঠানো হচ্ছে
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
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-zinc-50 font-sans text-zinc-900 selection:bg-zinc-200 selection:text-zinc-900">
      
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-zinc-900 p-12 flex-col justify-between border-r border-zinc-800 text-white">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-20">
            <FaDumbbell className="text-zinc-100" size={28} />
            <span className="font-extrabold text-2xl tracking-widest uppercase text-zinc-100">AuraGym</span>
          </div>

          {/* Heading & Description */}
          <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Elevate your <br />
            fitness journey, <span className="text-zinc-400">start<br />today.</span>
          </h1>
          <p className="text-zinc-400 text-lg mb-12 max-w-md leading-relaxed">
            Experience a premium, distraction-free workout environment with state-of-the-art equipment.
          </p>

          {/* Feature List */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-zinc-300" size={20} />
              <span className="text-zinc-300 font-medium tracking-wide">Premium minimal aesthetics</span>
            </div>
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-zinc-300" size={20} />
              <span className="text-zinc-300 font-medium tracking-wide">Top-tier modern equipment</span>
            </div>
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-zinc-300" size={20} />
              <span className="text-zinc-300 font-medium tracking-wide">Exclusive member privileges</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-zinc-500 font-medium tracking-widest uppercase">
          © 2026 AuraGym. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white overflow-y-auto">
        
        {/* Mobile Header */}
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
          <FaDumbbell className="text-zinc-900" size={20} />
          <span className="font-extrabold text-lg tracking-widest uppercase text-zinc-900">AuraGym</span>
        </div>

        <div className="w-full max-w-md flex flex-col my-auto">
          
          <div className="mb-8 mt-10 lg:mt-0">
            <h2 className="text-3xl font-extrabold text-zinc-900 mb-2 tracking-tight">
              Create Account
            </h2>
            <p className="text-zinc-500 text-sm font-medium">
              Join the exclusive AuraGym community today.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm font-medium flex items-center gap-2">
              <span>{success}</span>
            </div>
          )}

          {/* Native HTML Form Elements */}
          <form onSubmit={handleSignup} className="flex flex-col gap-5 w-full">
            
            {/* Image Upload Field (Refactored for ImageBB) */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">Profile Image</label>
              <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 flex items-center gap-4">
                <div className="h-12 w-12 bg-white border border-zinc-200 rounded-lg flex items-center justify-center text-zinc-400 shrink-0 overflow-hidden relative">
                  {isUploading ? (
                    <div className="animate-spin text-zinc-500">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : imageUrl ? (
                    <img src={imageUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FaImage size={20} />
                  )}
                </div>
                <div className="flex flex-col items-start gap-1">
                  <label className={`cursor-pointer bg-white border border-zinc-200 px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-zinc-100 transition-colors shadow-sm text-zinc-700 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isUploading ? 'Uploading...' : 'Choose Image'}
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/webp" 
                      className="hidden" 
                      onChange={handleImageUpload} 
                      disabled={isUploading} 
                    />
                  </label>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    {isUploading ? 'Uploading to ImageBB...' : 'Required (JPEG, PNG, WEBP up to 5MB)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Full Name Input */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-bold text-zinc-700">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <FaUser size={14} />
                </div>
                <input
                  name="fullName"
                  placeholder="John Doe"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-white border border-zinc-200 rounded-xl py-3 pl-10 pr-4 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-zinc-700">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                    <FaEnvelope size={14} />
                  </div>
                  <input
                    name="email"
                    placeholder="you@example.com"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white border border-zinc-200 rounded-xl py-3 pl-10 pr-4 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-zinc-700">Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                    <FaPhoneAlt size={14} />
                  </div>
                  <input
                    name="phone"
                    placeholder="+880 1..."
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white border border-zinc-200 rounded-xl py-3 pl-10 pr-4 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Passwords Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-zinc-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                    <FaLock size={14} />
                  </div>
                  <input
                    name="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-white border border-zinc-200 rounded-xl py-3 pl-10 pr-12 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                      {showPassword ? <FaEyeSlash className="text-zinc-400 hover:text-zinc-600 transition-colors" size={16} /> : <FaEye className="text-zinc-400 hover:text-zinc-600 transition-colors" size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-zinc-700">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                    <FaLock size={14} />
                  </div>
                  <input
                    name="confirmPassword"
                    placeholder="••••••••"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-white border border-zinc-200 rounded-xl py-3 pl-10 pr-12 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="focus:outline-none">
                      {showConfirmPassword ? <FaEyeSlash className="text-zinc-400 hover:text-zinc-600 transition-colors" size={16} /> : <FaEye className="text-zinc-400 hover:text-zinc-600 transition-colors" size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Password Hint */}
            <p className="text-[10px] text-zinc-500 font-medium -mt-2">
              Password must be at least 6 characters, with 1 uppercase and 1 lowercase letter.
            </p>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading || isUploading} // ছবি আপলোড বা রেজিস্ট্রেশন চলাকালীন ডিজেবল থাকবে
              className="w-full mt-2 flex items-center justify-center bg-zinc-900 text-white font-bold h-12 rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Complete Registration'}
            </button>
            
            {/* Navigation Option */}
            <div className="text-center mt-2 text-sm text-zinc-600 font-medium w-full">
              Already a member?{' '}
              <Link href="/auth/signin" className="text-zinc-900 font-extrabold hover:text-zinc-700 transition-colors underline decoration-2 underline-offset-4">
                Sign in
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}