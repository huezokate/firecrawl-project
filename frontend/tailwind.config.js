/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#00ff88",
        surface: "#1a1a1a",
        base: "#0a0a0a",
      },
    },
  },
  plugins: [],
}

