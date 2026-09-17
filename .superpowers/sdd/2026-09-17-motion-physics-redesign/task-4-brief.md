# Task 4 Brief: Interactive 3D Gyro Provenance Bento Grid with 1-Click Batch Verifier

## Context & Role
You are the Implementer Subagent for Task 4 of the Mitavin Motion & Physics Redesign.
Your job is to build `src/components/ProvenanceBento.tsx` and integrate it into `src/app/page.tsx` replacing the static provenance section.

## Global Constraints
- Strictly animate GPU compositor properties (`transform: translate3d(...)`, `opacity`, `rotateX`, `rotateY`).
- Mobile touch devices must bypass mouse tilt listeners to ensure 120 FPS thumb scrolling.
- Pure Atelier-Tech / Vercel dark tokens for the Bento section (`bg-zinc-950`, `border-zinc-800`, `text-zinc-100`, `#10B981` emerald accent).
- SSR hydration safety (`use client`, `mounted` guard or client boundary).

## Files to Touch
- Create: `src/components/ProvenanceBento.tsx`
- Modify: `src/app/page.tsx`

## Interfaces & Imports
- `triggerSpark` from `@/components/ClickSpark`
- `playHapticGlass`, `playHapticClick`, `playHapticPop` from `@/lib/sound`
- Lucide icons: `ShieldCheck`, `ThermometerSnowflake`, `Plane`, `Truck`, `Barcode`, `CheckCircle2`, `Activity`, `Sparkles`, `Clock`, `ArrowUpRight`

## Requirements & Implementation Details

### 1. Structure of `src/components/ProvenanceBento.tsx`
Render a modern luxury dark Bento grid (`bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl`):
- **Header Block**:
  - Badge: `THE MITAVIN PROVENANCE STANDARD` with emerald live pulse beacon.
  - Headline: `100% Laboratory Sourced. Zero Sea Freight Heat Exposure.`
  - Editorial description highlighting direct airfreight cold chain integrity vs 45-day sea cargo heat degradation.

- **4-Card Bento Grid Layout (`grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 pt-4`)**:

  1. **Tile 1 (Cold-Chain Telemetry)** — `md:col-span-7` or `md:col-span-6`:
     - Accent: Emerald (`#10B981`).
     - Badge: `ACTIVE SENSOR TELEMETRY • LOT 94820`
     - Headline: `Continuous 2°C – 8°C Cryo Monitoring`
     - Live SVG temperature telemetry wave graph animating smoothly with key points (`4.2°C` stable line, green glow filter, coordinate stamps).
     - Status readout: `Current Pod Temp: 4.2°C [STABLE] • Deviation: 0.0°C`.

  2. **Tile 2 (Direct Air-Freight Priority)** — `md:col-span-5` or `md:col-span-6`:
     - Accent: Cyan / Sky Blue (`#06B6D4`).
     - Badge: `AIR TRANSIT NODE`
     - Headline: `<48h Heathrow ➔ Dhaka Air Bridge`
     - Route visualization: `LHR (London Heathrow)` with scheduled departure stamp $\to$ flight path vector with jet icon $\to$ `DAC (Hazrat Shahjalal Int'l)` with priority clearance stamp.
     - Telemetry stats: `Transit Duration: 38h 14m` • `Zero Marine Hold Heat Exposure`.

  3. **Tile 3 (1-Click Sample Batch Verifier & 10x Guarantee)** — `md:col-span-7`:
     - Accent: Amber / Emerald (`#F59E0B` to `#10B981`).
     - Badge: `FACTORY SERIAL TRACEABILITY`
     - Headline: `Instant Lot Authenticity Cryptographic Verification`
     - Interactive Verification Box:
       - Sample Batch Pill: `#LHR-94820-UK (Aptamil Gold+ Stage 1)`
       - Interactive button: `[ Run Live Verification Scan ]`
       - When clicked:
         - Fires `playHapticGlass(0.08)`.
         - Shows scanning state (600ms animated laser line or shimmer).
         - Triggers `triggerSpark(e.clientX, e.clientY, '#10B981')`.
         - Resolves to: `✓ UK NHS LOT VERIFIED • 100% Hermetic Seal Passed • Tamper Flag: ZERO`.
       - Footnote: `10x Money-Back Guarantee backed by independent laboratory chromatography.`

  4. **Tile 4 (Dhaka Express Climate-Insulated Dispatch)** — `md:col-span-5`:
     - Accent: Emerald / Indigo (`#10B981`).
     - Badge: `LAST-MILE LOGISTICS`
     - Headline: `Sub-4-Hour Temperature Shielded Couriers`
     - Insulated climate pod telemetry: Gulshan, Banani, Dhanmondi, Uttara coverage indicator.
     - Pulsing dispatch beacon with real-time dispatcher queue telemetry (`Average Metro ETA: 142 mins`).

### 2. Micro-Physics & Gyro Tilt on Bento Tiles
- Add subtle 3D perspective (`perspective: 1000px`, spring-smoothed `rotateX` and `rotateY` within $\pm 3^\circ$) on hover for desktop.
- On mobile/touch, bypass tilt listeners cleanly.
- Add subtle cursor specular sheen or subtle linear gradient border sweep.

### 3. Replace Old Section in `src/app/page.tsx`
- Import `<ProvenanceBento />` in `src/app/page.tsx`.
- Replace the old static Section 5 (lines 128-216) with `<ProvenanceBento />`.

### 4. Verification & Commit
- Run `npx tsc --noEmit`. Ensure 0 errors.
- Stage files and commit: `feat(bento): interactive 3D gyro provenance bento grid with 1-click batch verifier`.
- Write report to `a:\Website\.superpowers\sdd\2026-09-17-motion-physics-redesign\task-4-report.md`.
- Generate review package to `a:\Website\.superpowers\sdd\2026-09-17-motion-physics-redesign\task-4-review-package.md`.
