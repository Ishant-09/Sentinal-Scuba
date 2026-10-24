/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#070b13',
        surface: {
          DEFAULT: '#0d1527',
          card: '#111c33',
          elevated: '#172442',
          hover: '#1b2b4e',
          active: '#1e325c',
        },
        border: {
          subtle: '#1e293b',
          muted: '#253554',
          highlight: '#38bdf8',
        },
        brand: {
          cyan: '#06b6d4',
          teal: '#14b8a6',
          blue: '#3b82f6',
          electric: '#2563eb',
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
        'card': '12px',
        'inner': '8px',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.25)',
        'glow-blue': '0 0 20px -5px rgba(59, 130, 246, 0.25)',
        'glow-purple': '0 0 20px -5px rgba(139, 92, 246, 0.25)',
        'panel': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
