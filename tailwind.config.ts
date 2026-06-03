import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#030611",
        navy: "#071227",
        cyan: "#4de8ff",
        violet: "#a277ff",
        pink: "#ff7dd6",
      },
      boxShadow: {
        neon: "0 0 24px rgba(77, 232, 255, 0.22)",
        violet: "0 0 28px rgba(162, 119, 255, 0.24)",
      },
    },
  },
  plugins: [],
};

export default config;
