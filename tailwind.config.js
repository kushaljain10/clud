/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b0b0d',
        panel: '#121316',
        border: '#1d1f24',
        soft: '#a3a3a3',
        accent: {
          DEFAULT: '#8b5cf6',
          hover: '#7c3aed',
        },
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0,0,0,0.35)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      fontFamily: {
        ui: ['system-ui', 'Inter', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 260ms ease-out',
        pulseSoft: 'pulseSoft 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};