/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff8f2',
          100: '#ffeedd',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          accent: '#ea580c',
          hover: '#d44e05',
        },
        surface: {
          light: '#faf7f2',
          card: '#fffbf5',
          dark: '#12100e',
          darkCard: '#1a1614',
          darkBorder: '#2e2620',
        },
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        handwriting: ['Caveat', 'cursive'],
      },
      boxShadow: {
        'material-sm': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.08)',
        'material-md': '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.04)',
        'material-lg': '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.03)',
        'material-xl': '0 20px 25px -5px rgba(0,0,0,0.08), 0 10px 10px -5px rgba(0,0,0,0.02)',
        'figma-card': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 25px rgba(234, 88, 12, 0.35)',
        'warm-card': '0 10px 30px -10px rgba(180, 83, 9, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
