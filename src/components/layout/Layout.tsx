import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import mainBg from '../assets/mainBG.webp';

export const Layout: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#faf7f2] dark:bg-[#12100e] text-stone-800 dark:text-stone-100 transition-colors duration-200 selection:bg-brand-500/20 selection:text-brand-900 overflow-x-hidden">
      {/* Scenic Background art from reference */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-top from-[#faf7f2]/10 via-[#faf7f2]/50 to-[#faf7f2] bg-no-repeat bg-cover opacity-85 dark:opacity-25 transition-opacity"
        style={{ backgroundImage: `url(${mainBg})` }}
      >
        {/* Soft bottom blend into the warm page palette for the tools section below */}
        <div className="absolute inset-0 bg-gradient-to-b  dark:from-[#12100e]/30 dark:via-[#12100e]/75 dark:to-[#12100e]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};
