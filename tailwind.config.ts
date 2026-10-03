import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        stage: {
          50: "#f5f6fa",
          100: "#ebeef5",
          200: "#d3d9e8",
          300: "#aeb9d5",
          400: "#8192be",
          500: "#5e70a6",
          600: "#49578c",
          700: "#3c4672",
          800: "#1a1c2b",
          900: "#10111a",
          950: "#08090f"
        },
        neon: {
          purple: "#c084fc",
          pink: "#f43f5e",
          cyan: "#06b6d4",
          amber: "#fbbf24",
          emerald: "#10b981"
        }
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(192, 132, 252, 0.35)",
        "glow-cyan": "0 0 25px -5px rgba(6, 182, 212, 0.35)",
        "glow-pink": "0 0 25px -5px rgba(244, 63, 94, 0.35)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.5)"
      }
    }
  },
  plugins: []
};

export default config;
