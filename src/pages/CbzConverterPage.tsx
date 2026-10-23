import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { FileItem, ConversionOptions, CbzOutputMode } from '../types';
import {
  extractCbzPages,
  convertCbzToPdf,
  convertCbzToImagesZip,
  createSampleCbzFile,
} from '../converters/cbzConverter';
import { ProgressOverlay } from '../components/convert/ProgressOverlay';
import { ResultModal } from '../components/convert/ResultModal';
import {
  BookOpen,
  FileArchive,
  Upload,
  X,
  Maximize2,
  SlidersHorizontal,
  ArrowLeft,
  ShieldCheck,
  Minimize2,
  Maximize,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  FileText,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CbzConverterPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Archive & page state
  const [comicName, setComicName] = useState<string>('');
  const [comicSize, setComicSize] = useState<number>(0);
  const [pages, setPages] = useState<FileItem[]>([]);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractStatus, setExtractStatus] = useState<string>('');
  const [showFullPreview, setShowFullPreview] = useState<boolean>(false);

  // Conversion options
  const [outputMode, setOutputMode] = useState<CbzOutputMode>('pdf');
  const [imageFormat, setImageFormat] = useState<'jpg' | 'png' | 'webp'>('webp');
  const [options, setOptions] = useState<ConversionOptions>({
    targetFormat: 'pdf',
    compressFile: true,
    quality: 80,
    pageSize: 'fit',
    orientation: 'auto',
    margin: 'none',
    mergeAll: true,
  });
  const [showAdvancedPdf, setShowAdvancedPdf] = useState<boolean>(false);

  // Running conversion state
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [conversionProgress, setConversionProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFilename, setResultFilename] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle CBZ upload
  const handleFileUpload = async (file: File) => {
    setIsExtracting(true);
    setExtractStatus('Reading comic archive...');
    setError(null);

    try {
      const data = await extractCbzPages(file, (_, status) => {
        setExtractStatus(status);
      });
      setComicName(data.filename);
      setComicSize(data.archiveSize);
      setPages(data.pages);
      setActivePageIndex(0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to extract CBZ file.';
      setError(msg);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const loadSampleComic = async () => {
    setIsExtracting(true);
    setExtractStatus('Generating sample comic pages in memory...');
    try {
      const sampleFile = await createSampleCbzFile();
      await handleFileUpload(sampleFile);
    } catch {
      setError('Could not generate sample comic.');
      setIsExtracting(false);
    }
  };

  const togglePageInclusion = (id: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, included: p.included === false ? true : false } : p))
    );
  };

  const selectAllPages = (included: boolean) => {
    setPages((prev) => prev.map((p) => ({ ...p, included })));
  };

  const activePage = pages[activePageIndex] || pages[0];
  const includedCount = pages.filter((p) => p.included !== false).length;

  // Estimated size calculation
  const totalRawSize = pages
    .filter((p) => p.included !== false)
    .reduce((acc, p) => acc + p.size, 0);

  const estimateRatio = options.compressFile ? Math.max(0.2, (options.quality / 100) * 0.65) : 0.95;
  const estimatedSizeBytes = Math.max(1024, Math.round(totalRawSize * estimateRatio));

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const percentReduction = Math.round((1 - estimateRatio) * 100);

  // Conversion Execution
  const handleStartConversion = async () => {
    if (pages.length === 0 || includedCount === 0) {
      setError('Please ensure at least one comic page is selected.');
      return;
    }

    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
    }

    setIsConverting(true);
    setConversionProgress(5);
    setStatusMessage('Initiating comic conversion...');
    setError(null);

    try {
      let res: { blob: Blob; filename: string };

      if (outputMode === 'pdf') {
        res = await convertCbzToPdf(pages, comicName || 'comic.cbz', options, (pct, status) => {
          setConversionProgress(pct);
          setStatusMessage(status);
        });
      } else {
        res = await convertCbzToImagesZip(
          pages,
          comicName || 'comic.cbz',
          imageFormat,
          options.quality,
          options.compressFile,
          (pct, status) => {
            setConversionProgress(pct);
            setStatusMessage(status);
          }
        );
      }

      const url = URL.createObjectURL(res.blob);
      setResultBlob(res.blob);
      setResultFilename(res.filename);
      setResultUrl(url);
      setIsConverting(false);

      // Celebrate
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#8B5CF6', '#38BDF8', '#10B981', '#F59E0B'],
        });
      } catch {
        // Safe fallback
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to convert CBZ.';
      setError(msg);
      setIsConverting(false);
    }
  };

  const handleReset = () => {
    pages.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setPages([]);
    setComicName('');
    setComicSize(0);
    setResultBlob(null);
    setResultFilename(null);
    setResultUrl(null);
    setError(null);
  };

  return (
    <div className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".cbz,.zip,application/zip,application/x-zip-compressed"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Navigation & Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all tools</span>
        </Link>

        {pages.length === 0 && (
          <button
            onClick={loadSampleComic}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 hover:bg-violet-100 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample Comic (.CBZ)</span>
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] tracking-tight flex items-center gap-3">
            <span>CBZ Comic Converter</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300">
              Offline
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-1">
            Preview comic pages first, adjust compression, and convert to PDF or separate image files.
          </p>
        </div>

        <div className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Zero cloud uploads · 100% local</span>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-between text-xs sm:text-sm text-rose-700 dark:text-rose-300">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="underline font-bold ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* Extraction in progress loader */}
      {isExtracting && (
        <div className="mb-6 p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 flex items-center gap-3 text-brand-700 dark:text-brand-300 text-xs sm:text-sm">
          <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin shrink-0" />
          <span>{extractStatus}</span>
        </div>
      )}

      {/* Main 2-Column Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Card 1: Comic File & Page Preview) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#151824] rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-7 shadow-material-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800 flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Comic Preview & Pages
              </h2>
              {pages.length > 0 && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-50 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-semibold">
                  {includedCount} of {pages.length} pages selected
                </span>
              )}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 hover:bg-violet-100 text-xs sm:text-sm font-semibold transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{pages.length > 0 ? 'Replace CBZ' : 'Select CBZ'}</span>
            </button>
          </div>

          {pages.length === 0 ? (
            /* Empty State Dropzone */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="min-h-[360px] rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-[#1a1d2c]/60 hover:bg-slate-50 dark:hover:bg-[#1a1d2c] hover:border-violet-500 flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4 shadow-sm">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="font-['Outfit'] font-bold text-lg text-slate-900 dark:text-white mb-1">
                Upload Comic Book Archive (.CBZ or .ZIP)
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-4">
                Drag and drop your CBZ file to inspect all comic pages before converting.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>.CBZ</span>
                <span>•</span>
                <span>.ZIP</span>
                <span>•</span>
                <span>Comic Book Archives</span>
              </div>
            </div>
          ) : (
            /* Active Comic Page Viewer & Gallery */
            <div>
              {/* Archive Info Bar */}
              <div className="mb-4 p-3 rounded-2xl bg-slate-50 dark:bg-[#191d2c] border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 truncate">
                  <FileArchive className="w-4 h-4 text-violet-500 shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                    {comicName}
                  </span>
                  <span className="text-slate-400">({formatFileSize(comicSize)})</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => selectAllPages(true)}
                    className="text-violet-600 dark:text-violet-400 hover:underline font-semibold"
                  >
                    Select All
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => selectAllPages(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {/* Large Featured Page Preview */}
              {activePage && (
                <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center group mb-4 border border-slate-200/80 dark:border-slate-800/80">
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/75 backdrop-blur-md text-white border border-white/10">
                      Page {activePage.pageNumber} of {pages.length}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/60 text-slate-300">
                      {activePage.width} × {activePage.height} px
                    </span>
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    disabled={activePageIndex === 0}
                    onClick={() => setActivePageIndex((prev) => Math.max(0, prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    disabled={activePageIndex === pages.length - 1}
                    onClick={() => setActivePageIndex((prev) => Math.min(pages.length - 1, prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setShowFullPreview(true)}
                    className="absolute bottom-3 right-3 p-2 rounded-full bg-black/75 text-white hover:scale-110 transition-transform"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  <img
                    src={activePage.previewUrl}
                    alt={activePage.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              )}

              {/* Thumbnails Gallery Strip */}
              <div className="mt-3">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                  Comic Pages ({includedCount} active)
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[190px] overflow-y-auto p-1 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl">
                  {pages.map((p, idx) => (
                    <div
                      key={p.id}
                      onClick={() => setActivePageIndex(idx)}
                      className={`relative rounded-xl overflow-hidden cursor-pointer border-2 aspect-[2/3] transition-all group ${
                        idx === activePageIndex
                          ? 'border-violet-500 ring-2 ring-violet-500/30 scale-[1.02]'
                          : p.included === false
                          ? 'opacity-40 border-slate-200 dark:border-slate-800 grayscale'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <img src={p.previewUrl} alt={p.name} className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 z-10">
                        <input
                          type="checkbox"
                          checked={p.included !== false}
                          onChange={(e) => {
                            e.stopPropagation();
                            togglePageInclusion(p.id);
                          }}
                          className="w-3.5 h-3.5 accent-violet-600 rounded cursor-pointer"
                        />
                      </div>
                      <span className="absolute bottom-1 right-1 text-[9px] bg-black/75 text-white px-1 py-0.2 rounded">
                        P{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Card 2: Conversion Options - Make it yours) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#151824] rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-7 shadow-material-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-7 h-7 rounded-full bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800 flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Make it yours
              </h2>
            </div>

            {/* Output Mode Selector: PDF vs Separate Images */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Convert CBZ to
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOutputMode('pdf')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    outputMode === 'pdf'
                      ? 'bg-violet-50/70 dark:bg-violet-950/40 border-violet-400 dark:border-violet-600 shadow-2xs'
                      : 'bg-white dark:bg-[#181b28] border-slate-200/90 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-rose-500" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">PDF Book</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-tight">
                    Single multi-page PDF document
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setOutputMode('images_zip')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    outputMode === 'images_zip'
                      ? 'bg-violet-50/70 dark:bg-violet-950/40 border-violet-400 dark:border-violet-600 shadow-2xs'
                      : 'bg-white dark:bg-[#181b28] border-slate-200/90 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileArchive className="w-4 h-4 text-sky-500" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Separate Images</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-tight">
                    Extracted image files (.ZIP)
                  </span>
                </button>
              </div>
            </div>

            {/* Separate Images Format Selector */}
            {outputMode === 'images_zip' && (
              <div className="mb-6 p-3 rounded-2xl bg-slate-50 dark:bg-[#191d2c] border border-slate-200/60 dark:border-slate-800/60">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                  Image Format
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['webp', 'jpg', 'png'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setImageFormat(fmt)}
                      className={`py-1.5 px-3 rounded-xl text-xs font-bold uppercase transition-colors ${
                        imageFormat === fmt
                          ? 'bg-violet-600 text-white shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* File Size / Compression Mode */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                File size
              </label>
              <div className="space-y-2.5">
                <div
                  onClick={() => setOptions((prev) => ({ ...prev, compressFile: true }))}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    options.compressFile
                      ? 'bg-violet-50/50 dark:bg-violet-950/40 border-violet-400 dark:border-violet-600'
                      : 'bg-white dark:bg-[#181b28] border-slate-200/90 dark:border-slate-800/90 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        options.compressFile ? 'border-violet-600' : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {options.compressFile && (
                        <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Compress file
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Smaller PDF or images, still looking sharp
                      </p>
                    </div>
                  </div>
                  <Minimize2 className="w-4 h-4 text-slate-400" />
                </div>

                <div
                  onClick={() => setOptions((prev) => ({ ...prev, compressFile: false }))}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    !options.compressFile
                      ? 'bg-violet-50/50 dark:bg-violet-950/40 border-violet-400 dark:border-violet-600'
                      : 'bg-white dark:bg-[#181b28] border-slate-200/90 dark:border-slate-800/90 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        !options.compressFile ? 'border-violet-600' : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {!options.compressFile && (
                        <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Original size
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Keep highest possible original resolution
                      </p>
                    </div>
                  </div>
                  <Maximize className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Quality Slider */}
            <div
              className={`mb-6 transition-opacity ${
                options.compressFile ? 'opacity-100' : 'opacity-40 pointer-events-none'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Quality
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {options.quality}% · {options.quality >= 75 ? 'High' : 'Medium'}
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={options.quality}
                onChange={(e) => setOptions({ ...options, quality: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>

            {/* PDF Layout options */}
            {outputMode === 'pdf' && (
              <div className="mb-6 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setShowAdvancedPdf(!showAdvancedPdf)}
                  className="flex items-center justify-between w-full text-xs font-semibold text-violet-600 dark:text-violet-400 py-1 hover:underline"
                >
                  <div className="flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>PDF Comic Layout (Fit comic image, A4)</span>
                  </div>
                  <span>{showAdvancedPdf ? 'Hide' : 'Options'}</span>
                </button>

                {showAdvancedPdf && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#191d2c] border border-slate-200/70 dark:border-slate-800/70 space-y-3">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Page Size
                      </span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(['fit', 'a4', 'letter'] as const).map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setOptions({ ...options, pageSize: sz })}
                            className={`py-1.5 px-2 rounded-xl text-xs font-medium uppercase transition-colors ${
                              options.pageSize === sz
                                ? 'bg-violet-600 text-white shadow-2xs'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {sz === 'fit' ? 'Fit Comic' : sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Action Area */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  Estimated output size
                </span>
                <span className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
                  {pages.length > 0 ? `~${formatFileSize(estimatedSizeBytes)}` : '—'}
                </span>
              </div>
              {pages.length > 0 && options.compressFile && percentReduction > 0 && (
                <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800/60">
                  ↓ {percentReduction}% smaller
                </span>
              )}
            </div>

            <button
              type="button"
              disabled={pages.length === 0 || includedCount === 0 || isConverting}
              onClick={handleStartConversion}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base text-white shadow-material-md flex items-center justify-center gap-2.5 transition-all duration-200 ${
                pages.length === 0 || includedCount === 0
                  ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-violet-600 hover:bg-violet-700 active:scale-[0.99] shadow-violet-500/25 hover:shadow-violet-500/35 hover:shadow-material-lg cursor-pointer'
              }`}
            >
              {isConverting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Converting CBZ...</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span>
                    {outputMode === 'pdf'
                      ? `Convert ${includedCount} Pages to PDF →`
                      : `Extract ${includedCount} Images (ZIP) →`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Trust Note */}
      <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-3">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>
            CBZ files are decompressed and processed in local device memory. Never uploaded to any server.
          </span>
        </div>
        <div className="font-medium">
          Supports .CBZ, .ZIP comic archives · Natural page sorting
        </div>
      </div>

      {/* Fullscreen Modal Preview */}
      {showFullPreview && activePage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowFullPreview(false)}
        >
          <div
            className="relative max-w-5xl max-h-[95vh] bg-white dark:bg-[#151824] rounded-2xl overflow-hidden shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Page {activePage.pageNumber}: {activePage.name} ({activePage.width} × {activePage.height} px)
              </span>
              <button
                onClick={() => setShowFullPreview(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center max-h-[80vh] overflow-auto">
              <img
                src={activePage.previewUrl}
                alt={activePage.name}
                className="max-h-[75vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Conversion Overlays */}
      {isConverting && (
        <ProgressOverlay
          progress={conversionProgress}
          statusText={statusMessage}
        />
      )}

      {resultBlob && resultFilename && resultUrl && (
        <ResultModal
          filename={resultFilename}
          blob={resultBlob}
          url={resultUrl}
          onClose={() => {
            setResultBlob(null);
            setResultFilename(null);
            setResultUrl(null);
          }}
          onConvertAnother={handleReset}
        />
      )}
    </div>
  );
};
