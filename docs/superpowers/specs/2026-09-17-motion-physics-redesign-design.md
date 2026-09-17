# Mitavin Motion, Physics & 3D Spatial Redesign Specification

**Date:** 2026-09-17  
**Project:** Mitavin Luxury E-Commerce (`mitavin.com`)  
**Status:** Approved for Implementation  
**Aesthetic Standard:** Vercel & Linear Precision + Atelier Spatial Physics  

---

## 1. Executive Summary & Goal
Mitavin is an authentic UK & USA longevity, baby nutrition, and clinical dispensary in Dhaka, Bangladesh. This specification defines the architecture, mathematical physics models, and component implementations to elevate Mitavin's web experience using advanced creative engineering principles inspired by high-octane modern motion design (GiGi Energy Drink reference architecture):
1. **Dual-Axis Opposing Kinetic Scroll Parallax** in the Hero section.
2. **3-Pillar 3D Floating Product Showcase Swapper** with multi-layer `translateZ` spatial parallax, ambient chromatic auras, and mobile touch-swipe physics.
3. **4-Column Product Catalog 3D Micro-Tilt & Cursor-Coupled Specular Glare** with hardware-accelerated spring damping.
4. **Targeted HTML5 Canvas Laser Micro-Physics (`ClickSpark`)** coupled with zero-latency Web Audio micro-haptics on high-intent conversion moments.
5. **Interactive 3D Gyro Provenance Bento Grid** featuring real-time cold-chain telemetry curves, flight route badges, and a 1-click authentic batch verification scanner.

---

## 2. Architecture & Motion Pipeline

### 2.1 Z-Index & Compositor Safety
All animations strictly modify GPU compositor properties (`transform: translate3d(...)` and `opacity`). Zero layout-triggering properties (`width`, `height`, `margin`, `padding`, `top`, `left`) are animated during scroll or pointer tracking.
- `z-0`: Canvas background aura & ambient chromatic glows (`pointer-events: none`).
- `z-10`: Page content, text layout, and structural grid.
- `z-20`: 3D spatial cards with `preserve-3d` matrix transforms.
- `z-30`: Sticky Vercel-style glass navigation bar.
- `z-50`: Modals, Slide-over Cart Drawer, and Checkout overlay.
- `z-[9999]`: Hardware-accelerated 2D Canvas laser spark layer (`pointer-events: none`).

### 2.2 Mathematical & Physics Models

#### A. Lenis Smooth Scroll Interpolation
Linear interpolation exponential decay curve:
$$y_t = y_{t-1} + \text{lerp} \cdot (\text{target} - y_{t-1})$$
Configured with `lerp: 0.08`, `duration: 1.2s`, and `touchMultiplier: 2.0` to preserve native 1:1 touch response on mobile while smoothing desktop wheel deltas.

#### B. Second-Order Damped Harmonic Oscillator (Spring Gyro)
$$\ddot{x} + 2\zeta\omega_0 \dot{x} + \omega_0^2 x = 0$$
- `stiffness` $k = 300$, `damping` $c = 30$.
- Damping ratio $\zeta = \frac{c}{2\sqrt{m k}} = \frac{30}{2\sqrt{300}} \approx 0.866$.
- Near-critical damping delivers instantaneous pointer responsiveness with zero unwanted bounce or motion-sickness wobble.

#### C. Canvas Laser Spark Particle Kinetics (`ClickSpark`)
- Emitter spawns $N = 8$ particle rays from origin $(x_c, y_c)$ at equidistant angles $\theta_i = \frac{2\pi i}{N}$.
- Deceleration curve: $\text{eased}(p) = p \cdot (2 - p)$ for normalized time $p = \frac{\Delta t}{400\text{ms}} \in [0, 1]$.
- Ray head: $x_1 = x_c + (\text{eased} \cdot R) \cos(\theta_i)$, $y_1 = y_c + (\text{eased} \cdot R) \sin(\theta_i)$.
- Ray tail contraction: $L = L_0 \cdot (1 - \text{eased})$.
- Ray end: $x_2 = x_c + (\text{eased} \cdot R + L) \cos(\theta_i)$, $y_2 = y_c + (\text{eased} \cdot R + L) \sin(\theta_i)$.
- When $p = 1$, $L = 0$ (ray collapses into point before disposal).

---

## 3. Detailed Component Specifications

### 3.1 `src/components/ClickSpark.tsx` (New Component)
- **Role**: Global particle engine canvas mounted at root, exposing a lightweight API or event listener `triggerSpark(x, y, color)`.
- **Properties**:
  - `sparkColor`: Default `#10B981` (Emerald).
  - `sparkSize`: $12\text{px}$.
  - `sparkRadius`: $24\text{px}$.
  - `sparkCount`: $8$.
  - `duration`: $400\text{ms}$.
- **Lifecycle**: Active `requestAnimationFrame` loop runs strictly when sparks array length $> 0$; completely suspends when idle (0% CPU impact).

### 3.2 `src/components/HeroBanner.tsx` (Enhanced Component)
- **Dual-Axis Scissor Typography**:
  - Line 1 (`"THE AUTHENTIC"`): Translates $-80\text{px}$ on desktop (clamped to $-25\text{px}$ on mobile) via `useScroll`.
  - Line 2 (`"DISPENSARY."`): Translates $+80\text{px}$ on desktop (clamped to $+25\text{px}$ on mobile) via `useScroll`.
  - Both smoothed with `useSpring({ stiffness: 100, damping: 30 })`.
- **3-Pillar 3D Floating Sculpture Swapper (Apple/GiGi Standard)**:
  - Replaces the boxed thumbnail card with a monumental, free-floating transparent product sculpture resting on an elastic dynamic ambient ground shadow plane.
  - Three switchable pillars:
    1. **Pediatric Gold**: Aptamil Gold+ Stage 1 Infant Tin (900g). Floating golden DHA Omega-3 droplet micro-element, London LHR $\to$ DAC flight tag, Amber aura (`rgba(245, 158, 11, 0.12)`), ৳4,200.
    2. **Cellular Longevity**: NMN 500mg Pure Trans-Resveratrol (Amber Glass Apothecary Vial). Cellular NAD+ molecule micro-element, $2^\circ\text{C}-8^\circ\text{C}$ sensor tag, Cyan aura (`rgba(6, 182, 212, 0.12)`), ৳3,850.
    3. **Clinical Dermatology**: CeraVe Bio-Ceramide Moisturizing Cream (Clinical Dispenser). Purified moisture droplet micro-element, NHS Tamper-Seal verification tag, Mint aura (`rgba(16, 185, 129, 0.12)`), ৳2,150.
  - **Multi-Layer `translateZ` Spatial Staging**:
    - Ambient Aura & Ground Shadow: $Z = 0\text{px}$ (shadow squashes and stretches dynamically with tilt)
    - Metadata & Pricing: $Z = 30\text{px}$
    - Transparent Product Sculpture: $Z = 65\text{px}$ (floats forward with studio rim light reflection)
    - Floating Interactive Hotspot Pins: $Z = 90\text{px}$ (tethered to cap and base with pulsing status beacons: `[ Tamper-Evident Foil Seal Intact ]`, `[ Batch Expiry: Nov 2027 • Serial Verified ]`)
  - **Gesture & Deck-Flip Physics**:
    - $15^\circ$ Y-axis rotation on entry/exit transitions (`stiffness: 300, damping: 30`).
    - Touchscreen drag physics (`drag="x"`) with elastic boundary return on mobile.
    - Quick Specs flip toggle revealing real-time lot certificate and telemetry logs.

### 3.3 `src/components/ProductCard.tsx` (Enhanced Component)
- **3D Spatial Tilt**:
  - `perspective: 1000px`, `transform-style: preserve-3d`.
  - Pointer moves drive $rotateX \in [-3.5^\circ, 3.5^\circ]$ and $rotateY \in [-3.5^\circ, 3.5^\circ]$.
- **Cursor-Coupled Specular Glare**:
  - Overlay gradient `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.22), transparent 60%)` dynamically tracking mouse coordinates.
- **Mobile Touch Fallback**:
  - Touch devices bypass gyro tilt to maintain 120 FPS thumb scrolling; apply tactile `whileTap={{ scale: 0.98 }}`.
- **Conversion Trigger**:
  - `+ Add` button executes `playHapticPop()` + triggers emerald `ClickSpark` from button coordinates + displays `Added ✓` state for 1200ms.

### 3.4 `src/components/ProvenanceBento.tsx` (New Component)
- **Design**: Replaces static dark banner with 4-card 3D Gyro Bento Grid (`bg-zinc-950 border border-zinc-800`):
  - **Tile 1 (Cold-Chain)**: Emerald `#10B981` accent, $4.2^\circ\text{C}$ active readout, animated SVG temperature telemetry wave.
  - **Tile 2 (Air Freight)**: Sky Blue `#0284C7` accent, $<48\text{h}$ Heathrow/JFK to Dhaka coordinate pill.
  - **Tile 3 (Authenticity)**: Amber `#F59E0B` accent, interactive **`[ Test Sample Batch #LHR-94820 ]`** button. Clicking triggers a 600ms scan animation resulting in `✓ Authentic Sealed UK Batch Verified` with emerald sparks.
  - **Tile 4 (Dhaka Express)**: Violet `#8B5CF6` accent, live dispatch radius, active dispensary beacon.
- Each tile features individual 3D tilt and diagonal $105^\circ$ specular light sweep on hover.

### 3.5 `src/components/CartDrawer.tsx` & `src/components/CheckoutModal.tsx`
- **CartDrawer**: Triggers emerald spark celebration and `playHapticGlass()` when the dynamic subtotal crosses the ৳2,000 threshold, unlocking Free Dhaka Delivery.
- **CheckoutModal**: Triggers emerald spark burst when clicking 1-click copy on bKash merchant number `01978303867`.

---

## 4. Verification & Testing Strategy

### 4.1 Automated Tooling
- `npx tsc --noEmit`: 0 TypeScript type errors.
- `npm run build`: Production Next.js Turbopack compilation passing with static route generation.
- `playwright`: Headless Chromium visual validation:
  - 1440x900 Desktop: Test hero 3D swapper, catalog card hover tilt, and bento verification click.
  - 390x844 Mobile (iPhone 13): Verify touch swiping, 0 horizontal overflow, and sticky bottom navigation clearance.

### 4.2 Git Repository Management
- Clean commits adhering to conventional commits (`feat(motion): ...`).
- All code pushed to `origin/main` on GitHub before any deployment triggers.
