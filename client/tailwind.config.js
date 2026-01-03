/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        // Light Green + Black Color Palette
        "app-bg": "#F8FBF8",
        "card-surface": "#FFFFFF",
        "border-color": "#E2E8E4",

        "text-primary": "#111111",
        "text-secondary": "#333333",
        "text-muted": "#666666",
        "text-disabled": "#999999",

        // Primary - Light Green / Mint
        primary: {
          DEFAULT: "#22C55E",
          hover: "#16A34A",
          light: "#DCFCE7",
          dark: "#15803D",
        },
        // Secondary - Dark / Black
        secondary: {
          DEFAULT: "#1F2937",
          hover: "#111827",
          light: "#F3F4F6",
        },
        // Warning - Amber
        warning: {
          DEFAULT: "#F59E0B",
          hover: "#D97706",
          light: "#FEF3C7",
        },
        // Success - Green (same as primary for consistency)
        success: {
          DEFAULT: "#22C55E",
          hover: "#16A34A",
          light: "#DCFCE7",
        },
        // Error - Red
        error: {
          DEFAULT: "#EF4444",
          hover: "#DC2626",
          light: "#FEE2E2",
        },
        // Info - Gray
        info: {
          DEFAULT: "#6B7280",
          hover: "#4B5563",
          light: "#F3F4F6",
        },
        // Accent - Emerald
        accent: {
          DEFAULT: "#10B981",
          hover: "#059669",
          light: "#D1FAE5",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
        card: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 20px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
        glow: "0 0 20px rgba(13, 148, 136, 0.25)",
        "glow-success": "0 0 20px rgba(5, 150, 105, 0.25)",
        "glow-warning": "0 0 20px rgba(217, 119, 6, 0.25)",
        "glow-error": "0 0 20px rgba(225, 29, 72, 0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-pattern": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "mesh-gradient":
          "linear-gradient(135deg, #E0F2FE 0%, #EDE9FE 50%, #FCE7F3 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
