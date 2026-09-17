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
        canvas: "#FFFFFF",
        "canvas-soft": "#FAFAFA",
        "canvas-soft-2": "#F5F5F5",
        card: "#FFFFFF",
        hairline: "#E5E7EB",
        "hairline-strong": "#A1A1AA",
        whisper: "#E5E7EB",
        ink: {
          primary: "#171717",
          muted: "#737373",
          faint: "#A1A1AA",
        },
        brand: {
          emerald: "#10B981",
          "emerald-light": "#ECFDF5",
          "emerald-subtle": "#F0FDF4",
          blue: "#0070F3",
          "blue-light": "#EFF6FF",
          champagne: "#D97706",
          dark: "#171717",
        },
        scarcity: {
          crimson: "#EF4444",
          subtle: "#FEF2F2",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Geist", "Inter", "-apple-system", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        hairline: "0 0 0 1px #E5E7EB",
        subtle: "0 1px 2px rgba(0, 0, 0, 0.04), 0 0 0 1px #E5E7EB",
        elevation: "0 4px 12px -2px rgba(0, 0, 0, 0.06), 0 0 0 1px #E5E7EB",
        hover: "0 8px 24px -4px rgba(0, 0, 0, 0.08), 0 0 0 1px #D4D4D8",
        floating: "0 16px 36px -4px rgba(0, 0, 0, 0.12), 0 0 0 1px #E5E7EB",
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
        pill: "100px",
      },
      keyframes: {
        "haptic-press": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.97)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseBeacon: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.3)", opacity: "0.6" },
        },
      },
      animation: {
        "haptic-press": "haptic-press 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-up": "fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-beacon": "pulseBeacon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
