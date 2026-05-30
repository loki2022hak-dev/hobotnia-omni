import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.8s ease-out forwards',
        'fade-in-delayed': 'fadeIn 1s ease-out 1s forwards',
        'quote-line1': 'quoteFadeIn 1.5s ease-out 0.5s forwards',
        'quote-line2': 'quoteFadeIn 1.5s ease-out 2.0s forwards',
        'quote-line3': 'quoteFadeIn 1.5s ease-out 4.0s forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        quoteFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px) filter(blur(5px))' },
          '100%': { opacity: '1', transform: 'translateY(0) filter(blur(0))' },
        }
      },
    },
  },
  plugins: [],
};
export default config;
