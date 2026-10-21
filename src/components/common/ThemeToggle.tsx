import React from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import { FiSun, FiMoon } from 'react-icons/fi';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="relative flex items-center justify-between w-14 h-7 px-1.5 rounded-full bg-black/15 dark:bg-white/10 backdrop-blur-md border border-stone-200/40 dark:border-stone-700/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50 shadow-inner group cursor-pointer"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <FiSun className={`w-3.5 h-3.5 transition-colors duration-200 ${!isDark ? 'text-amber-500' : 'text-stone-400'}`} />
      <FiMoon className={`w-3.5 h-3.5 transition-colors duration-200 ${isDark ? 'text-amber-300' : 'text-stone-400'}`} />
      <span
        className={`absolute top-0.5 w-6 h-6 rounded-full bg-white dark:bg-stone-800 shadow-md border border-stone-200/60 dark:border-stone-700 flex items-center justify-center transition-transform duration-300 ease-out ${
          isDark ? 'left-7' : 'left-0.5'
        }`}
      >
        {isDark ? (
          <FiMoon className="w-3 h-3 text-amber-300" />
        ) : (
          <FiSun className="w-3 h-3 text-amber-500" />
        )}
      </span>
    </button>
  );
};
