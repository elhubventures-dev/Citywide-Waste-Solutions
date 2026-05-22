/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");

// Logo: navy (#1E3A5C) + forest green (#2E9B4A)
const brand = {
  navy: "#1E3A5C",
  green: "#2E9B4A",
};

module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
    "./sanity/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // ─── Brand Color System ───────────────────────────────────────
      colors: {
        brand: {
          navy:  brand.navy,
          green: brand.green,
        },
        // Primary — logo forest green ("WIDE")
        green: {
          50:  "#edf7f0",
          100: "#d4edda",
          200: "#a9dab5",
          300: "#6fc486",
          400: "#45b06a",
          500: brand.green,
          600: "#268040",
          700: "#1F7A38",
          800: "#18592c",
          900: "#0f3a1d",
          950: "#071f10",
        },
        // Secondary — logo navy ("CITY")
        blue: {
          50:  "#eef3f8",
          100: "#d4e3ef",
          200: "#a9c7df",
          300: "#6fa3c8",
          400: "#4585b0",
          500: brand.navy,
          600: "#183149",
          700: "#152E47",
          800: "#0f2236",
          900: "#0a1624",
          950: "#050b12",
        },
        // Accent — Earth Tone
        earth: {
          50:  "#f8f2ee",
          100: "#eeddd4",
          200: "#dcbaa9",
          300: "#c48f75",
          400: "#a86348",
          500: "#6B4226", // brand earth
          600: "#573520",
          700: "#422818",
          800: "#2c1b10",
          900: "#160d08",
          950: "#0b0704",
        },
        // Neutrals
        gray: {
          50:  "#f8faf9",
          100: "#e8edea",
          200: "#d0d9d4",
          300: "#adbdb5",
          400: "#849d93",
          500: "#637d73",
          600: "#4e635b",
          700: "#3b4d45",
          800: "#273631",
          900: "#141c18",
          950: "#0a0e0c",
        },
        // Semantic
        success: brand.green,
        warning: "#d97706",
        error:   "#dc2626",
        info:    brand.navy,
        // Aliases used by shadcn/ui
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        card:        { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover:     { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary:     { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary:   { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted:       { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent:      { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },

      // ─── Typography ────────────────────────────────────────────────
      fontFamily: {
        sans:    ["var(--font-plus-jakarta)", ...fontFamily.sans],
        heading: ["var(--font-plus-jakarta)", ...fontFamily.sans],
        mono:    ["var(--font-jetbrains-mono)", ...fontFamily.mono],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
        xs:    ["0.75rem",  { lineHeight: "1rem" }],
        sm:    ["0.875rem", { lineHeight: "1.25rem" }],
        base:  ["1rem",     { lineHeight: "1.625rem" }],
        lg:    ["1.125rem", { lineHeight: "1.75rem" }],
        xl:    ["1.25rem",  { lineHeight: "1.875rem" }],
        "2xl": ["1.5rem",   { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.375rem" }],
        "4xl": ["2.25rem",  { lineHeight: "2.75rem" }],
        "5xl": ["3rem",     { lineHeight: "1.2" }],
        "6xl": ["3.75rem",  { lineHeight: "1.1" }],
        "7xl": ["4.5rem",   { lineHeight: "1.05" }],
        "8xl": ["6rem",     { lineHeight: "1" }],
      },

      // ─── Spacing ───────────────────────────────────────────────────
      spacing: {
        "4.5":  "1.125rem",
        "13":   "3.25rem",
        "15":   "3.75rem",
        "18":   "4.5rem",
        "22":   "5.5rem",
        "26":   "6.5rem",
        "30":   "7.5rem",
        "34":   "8.5rem",
        "section":  "6rem",
        "section-sm": "3rem",
        "section-lg": "9rem",
      },

      // ─── Container ─────────────────────────────────────────────────
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2rem",
          xl: "2rem",
          "2xl": "2rem",
        },
        screens: {
          sm:   "640px",
          md:   "768px",
          lg:   "1024px",
          xl:   "1280px",
          "2xl": "1440px",
        },
      },

      // ─── Border Radius ─────────────────────────────────────────────
      borderRadius: {
        none: "0",
        sm:   "0.25rem",
        DEFAULT: "0.375rem",
        md:   "0.5rem",
        lg:   "0.75rem",
        xl:   "1rem",
        "2xl":"1.5rem",
        "3xl":"2rem",
        full: "9999px",
      },

      // ─── Shadows ───────────────────────────────────────────────────
      boxShadow: {
        sm:    "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT:"0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md:    "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)",
        lg:    "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)",
        xl:    "0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.08)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.15)",
        green: "0 4px 24px -4px rgb(46 155 74 / 0.28)",
        blue:  "0 4px 24px -4px rgb(30 58 92 / 0.28)",
        card:  "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        "card-hover": "0 8px 24px -4px rgb(0 0 0 / 0.12)",
        none: "none",
      },

      // ─── Animations ────────────────────────────────────────────────
      keyframes: {
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          "0%":   { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%":   { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%":   { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "count-up": {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-green": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgb(46 155 74 / 0.4)" },
          "70%":      { boxShadow: "0 0 0 10px rgb(46 155 74 / 0)" },
        },
        "ticker": {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-18px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%":      { transform: "translateY(-12px) scale(1.02)" },
        },
      },
      animation: {
        "fade-in":       "fade-in 0.4s ease-out both",
        "fade-in-up":    "fade-in-up 0.5s ease-out both",
        "fade-in-down":  "fade-in-down 0.4s ease-out both",
        "slide-in-left": "slide-in-left 0.5s ease-out both",
        "slide-in-right":"slide-in-right 0.5s ease-out both",
        "scale-in":      "scale-in 0.3s ease-out both",
        "shimmer":       "shimmer 2s infinite linear",
        "pulse-green":   "pulse-green 2s infinite",
        "ticker":        "ticker 30s linear infinite",
        float:           "float 8s ease-in-out infinite",
        "float-slow":    "float-slow 12s ease-in-out infinite",
      },

      // ─── Background patterns ────────────────────────────────────────
      backgroundImage: {
        "hero-gradient":    `linear-gradient(135deg, ${brand.green} 0%, ${brand.navy} 100%)`,
        "green-gradient":   `linear-gradient(135deg, ${brand.green} 0%, #1F7A38 100%)`,
        "blue-gradient":    `linear-gradient(135deg, ${brand.navy} 0%, #152E47 100%)`,
        "earth-gradient":   "linear-gradient(135deg, #6B4226 0%, #422818 100%)",
        "card-gradient":    "linear-gradient(145deg, #ffffff 0%, #f8faf9 100%)",
        "section-gradient": "linear-gradient(180deg, #f8faf9 0%, #ffffff 100%)",
        "dot-pattern":      "radial-gradient(circle, #d0d9d4 1px, transparent 1px)",
        "leaf-pattern":     "url('/images/leaf-pattern.svg')",
      },

      // ─── Transitions ────────────────────────────────────────────────
      transitionTimingFunction: {
        "bounce-sm": "cubic-bezier(0.34, 1.36, 0.64, 1)",
        "smooth":    "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        "250": "250ms",
        "350": "350ms",
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
      },

      // ─── Screens ───────────────────────────────────────────────────
      screens: {
        xs:   "375px",
        sm:   "640px",
        md:   "768px",
        lg:   "1024px",
        xl:   "1280px",
        "2xl":"1440px",
        "3xl":"1920px",
      },

      // ─── Z-index ───────────────────────────────────────────────────
      zIndex: {
        "0":   0,
        "10":  10,
        "20":  20,
        "30":  30,
        "40":  40,
        "50":  50,
        "nav": 100,
        "modal": 200,
        "toast": 300,
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};
