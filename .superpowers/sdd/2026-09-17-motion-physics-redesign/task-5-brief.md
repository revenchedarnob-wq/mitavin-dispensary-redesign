# Task 5 Brief: Checkout & Cart Haptic Spark Integration

## Context & Role
You are the Implementer Subagent for Task 5 of the Mitavin Motion & Physics Redesign.
Your job is to wire conversion-targeted emerald canvas sparks and micro-haptics into `src/components/CartDrawer.tsx` and `src/components/CheckoutModal.tsx`.

## Global Constraints
- SSR hydration safety (`use client`, window checks).
- Micro-haptics from `@/lib/sound` (`playHapticGlass`, `playHapticPop`, `playHapticClick`).
- Laser spark emissions from `@/components/ClickSpark` (`triggerSpark`).
- Prevent spark spam: Free shipping threshold celebration must trigger only once when transitioning across the ৳2,000 boundary.

## Files to Touch
- Modify: `src/components/CartDrawer.tsx`
- Modify: `src/components/CheckoutModal.tsx`

## Requirements & Implementation Details

### 1. `src/components/CartDrawer.tsx`: Free Delivery Threshold Celebration
- Import `triggerSpark` from `@/components/ClickSpark`.
- Track threshold crossing:
  - Keep a `useRef<boolean>(false)` or `useState` tracking whether ৳2,000 was already reached (`hasCelebratedThreshold`).
  - When `subtotal >= 2000` and `!hasCelebratedThreshold.current`:
    - Set `hasCelebratedThreshold.current = true`.
    - Trigger `playHapticGlass(0.12)`.
    - Find the progress bar element or use center coords to fire `triggerSpark(window.innerWidth - 200, 160, '#10B981', 12, 32)`.
  - When `subtotal < 2000`:
    - Reset `hasCelebratedThreshold.current = false`.
- In the free delivery banner:
  - When `isFreeDelivery` is true, style with a subtle emerald glow pulse (`bg-emerald-50/70 border-emerald-200 text-emerald-950`).
  - Highlight: `🎉 Free Dhaka Express Delivery Unlocked!`.

### 2. `src/components/CheckoutModal.tsx`: bKash Copy & Order Celebration
- Import `triggerSpark` from `@/components/ClickSpark`.
- In `handleCopyBkash`:
  - Accept `(e?: React.MouseEvent)`.
  - Extract coordinates `const x = e?.clientX || window.innerWidth / 2; const y = e?.clientY || window.innerHeight / 2;`.
  - Call `triggerSpark(x, y, '#10B981', 10, 24)`.
  - Play `playHapticGlass(0.08)`.
- In `handleSubmitOrder` upon successful response:
  - Trigger `triggerSpark(window.innerWidth / 2, window.innerHeight * 0.45, '#10B981', 16, 36)`.
  - Preserve `playHapticSuccess` and confetti.

### 3. Verification & Commit
- Run `npx tsc --noEmit`. Ensure 0 errors.
- Stage `src/components/CartDrawer.tsx` and `src/components/CheckoutModal.tsx`.
- Commit: `feat(checkout): tactile emerald spark celebrations for free shipping and bKash copy`.
- Write completion report to `a:\Website\.superpowers\sdd\2026-09-17-motion-physics-redesign\task-5-report.md`.
- Generate review package to `a:\Website\.superpowers\sdd\2026-09-17-motion-physics-redesign\task-5-review-package.md`.
