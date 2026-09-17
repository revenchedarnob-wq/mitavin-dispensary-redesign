# Task 2 Brief: Hero Dual-Axis Scissor & 3D Floating Sculpture Swapper

## Context & Role
You are the Implementer Subagent for Task 2 of the Mitavin Motion & Physics Redesign.
Your job is to overhaul `src/components/HeroBanner.tsx` to implement dual-axis kinetic scroll typography and the 3-Pillar 3D Floating Sculpture Swapper.

## Global Constraints
- Strictly animate GPU compositor properties (`transform: translate3d`, `opacity`, matrix3d).
- Zero layout reflow properties (`width`, `height`, `margin`) on scroll.
- Mobile text scissoring must be clamped to $\pm 25\text{px}$ inside an `overflow-hidden` container to prevent mobile horizontal scroll jitter.
- Pure Vercel/Linear design tokens (`#FFFFFF`, `#171717`, `#E5E7EB`, `#10B981`).
- SSR-safe: All mouse and scroll listeners must be hydration-guarded.

## Files to Touch
- Modify: `src/components/HeroBanner.tsx`

## Interfaces
- Consumes:
  - `triggerSpark` from `@/components/ClickSpark`
  - `playHapticPop`, `playHapticGlass`, `playHapticClick` from `@/lib/sound`
  - `useCartStore` from `@/lib/store`
  - `formatBDT` from `@/lib/utils`

## Requirements & Implementation Details
1. **Kinetic Dual-Axis Scroll Scissoring**:
   - Use `useScroll` with `target: containerRef, offset: ["start start", "end start"]`.
   - Wrap headline in `overflow-hidden`.
   - Line 1 (`"THE AUTHENTIC"`): `x` maps $[0, 1] \to [0, -80]$ on desktop / $[0, -25]$ on mobile.
   - Line 2 (`"DISPENSARY."`): `x` maps $[0, 1] \to [0, 80]$ on desktop / $[0, 25]$ on mobile.
   - Smooth both with `useSpring({ stiffness: 100, damping: 30 })`.

2. **3-Pillar Data Model**:
   ```ts
   interface HeroPillar {
     id: string;
     category: string;
     title: string;
     subtitle: string;
     priceBDT: number;
     originalPriceBDT: number;
     image: string;
     auraColor: string;
     badgeText: string;
     pins: { label: string; sub: string; position: string }[];
     specs: { batch: string; temp: string; expiry: string; origin: string };
   }
   ```
   Define the 3 Pillars:
   - Pillar 1: Pediatric Care — Aptamil Gold+ Stage 1 Infant Tin (900g, ৳4,200). Image: `https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=85`. Aura: `rgba(245, 158, 11, 0.12)`. Pins: `✈ London LHR ➔ Dhaka Metro`, `❄ 2°C - 8°C Monitored`. Specs: Batch `#LHR-94820-UK`, Temp `4.2°C Continuous`, Expiry `Nov 2027`, Origin `UK NHS Registered`.
   - Pillar 2: Cellular Longevity — Pure NMN 500mg + Trans-Resveratrol (৳3,850). Image: `https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=900&q=85`. Aura: `rgba(6, 182, 212, 0.12)`. Pins: `🧪 99.8% Purity Assured`, `🧬 NAD+ Precursor`. Specs: Batch `#JFK-77412-USA`, Temp `Ambient <22°C`, Expiry `Aug 2028`, Origin `USA FDA Lot Assured`.
   - Pillar 3: Clinical Dermatology — CeraVe Bio-Ceramide Moisturizing Cream (৳2,150). Image: `https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85`. Aura: `rgba(16, 185, 129, 0.12)`. Pins: `💧 3 Essential Ceramides`, `🛡 Tamper-Proof Sealed`. Specs: Batch `#FRA-33821-EU`, Temp `Climate Controlled`, Expiry `Jan 2028`, Origin `EU Clinical Lot`.

3. **Multi-Layer `translateZ` Staging & Gyro**:
   - `perspective: 1200px`, `transformStyle: "preserve-3d"`.
   - On `mousemove` on desktop: calculate `(mouseX / width - 0.5)` and `(mouseY / height - 0.5)`, smoothing with `useSpring({ stiffness: 300, damping: 30 })` mapping to `rotateX: [-6deg, 6deg]` and `rotateY: [-6deg, 6deg]`.
   - Ground shadow underneath product scales and squashes on tilt.
   - Hotspot pins sit at `translateZ(85px)` with pulsing live green dot.
   - Product cutout sits at `translateZ(60px)`.
   - Text & price sits at `translateZ(30px)`.

4. **Interactive Quick Specs Flip**:
   - State `showSpecs`: toggling flips the card or slides over the clinical telemetry card with batch code, cold chain sensor reading, and authenticity seal.
   - Button `+ Add to Cart`:
     - Calls `addItem({ id: activePillar.id, name: activePillar.title, ... })`.
     - Calls `triggerSpark(e.clientX, e.clientY, '#10B981')`.
     - Calls `playHapticPop(0.08)`.

5. **Navigation & Gestures**:
   - Left/Right arrows with `playHapticGlass(0.05)`.
   - Category pill dots underneath to jump directly.
   - `AnimatePresence mode="wait"` with $15^\circ$ Y-axis rotation on entry/exit.
   - Touch drag gesture `drag="x"` with elastic drag constraints on mobile.

6. **Verification & Commit**:
   - Run `npx tsc --noEmit`. Ensure 0 errors.
   - Stage `src/components/HeroBanner.tsx`.
   - Commit: `feat(hero): dual-axis kinetic scroll typography and 3D floating sculpture swapper`.
   - Write report to `a:\Website\.superpowers\sdd\2026-09-17-motion-physics-redesign\task-2-report.md`.
