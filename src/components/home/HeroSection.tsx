import React, { useRef, useEffect } from 'react';
import type { ToolCategory } from '../../types';
import {
  Search,
  LayoutGrid,
  Image as ImageIcon,
  BookOpen,
  FileText,
  ShieldCheck,
  X,
} from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ToolCategory;
  onCategoryChange: (cat: ToolCategory) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories: { id: ToolCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Tools', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'image', label: 'Image Tools', icon: <ImageIcon className="w-4 h-4 text-amber-500" /> },
    { id: 'cbz', label: 'CBZ Comics', icon: <BookOpen className="w-4 h-4 text-orange-500" /> },
    { id: 'pdf', label: 'PDF Tools', icon: <FileText className="w-4 h-4 text-amber-600" /> },
    { id: 'security', label: 'Security & Privacy', icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> },
  ];

  // Global Ctrl+K / Cmd+K keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="relative pt-10 pb-6 px-4 sm:px-6 lg:px-8 text-center overflow-hidden min-w-fit">
      {/* Top Floating Leaf Accent */}
      <div className="inline-flex items-center justify-center mb-3 ">
        <span className="text-2xl transform -rotate-12 animate-pulse inline-block">🍂</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#2c221a] dark:text-stone-50 max-w-4xl mx-auto font-['Outfit'] leading-[1.1]">
        <span>Convert Files</span>
        <br />
        <span className="font-handwriting font-bold text-[#ea580c] dark:text-orange-400 text-5xl sm:text-7xl lg:text-8xl inline-flex items-center gap-2 mt-1 sm:mt-2">
          <span className="text-2xl sm:text-3xl opacity-75 hidden sm:inline">🍂</span>
          Locally, Beautifully
          <span className="text-2xl sm:text-3xl opacity-75 hidden sm:inline">🍁</span>
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-stone-700 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed font-medium">
        Images, documents, comics and more — all processed on your device.
        <br className="hidden sm:inline" />
        {' '}No uploads. No servers. Just fast, private conversions.
      </p>

      {/* Pill Search Input with Ctrl K */}
      <div className="mt-7 max-w-xl mx-auto relative ">
        <div className="relative flex px-5 items-center bg-white/80 dark:bg-[#1a1614]/85 backdrop-blur-md border border-[#edd7c2] dark:border-stone-700/80 rounded-full shadow-material-sm hover:shadow-material-md focus-within:shadow-material-md focus-within:border-brand-500/80 dark:focus-within:border-brand-500/80 transition-all duration-200">
          <Search className="absolute left-4.5 w-5 h-5 text-stone-400 dark:text-stone-800 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tools (e.g. image to PDF, CBZ to PDF, WebP, ...)"
            className="w-full pl-12 pr-20 py-3.5 rounded-full bg-transparent text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 text-xs sm:text-sm focus:outline-none"
          />
          <div className="absolute right-3.5 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                onClick={() => {
                  onSearchChange('');
                  searchInputRef.current?.focus();
                }}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-stone-400 dark:text-stone-400 bg-stone-100/90 dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700 rounded-md shadow-xs pointer-events-none">
                Ctrl K
              </kbd>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills Tab Bar */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#ea580c] text-white shadow-md shadow-orange-500/25 scale-102'
                : 'bg-white/70 dark:bg-[#1a1614]/70 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-white dark:hover:bg-stone-800 border border-[#edd7c2]/80 dark:border-stone-800 backdrop-blur-sm'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};
