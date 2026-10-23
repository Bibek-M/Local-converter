import React from 'react';
import { CONVERSION_TOOLS } from '../converters/registry';
import { ToolCard } from '../components/home/ToolCard';
import { useNavigate } from 'react-router-dom';
import {
  Image as ImageIcon,
  Sparkles,
  Upload,
} from 'lucide-react';
import { useConvertStore } from '../store/useConvertStore';

export const ImagesCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const { addFiles } = useConvertStore();

  const imageTools = CONVERSION_TOOLS.filter((t) => t.category === 'image' || t.id === 'image-to-pdf');

  const handleQuickUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
      navigate('/convert/image-to-pdf');
    }
  };

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-4">
          <ImageIcon className="w-4 h-4 text-amber-500" />
          <span>Complete Image Conversion Suite</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] tracking-tight">
          Image Tools & Converters
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Convert any image (PNG, JPG, WebP, SVG, GIF, AVIF) to PDF or next-gen image formats.
          All processing runs 100% locally in your browser memory.
        </p>
      </div>

      {/* Quick Launch Dropzone */}
      <div className="max-w-2xl mx-auto mb-12">
        <label className="relative flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed border-brand-300 dark:border-brand-800 bg-brand-50/40 dark:bg-brand-950/20 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-all cursor-pointer group shadow-sm">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleQuickUpload}
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-brand-500 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-md shadow-brand-500/20">
            <Upload className="w-7 h-7" />
          </div>
          <span className="font-['Outfit'] font-bold text-base text-slate-900 dark:text-white">
            Quick Drop: Select or Drag Images Here
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Instantly opens conversion studio · Supports all major image formats
          </span>
        </label>
      </div>

      {/* Image Tools Grid */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Outfit']">
            Available Image Tools
          </h2>
          <span className="text-xs text-slate-500">
            {imageTools.length} tools available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {imageTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>

      {/* Image Formats Comparison Card */}
      <div className="rounded-3xl bg-white dark:bg-[#151824] border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-8 shadow-sm">
        <h3 className="font-['Outfit'] font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-500" />
          <span>Which Image Format Should You Choose?</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <span className="font-bold text-rose-500 text-sm block mb-1">PDF</span>
            <p className="text-slate-600 dark:text-slate-300">
              Best for printing, archiving, and multi-page documents. Maintains exact margins and aspect ratios.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <span className="font-bold text-purple-500 text-sm block mb-1">WebP</span>
            <p className="text-slate-600 dark:text-slate-300">
              Modern web standard. 30–50% smaller than JPG with identical visual quality and transparency support.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <span className="font-bold text-emerald-500 text-sm block mb-1">PNG</span>
            <p className="text-slate-600 dark:text-slate-300">
              Lossless with sharp edges and alpha transparency. Ideal for logos, icons, diagrams, and screenshots.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <span className="font-bold text-blue-500 text-sm block mb-1">JPG</span>
            <p className="text-slate-600 dark:text-slate-300">
              Universal compatibility for photography. Compact file sizes with customizable compression.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
