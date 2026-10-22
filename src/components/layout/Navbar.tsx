import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';
import appLogo from '../assets/applogo.webp';
import {
  HelpCircle,
  Image as ImageIcon,
  BookOpen,
  ChevronDown,
  Sparkles,
  FileImage,
  Camera,
  Minimize2,
  FileText,
  ShieldCheck,
  LayoutGrid,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [isImagesDropdownOpen, setIsImagesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isHome = location.pathname === '/';
  const isImages = location.pathname.startsWith('/images') || (location.pathname.startsWith('/convert/image') && location.pathname !== '/convert/image-to-pdf');
  const isCbz = location.pathname.startsWith('/cbz') || location.pathname === '/convert/cbz';
  const isPdf = location.pathname === '/convert/image-to-pdf' || location.pathname === '/convert/merge-pdf' || location.pathname === '/convert/pdf-to-image';
  const isSecurity = location.pathname === '/convert/privacy-strip';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsImagesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const imageSubtools = [
    {
      title: 'Image to PDF',
      path: '/convert/image-to-pdf',
      desc: 'Convert any image to PDF document',
      icon: <FileText className="w-4 h-4 text-amber-500" />,
    },
    {
      title: 'Convert to WebP',
      path: '/convert/image-to-webp',
      desc: 'Compress to next-gen WebP format',
      icon: <Sparkles className="w-4 h-4 text-orange-500" />,
    },
    {
      title: 'Convert to PNG',
      path: '/convert/image-to-png',
      desc: 'Lossless format with transparency',
      icon: <FileImage className="w-4 h-4 text-emerald-500" />,
    },
    {
      title: 'Convert to JPG',
      path: '/convert/image-to-jpg',
      desc: 'Lightweight photography format',
      icon: <Camera className="w-4 h-4 text-amber-600" />,
    },
    {
      title: 'Compress Image',
      path: '/convert/compress-image',
      desc: 'Reduce file size locally',
      icon: <Minimize2 className="w-4 h-4 text-rose-500" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#faf7f2]/85 dark:bg-[#12100e]/85 backdrop-blur-md border-b border-[#ebdccd]/80 dark:border-stone-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={appLogo}
              alt="LocalConvert Logo"
              className="w-9 h-9 object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Outfit'] font-bold text-xl tracking-tight text-stone-900 dark:text-stone-100">
                  Local<span className="text-brand-500">Convert</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  100% Local
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 -mt-0.5 hidden sm:block">
                Zero Cloud Uploads · Total Privacy
              </p>
            </div>
          </Link>

          {/* Navigation Links matching reference */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                isHome
                  ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/70 dark:hover:bg-stone-800/60'
              }`}
            >
              <LayoutGrid className="w-4 h-4 opacity-75" />
              <span>All Tools</span>
            </Link>

            {/* Images Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center">
                <Link
                  to="/images"
                  className={`pl-3 pr-1.5 py-1.5 rounded-l-xl text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                    isImages
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/70 dark:hover:bg-stone-800/60'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-amber-500" />
                  <span>Images</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsImagesDropdownOpen(!isImagesDropdownOpen)}
                  aria-label="Toggle images menu"
                  className={`pr-2.5 pl-0.5 py-1.5 rounded-r-xl text-sm font-semibold transition-colors cursor-pointer ${
                    isImages
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/70 dark:hover:bg-stone-800/60'
                  }`}
                >
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isImagesDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Images Dropdown Menu */}
              {isImagesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-[#fffbf5] dark:bg-[#1c1815] border border-[#ebdccd] dark:border-stone-800 rounded-2xl shadow-xl overflow-hidden py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-[#f2e7db] dark:border-stone-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                      Image Converters
                    </span>
                    <Link
                      to="/images"
                      onClick={() => setIsImagesDropdownOpen(false)}
                      className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                    >
                      View Hub →
                    </Link>
                  </div>
                  <div className="py-1">
                    {imageSubtools.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsImagesDropdownOpen(false)}
                        className="flex items-start gap-3 px-4 py-2.5 hover:bg-brand-50/60 dark:hover:bg-stone-800/60 transition-colors"
                      >
                        <div className="mt-0.5">{item.icon}</div>
                        <div>
                          <div className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                            {item.title}
                          </div>
                          <div className="text-xs text-stone-400">{item.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CBZ Comics */}
            <Link
              to="/cbz"
              className={`px-3 py-1.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                isCbz
                  ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/70 dark:hover:bg-stone-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>CBZ Comics</span>
            </Link>

            {/* PDF Tools */}
            <Link
              to="/convert/image-to-pdf"
              className={`px-3 py-1.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                isPdf
                  ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/70 dark:hover:bg-stone-800/60'
              }`}
            >
              <FileText className="w-4 h-4 text-orange-500" />
              <span>PDF Tools</span>
            </Link>

            {/* Security */}
            <Link
              to="/convert/privacy-strip"
              className={`px-3 py-1.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                isSecurity
                  ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/70 dark:hover:bg-stone-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Security</span>
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/how-it-works"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100/70 dark:hover:bg-stone-800/60 transition-colors"
              title="Learn how client-side conversion works"
            >
              <HelpCircle className="w-4 h-4 text-stone-400" />
              <span>How it works</span>
            </Link>

            <div className="h-5 w-px bg-stone-300 dark:bg-stone-800 mx-1 hidden sm:block" />

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
