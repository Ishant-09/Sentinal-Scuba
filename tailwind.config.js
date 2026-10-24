/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0d14',
        surface: {
          DEFAULT: '#0f141f',
          card: '#131926',
          elevated: '#171f30',
          hover: '#1b2438',
          active: '#1f2a40',
        },
        border: {
          subtle: '#1a2233',
          muted: '#222d42',
          highlight: '#38bdf8',
        },
        brand: {
          cyan: '#14b8a6', // soothing study teal
          teal: '#0d9488',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          amber: '#f59e0b',
          rose: '#f43f5e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        'card': '10px',
        'inner': '6px',
      },
      boxShadow: {
        'panel': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
        'subtle': '0 2px 8px -2px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}
