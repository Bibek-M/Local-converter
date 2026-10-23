import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center justify-center mx-auto mb-4 text-brand-600 dark:text-brand-400">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold font-['Outfit'] text-slate-900 dark:text-white mb-2">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        The conversion tool or page you are looking for doesn't exist or has moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to All Tools</span>
      </Link>
    </div>
  );
};
