
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        fitbud: {
          primary: '#000000', // Pure Black
          secondary: '#333333', // Dark Gray
          accent: '#666666', // Mid Gray
          light: '#F5F5F5', // Very Light Gray
          dark: '#000000', // Black
        },
        background: {
          DEFAULT: '#FFFFFF', // White
          foreground: '#000000' // Black
        },
        border: {
          DEFAULT: '#E0E0E0' // Light Gray Border
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'minimal': '0 1px 3px rgba(0,0,0,0.1)', // Subtle shadow
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

