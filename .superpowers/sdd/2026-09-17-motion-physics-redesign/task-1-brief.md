# Task 1 Brief: Canvas Laser Particle Engine (`ClickSpark.tsx`)

## Context & Role
You are the Implementer Subagent for Task 1 of the Mitavin Motion & Physics Redesign.
Your job is to build the high-performance HTML5 2D Canvas particle engine and mount it in the root layout.

## Global Constraints
- Strictly animate GPU compositor / canvas properties.
- SSR Hydration Safety: Canvas rendering must be client-side only (`use client`, guarded behind `mounted` state).
- Respect `prefers-reduced-motion`.
- Pure Vercel/Linear design tokens (`#10B981` emerald accent).
- Zero uncommitted code: run `npx tsc --noEmit` to verify 0 errors and commit to git.

## Files to Touch
- Create: `src/components/ClickSpark.tsx`
- Modify: `src/app/layout.tsx`

## Requirements & Implementation Details
1. In `src/components/ClickSpark.tsx`:
   - Define custom event `"mitavin:spark"` detail interface: `{ x: number; y: number; color?: string; count?: number; radius?: number }`.
   - Implement `triggerSpark(x: number, y: number, color?: string)`:
     ```ts
     export function triggerSpark(x: number, y: number, color = "#10B981", count = 8, radius = 24) {
       if (typeof window === "undefined") return;
       window.dispatchEvent(new CustomEvent("mitavin:spark", { detail: { x, y, color, count, radius } }));
     }
     ```
   - In `ClickSparkCanvas`:
     - Render `<canvas className="fixed inset-0 pointer-events-none z-[9999]" />`.
     - Handle window resize with `ResizeObserver` or `window.addEventListener('resize')`.
     - Listen to `"mitavin:spark"` on `window`.
     - When an event arrives, spawn $N = \text{count}$ sparks with angles $\theta_i = \frac{2\pi i}{N}$, start timestamp `performance.now()`.
     - In `requestAnimationFrame` loop:
       - Clear rect.
       - If sparks array is empty, cancel animation loop until new sparks arrive (0% idle CPU).
       - For each spark:
         - Progress $p = (t - t_0) / 400$. If $p \ge 1$, remove spark.
         - Eased $e = p(2 - p)$.
         - Distance $d = e \cdot \text{radius}$.
         - Line length $L = 12 \cdot (1 - e)$.
         - Start $(x_1, y_1) = (x_c + d \cos\theta, y_c + d \sin\theta)$.
         - End $(x_2, y_2) = (x_c + (d + L) \cos\theta, y_c + (d + L) \sin\theta)$.
         - Stroke with `lineWidth = 2`, `strokeStyle = color || "#10B981"`.
2. In `src/app/layout.tsx`:
   - Import `ClickSparkCanvas` from `@/components/ClickSpark`.
   - Place `<ClickSparkCanvas />` inside the `<body>`.
3. Verification:
   - Run `npx tsc --noEmit` in `a:\Website`. Ensure 0 errors.
   - Run `git add src/components/ClickSpark.tsx src/app/layout.tsx`.
   - Commit: `feat(physics): add high-performance HTML5 canvas laser spark engine`.
4. Report:
   - Write full report to `a:\Website\.superpowers\sdd\2026-09-17-motion-physics-redesign\task-1-report.md`.
