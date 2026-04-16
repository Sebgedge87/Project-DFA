/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'dfa-red':            '#8B1A1A',
        'dfa-red-bright':     '#C41E1E',
        'dfa-black':          '#0D0D0D',
        'dfa-surface':        '#1A1A1A',
        'dfa-surface-raised': '#222222',
        'dfa-border':         '#3A1A1A',
        'dfa-text':           '#F0EDE8',
        'dfa-text-muted':     '#9A8A80',
        'dfa-gold':           '#C4943A',
      },
      fontFamily: {
        display: ['Barlow Condensed', 'sans-serif'],
        body:    ['IBM Plex Sans', 'sans-serif'],
        mono:    ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
