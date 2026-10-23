import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  // Check localStorage or default to false (Light mode by default as requested)
  const savedTheme = localStorage.getItem('localconvert_theme');
  const initialDark = savedTheme === 'dark';

  if (initialDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  return {
    isDark: initialDark,
    toggleTheme: () =>
      set((state) => {
        const next = !state.isDark;
        if (next) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('localconvert_theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('localconvert_theme', 'light');
        }
        return { isDark: next };
      }),
    setTheme: (isDark: boolean) => {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('localconvert_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('localconvert_theme', 'light');
      }
      set({ isDark });
    },
  };
});
