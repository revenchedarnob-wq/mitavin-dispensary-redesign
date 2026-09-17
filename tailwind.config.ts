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
        canvas: "var(--bg-canvas)",
        card: "var(--bg-card)",
        whisper: "var(--border-whisper)",
        ink: {
          primary: "var(--ink-primary)",
          muted: "var(--ink-muted)",
          faint: "var(--ink-faint)",
        },
        brand: {
          emerald: "var(--brand-emerald)",
          "emerald-light": "var(--brand-emerald-light)",
          "emerald-subtle": "var(--brand-emerald-subtle)",
          champagne: "var(--brand-champagne)",
          "champagne-light": "var(--brand-champagne-light)",
          "champagne-glow": "var(--brand-champagne-glow)",
        },
        scarcity: {
          crimson: "var(--scarcity-crimson)",
          subtle: "var(--scarcity-subtle)",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Instrument Serif", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        whisper: "0 1px 3px 0 rgba(0, 0, 0, 0.02), 0 1px 2px -1px rgba(0, 0, 0, 0.02)",
        elevation: "0 10px 30px -10px rgba(18, 28, 24, 0.06), 0 4px 6px -2px rgba(18, 28, 24, 0.03)",
        floating: "0 24px 48px -12px rgba(18, 28, 24, 0.12), 0 8px 16px -4px rgba(18, 28, 24, 0.04)",
        glow: "0 0 24px -4px var(--brand-emerald-subtle)",
        gold: "0 0 24px -4px var(--brand-champagne-glow)",
      },
      borderRadius: {
        "2.5xl": "1.25rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "haptic-press": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.97)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "haptic-press": "haptic-press 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-up": "fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-glow": "pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
