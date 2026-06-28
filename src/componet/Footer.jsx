'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { MdMail, MdLocationOn, MdPhone } from 'react-icons/md';

const Footer = () => {
  const pathname = usePathname();

  // Hide footer on dashboard and auth routes
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/auth')) {
    return null;
  }

  return (
    <footer className="w-full bg-white dark:bg-[#0a0007] border-t border-gray-200 dark:border-red-950/40 text-gray-600 dark:text-gray-300 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-[1440px] w-full mx-auto px-4 md:px-8">
        
        {/* Top Section: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* 1. Logo & About */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 w-fit">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src="/logo-ag.png"
                  alt="AuraGym Logo"
                  fill
                  className="object-contain mix-blend-multiply dark:mix-blend-screen dark:invert"
                  style={{ filter: 'contrast(1.2)' }}
                />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white">
                Aura<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-rose-500">Gym</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-2">
              Elevate your fitness journey with the ultimate platform for enthusiasts and trainers. Book classes, join the community, and master your aura.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Quick Links</h3>
            <ul className="flex flex-col gap-3 text-sm font-medium">
              <li><Link href="/" className="hover:text-red-700 dark:hover:text-rose-400 transition-colors">Home</Link></li>
              <li><Link href="/classes" className="hover:text-red-700 dark:hover:text-rose-400 transition-colors">All Classes</Link></li>
              <li><Link href="/forum" className="hover:text-red-700 dark:hover:text-rose-400 transition-colors">Community Forum</Link></li>
              <li><Link href="/apply-trainer" className="hover:text-red-700 dark:hover:text-rose-400 transition-colors">Become a Trainer</Link></li>
            </ul>
          </div>

          {/* 3. Contact Information */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Contact Us</h3>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex items-center gap-3">
                <MdLocationOn size={20} className="text-red-700 dark:text-rose-400 flex-shrink-0" />
                <span>Level-4, 34, Awal Centre, Banani, Dhaka</span>
              </li>
              <li className="flex items-center gap-3">
                <MdPhone size={20} className="text-red-700 dark:text-rose-400 flex-shrink-0" />
                <span>+880 1234 567 890</span>
              </li>
              <li className="flex items-center gap-3">
                <MdMail size={20} className="text-red-700 dark:text-rose-400 flex-shrink-0" />
                <span>support@auragym.com</span>
              </li>
            </ul>
          </div>

          {/* 4. Social Media Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Follow Us</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Stay updated with our latest workouts and community news.</p>
            <div className="flex items-center gap-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-red-950/20 border border-gray-200 dark:border-red-900/30 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-red-700 hover:text-white hover:border-red-700 dark:hover:bg-rose-500 dark:hover:text-white dark:hover:border-rose-500 transition-all group">
                <FaFacebookF size={16} className="transition-transform group-hover:scale-110" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-red-950/20 border border-gray-200 dark:border-red-900/30 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-red-700 hover:text-white hover:border-red-700 dark:hover:bg-rose-500 dark:hover:text-white dark:hover:border-rose-500 transition-all group">
                <FaInstagram size={16} className="transition-transform group-hover:scale-110" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-red-950/20 border border-gray-200 dark:border-red-900/30 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-red-700 hover:text-white hover:border-red-700 dark:hover:bg-rose-500 dark:hover:text-white dark:hover:border-rose-500 transition-all group">
                <FaXTwitter size={16} className="transition-transform group-hover:scale-110" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-red-950/20 border border-gray-200 dark:border-red-900/30 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-red-700 hover:text-white hover:border-red-700 dark:hover:bg-rose-500 dark:hover:text-white dark:hover:border-rose-500 transition-all group">
                <FaLinkedinIn size={16} className="transition-transform group-hover:scale-110" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section: Copyright */}
        <div className="border-t border-gray-200 dark:border-red-950/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} AuraGym. All rights reserved.
          </p>
          <div className="flex gap-6 font-medium">
            <Link href="/privacy" className="hover:text-red-700 dark:hover:text-rose-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-red-700 dark:hover:text-rose-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;