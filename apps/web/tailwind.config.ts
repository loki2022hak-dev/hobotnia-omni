import type { Config } from 'tailwindcss';
export default {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080A0F',
        panel: '#111520',
        line: '#242A3A',
        brand: '#32D6A1',
        accent: '#F4C95D'
      }
    }
  },
  plugins: []
} satisfies Config;
