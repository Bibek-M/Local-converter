import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useConvertStore } from '../store/useConvertStore';
import { getToolById } from '../converters/registry';
import { FilePreviewCard } from '../components/convert/FilePreviewCard';
import { ConversionOptionsCard } from '../components/convert/ConversionOptionsCard';
import { ProgressOverlay } from '../components/convert/ProgressOverlay';
import { ResultModal } from '../components/convert/ResultModal';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const ConvertPage: React.FC = () => {
  const { toolId } = useParams<{ toolId?: string }>();
  const tool = getToolById(toolId || 'image-to-pdf');

  const {
    files,
    activeFileIndex,
    options,
    isConverting,
    conversionProgress,
    statusMessage,
    resultBlob,
    resultFilename,
    resultUrl,
    error,
    addFiles,
    removeFile,
    clearFiles,
    setActiveFileIndex,
    setOptions,
    setTargetFormat,
    startConversion,
    resetResult,
    clearError,
  } = useConvertStore();

  // Synchronize target format with active route
  useEffect(() => {
    if (tool) {
      setTargetFormat(tool.targetFormat);
    }
  }, [tool, setTargetFormat]);

  // Demo sample loader for fast testing
  const loadSampleImage = async () => {
    try {
      // Create a crisp sample canvas landscape image (mountain sunset theme)
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Gradient sky
      const skyGradient = ctx.createLinearGradient(0, 0, 0, 800);
      skyGradient.addColorStop(0, '#312e81');
      skyGradient.addColorStop(0.5, '#7c3aed');
      skyGradient.addColorStop(0.8, '#f59e0b');
      skyGradient.addColorStop(1, '#ec4899');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, 1200, 800);

      // Sun
      ctx.beginPath();
      ctx.arc(600, 480, 120, 0, Math.PI * 2);
      ctx.fillStyle = '#fef08a';
      ctx.fill();

      // Mountains
      ctx.beginPath();
      ctx.moveTo(0, 800);
      ctx.lineTo(250, 420);
      ctx.lineTo(550, 750);
      ctx.lineTo(850, 360);
      ctx.lineTo(1200, 800);
      ctx.closePath();
      ctx.fillStyle = '#1e1b4b';
      ctx.fill();

      // Foreground lake
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 720, 1200, 80);

      // Label text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('alpine-escape.jpg', 60, 100);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const sampleFile = new File([blob], 'alpine-escape.jpg', { type: 'image/jpeg' });
        addFiles([sampleFile]);
      }, 'image/jpeg', 0.95);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
      {/* Top Navigation Back Link */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all tools</span>
        </Link>

        {files.length === 0 && (
          <button
            onClick={loadSampleImage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 hover:bg-brand-100 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load sample image (Quick test)</span>
          </button>
        )}
      </div>

      {/* Main Header matching Figma */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] tracking-tight">
            Convert your file
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-1">
            A different format, without the fuss.
          </p>
        </div>

        {/* Privacy Pill Tag matching Figma */}
        <div className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 text-xs font-semibold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Your files stay yours</span>
        </div>
      </div>

      {/* Error alert if any */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-between text-xs sm:text-sm text-rose-700 dark:text-rose-300">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={clearError}
            className="text-xs font-bold underline hover:no-underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2-Column Grid matching Figma Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Figma Card 1: 1 Your file) */}
        <div className="lg:col-span-7">
          <FilePreviewCard
            files={files}
            activeFileIndex={activeFileIndex}
            onSelectIndex={setActiveFileIndex}
            onAddFiles={addFiles}
            onRemoveFile={removeFile}
          />
        </div>

        {/* Right Column (Figma Card 2: 2 Make it yours) */}
        <div className="lg:col-span-5">
          <ConversionOptionsCard
            files={files}
            options={options}
            onChangeOptions={setOptions}
            onConvert={startConversion}
            isConverting={isConverting}
          />
        </div>
      </div>

      {/* Bottom Trust & Supported formats matching Figma */}
      <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-3">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Secure transfer. Files are processed locally on device and never leave your browser.
          </span>
        </div>
        <div className="font-medium">
          JPG, PNG, WebP, SVG, GIF, BMP, HEIC & more
        </div>
      </div>

      {/* Overlays */}
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
          onClose={resetResult}
          onConvertAnother={() => {
            resetResult();
            clearFiles();
          }}
        />
      )}
    </div>
  );
};
