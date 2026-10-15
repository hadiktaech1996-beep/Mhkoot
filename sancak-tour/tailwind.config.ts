import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        olive: { DEFAULT: "#A8B75A", 600: "#8E9E43", 700: "#728032" },
        forest: { DEFAULT: "#213D32", 700: "#1A3128", 800: "#12251D", 900: "#0C1914" },
        gold: { DEFAULT: "#D6B977", 600: "#BF9F57", 700: "#9C7F3E" },
        ivory: { DEFAULT: "#F8F6EF", 200: "#EFEBDD", 300: "#E3DDC8" },
        charcoal: { DEFAULT: "#17212B", 500: "#46525E", 400: "#66727E" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Cormorant Garamond", "Cairo Variable", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter Variable", "Cairo Variable", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(23,33,43,.06), 0 12px 32px -12px rgba(23,33,43,.22)",
        lift: "0 2px 4px rgba(23,33,43,.08), 0 28px 48px -16px rgba(23,33,43,.35)",
      },
      keyframes: {
        drift: { "0%,100%": { transform: "scale(1.06) translate3d(0,0,0)" }, "50%": { transform: "scale(1.12) translate3d(-1.5%,-1%,0)" } },
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
      },
      animation: { drift: "drift 28s ease-in-out infinite", floaty: "floaty 5s ease-in-out infinite" },
    },
  },
  plugins: [],
};
export default config;
