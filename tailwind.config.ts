import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coy: {
          pink: "#FF3366",
          darkPink: "#E0245E",
          coral: "#FF6B6B",
          purple: "#7928CA",
          bg: "#0B0C10",
          card: "#16181F",
          cardBorder: "#272A36",
          subtle: "#8E95A5",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      animation: {
        "pulse-glow": "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 15px rgba(255, 51, 102, 0.6))" },
          "50%": { opacity: ".85", filter: "drop-shadow(0 0 5px rgba(255, 51, 102, 0.2))" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
