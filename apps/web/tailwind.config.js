/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // These two use CSS vars so theme switching works, including opacity variants (bg-dfa-red/10 etc.)
        'dfa-red':            'rgb(var(--dfa-red-rgb) / <alpha-value>)',
        'dfa-red-bright':     'rgb(var(--dfa-red-bright-rgb) / <alpha-value>)',
        // Remaining colors reference CSS vars for inline-style theming
        'dfa-black':          'var(--dfa-black)',
        'dfa-surface':        'var(--dfa-surface)',
        'dfa-surface-raised': 'var(--dfa-surface-raised)',
        'dfa-border':         'var(--dfa-border)',
        'dfa-text':           'var(--dfa-text)',
        'dfa-text-muted':     'var(--dfa-text-muted)',
        'dfa-gold':           'var(--dfa-gold)',
        'dfa-border-neutral': 'var(--dfa-border-neutral)',
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
