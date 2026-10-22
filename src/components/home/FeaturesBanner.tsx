import React from 'react';
import { ShieldCheck, Zap, WifiOff, Infinity as InfinityIcon } from 'lucide-react';

export const FeaturesBanner: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: '100% Privacy Guarantee',
      desc: 'Files are processed directly inside your device memory. Zero bytes are uploaded to any server or cloud.',
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: 'Zero Latency & Instant',
      desc: 'No upload/download waiting times. High throughput processing powered by modern browser execution.',
    },
    {
      icon: <WifiOff className="w-6 h-6 text-blue-500" />,
      title: 'Works Completely Offline',
      desc: 'Installed as a Progressive Web App (PWA). Convert your sensitive files on airplanes, trains, or anywhere.',
    },
    {
      icon: <InfinityIcon className="w-6 h-6 text-purple-500" />,
      title: 'No Limits or Subscriptions',
      desc: 'No arbitrary file size limits, no daily conversion caps, and no watermark on generated PDF files.',
    },
  ];

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-[#fffbf2]/85 dark:bg-[#1a1614]/85 backdrop-blur-md border border-[#edd7c2] dark:border-stone-800 rounded-3xl p-8 sm:p-12 shadow-material-sm">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-['Outfit'] font-bold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100">
            Why Local File Conversion Matters
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600 dark:text-stone-400">
            Traditional online converters upload your personal documents and images to remote servers.
            LocalConvert changes that forever.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white/85 dark:bg-[#12100e]/85 border border-[#ede1d3] dark:border-stone-800 shadow-xs hover:shadow-material-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 flex items-center justify-center mb-4 border border-amber-500/20">
                {f.icon}
              </div>
              <h3 className="font-['Outfit'] font-semibold text-base text-stone-900 dark:text-stone-100">
                {f.title}
              </h3>
              <p className="mt-2 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
