import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Paleta del Beni - Selva Amazónica
        selva: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        beni: {
          // Verde selva profunda
          dark:    "#0d2818",
          darker:  "#071a0f",
          // Verde canopy
          forest:  "#1a4a2e",
          deep:    "#2d6a4f",
          medium:  "#40916c",
          light:   "#52b788",
          // Oro tropical (guacamaya, flores)
          gold:    "#f4a11d",
          amber:   "#e8851a",
          // Río Mamoré
          river:   "#1e6b8a",
          water:   "#2980b9",
          // Terracota amazónica
          terra:   "#c74b2a",
          earth:   "#a0522d",
          // Neutros selva
          bark:    "#3d2b1f",
          sand:    "#d4a96a",
          cream:   "#fef3e2",
        },
      },
      fontFamily: {
        heading: ["var(--font-outfit)", "sans-serif"],
        body:    ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "jungle-gradient":
          "linear-gradient(135deg, #071a0f 0%, #0d2818 30%, #1a4a2e 60%, #2d6a4f 100%)",
        "gold-gradient":
          "linear-gradient(135deg, #f4a11d 0%, #e8851a 100%)",
        "river-gradient":
          "linear-gradient(135deg, #1e6b8a 0%, #2980b9 100%)",
        "card-glass":
          "linear-gradient(135deg, rgba(26,74,46,0.6) 0%, rgba(45,106,79,0.4) 100%)",
      },
      boxShadow: {
        "jungle": "0 4px 24px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(82,183,136,0.15)",
        "gold":   "0 0 20px rgba(244,161,29,0.3)",
        "glow":   "0 0 40px rgba(82,183,136,0.2)",
      },
      animation: {
        "float":      "float 6s ease-in-out infinite",
        "shimmer":    "shimmer 2s linear infinite",
        "fade-in":    "fadeIn 0.5s ease-in-out",
        "slide-up":   "slideUp 0.4s ease-out",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(244,161,29,0.4)" },
          "50%":      { boxShadow: "0 0 0 8px rgba(244,161,29,0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
