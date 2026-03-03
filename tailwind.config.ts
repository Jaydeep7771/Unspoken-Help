import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7C8CF8",
        secondary: "#A3E7D8",
        muted: "#F5F5FA"
      }
    }
  },
  plugins: []
};

export default config;
