import Link from 'next/link';
// react-icons থেকে প্রয়োজনীয় আইকনগুলো ইমপোর্ট করা হলো
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter, FaDumbbell } from 'react-icons/fa6';
import { MdMail, MdLocationOn, MdPhone } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-[#0a0f16] border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-[1440px] w-full mx-auto px-4 md:px-8">
        
        {/* Top Section: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* 1. Logo & About */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 w-fit">
              <div className="bg-cyan-400 p-2 rounded-lg text-[#0a0f16]">
                <FaDumbbell size={24} />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white">
                Aura<span className="text-cyan-600 dark:text-cyan-400">Gym</span>
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
              <li><Link href="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Home</Link></li>
              <li><Link href="/classes" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">All Classes</Link></li>
              <li><Link href="/forum" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Community Forum</Link></li>
              <li><Link href="/apply-trainer" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Become a Trainer</Link></li>
            </ul>
          </div>

          {/* 3. Contact Information */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Contact Us</h3>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex items-center gap-3">
                <MdLocationOn size={20} className="text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                <span>Level-4, 34, Awal Centre, Banani, Dhaka</span>
              </li>
              <li className="flex items-center gap-3">
                <MdPhone size={20} className="text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                <span>+880 1234 567 890</span>
              </li>
              <li className="flex items-center gap-3">
                <MdMail size={20} className="text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                <span>support@auragym.com</span>
              </li>
            </ul>
          </div>

          {/* 4. Social Media Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Follow Us</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Stay updated with our latest workouts and community news.</p>
            <div className="flex items-center gap-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-cyan-600 hover:text-white dark:hover:bg-cyan-400 dark:hover:text-[#0a0f16] transition-all group">
                <FaFacebookF size={18} className="transition-transform group-hover:scale-110" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-cyan-600 hover:text-white dark:hover:bg-cyan-400 dark:hover:text-[#0a0f16] transition-all group">
                <FaInstagram size={18} className="transition-transform group-hover:scale-110" />
              </a>
              {/* Using the official new X logo from react-icons */}
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-cyan-600 hover:text-white dark:hover:bg-cyan-400 dark:hover:text-[#0a0f16] transition-all group">
                <FaXTwitter size={18} className="transition-transform group-hover:scale-110" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-cyan-600 hover:text-white dark:hover:bg-cyan-400 dark:hover:text-[#0a0f16] transition-all group">
                <FaLinkedinIn size={18} className="transition-transform group-hover:scale-110" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section: Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} AuraGym. All rights reserved.
          </p>
          <div className="flex gap-6 font-medium">
            <Link href="/privacy" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;