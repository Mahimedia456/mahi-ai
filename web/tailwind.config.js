/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        mahi: {
          accent: "#53f5e7",
          accentText: "#003733",

          bg: "#131313",
          bgPure: "#000000",

          surface: "#131313",
          surfaceLowest: "#0e0e0e",
          surfaceLow: "#1b1b1b",
          surfaceContainer: "#1f1f1f",
          surfaceHigh: "#2a2a2a",
          surfaceHighest: "#353535",

          text: "#e2e2e2",
          textStrong: "#ffffff",
          textMuted: "#bacac7",
          textMuted2: "#859491",

          outline: "#859491",
          outlineVariant: "#3b4a47",
        },
      },
      borderRadius: {
        lg: "8px",
        xl: "12px",
        "3xl": "24px",
        full: "9999px",
      },
      boxShadow: {
        glow: "0 0 40px rgba(83, 245, 231, 0.15)",
      },
    },
  },
  plugins: [],
};