import React, { useState, useMemo } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { ToolCard } from '../components/home/ToolCard';
import { FeaturesBanner } from '../components/home/FeaturesBanner';
import { CONVERSION_TOOLS } from '../converters/registry';
import type { ToolCategory } from '../types';
import { FileSearch, ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import convertImg from '../components/assets/convertImg.webp';
import convertComic from '../components/assets/ConvertComic.webp';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');

  const filteredTools = useMemo(() => {
    return CONVERSION_TOOLS.filter((tool) => {
      const matchesSearch =
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Featured Cards (Image to PDF & CBZ Comic Converter) Matching Reference Mockup */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-2 mb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {/* Card 1: Image to PDF */}
          <div className="rounded-3xl bg-[#fffbf2]/92 dark:bg-[#1a1614]/92 backdrop-blur-md border border-[#edd7c2] dark:border-stone-800/90 p-6 sm:p-7 shadow-material-lg hover:shadow-warm-card hover:border-brand-500/40 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex-1 space-y-2 text-left">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  <span className="text-sm">🍂</span>
                  <span>FEATURED TOOL</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-[#2c221a] dark:text-white">
                  Image to PDF
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-sm">
                  Turn multiple images into a clean PDF. Adjust page size, margins and more — all offline.
                </p>
                <div className="pt-3">
                  <Link
                    to="/convert/image-to-pdf"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ea580c] hover:bg-[#d44e05] text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/25 transition-all hover:scale-102"
                  >
                    <span>Convert Images</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="w-full sm:w-48 md:w-56 h-36 sm:h-44 flex-shrink-0 flex items-center justify-center relative">
                <img
                  src={convertImg}
                  alt="Image to PDF preview"
                  className="max-h-full max-w-full object-contain rounded-xl drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {/* Card 2: CBZ Comic Converter */}
          <div className="rounded-3xl bg-[#fffbf2]/92 dark:bg-[#1a1614]/92 backdrop-blur-md border border-[#edd7c2] dark:border-stone-800/90 p-6 sm:p-7 shadow-material-lg hover:shadow-warm-card hover:border-brand-500/40 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex-1 space-y-2 text-left">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  <span className="text-sm">🍂</span>
                  <span>NEW</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-[#2c221a] dark:text-white">
                  CBZ Comic Converter
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-sm">
                  View comic pages, reorder, and convert CBZ archives to PDF or extract images — all locally.
                </p>
                <div className="pt-3">
                  <Link
                    to="/cbz"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ea580c] hover:bg-[#d44e05] text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/25 transition-all hover:scale-102"
                  >
                    <span>Open CBZ Converter</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="w-full sm:w-48 md:w-56 h-36 sm:h-44 flex-shrink-0 flex items-center justify-center relative">
                <img
                  src={convertComic}
                  alt="CBZ Comic Converter preview"
                  className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Explore All Tools Indicator */}
        <div className="flex justify-center mt-6 mb-4">
          <button
            onClick={() => {
              document.getElementById('all-tools-grid')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer group"
          >
            <span className="text-sm">🍂</span>
            <span>Explore All Tools</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Tools Grid */}
      <section id="all-tools-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-['Outfit']">
            {selectedCategory === 'all'
              ? 'All Conversion Tools'
              : selectedCategory === 'image'
              ? 'Image Converters'
              : selectedCategory === 'cbz'
              ? 'CBZ Comic Tools'
              : selectedCategory === 'pdf'
              ? 'PDF Tools'
              : 'Security & Privacy Tools'}
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            Showing {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
          </span>
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-[#fffbf5]/90 dark:bg-[#1a1614]/90 rounded-3xl border border-[#edd7c2] dark:border-stone-800">
            <FileSearch className="w-12 h-12 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-stone-800 dark:text-stone-200">
              No conversion tools found
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              We couldn't find any tool matching "{searchQuery}". Try searching for "PDF", "CBZ" or "WebP".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Features Banner */}
      <FeaturesBanner />
    </div>
  );
};
