import React from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';

interface ProgressOverlayProps {
  progress: number;
  statusText: string;
}

export const ProgressOverlay: React.FC<ProgressOverlayProps> = ({ progress, statusText }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#151824] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
        {/* Animated Icon */}
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center justify-center mx-auto mb-5 text-brand-600 dark:text-brand-400">
          <Cpu className="w-8 h-8 animate-pulse" />
        </div>

        <h3 className="font-['Outfit'] font-bold text-xl text-slate-900 dark:text-white mb-1">
          Converting locally on device
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 min-h-[20px]">
          {statusText || 'Executing client-side algorithm...'}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 mb-3 overflow-hidden p-0.5">
          <div
            className="bg-brand-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-6">
          <span>Local processing</span>
          <span className="font-bold text-brand-600 dark:text-brand-400">{progress}%</span>
        </div>

        {/* Privacy Note */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 py-2 px-3 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Zero cloud uploads · 100% private in browser</span>
        </div>
      </div>
    </div>
  );
};
