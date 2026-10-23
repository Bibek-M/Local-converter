import React, { useState } from 'react';
import type { ConversionOptions, FileItem, TargetFormat } from '../../types';
import {
  FileText,
  Sparkles,
  ChevronDown,
  Minimize2,
  Maximize,
  ArrowRight,
  ArrowLeftRight,
  SlidersHorizontal,
} from 'lucide-react';

interface ConversionOptionsCardProps {
  files: FileItem[];
  options: ConversionOptions;
  onChangeOptions: (patch: Partial<ConversionOptions>) => void;
  onConvert: () => void;
  isConverting: boolean;
}

export const ConversionOptionsCard: React.FC<ConversionOptionsCardProps> = ({
  files,
  options,
  onChangeOptions,
  onConvert,
  isConverting,
}) => {
  const [isFormatDropdownOpen, setIsFormatDropdownOpen] = useState(false);
  const [showAdvancedPdf, setShowAdvancedPdf] = useState(false);

  const formatOptions: { id: TargetFormat; title: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      id: 'pdf',
      title: 'PDF',
      subtitle: 'Portable Document Format',
      icon: <FileText className="w-4 h-4 text-rose-500" />,
    },
    {
      id: 'webp',
      title: 'WebP',
      subtitle: 'Made for the web',
      icon: <Sparkles className="w-4 h-4 text-purple-500" />,
    },
    {
      id: 'png',
      title: 'PNG',
      subtitle: 'Lossless with transparency',
      icon: <FileText className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: 'jpg',
      title: 'JPG',
      subtitle: 'Standard lightweight image',
      icon: <FileText className="w-4 h-4 text-blue-500" />,
    },
  ];

  const currentFormat = formatOptions.find((f) => f.id === options.targetFormat) || formatOptions[0];

  // Calculate dynamic estimated size
  const totalInputSize = files.reduce((acc, f) => acc + f.size, 0);
  const estimateRatio = options.compressFile ? Math.max(0.2, (options.quality / 100) * 0.65) : 0.95;
  const estimatedSizeBytes = Math.max(1024, Math.round(totalInputSize * estimateRatio));

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const percentReduction = Math.round((1 - estimateRatio) * 100);

  const getQualityText = (val: number) => {
    if (val >= 90) return 'Very High';
    if (val >= 75) return 'High';
    if (val >= 50) return 'Medium';
    return 'Low';
  };

  return (
    <div className="bg-white dark:bg-[#151824] rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-7 shadow-material-sm transition-colors flex flex-col justify-between">
      <div>
        {/* Card Header: Step 2 Make it yours */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-7 h-7 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-xs font-bold">
            2
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Make it yours
          </h2>
        </div>

        {/* Convert to Format Selector matching Figma */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Convert to
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFormatDropdownOpen(!isFormatDropdownOpen)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200/80 dark:border-brand-800/60 hover:border-brand-400 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 shadow-2xs flex items-center justify-center">
                  {currentFormat.icon}
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {currentFormat.title}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                    {currentFormat.subtitle}
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                  isFormatDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isFormatDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white dark:bg-[#1a1d2c] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden py-1">
                {formatOptions.map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => {
                      onChangeOptions({ targetFormat: fmt.id });
                      setIsFormatDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                      options.targetFormat === fmt.id
                        ? 'bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300 font-semibold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        {fmt.icon}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{fmt.title}</div>
                        <div className="text-xs text-slate-400">{fmt.subtitle}</div>
                      </div>
                    </div>
                    {options.targetFormat === fmt.id && (
                      <span className="text-xs text-brand-600 font-bold">Selected</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* File Size / Quality Mode Cards matching Figma */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            File size
          </label>
          <div className="space-y-2.5">
            {/* Card 1: Compress file */}
            <div
              onClick={() => onChangeOptions({ compressFile: true })}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                options.compressFile
                  ? 'bg-brand-50/50 dark:bg-brand-950/40 border-brand-400/90 dark:border-brand-600/90 shadow-2xs'
                  : 'bg-white dark:bg-[#181b28] border-slate-200/90 dark:border-slate-800/90 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    options.compressFile
                      ? 'border-brand-600 dark:border-brand-400'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {options.compressFile && (
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-600 dark:bg-brand-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Compress file
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    A smaller file, still looking sharp
                  </p>
                </div>
              </div>
              <Minimize2 className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </div>

            {/* Card 2: Original size */}
            <div
              onClick={() => onChangeOptions({ compressFile: false })}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                !options.compressFile
                  ? 'bg-brand-50/50 dark:bg-brand-950/40 border-brand-400/90 dark:border-brand-600/90 shadow-2xs'
                  : 'bg-white dark:bg-[#181b28] border-slate-200/90 dark:border-slate-800/90 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    !options.compressFile
                      ? 'border-brand-600 dark:border-brand-400'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {!options.compressFile && (
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-600 dark:bg-brand-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Original size
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Keep the highest possible quality
                  </p>
                </div>
              </div>
              <Maximize className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </div>
          </div>
        </div>

        {/* Quality Slider matching Figma */}
        <div className={`mb-6 transition-opacity ${options.compressFile ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Quality
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {options.quality}% · {getQualityText(options.quality)}
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            step="5"
            value={options.quality}
            onChange={(e) => onChangeOptions({ quality: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
          />
        </div>

        {/* PDF Specific Settings Section */}
        {options.targetFormat === 'pdf' && (
          <div className="mb-6 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              onClick={() => setShowAdvancedPdf(!showAdvancedPdf)}
              className="flex items-center justify-between w-full text-xs font-semibold text-brand-600 dark:text-brand-400 py-1 hover:underline"
            >
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>PDF Page Layout Options</span>
              </div>
              <span>{showAdvancedPdf ? 'Hide' : 'Configure (A4, Margins, etc.)'}</span>
            </button>

            {showAdvancedPdf && (
              <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#191d2c] border border-slate-200/70 dark:border-slate-800/70 space-y-3">
                {/* Orientation */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Orientation
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['auto', 'portrait', 'landscape'] as const).map((ori) => (
                      <button
                        key={ori}
                        type="button"
                        onClick={() => onChangeOptions({ orientation: ori })}
                        className={`py-1.5 px-2 rounded-xl text-xs font-medium capitalize transition-colors ${
                          options.orientation === ori
                            ? 'bg-brand-500 text-white shadow-2xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {ori}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Page Size */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Page Size
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['fit', 'a4', 'letter'] as const).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => onChangeOptions({ pageSize: sz })}
                        className={`py-1.5 px-2 rounded-xl text-xs font-medium uppercase transition-colors ${
                          options.pageSize === sz
                            ? 'bg-brand-500 text-white shadow-2xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {sz === 'fit' ? 'Fit Image' : sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Margins */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Margins
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['none', 'small', 'normal'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => onChangeOptions({ margin: m })}
                        className={`py-1.5 px-2 rounded-xl text-xs font-medium capitalize transition-colors ${
                          options.margin === m
                            ? 'bg-brand-500 text-white shadow-2xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Summary & Action Button */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
        {/* Estimated File Size matching Figma */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">
              Estimated file size
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
              {files.length > 0 ? `~${formatFileSize(estimatedSizeBytes)}` : '—'}
            </span>
          </div>

          {files.length > 0 && options.compressFile && percentReduction > 0 && (
            <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800/60">
              ↓ {percentReduction}% smaller
            </span>
          )}
        </div>

        {/* Large Vibrant Convert Button matching Figma */}
        <button
          type="button"
          disabled={files.length === 0 || isConverting}
          onClick={onConvert}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base text-white shadow-material-md flex items-center justify-center gap-2.5 transition-all duration-200 ${
            files.length === 0
              ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-brand-600 hover:bg-brand-700 active:scale-[0.99] shadow-brand-500/25 hover:shadow-brand-500/35 hover:shadow-material-lg cursor-pointer'
          }`}
        >
          {isConverting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Converting file...</span>
            </>
          ) : (
            <>
              <ArrowLeftRight className="w-4 h-4" />
              <span>Convert to {options.targetFormat.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
