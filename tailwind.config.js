/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F2F0EB',
        surface: '#E9E5DB',
        ink: '#0C0C0A',
        fadedink: '#6E6A61',
        saffron: '#FF3E00',
        moss: '#00E05A',
        brass: '#FFAA00',
        rosewood: '#FF3E00',
      },
      fontFamily: {
        sans: ['"JetBrains Mono"', 'monospace'],
        mono: ['"JetBrains Mono"', 'monospace'],
        serif: ['"Space Grotesk"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        malayalam: ['"Anek Malayalam"', 'sans-serif'],
      },
      /* Brutalist: zero radii everywhere */
      borderRadius: {
        none: '0px',
        sm: '0px',
        DEFAULT: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '0px',
      },
      boxShadow: {
        editorial: '6px 6px 0 0 var(--ink, #0C0C0A)',
        lg: '6px 6px 0 0 var(--ink, #0C0C0A)',
        hard: '8px 8px 0 0 #0C0C0A',
        'hard-orange': '8px 8px 0 0 #FF3E00',
      },
      maxWidth: {
        magazine: '1440px',
      },
    },
  },
  plugins: [],
};