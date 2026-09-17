# Review Package for Task 3

## Commits
4f5d381 feat(catalog): 3D spatial gyro tilt, cursor specular glare, and conversion laser sparks

## Stat
 src/components/ProductCard.tsx | 307 +++++++++++++++++++++++++++--------------
 1 file changed, 206 insertions(+), 101 deletions(-)

## Full Diff
diff --git a/src/components/ProductCard.tsx b/src/components/ProductCard.tsx
index b97b4dd..7186996 100644
--- a/src/components/ProductCard.tsx
+++ b/src/components/ProductCard.tsx
@@ -1,7 +1,8 @@
 "use client";
 
-import React, { useState } from "react";
+import React, { useState, useEffect, useRef } from "react";
 import Image from "next/image";
+import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
 import {
   Eye,
   Plus,
@@ -9,8 +10,9 @@ import {
   Check,
 } from "lucide-react";
 import { Product } from "@/data/products";
-import { useStore } from "@/lib/store";
+import { useCartStore } from "@/lib/store";
 import { playHapticPop, playHapticGlass } from "@/lib/sound";
+import { triggerSpark } from "@/components/ClickSpark";
 import { formatBDT } from "@/lib/utils";
 
 interface ProductCardProps {
@@ -18,8 +20,65 @@ interface ProductCardProps {
 }
 
 export function ProductCard({ product }: ProductCardProps) {
-  const { addItem, openQuickView } = useStore();
+  const { addItem, openQuickView } = useCartStore();
   const [justAdded, setJustAdded] = useState(false);
+  const [isTouch, setIsTouch] = useState(false);
+  const [isHovered, setIsHovered] = useState(false);
+  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
+
+  const cardRef = useRef<HTMLDivElement>(null);
+
+  // Framer Motion 3D gyro tilt physics
+  const xMotion = useMotionValue(0);
+  const yMotion = useMotionValue(0);
+
+  const springConfig = { stiffness: 300, damping: 30 };
+  const xSpring = useSpring(xMotion, springConfig);
+  const ySpring = useSpring(yMotion, springConfig);
+
+  const rotateX = useTransform(ySpring, [-0.5, 0.5], [3.5, -3.5]);
+  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-3.5, 3.5]);
+
+  // Touchscreen detection & safe SSR hydration
+  useEffect(() => {
+    if (typeof window === "undefined") return;
+    const mediaQuery = window.matchMedia("(pointer: coarse)");
+    setIsTouch(mediaQuery.matches);
+
+    const handlePointerChange = (e: MediaQueryListEvent) => {
+      setIsTouch(e.matches);
+    };
+
+    if (mediaQuery.addEventListener) {
+      mediaQuery.addEventListener("change", handlePointerChange);
+      return () => mediaQuery.removeEventListener("change", handlePointerChange);
+    }
+  }, []);
+
+  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
+    if (isTouch || !cardRef.current) return;
+    const rect = cardRef.current.getBoundingClientRect();
+    const x = (e.clientX - rect.left) / rect.width - 0.5;
+    const y = (e.clientY - rect.top) / rect.height - 0.5;
+
+    xMotion.set(x);
+    yMotion.set(y);
+
+    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
+    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
+    setGlarePos({ x: glareX, y: glareY });
+  };
+
+  const handleMouseEnter = () => {
+    if (isTouch) return;
+    setIsHovered(true);
+  };
+
+  const handleMouseLeave = () => {
+    setIsHovered(false);
+    xMotion.set(0);
+    yMotion.set(0);
+  };
 
   const discountPercent = product.originalPriceBDT
     ? Math.round(
@@ -34,8 +93,22 @@ export function ProductCard({ product }: ProductCardProps) {
   const handleAddToCart = (e: React.MouseEvent) => {
     e.stopPropagation();
     addItem(product, 1);
+    const sparkX =
+      e.clientX ||
+      (cardRef.current
+        ? cardRef.current.getBoundingClientRect().left +
+          cardRef.current.getBoundingClientRect().width / 2
+        : 0);
+    const sparkY =
+      e.clientY ||
+      (cardRef.current
+        ? cardRef.current.getBoundingClientRect().top +
+          cardRef.current.getBoundingClientRect().height / 2
+        : 0);
+    triggerSpark(sparkX, sparkY, "#10B981");
+    playHapticPop(0.08);
     setJustAdded(true);
-    setTimeout(() => setJustAdded(false), 1000);
+    setTimeout(() => setJustAdded(false), 1200);
   };
 
   const handleQuickView = (e: React.MouseEvent) => {
@@ -56,120 +129,152 @@ export function ProductCard({ product }: ProductCardProps) {
 
   return (
     <div
-      onClick={handleQuickView}
-      className="group relative flex flex-col rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 hover:-translate-y-1 hover:shadow-elevation transition-all duration-200 overflow-hidden cursor-pointer"
+      className="relative w-full h-full [perspective:1000px]"
+      style={{ perspective: 1000 }}
     >
-      {/* Product Image Area with Clean Padding & Object Contain */}
-      <div className="relative aspect-square bg-zinc-50/70 p-6 overflow-hidden border-b border-zinc-100 flex items-center justify-center">
-        <Image
-          src={product.image}
-          alt={product.name}
-          fill
-          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
-          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300 ease-out"
-        />
-
-        {/* Top Badges: Origin Pill & Discount */}
-        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
-          <span className="px-2 py-0.5 rounded-md bg-white text-[10px] font-mono font-medium text-zinc-800 shadow-2xs border border-zinc-200">
-            {originFlag}
-          </span>
-        </div>
+      <motion.div
+        ref={cardRef}
+        onClick={handleQuickView}
+        onMouseMove={handleMouseMove}
+        onMouseEnter={handleMouseEnter}
+        onMouseLeave={handleMouseLeave}
+        onTouchStart={() => {
+          setIsTouch(true);
+          setIsHovered(false);
+          xMotion.set(0);
+          yMotion.set(0);
+        }}
+        whileTap={{ scale: 0.98 }}
+        style={{
+          perspective: 1000,
+          transformStyle: "preserve-3d",
+          rotateX: isTouch ? 0 : rotateX,
+          rotateY: isTouch ? 0 : rotateY,
+        }}
+        className="group relative flex flex-col h-full rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 hover:shadow-elevation transition-[border-color,box-shadow] duration-200 overflow-hidden cursor-pointer"
+      >
+        {/* Cursor-Coupled Specular Glare Overlay */}
+        {isHovered && !isTouch && (
+          <div
+            className="absolute inset-0 pointer-events-none rounded-xl z-20 transition-opacity duration-300"
+            style={{
+              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.22), transparent 60%)`,
+            }}
+          />
+        )}
 
-        <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1 z-10">
-          {discountPercent && discountPercent > 0 && (
-            <span className="px-1.5 py-0.5 rounded bg-zinc-950 text-white text-[10px] font-mono font-bold tracking-tight">
-              -{discountPercent}%
-            </span>
-          )}
-        </div>
+        {/* Product Image Area with Clean Padding & Object Contain */}
+        <div className="relative aspect-square bg-zinc-50/70 p-6 overflow-hidden border-b border-zinc-100 flex items-center justify-center">
+          <Image
+            src={product.image}
+            alt={product.name}
+            fill
+            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
+            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300 ease-out"
+          />
 
-        {/* Scarcity Pill (Bottom Left) */}
-        {isLowStock && (
-          <div className="absolute bottom-2.5 left-2.5 z-10">
-            <span className="px-2 py-0.5 rounded-md bg-white text-[10px] font-medium text-red-600 border border-red-200 shadow-2xs flex items-center gap-1.5">
-              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
-              Only {product.stockCount} left in Dhaka
-            </span>
-          </div>
-        )}
+          {/* Top Badges: Origin Pill & Discount */}
+          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
+            <span className="px-2 py-0.5 rounded-md bg-white text-[10px] font-mono font-medium text-zinc-800 shadow-2xs border border-zinc-200">
+              {originFlag}
+            </span>
+          </div>
 
-        {/* Quick View Button Hover Overlay */}
-        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
-          <button
-            onClick={handleQuickView}
-            className="pointer-events-auto px-3 py-1.5 rounded-md bg-white text-zinc-900 text-xs font-medium shadow-sm border border-zinc-200 flex items-center gap-1.5 hover:bg-zinc-50 active:scale-95 transition-all"
-            title="Quick View"
-          >
-            <Eye className="w-3.5 h-3.5 text-zinc-500" />
-            <span>Quick View</span>
-          </button>
-        </div>
-      </div>
-
-      {/* Card Content & Pricing */}
-      <div className="p-4 flex flex-col flex-1 justify-between space-y-3 bg-white">
-        <div className="space-y-1.5">
-          {/* Category Brand & Star Rating */}
-          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
-            <span className="font-semibold uppercase tracking-wider text-zinc-600">
-              {product.brand}
-            </span>
-            <div className="flex items-center gap-1 font-medium text-zinc-800">
-              <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
-              <span>{product.rating}</span>
-              <span className="text-zinc-400">({product.reviewCount})</span>
-            </div>
+          <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1 z-10">
+            {discountPercent && discountPercent > 0 && (
+              <span className="px-1.5 py-0.5 rounded bg-zinc-950 text-white text-[10px] font-mono font-bold tracking-tight">
+                -{discountPercent}%
+              </span>
+            )}
           </div>
 
-          {/* Product Title (Sans-serif) */}
-          <h3 className="font-sans font-semibold text-zinc-950 text-sm line-clamp-2 leading-snug group-hover:text-zinc-700 transition-colors">
-            {product.name}
-          </h3>
+          {/* Scarcity Pill (Bottom Left) */}
+          {isLowStock && (
+            <div className="absolute bottom-2.5 left-2.5 z-10">
+              <span className="px-2 py-0.5 rounded-md bg-white text-[10px] font-medium text-red-600 border border-red-200 shadow-2xs flex items-center gap-1.5">
+                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
+                Only {product.stockCount} left in Dhaka
+              </span>
+            </div>
+          )}
 
-          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
-            {product.summary}
-          </p>
+          {/* Quick View Button Hover Overlay */}
+          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
+            <button
+              onClick={handleQuickView}
+              className="pointer-events-auto px-3 py-1.5 rounded-md bg-white text-zinc-900 text-xs font-medium shadow-sm border border-zinc-200 flex items-center gap-1.5 hover:bg-zinc-50 active:scale-95 transition-all"
+              title="Quick View"
+            >
+              <Eye className="w-3.5 h-3.5 text-zinc-500" />
+              <span>Quick View</span>
+            </button>
+          </div>
         </div>
 
-        {/* Pricing & Add to Cart Footer */}
-        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
-          <div>
-            <div className="text-base font-bold text-zinc-950 font-mono leading-none">
-              {formatBDT(product.priceBDT)}
-            </div>
-            {product.originalPriceBDT && (
-              <div className="text-[11px] text-zinc-400 line-through mt-0.5 font-mono">
-                {formatBDT(product.originalPriceBDT)}
+        {/* Card Content & Pricing */}
+        <div className="p-4 flex flex-col flex-1 justify-between space-y-3 bg-white">
+          <div className="space-y-1.5">
+            {/* Category Brand & Star Rating */}
+            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
+              <span className="font-semibold uppercase tracking-wider text-zinc-600">
+                {product.brand}
+              </span>
+              <div className="flex items-center gap-1 font-medium text-zinc-800">
+                <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
+                <span>{product.rating}</span>
+                <span className="text-zinc-400">({product.reviewCount})</span>
               </div>
-            )}
+            </div>
+
+            {/* Product Title (Sans-serif) */}
+            <h3 className="font-sans font-semibold text-zinc-950 text-sm line-clamp-2 leading-snug group-hover:text-zinc-700 transition-colors">
+              {product.name}
+            </h3>
+
+            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
+              {product.summary}
+            </p>
           </div>
 
-          <div className="flex items-center gap-1.5">
-            <button
-              onClick={handleAddToCart}
-              className={`px-3 py-1.5 rounded-md text-xs font-medium active:scale-95 transition-all shadow-2xs flex items-center gap-1.5 ${
-                justAdded
-                  ? "bg-emerald-600 text-white"
-                  : "bg-zinc-950 text-white hover:bg-zinc-800"
-              }`}
-              aria-label={`Add ${product.name} to cart`}
-            >
-              {justAdded ? (
-                <>
-                  <Check className="w-3.5 h-3.5" />
-                  <span>Added</span>
-                </>
-              ) : (
-                <>
-                  <Plus className="w-3.5 h-3.5" />
-                  <span>Add</span>
-                </>
+          {/* Pricing & Add to Cart Footer */}
+          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
+            <div>
+              <div className="text-base font-bold text-zinc-950 font-mono leading-none">
+                {formatBDT(product.priceBDT)}
+              </div>
+              {product.originalPriceBDT && (
+                <div className="text-[11px] text-zinc-400 line-through mt-0.5 font-mono">
+                  {formatBDT(product.originalPriceBDT)}
+                </div>
               )}
-            </button>
+            </div>
+
+            <div className="flex items-center gap-1.5">
+              <button
+                onClick={handleAddToCart}
+                className={`px-3 py-1.5 rounded-md text-xs font-medium active:scale-95 transition-all shadow-2xs flex items-center gap-1.5 ${
+                  justAdded
+                    ? "bg-emerald-600 text-white"
+                    : "bg-zinc-950 text-white hover:bg-zinc-800"
+                }`}
+                aria-label={`Add ${product.name} to cart`}
+              >
+                {justAdded ? (
+                  <>
+                    <Check className="w-3.5 h-3.5" />
+                    <span>Added</span>
+                  </>
+                ) : (
+                  <>
+                    <Plus className="w-3.5 h-3.5" />
+                    <span>Add</span>
+                  </>
+                )}
+              </button>
+            </div>
           </div>
         </div>
-      </div>
+      </motion.div>
     </div>
   );
 }
