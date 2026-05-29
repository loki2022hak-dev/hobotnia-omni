import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#0a0a0a",
        surfaceCard: "#121212",
        borderDark: "#222222",
        primary: "#E50914",
        primaryHover: "#ff1a26",
        gold: "#FFD700",
        goldDark: "#B8860B",
        textMuted: "#888888",
      }
    }
  },
  plugins: [],
};
export default config;
