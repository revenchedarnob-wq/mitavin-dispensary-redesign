# Task 3 Brief: 4-Column Product Catalog 3D Micro-Tilt & Specular Glare

## Context & Role
You are the Implementer Subagent for Task 3 of the Mitavin Motion & Physics Redesign.
Your job is to enhance `src/components/ProductCard.tsx` to add hardware-accelerated 3D mouse gyro tilt, cursor-coupled specular spotlight, mobile touch-safe fallback, and conversion laser micro-sparks on `+ Add`.

## Global Constraints
- Strictly animate GPU compositor properties (`transform: translate3d(...)`, `opacity`, `rotateX`, `rotateY`).
- Mobile touch devices must bypass mouse tilt listeners to ensure 120 FPS thumb scrolling.
- Pure Vercel/Linear tokens (`#FFFFFF`, `#FAFAFA`, `#E5E7EB`, `#10B981`).
- SSR hydration safety (`use client`, `mounted` guard).

## Files to Touch
- Modify: `src/components/ProductCard.tsx`

## Interfaces
- Consumes:
  - `triggerSpark` from `@/components/ClickSpark`
  - `playHapticPop` from `@/lib/sound`
  - `useCartStore` from `@/lib/store`
  - `formatBDT` from `@/lib/utils`

## Requirements & Implementation Details
1. **3D Spatial Gyro Tilt (`perspective: 1000px`, `transformStyle: "preserve-3d"`)**:
   - Track card bounding box on `onMouseMove`:
     ```ts
     const rect = cardRef.current.getBoundingClientRect();
     const x = (e.clientX - rect.left) / rect.width - 0.5;
     const y = (e.clientY - rect.top) / rect.height - 0.5;
     ```
   - Use `useSpring(xMotion, { stiffness: 300, damping: 30 })` and `useSpring(yMotion, { stiffness: 300, damping: 30 })`.
   - Map:
     - `rotateX` = `useTransform(ySpring, [-0.5, 0.5], [3.5, -3.5])` (degrees).
     - `rotateY` = `useTransform(xSpring, [-0.5, 0.5], [-3.5, 3.5])` (degrees).
   - On `onMouseLeave`: reset `xMotion.set(0)` and `yMotion.set(0)`.

2. **Cursor-Coupled Specular Glare Overlay**:
   - Calculate percentage `glareX = ((e.clientX - rect.left) / rect.width) * 100` and `glareY = ((e.clientY - rect.top) / rect.height) * 100`.
   - Render specular overlay:
     ```tsx
     {isHovered && !isTouch && (
       <div
         className="absolute inset-0 pointer-events-none rounded-xl z-20 transition-opacity duration-300"
         style={{
           background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.22), transparent 60%)`,
         }}
       />
     )}
     ```

3. **Touchscreen Safety**:
   - Check `window.matchMedia('(pointer: coarse)').matches` or touch event to disable tilt on phones.
   - Use `whileTap={{ scale: 0.98 }}` for tactile mobile feedback.

4. **Conversion Laser Sparks on `+ Add`**:
   - In `handleAddToCart(e: React.MouseEvent)`:
     ```ts
     e.stopPropagation();
     addItem(product);
     triggerSpark(e.clientX, e.clientY, "#10B981");
     playHapticPop(0.08);
     setJustAdded(true);
     setTimeout(() => setJustAdded(false), 1200);
     ```

5. **Verification & Commit**:
   - Run `npx tsc --noEmit`. Ensure 0 errors.
   - Stage `src/components/ProductCard.tsx`.
   - Commit: `feat(catalog): 3D spatial gyro tilt, cursor specular glare, and conversion laser sparks`.
   - Write completion report to `a:\Website\.superpowers\sdd\2026-09-17-motion-physics-redesign\task-3-report.md`.
