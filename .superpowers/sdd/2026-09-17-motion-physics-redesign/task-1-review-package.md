# Review Package for Task 1

## Commits
8660ed1 feat(physics): add high-performance HTML5 canvas laser spark engine

## Stat
 src/app/layout.tsx            |   2 +
 src/components/ClickSpark.tsx | 200 ++++++++++++++++++++++++++++++++++++++++++
 2 files changed, 202 insertions(+)

## Full Diff
diff --git a/src/app/layout.tsx b/src/app/layout.tsx
index 1237e13..a59e3ef 100644
--- a/src/app/layout.tsx
+++ b/src/app/layout.tsx
@@ -1,14 +1,15 @@
 import type { Metadata, Viewport } from "next";
 import { Inter } from "next/font/google";
 import "./globals.css";
 import { SmoothScroll } from "@/components/SmoothScroll";
+import { ClickSparkCanvas } from "@/components/ClickSpark";
 
 const inter = Inter({
   subsets: ["latin"],
   variable: "--font-sans",
   display: "swap",
 });
 
 export const viewport: Viewport = {
   themeColor: "#FFFFFF",
   width: "device-width",
@@ -40,14 +41,15 @@ export const metadata: Metadata = {
 
 export default function RootLayout({
   children,
 }: Readonly<{
   children: React.ReactNode;
 }>) {
   return (
     <html lang="en" className={inter.variable}>
       <body className="antialiased selection:bg-zinc-900 selection:text-white bg-white text-zinc-900 font-sans">
         <SmoothScroll>{children}</SmoothScroll>
+        <ClickSparkCanvas />
       </body>
     </html>
   );
 }
diff --git a/src/components/ClickSpark.tsx b/src/components/ClickSpark.tsx
new file mode 100644
index 0000000..ca704e4
--- /dev/null
+++ b/src/components/ClickSpark.tsx
@@ -0,0 +1,200 @@
+"use client";
+
+import React, { useEffect, useRef, useState } from "react";
+
+export interface SparkDetail {
+  x: number;
+  y: number;
+  color?: string;
+  count?: number;
+  radius?: number;
+}
+
+export function triggerSpark(
+  x: number,
+  y: number,
+  color = "#10B981",
+  count = 8,
+  radius = 24
+) {
+  if (typeof window === "undefined") return;
+  window.dispatchEvent(
+    new CustomEvent<SparkDetail>("mitavin:spark", {
+      detail: { x, y, color, count, radius },
+    })
+  );
+}
+
+interface SparkRay {
+  xc: number;
+  yc: number;
+  angle: number;
+  radius: number;
+  color: string;
+  t0: number;
+  duration: number;
+}
+
+export function ClickSparkCanvas() {
+  const [mounted, setMounted] = useState(false);
+  const canvasRef = useRef<HTMLCanvasElement | null>(null);
+  const sparksRef = useRef<SparkRay[]>([]);
+  const animFrameIdRef = useRef<number | null>(null);
+
+  useEffect(() => {
+    setMounted(true);
+  }, []);
+
+  useEffect(() => {
+    if (!mounted) return;
+
+    const canvas = canvasRef.current;
+    if (!canvas) return;
+
+    const resizeCanvas = () => {
+      if (!canvas) return;
+      const dpr = window.devicePixelRatio || 1;
+      const width = window.innerWidth;
+      const height = window.innerHeight;
+      canvas.width = Math.floor(width * dpr);
+      canvas.height = Math.floor(height * dpr);
+      canvas.style.width = `${width}px`;
+      canvas.style.height = `${height}px`;
+      const ctx = canvas.getContext("2d");
+      if (ctx) {
+        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
+      }
+    };
+
+    resizeCanvas();
+    window.addEventListener("resize", resizeCanvas);
+
+    const animate = (currentTime: number) => {
+      if (!canvasRef.current) {
+        animFrameIdRef.current = null;
+        return;
+      }
+      const ctx = canvasRef.current.getContext("2d");
+      if (!ctx) {
+        animFrameIdRef.current = null;
+        return;
+      }
+
+      // Clear physical buffer
+      ctx.save();
+      ctx.setTransform(1, 0, 0, 1, 0, 0);
+      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
+      ctx.restore();
+
+      const sparks = sparksRef.current;
+      if (sparks.length === 0) {
+        animFrameIdRef.current = null;
+        return;
+      }
+
+      const remainingSparks: SparkRay[] = [];
+
+      for (let i = 0; i < sparks.length; i++) {
+        const spark = sparks[i];
+        const p = (currentTime - spark.t0) / spark.duration;
+
+        if (p >= 1) {
+          continue;
+        }
+
+        remainingSparks.push(spark);
+
+        const e = p * (2 - p);
+        const d = e * spark.radius;
+        const L = 12 * (1 - e);
+        const cosTheta = Math.cos(spark.angle);
+        const sinTheta = Math.sin(spark.angle);
+
+        const x1 = spark.xc + d * cosTheta;
+        const y1 = spark.yc + d * sinTheta;
+        const x2 = spark.xc + (d + L) * cosTheta;
+        const y2 = spark.yc + (d + L) * sinTheta;
+
+        ctx.beginPath();
+        ctx.moveTo(x1, y1);
+        ctx.lineTo(x2, y2);
+        ctx.strokeStyle = spark.color || "#10B981";
+        ctx.lineWidth = 2;
+        ctx.lineCap = "round";
+        ctx.stroke();
+      }
+
+      sparksRef.current = remainingSparks;
+
+      if (remainingSparks.length > 0) {
+        animFrameIdRef.current = requestAnimationFrame(animate);
+      } else {
+        animFrameIdRef.current = null;
+      }
+    };
+
+    const handleSparkEvent = (e: Event) => {
+      if (
+        typeof window !== "undefined" &&
+        window.matchMedia &&
+        window.matchMedia("(prefers-reduced-motion: reduce)").matches
+      ) {
+        return;
+      }
+      const customEvent = e as CustomEvent<SparkDetail>;
+      if (!customEvent.detail) return;
+
+      const {
+        x,
+        y,
+        color = "#10B981",
+        count = 8,
+        radius = 24,
+      } = customEvent.detail;
+      const now = performance.now();
+      const newSparks: SparkRay[] = [];
+
+      for (let i = 0; i < count; i++) {
+        const angle = (2 * Math.PI * i) / count;
+        newSparks.push({
+          xc: x,
+          yc: y,
+          angle,
+          color,
+          radius,
+          t0: now,
+          duration: 400,
+        });
+      }
+
+      sparksRef.current.push(...newSparks);
+
+      if (!animFrameIdRef.current) {
+        animFrameIdRef.current = requestAnimationFrame(animate);
+      }
+    };
+
+    window.addEventListener("mitavin:spark", handleSparkEvent);
+
+    return () => {
+      window.removeEventListener("resize", resizeCanvas);
+      window.removeEventListener("mitavin:spark", handleSparkEvent);
+      if (animFrameIdRef.current) {
+        cancelAnimationFrame(animFrameIdRef.current);
+        animFrameIdRef.current = null;
+      }
+    };
+  }, [mounted]);
+
+  if (!mounted) return null;
+
+  return (
+    <canvas
+      ref={canvasRef}
+      aria-hidden="true"
+      className="fixed inset-0 pointer-events-none z-[9999]"
+    />
+  );
+}
+
+export default ClickSparkCanvas;
