import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Select or Drop Files',
      desc: 'When you select an image or document, the browser’s File API loads the raw binary directly into your device’s local memory (RAM). Nothing is transmitted over the network.',
    },
    {
      num: '02',
      title: 'Client-Side Processing Engine',
      desc: 'LocalConvert runs optimized TypeScript algorithms, HTML5 Canvas rasterization, and PDF-Lib rendering in the browser tab. All compression and page formatting happen directly on your CPU/GPU.',
    },
    {
      num: '03',
      title: 'Instant In-Memory Generation',
      desc: 'A binary Blob (e.g. PDF or WebP) is assembled in browser memory and delivered as an instant download link without queuing or waiting for external cloud renders.',
    },
  ];

  return (
    <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mb-4">
          Under The Hood
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
          How Local Conversion Works
        </h1>
        <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
          Traditional online file converters force you to upload sensitive documents to their servers.
          LocalConvert processes everything locally inside your browser sandbox.
        </p>
      </div>

      {/* 3 Step Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {steps.map((s, i) => (
          <div
            key={i}
            className="p-6 rounded-3xl bg-white dark:bg-[#151824] border border-slate-200/90 dark:border-slate-800/90 shadow-sm relative overflow-hidden"
          >
            <span className="text-4xl font-extrabold text-brand-500/20 dark:text-brand-400/10 font-['Outfit'] absolute top-4 right-4">
              {s.num}
            </span>
            <h3 className="font-['Outfit'] font-bold text-lg text-slate-900 dark:text-white mb-2">
              {s.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {s.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Technical Comparison Table */}
      <div className="bg-white dark:bg-[#151824] rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-8 shadow-sm mb-16">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Outfit'] mb-6">
          Cloud Converters vs. LocalConvert
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold uppercase text-slate-400">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4 text-rose-500">Traditional Online Converters</th>
                <th className="py-3 px-4 text-brand-600 dark:text-brand-400">LocalConvert (Offline PWA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs sm:text-sm">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">Data Privacy</td>
                <td className="py-3.5 px-4 text-slate-500">Uploaded to third-party servers</td>
                <td className="py-3.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  100% Never leaves your device
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">Offline Capability</td>
                <td className="py-3.5 px-4 text-slate-500">Fails without internet connection</td>
                <td className="py-3.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Fully functional offline via PWA
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">Speed / Latency</td>
                <td className="py-3.5 px-4 text-slate-500">Slow upload + server queue + download</td>
                <td className="py-3.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Instant device RAM execution
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">File Limits & Paywalls</td>
                <td className="py-3.5 px-4 text-slate-500">Size caps, daily quotas, watermarks</td>
                <td className="py-3.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Completely free & unlimited
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          to="/convert/image-to-pdf"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm sm:text-base shadow-material-md transition-all hover:scale-105 active:scale-95"
        >
          <span>Try Image to PDF Converter Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
