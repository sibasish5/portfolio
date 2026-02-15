/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7' },
        accent: { 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed' },
        dark: { 100: '#1e293b', 200: '#0f172a', 300: '#020617' }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
        glow: { '0%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)' }, '100%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' } }
      }
    }
  },
  plugins: []
}