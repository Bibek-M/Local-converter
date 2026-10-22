import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cpu, WifiOff } from 'lucide-react';
import appLogo from '../assets/applogo.webp';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#edd7c2] dark:border-stone-800/80 bg-[#fffbf2]/85 dark:bg-[#12100e]/85 backdrop-blur-md transition-colors mt-auto py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <img src={appLogo} alt="LocalConvert logo" className="w-8 h-8 object-contain drop-shadow-xs" />
              <span className="font-['Outfit'] font-bold text-lg text-stone-900 dark:text-stone-100">
                Local<span className="text-brand-500">Convert</span>
              </span>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400 max-w-md leading-relaxed">
              Fast, high-fidelity file conversion that runs 100% locally on your computer or mobile device.
              Zero network latency, zero tracking, and no file size limits.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Client-Side</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800/40">
                <WifiOff className="w-3.5 h-3.5" />
                <span>Works Completely Offline</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800/40">
                <Cpu className="w-3.5 h-3.5" />
                <span>Device CPU/GPU Powered</span>
              </div>
            </div>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
              Popular Tools
            </h4>
            <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
              <li>
                <Link to="/images" className="hover:text-brand-500 transition-colors font-medium">
                  Image Conversion Hub →
                </Link>
              </li>
              <li>
                <Link to="/convert/image-to-pdf" className="hover:text-brand-500 transition-colors">
                  Image to PDF
                </Link>
              </li>
              <li>
                <Link to="/cbz" className="hover:text-brand-500 transition-colors font-medium">
                  CBZ Comic Converter →
                </Link>
              </li>
              <li>
                <Link to="/convert/image-to-webp" className="hover:text-brand-500 transition-colors">
                  Convert to WebP
                </Link>
              </li>
              <li>
                <Link to="/convert/image-to-png" className="hover:text-brand-500 transition-colors">
                  Convert to PNG
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology & Privacy */}
          <div>
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
              Security Guarantee
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Your files never leave your browser memory. We do not maintain any servers, databases, or logging endpoints.
              All operations are sandbox-isolated in your browser tab.
            </p>
            <div className="mt-3">
              <Link to="/how-it-works" className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline">
                Read technical architecture →
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#edd7c2] dark:border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 dark:text-stone-400 gap-3">
          <p>© {new Date().getFullYear()} LocalConvert. Built with React, TypeScript & Bun.</p>
          <p className="flex items-center gap-1">
            Engineered for high performance and total data sovereignty.
          </p>
        </div>
      </div>
    </footer>
  );
};
