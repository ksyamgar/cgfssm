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
        cg: {
          navy: '#0A2540',
          navyLight: '#0F3860',
          ink: '#061826',
          darkSurface: '#051b2c',
          panel: 'rgba(10, 37, 64, 0.85)',
          teal: '#0D9488',
          tealDark: '#0F766E',
          tealLight: '#14B8A6',
          cyan: '#0284C7',
          cyanDark: '#0369A1',
          amber: '#D97706',
          amberLight: '#F59E0B',
          red: '#DC2626',
          green: '#15803D',
          greenLight: '#16A34A',
          violet: '#7C3AED',
          lightBg: '#F8FAFC',
          lightCard: '#FFFFFF',
          textDark: '#F8FAFC',
          textDarkMuted: '#94A3B8',
          textLight: '#0F172A',
          textLightMuted: '#475569',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        hindi: ['"Noto Sans Devanagari"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'clean': '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'clean-md': '0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
        'clean-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
        'glass-glow': '0 8px 30px rgba(13, 148, 136, 0.16)',
        'glass-dark': '0 8px 32px rgba(2, 20, 35, 0.45)',
        'glass-light': '0 4px 20px rgba(15, 41, 66, 0.06)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
