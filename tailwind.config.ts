import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'bg-base': '#09090E',
        'bg-surface': '#101016',
        'bg-elevated': '#18181F',
        // Borders
        'border-subtle': '#222230',
        'border-default': '#2E2E3E',
        // Text
        'text-primary': '#EDEDF2',
        'text-secondary': '#7E7E96',
        'text-muted': '#52526A',
        // Accents
        'accent-primary': '#4F46E5',
        'accent-warm': '#E8A844',
        'accent-confirm': '#22C55E',
        // Legacy aliases for gradual migration
        cyber: {
          black: '#09090E',
          darker: '#101016',
          dark: '#18181F',
          cyan: '#4F46E5',
          orange: '#E8A844',
          purple: '#4F46E5',
          green: '#22C55E',
          pink: '#E8A844',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        ui: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'glitch': 'glitch 0.3s ease-in-out infinite',
        'scan': 'scan 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'ticker': 'ticker 30s linear infinite',
        'decrypt': 'decrypt 0.5s steps(10) forwards',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(79, 70, 229, 0.15)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(79, 70, 229, 0.25)',
            transform: 'scale(1.01)'
          },
        },
        'glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-1px, 1px)' },
          '40%': { transform: 'translate(-1px, -1px)' },
          '60%': { transform: 'translate(1px, 1px)' },
          '80%': { transform: 'translate(1px, -1px)' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.01)', opacity: '1' },
        },
        'ticker': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'decrypt': {
          '0%': { opacity: '0', filter: 'blur(4px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 40% at 50% -10%, rgba(79, 70, 229, 0.12), transparent)',
      },
    },
  },
  plugins: [],
};

export default config;
