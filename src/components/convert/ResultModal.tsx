import React from 'react';
import {
  Download,
  ExternalLink,
  CheckCircle2,
  FileCheck,
  RotateCcw,
  ShieldCheck,
  X,
} from 'lucide-react';

interface ResultModalProps {
  filename: string;
  blob: Blob;
  url: string;
  onClose: () => void;
  onConvertAnother: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  filename,
  blob,
  url,
  onClose,
  onConvertAnother,
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenPreview = () => {
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#151824] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto mb-4 text-emerald-500 shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h3 className="font-['Outfit'] font-bold text-2xl text-slate-900 dark:text-white">
            Conversion Complete!
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Your file was converted locally with 100% privacy.
          </p>
        </div>

        {/* File Result Info Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#191d2c] border border-slate-200/80 dark:border-slate-800/80 mb-6 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>
          <div className="truncate flex-1">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
              {filename}
            </h4>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              <span>{blob.type || 'Document'}</span>
              <span>•</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {formatFileSize(blob.size)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 mb-6">
          <button
            onClick={handleDownload}
            className="w-full py-3.5 px-5 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-material-md shadow-brand-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download {filename.endsWith('.pdf') ? 'PDF Document' : 'File'}</span>
          </button>

          <button
            onClick={handleOpenPreview}
            className="w-full py-3 px-5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Preview in Browser Tab</span>
          </button>
        </div>

        {/* Convert Another File */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={onConvertAnother}
            className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-semibold hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Convert another file</span>
          </button>

          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Processed on device</span>
          </div>
        </div>
      </div>
    </div>
  );
};
