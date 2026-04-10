/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'pulse-red': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.015)' },
        },
        'flash-danger': {
          '0%, 100%': { backgroundColor: 'rgb(254 226 226)' },
          '50%': { backgroundColor: 'rgb(220 38 38 / 0.3)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'bounce-dots': {
          '0%, 80%, 100%': { transform: 'scale(0)', opacity: '0.5' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'pulse-red': 'pulse-red 1.5s ease-in-out infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
        'flash-danger': 'flash-danger 0.8s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-in',
        'shimmer': 'shimmer 1.5s infinite linear',
        'bounce-dot': 'bounce-dots 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
