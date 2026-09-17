# Mitavin Motion, Physics & 3D Spatial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Mitavin into an elite, high-converting luxury dispensary with dual-axis kinetic scroll typography, 3-pillar floating 3D sculpture staging with multi-layer `translateZ` depth, catalog mouse-gyro tilt with real-time cursor specular glare, conversion-targeted HTML5 canvas laser micro-sparks, and an interactive 4-card 3D provenance bento grid.

**Architecture:** Hardware-accelerated GPU compositor transforms (`translate3d`, `opacity`, matrix 3D) synchronized with Lenis smooth scroll and Framer Motion spring physics. A root-level 2D canvas emitter runs on-demand particle bursts on conversion triggers, while 3D card stages calculate normalized cursor vectors to drive second-order damped harmonic oscillator tilt ($k=300, c=30$).

**Tech Stack:** Next.js 15, React 19, TypeScript 5, Tailwind CSS 3, Framer Motion 12, Lenis 1.3, Web Audio API, HTML5 2D Canvas.

**Spec:** `docs/superpowers/specs/2026-09-17-motion-physics-redesign-design.md`

## Global Constraints
- Strictly animate GPU compositor properties (`transform`, `opacity`). Never animate layout properties (`width`, `height`, `margin`, `padding`).
- Maintain pure Vercel/Linear design tokens: `#FFFFFF` canvas, `#FAFAFA` cards, 1px `#E5E7EB` borders, `#171717` ink typography, `#10B981` emerald accent.
- All canvas particle and mouse gyro operations must be 100% SSR-safe and guarded against hydration mismatches.
- Touchscreen mobile devices must bypass mouse gyro tilt to preserve 120 FPS thumb scrolling; mobile text scissoring must be clamped to $\pm 25\text{px}$ inside `overflow-hidden`.
- Zero uncommitted code: every task must verify cleanly with `npx tsc --noEmit` and commit to Git.

---

### Task 1: Canvas Laser Particle Engine (`ClickSpark.tsx`)

**Files:**
- Create: `src/components/ClickSpark.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: `export function triggerSpark(x: number, y: number, color?: string): void`
- Produces: `export function ClickSparkCanvas(): React.JSX.Element`

- [ ] **Step 1: Write `src/components/ClickSpark.tsx`**
Implement the HTML5 2D Canvas engine with polar radial ray calculations ($\theta_i = \frac{2\pi i}{N}$), quadratic ease-out velocity decay ($p(2-p)$), contracting streak lengths ($L_0(1-\text{eased})$), and custom event listener `mitavin:spark` for decoupled trigger from any button.

- [ ] **Step 2: Mount `ClickSparkCanvas` in `src/app/layout.tsx`**
Mount the canvas at the root layout with fixed position, `inset-0`, `pointer-events-none`, and `z-[9999]`.

- [ ] **Step 3: Verify TypeScript Compilation**
Run `npx tsc --noEmit`. Expected: Exit code 0.

- [ ] **Step 4: Commit**
```bash
git add src/components/ClickSpark.tsx src/app/layout.tsx
git commit -m "feat(physics): add high-performance HTML5 canvas laser spark engine"
```

---

### Task 2: Hero Dual-Axis Scissor & 3D Floating Sculpture Swapper

**Files:**
- Modify: `src/components/HeroBanner.tsx`

**Interfaces:**
- Consumes: `triggerSpark` from `src/components/ClickSpark.tsx`, `playHapticPop`, `playHapticGlass` from `src/lib/sound.ts`, `useCartStore` from `src/lib/store.ts`.

- [ ] **Step 1: Implement Dual-Axis Kinetic Scroll Scissoring**
Map headline lines to opposing spring vectors:
- Line 1 (`"THE AUTHENTIC"`): `x = [-80px, 0]` desktop / `[-25px, 0]` mobile.
- Line 2 (`"DISPENSARY."`): `x = [80px, 0]` desktop / `[25px, 0]` mobile.
- Wrap headline in `overflow-hidden` container to guarantee 0 horizontal overflow.

- [ ] **Step 2: Build 3-Pillar 3D Floating Sculpture Swapper**
Replace the boxed thumbnail card with the 3 switchable pillars:
1. **Pediatric Gold**: Aptamil Gold+ Stage 1 (Amber aura, London $\to$ Dhaka flight tag, $2^\circ\text{C}-8^\circ\text{C}$ tag, ৳4,200).
2. **Cellular Longevity**: NMN 500mg Pure Trans-Resveratrol (Cyan aura, 99.8% Purity tag, NAD+ tag, ৳3,850).
3. **Clinical Dermatology**: CeraVe Moisturizing Cream (Mint aura, 3 Bio-Ceramides tag, Tamper Seal tag, ৳2,150).
Implement multi-layer `translateZ` spatial parallax ($Z = 0, 30, 65, 90\text{px}$), dynamic ground shadow squashing on tilt, touch-swipe gesture support (`drag="x"`), and a Quick Specs clinical flip toggle.

- [ ] **Step 3: Connect Hero Conversion CTA**
Add `+ Add to Dispensary Cart` with `triggerSpark` emerald particle burst, Web Audio `playHapticPop()`, and instant cart drawer update.

- [ ] **Step 4: Verify TypeScript & Build**
Run `npx tsc --noEmit`. Expected: Exit code 0.

- [ ] **Step 5: Commit**
```bash
git add src/components/HeroBanner.tsx
git commit -m "feat(hero): dual-axis kinetic scroll typography and 3D floating sculpture swapper"
```

---

### Task 3: 4-Column Product Catalog 3D Micro-Tilt & Specular Glare

**Files:**
- Modify: `src/components/ProductCard.tsx`

**Interfaces:**
- Consumes: `triggerSpark` from `src/components/ClickSpark.tsx`, `playHapticPop` from `src/lib/sound.ts`.

- [ ] **Step 1: Implement Damped 3D Gyro Spring Physics**
Wrap each card in a `perspective: 1000px` container with `preserve-3d`. On `mousemove`, normalize cursor coordinates to $[-0.5, 0.5]$ and map via spring physics ($k=300, c=30$) to $rotateX \in [-3.5^\circ, 3.5^\circ]$ and $rotateY \in [-3.5^\circ, 3.5^\circ]$.

- [ ] **Step 2: Implement Real-Time Cursor Specular Spotlight**
Render a cursor-following radial gradient overlay:
`radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.22), transparent 60%)`
with `pointer-events-none` that glides over the card surface.

- [ ] **Step 3: Add Touchscreen Safety & Conversion Micro-Physics**
Detect touch capability to disable mousemove listeners on phones, using `whileTap={{ scale: 0.98 }}`. On clicking `+ Add`, trigger `triggerSpark(clientX, clientY, "#10B981")`, execute `playHapticPop()`, and show `Added ✓` state for 1200ms.

- [ ] **Step 4: Verify TypeScript & Build**
Run `npx tsc --noEmit`. Expected: Exit code 0.

- [ ] **Step 5: Commit**
```bash
git add src/components/ProductCard.tsx
git commit -m "feat(catalog): 3D spatial gyro tilt, cursor specular glare, and conversion laser sparks"
```

---

### Task 4: Interactive 3D Gyro Provenance Bento Grid

**Files:**
- Create: `src/components/ProvenanceBento.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `triggerSpark` from `src/components/ClickSpark.tsx`, `playHapticGlass` from `src/lib/sound.ts`.

- [ ] **Step 1: Create `src/components/ProvenanceBento.tsx`**
Build the 4-card 3D Bento Grid (`bg-zinc-950 border border-zinc-800`):
- **Tile 1 (Cold-Chain Telemetry)**: Emerald accent, $4.2^\circ\text{C}$ continuous readout, interactive SVG live temperature wave.
- **Tile 2 (Direct Air-Freight)**: Sky Blue accent, $<48\text{h}$ transit coordinate pill (Heathrow LHR $\to$ Dhaka DAC).
- **Tile 3 (10x Authenticity Guarantee)**: Amber accent with interactive **`[ Test Sample Batch #LHR-94820 ]`** button. Clicking triggers a 600ms scan animation lighting up `✓ Verified Authentic UK Batch` with emerald sparks and `playHapticGlass()`.
- **Tile 4 (4h Dhaka Express)**: Violet accent, active delivery radius, pulsing live dispatch beacon.

- [ ] **Step 2: Add 3D Tilt & Specular Sheen to Bento Tiles**
Equip each tile with independent gyro tilt and the $105^\circ$ diagonal specular light sheen sweep on hover.

- [ ] **Step 3: Integrate Bento Grid into `src/app/page.tsx`**
Replace the static dark banner with `<ProvenanceBento />` in `src/app/page.tsx`.

- [ ] **Step 4: Verify TypeScript & Build**
Run `npx tsc --noEmit`. Expected: Exit code 0.

- [ ] **Step 5: Commit**
```bash
git add src/components/ProvenanceBento.tsx src/app/page.tsx
git commit -m "feat(bento): interactive 3D gyro provenance bento grid with 1-click batch verifier"
```

---

### Task 5: Checkout & Cart Haptic Spark Integration

**Files:**
- Modify: `src/components/CartDrawer.tsx`
- Modify: `src/components/CheckoutModal.tsx`

**Interfaces:**
- Consumes: `triggerSpark` from `src/components/ClickSpark.tsx`, `playHapticGlass`, `playHapticSwoosh` from `src/lib/sound.ts`.

- [ ] **Step 1: Wire Free Delivery Threshold Celebration in `CartDrawer.tsx`**
When user subtotal crosses ৳2,000, fire emerald spark burst and play `playHapticGlass()`, transforming progress bar into `🎉 Free Same-Day Dhaka Delivery Unlocked!`.

- [ ] **Step 2: Wire bKash Copy & Checkout Launch Sparks in `CheckoutModal.tsx`**
Fire emerald sparks when clicking 1-click copy on bKash merchant number `01978303867` and on clicking `Confirm Order`.

- [ ] **Step 3: Verify TypeScript & Build**
Run `npx tsc --noEmit`. Expected: Exit code 0.

- [ ] **Step 4: Commit**
```bash
git add src/components/CartDrawer.tsx src/components/CheckoutModal.tsx
git commit -m "feat(checkout): tactile emerald spark celebrations for free shipping and bKash copy"
```

---

### Task 6: Autonomous Verification, Visual QA & Push

**Files:**
- Test across all components running on Chromium.

- [ ] **Step 1: Run Full Production Build**
Execute `npm run build` to verify clean Turbopack static compilation.

- [ ] **Step 2: Automated Playwright Visual QA**
Start server with `npm run start`. Using Playwright Chromium:
- Verify Desktop 1440px view: Hero 3D swapper, dual-axis kinetic scroll, catalog hover tilt, and bento verification click.
- Verify Mobile 390px (iPhone 13): Touch swiping, 0 horizontal overflow, and clean bottom dock clearance.
- Capture verification screenshots.

- [ ] **Step 3: Push to GitHub**
Push all commits to `origin/main` on GitHub repository `revenchedarnob-wq/mitavin-dispensary-redesign`.
