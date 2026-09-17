# Review Package for Task 2

## Commits
7c875e5 feat(hero): dual-axis kinetic scroll typography and 3D floating sculpture swapper

## Stat
 src/components/HeroBanner.tsx | 666 ++++++++++++++++++++++++++++++++++++------
 src/lib/store.ts              |   2 +
 2 files changed, 579 insertions(+), 89 deletions(-)

## Full Diff
diff --git a/src/components/HeroBanner.tsx b/src/components/HeroBanner.tsx
index 4587583..56422e6 100644
--- a/src/components/HeroBanner.tsx
+++ b/src/components/HeroBanner.tsx
@@ -1,34 +1,262 @@
 "use client";
 
-import React from "react";
+import React, { useState, useEffect, useRef } from "react";
 import Image from "next/image";
+import {
+  motion,
+  useScroll,
+  useSpring,
+  useTransform,
+  useMotionValue,
+  AnimatePresence,
+} from "framer-motion";
 import {
   ShieldCheck,
   Zap,
   RotateCcw,
   ArrowRight,
   MessageCircle,
   ThermometerSnowflake,
-  Check,
   Plus,
+  ChevronLeft,
+  ChevronRight,
 } from "lucide-react";
-import { playHapticClick, playHapticPop } from "@/lib/sound";
-import { useStore } from "@/lib/store";
-import { PRODUCTS } from "@/data/products";
+import { playHapticClick, playHapticPop, playHapticGlass } from "@/lib/sound";
+import { triggerSpark } from "@/components/ClickSpark";
+import { useCartStore } from "@/lib/store";
+import { PRODUCTS, Product } from "@/data/products";
 import { formatBDT } from "@/lib/utils";
 
+export interface HeroPillar {
+  id: string;
+  category: string;
+  title: string;
+  subtitle: string;
+  priceBDT: number;
+  originalPriceBDT: number;
+  image: string;
+  auraColor: string;
+  badgeText: string;
+  pins: { label: string; sub: string; position: string }[];
+  specs: { batch: string; temp: string; expiry: string; origin: string };
+}
+
+export const HERO_PILLARS: HeroPillar[] = [
+  {
+    id: "mitavin-aptamil-gold-stage-1",
+    category: "Pediatric Care",
+    title: "Aptamil Gold+ Stage 1 Infant Tin (900g)",
+    subtitle: "Nutritionally complete infant formula with scGOS/lcFOS prebiotics, premium DHA, and continuous temperature monitoring.",
+    priceBDT: 4200,
+    originalPriceBDT: 4600,
+    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=85",
+    auraColor: "rgba(245, 158, 11, 0.12)",
+    badgeText: "BATCH VERIFIED • UK AIR IMPORT",
+    pins: [
+      { label: "✈ London LHR ➔ Dhaka Metro", sub: "Priority Airfreight", position: "top-4 left-4" },
+      { label: "❄ 2°C - 8°C Monitored", sub: "Cold Chain Active", position: "bottom-8 right-4" },
+    ],
+    specs: {
+      batch: "#LHR-94820-UK",
+      temp: "4.2°C Continuous",
+      expiry: "Nov 2027",
+      origin: "UK NHS Registered",
+    },
+  },
+  {
+    id: "mitavin-nmn-longevity-500",
+    category: "Cellular Longevity",
+    title: "Pure NMN 500mg + Trans-Resveratrol",
+    subtitle: "Enzymatic NAD+ biosynthesis precursor stabilized with pharmaceutical-grade resveratrol for cellular repair and mitochondrial resilience.",
+    priceBDT: 3850,
+    originalPriceBDT: 4300,
+    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=900&q=85",
+    auraColor: "rgba(6, 182, 212, 0.12)",
+    badgeText: "CLINICAL HPLC LOT • USA SOURCED",
+    pins: [
+      { label: "🧪 99.8% Purity Assured", sub: "Enzymatic Grade", position: "top-4 left-4" },
+      { label: "🧬 NAD+ Precursor", sub: "Cellular Energy", position: "bottom-8 right-4" },
+    ],
+    specs: {
+      batch: "#JFK-77412-USA",
+      temp: "Ambient <22°C",
+      expiry: "Aug 2028",
+      origin: "USA FDA Lot Assured",
+    },
+  },
+  {
+    id: "mitavin-cerave-bio-ceramide-cream",
+    category: "Clinical Dermatology",
+    title: "CeraVe Bio-Ceramide Moisturizing Cream",
+    subtitle: "Multivesicular emulsion (MVE) delivery vehicle with 3 identical bio-ceramides (1, 3, 6-II) to fortify the compromised skin barrier.",
+    priceBDT: 2150,
+    originalPriceBDT: 2450,
+    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85",
+    auraColor: "rgba(16, 185, 129, 0.12)",
+    badgeText: "DERMATOLOGIST VERIFIED • EU IMPORT",
+    pins: [
+      { label: "💧 3 Essential Ceramides", sub: "Barrier Restorative", position: "top-4 left-4" },
+      { label: "🛡 Tamper-Proof Sealed", sub: "Zero Adulteration", position: "bottom-8 right-4" },
+    ],
+    specs: {
+      batch: "#FRA-33821-EU",
+      temp: "Climate Controlled",
+      expiry: "Jan 2028",
+      origin: "EU Clinical Lot",
+    },
+  },
+];
+
 export function HeroBanner() {
-  const { addItem, openQuickView } = useStore();
+  const { addItem } = useCartStore();
+
+  // Scissoring Scroll Kinetic Typography
+  const sectionRef = useRef<HTMLElement>(null);
+  const [isMobile, setIsMobile] = useState(false);
+
+  useEffect(() => {
+    const checkMobile = () => {
+      setIsMobile(window.innerWidth < 768);
+    };
+    checkMobile();
+    window.addEventListener("resize", checkMobile);
+    return () => window.removeEventListener("resize", checkMobile);
+  }, []);
+
+  const { scrollYProgress } = useScroll({
+    target: sectionRef,
+    offset: ["start start", "end start"],
+  });
+
+  const smoothScroll = useSpring(scrollYProgress, {
+    stiffness: 100,
+    damping: 30,
+  });
+
+  const line1X = useTransform(smoothScroll, (v) => v * (isMobile ? -25 : -80));
+  const line2X = useTransform(smoothScroll, (v) => v * (isMobile ? 25 : 80));
+
+  // 3D Sculpture Swapper State
+  const [currentPillarIndex, setCurrentPillarIndex] = useState(0);
+  const [direction, setDirection] = useState(0);
+  const [showSpecs, setShowSpecs] = useState(false);
+
+  const currentPillar = HERO_PILLARS[currentPillarIndex];
+
+  // Gyro Tilt Physics
+  const cardRef = useRef<HTMLDivElement>(null);
+  const rawMouseX = useMotionValue(0);
+  const rawMouseY = useMotionValue(0);
+
+  const springMouseX = useSpring(rawMouseX, { stiffness: 300, damping: 30 });
+  const springMouseY = useSpring(rawMouseY, { stiffness: 300, damping: 30 });
+
+  const rotateY = useTransform(springMouseX, [-0.5, 0.5], [-6, 6]);
+  const rotateX = useTransform(springMouseY, [-0.5, 0.5], [6, -6]);
 
-  const featuredProduct =
-    PRODUCTS.find((p) => p.id === "mitavin-aptamil-gold-stage-1") || PRODUCTS[0];
+  const shadowScaleX = useTransform(springMouseX, [-0.5, 0.5], [0.92, 1.08]);
+  const shadowScaleY = useTransform(springMouseY, [-0.5, 0.5], [1.08, 0.92]);
+  const shadowOpacity = useTransform(springMouseY, [-0.5, 0.5], [0.25, 0.4]);
+
+  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
+    if (isMobile) return;
+    const rect = e.currentTarget.getBoundingClientRect();
+    if (!rect.width || !rect.height) return;
+    const x = (e.clientX - rect.left) / rect.width - 0.5;
+    const y = (e.clientY - rect.top) / rect.height - 0.5;
+    rawMouseX.set(x);
+    rawMouseY.set(y);
+  };
+
+  const handleMouseLeave = () => {
+    rawMouseX.set(0);
+    rawMouseY.set(0);
+  };
+
+  const nextPillar = () => {
+    playHapticGlass(0.05);
+    setDirection(1);
+    setCurrentPillarIndex((prev) => (prev + 1) % HERO_PILLARS.length);
+    setShowSpecs(false);
+  };
+
+  const prevPillar = () => {
+    playHapticGlass(0.05);
+    setDirection(-1);
+    setCurrentPillarIndex((prev) => (prev - 1 + HERO_PILLARS.length) % HERO_PILLARS.length);
+    setShowSpecs(false);
+  };
+
+  const selectPillar = (idx: number) => {
+    if (idx === currentPillarIndex) return;
+    playHapticClick(0.06);
+    setDirection(idx > currentPillarIndex ? 1 : -1);
+    setCurrentPillarIndex(idx);
+    setShowSpecs(false);
+  };
+
+  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
+    e.stopPropagation();
+    triggerSpark(e.clientX, e.clientY, "#10B981");
+    playHapticPop(0.12);
+
+    const existing = PRODUCTS.find((p) => p.id === currentPillar.id);
+    const productToAdd: Product = existing || {
+      id: currentPillar.id,
+      slug: currentPillar.id,
+      name: currentPillar.title,
+      brand:
+        currentPillar.category === "Cellular Longevity"
+          ? "Mitavin Bioceuticals"
+          : currentPillar.category === "Clinical Dermatology"
+          ? "CeraVe"
+          : "Aptamil",
+      category:
+        currentPillar.category === "Pediatric Care"
+          ? "mother-baby"
+          : currentPillar.category === "Cellular Longevity"
+          ? "vitamins-supplements"
+          : "dermatological-skincare",
+      categoryName: currentPillar.category,
+      priceBDT: currentPillar.priceBDT,
+      originalPriceBDT: currentPillar.originalPriceBDT,
+      inStock: true,
+      stockCount: 25,
+      importOrigin: currentPillar.specs.origin.includes("UK")
+        ? "UK Import"
+        : currentPillar.specs.origin.includes("USA")
+        ? "USA Sourced"
+        : "EU Import",
+      rating: 5.0,
+      reviewCount: 142,
+      verifiedBadge: true,
+      coldChainMonitored:
+        currentPillar.specs.temp.includes("°C") &&
+        !currentPillar.specs.temp.includes("Ambient"),
+      featured: true,
+      tags: [currentPillar.category, "Verified Batch", "Authentic"],
+      summary: currentPillar.subtitle,
+      description: currentPillar.subtitle,
+      specifications: {
+        "Batch Number": currentPillar.specs.batch,
+        "Storage Temperature": currentPillar.specs.temp,
+        "Expiry Verification": currentPillar.specs.expiry,
+        "Regulatory Assurance": currentPillar.specs.origin,
+      },
+      image: currentPillar.image,
+      gallery: [currentPillar.image],
+      reviews: [],
+    };
+
+    addItem(productToAdd, 1);
+  };
 
   const handleScrollToCatalog = () => {
     playHapticClick(0.08);
     const catalog = document.getElementById("catalog-section");
     if (catalog) {
       catalog.scrollIntoView({ behavior: "smooth" });
     }
   };
 
   const handleWhatsApp = () => {
@@ -56,21 +284,24 @@ export function HeroBanner() {
       subtitle: "Delivered under 4 hours",
     },
     {
       icon: RotateCcw,
       title: "7-Day Hassle-Free Exchange",
       subtitle: "Sealed Dermal Guarantee",
     },
   ];
 
   return (
-    <section className="relative overflow-hidden bg-white border-b border-zinc-200 py-12 sm:py-16 lg:py-20">
+    <section
+      ref={sectionRef}
+      className="relative overflow-hidden bg-white border-b border-zinc-200 py-12 sm:py-16 lg:py-20"
+    >
       {/* Vercel-Style Subtle Atmospheric Glow */}
       <div
         className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-zinc-100/70 rounded-full blur-3xl pointer-events-none -z-10"
         aria-hidden="true"
       />
 
       <div className="max-w-7xl mx-auto px-4 sm:px-8">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
           {/* Left Narrative Column (7 cols) */}
           <div className="lg:col-span-7 space-y-6">
@@ -78,27 +309,42 @@ export function HeroBanner() {
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs font-mono font-medium shadow-2xs">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
               </span>
               <span className="tracking-wide uppercase text-[11px] text-zinc-700">
                 DIRECT AIR-FREIGHTED • COLD-CHAIN MONITORED
               </span>
             </div>
 
-            {/* Display Title - 100% Sans */}
-            <div className="space-y-3 max-w-2xl">
-              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-bold tracking-tight text-zinc-950 leading-[1.08]">
-                The Authentic Longevity &amp; Pediatric Dispensary.
-              </h1>
-              <p className="text-base sm:text-lg text-zinc-600 leading-relaxed font-normal pt-1">
-                100% verified UK &amp; USA imported baby nutrition, clinical dermatology, and micronutrients delivered in Dhaka within 4 hours.
+            {/* Display Title - Dual-Axis Kinetic Scroll Scissoring (Wrapped in overflow-hidden) */}
+            <div className="space-y-1 max-w-2xl overflow-hidden py-1">
+              <div className="overflow-hidden">
+                <motion.div
+                  style={{ x: line1X }}
+                  className="text-4xl sm:text-5xl lg:text-6xl font-sans font-extrabold tracking-tight text-zinc-950 leading-[1.08] select-none whitespace-nowrap will-change-transform"
+                >
+                  THE AUTHENTIC
+                </motion.div>
+              </div>
+
+              <div className="overflow-hidden">
+                <motion.div
+                  style={{ x: line2X }}
+                  className="text-4xl sm:text-5xl lg:text-6xl font-sans font-extrabold tracking-tight text-emerald-600 leading-[1.08] select-none whitespace-nowrap will-change-transform"
+                >
+                  DISPENSARY.
+                </motion.div>
+              </div>
+
+              <p className="text-base sm:text-lg text-zinc-600 leading-relaxed font-normal pt-3">
+                100% verified UK &amp; USA imported baby nutrition, cellular longevity actives, and dermatological skincare delivered across Dhaka within 4 hours.
               </p>
             </div>
 
             {/* Action Buttons */}
             <div className="flex flex-wrap items-center gap-3 pt-2">
               <button
                 onClick={handleScrollToCatalog}
                 className="px-6 py-3 rounded-lg bg-zinc-950 text-white text-sm font-medium hover:bg-zinc-800 active:scale-95 transition-all shadow-sm flex items-center gap-2 group"
               >
                 <span>Shop Authentic Catalog</span>
@@ -129,99 +375,341 @@ export function HeroBanner() {
                     </div>
                     <div className="text-[11px] text-zinc-500 leading-tight">
                       {chip.subtitle}
                     </div>
                   </div>
                 );
               })}
             </div>
           </div>
 
-          {/* Right Product Showcase (5 cols) */}
-          <div className="lg:col-span-5 flex justify-center">
-            <div className="relative w-full max-w-md rounded-2xl bg-white border border-zinc-200 p-5 sm:p-6 shadow-elevation group hover:border-zinc-300 transition-all duration-300">
-              {/* Floating Vercel Batch Verified Card */}
-              <div className="absolute -top-3.5 right-6 z-20">
-                <div className="px-3 py-1 rounded-full bg-zinc-950 text-white text-[10px] font-mono font-medium tracking-wider uppercase shadow-md flex items-center gap-1.5 border border-zinc-800">
-                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
-                  <span>BATCH VERIFIED • UK AIR IMPORT</span>
-                </div>
+          {/* Right 3D Floating Sculpture Swapper Column (5 cols) */}
+          <div className="lg:col-span-5 flex flex-col items-center">
+            {/* Swapper Tabs & Direct Jump Pills */}
+            <div className="w-full max-w-md flex items-center justify-between mb-3 px-1">
+              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
+                {HERO_PILLARS.map((p, idx) => (
+                  <button
+                    key={p.id}
+                    onClick={() => selectPillar(idx)}
+                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all select-none whitespace-nowrap ${
+                      idx === currentPillarIndex
+                        ? "bg-zinc-950 text-white shadow-sm"
+                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80"
+                    }`}
+                  >
+                    {p.category}
+                  </button>
+                ))}
+              </div>
+
+              {/* Prev / Next Chevrons */}
+              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
+                <button
+                  onClick={prevPillar}
+                  className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 active:scale-95 transition-all shadow-2xs"
+                  aria-label="Previous Pillar"
+                >
+                  <ChevronLeft className="w-3.5 h-3.5" />
+                </button>
+                <button
+                  onClick={nextPillar}
+                  className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 active:scale-95 transition-all shadow-2xs"
+                  aria-label="Next Pillar"
+                >
+                  <ChevronRight className="w-3.5 h-3.5" />
+                </button>
               </div>
+            </div>
 
-              {/* Product Visual */}
-              <div className="relative aspect-square sm:aspect-[4/3] rounded-xl bg-zinc-50 p-4 overflow-hidden border border-zinc-200/60 flex items-center justify-center">
-                <Image
-                  src={featuredProduct.image}
-                  alt={featuredProduct.name}
-                  fill
-                  priority
-                  sizes="(max-width: 768px) 100vw, 400px"
-                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
+            {/* 3D Perspective Stage */}
+            <div
+              className="relative w-full max-w-md"
+              style={{ perspective: 1200 }}
+            >
+              {/* Tilt-Responsive Container */}
+              <motion.div
+                ref={cardRef}
+                onMouseMove={handleMouseMove}
+                onMouseLeave={handleMouseLeave}
+                style={{
+                  rotateX,
+                  rotateY,
+                  transformStyle: "preserve-3d",
+                }}
+                className="relative select-none"
+              >
+                {/* Dynamic Ambient Aura (Z=0) */}
+                <div
+                  style={{
+                    transform: "translateZ(0px)",
+                    backgroundColor: currentPillar.auraColor,
+                  }}
+                  className="absolute -top-12 -right-12 w-80 h-80 rounded-full blur-3xl transition-colors duration-700 pointer-events-none -z-10"
+                  aria-hidden="true"
                 />
 
-                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
-                  <span className="px-2 py-0.5 rounded-md bg-white text-[10px] font-mono font-medium text-zinc-700 border border-zinc-200 shadow-2xs">
-                    {featuredProduct.importOrigin}
-                  </span>
-                  {featuredProduct.coldChainMonitored && (
-                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[10px] font-mono font-medium text-blue-700 border border-blue-200 shadow-2xs">
-                      2°C–8°C Monitored
-                    </span>
-                  )}
-                </div>
-              </div>
+                {/* Dynamic Ground Shadow (Z=0) */}
+                <motion.div
+                  style={{
+                    scaleX: shadowScaleX,
+                    scaleY: shadowScaleY,
+                    opacity: shadowOpacity,
+                    transform: "translateZ(0px)",
+                  }}
+                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-zinc-950/20 rounded-full blur-xl pointer-events-none -z-10"
+                  aria-hidden="true"
+                />
 
-              {/* Details */}
-              <div className="mt-4 space-y-2">
-                <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
-                  <span className="font-semibold uppercase tracking-wider text-zinc-700">
-                    {featuredProduct.brand}
-                  </span>
-                  <span className="text-emerald-700 font-medium">Ready for Dispatch</span>
-                </div>
-
-                <h3 className="font-sans text-lg font-semibold text-zinc-950 leading-snug">
-                  {featuredProduct.name}
-                </h3>
-
-                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
-                  {featuredProduct.summary}
-                </p>
-              </div>
+                {/* Animated Pillar Swapper (3D Flip / Rotational Transition) */}
+                <AnimatePresence mode="wait" custom={direction}>
+                  <motion.div
+                    key={currentPillar.id}
+                    custom={direction}
+                    initial={{
+                      opacity: 0,
+                      rotateY: direction >= 0 ? 15 : -15,
+                      scale: 0.96,
+                    }}
+                    animate={{ opacity: 1, rotateY: 0, scale: 1 }}
+                    exit={{
+                      opacity: 0,
+                      rotateY: direction >= 0 ? -15 : 15,
+                      scale: 0.96,
+                    }}
+                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
+                    drag="x"
+                    dragConstraints={{ left: 0, right: 0 }}
+                    dragElastic={0.2}
+                    onDragEnd={(e, { offset, velocity }) => {
+                      const swipe = Math.abs(offset.x) * velocity.x;
+                      if (swipe < -80 || offset.x < -60) {
+                        nextPillar();
+                      } else if (swipe > 80 || offset.x > 60) {
+                        prevPillar();
+                      }
+                    }}
+                    style={{ transformStyle: "preserve-3d" }}
+                    className="relative w-full rounded-2xl bg-white border border-zinc-200 p-5 sm:p-6 shadow-elevation group hover:border-zinc-300 transition-colors duration-300"
+                  >
+                    {/* Floating Verified Badge (translateZ: 30px) */}
+                    <div
+                      style={{ transform: "translateZ(30px)" }}
+                      className="absolute -top-3.5 right-6 z-20 pointer-events-none"
+                    >
+                      <div className="px-3 py-1 rounded-full bg-zinc-950 text-white text-[10px] font-mono font-medium tracking-wider uppercase shadow-md flex items-center gap-1.5 border border-zinc-800">
+                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
+                        <span>{currentPillar.badgeText}</span>
+                      </div>
+                    </div>
 
-              {/* Pricing & CTA */}
-              <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between">
-                <div>
-                  <div className="text-xl font-bold text-zinc-950 font-mono">
-                    {formatBDT(featuredProduct.priceBDT)}
-                  </div>
-                  {featuredProduct.originalPriceBDT && (
-                    <div className="text-xs text-zinc-400 line-through font-mono">
-                      {formatBDT(featuredProduct.originalPriceBDT)}
+                    {/* Product Visual Container (translateZ: 65px) & Hotspot Pins (translateZ: 90px) */}
+                    <div
+                      style={{
+                        transform: "translateZ(65px)",
+                        transformStyle: "preserve-3d",
+                      }}
+                      className="relative aspect-square sm:aspect-[4/3] rounded-xl bg-gradient-to-b from-zinc-50 to-zinc-100/50 p-4 overflow-hidden border border-zinc-200/60 flex items-center justify-center"
+                    >
+                      <Image
+                        src={currentPillar.image}
+                        alt={currentPillar.title}
+                        fill
+                        priority
+                        sizes="(max-width: 768px) 100vw, 450px"
+                        className="object-contain p-4 drop-shadow-xl group-hover:scale-105 transition-transform duration-500 ease-out pointer-events-none"
+                      />
+
+                      {/* Hotspot Telemetry Pins (translateZ: 90px) */}
+                      {currentPillar.pins.map((pin, i) => (
+                        <div
+                          key={i}
+                          style={{ transform: "translateZ(90px)" }}
+                          className={`absolute ${pin.position} z-20 pointer-events-auto`}
+                        >
+                          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-950/85 text-white backdrop-blur-md border border-zinc-800/80 shadow-md">
+                            <span className="relative flex h-2 w-2 flex-shrink-0">
+                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
+                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
+                            </span>
+                            <div className="flex flex-col text-left">
+                              <span className="font-mono text-[10px] font-medium text-zinc-100 leading-none">
+                                {pin.label}
+                              </span>
+                              <span className="text-[9px] font-mono text-emerald-400 leading-tight">
+                                {pin.sub}
+                              </span>
+                            </div>
+                          </div>
+                        </div>
+                      ))}
                     </div>
-                  )}
-                </div>
 
-                <div className="flex items-center gap-2">
-                  <button
-                    onClick={() => openQuickView(featuredProduct)}
-                    className="px-3 py-1.5 rounded-md border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 text-xs font-medium transition-colors"
-                  >
-                    Quick Specs
-                  </button>
+                    {/* Product Details (translateZ: 30px) */}
+                    <div
+                      style={{ transform: "translateZ(30px)" }}
+                      className="mt-4 space-y-2"
+                    >
+                      <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
+                        <span className="font-semibold uppercase tracking-wider text-zinc-700">
+                          {currentPillar.category}
+                        </span>
+                        <span className="text-emerald-700 font-medium flex items-center gap-1">
+                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
+                          Ready for Dispatch
+                        </span>
+                      </div>
 
-                  <button
-                    onClick={() => addItem(featuredProduct, 1)}
-                    className="px-4 py-1.5 rounded-md bg-zinc-950 text-white text-xs font-medium hover:bg-zinc-800 active:scale-95 transition-all shadow-sm flex items-center gap-1"
-                  >
-                    <Plus className="w-3.5 h-3.5" />
-                    <span>Add to Cart</span>
-                  </button>
-                </div>
-              </div>
+                      <h3 className="font-sans text-lg font-semibold text-zinc-950 leading-snug line-clamp-1">
+                        {currentPillar.title}
+                      </h3>
+
+                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
+                        {currentPillar.subtitle}
+                      </p>
+                    </div>
+
+                    {/* Pricing & CTA Controls (translateZ: 30px) */}
+                    <div
+                      style={{ transform: "translateZ(30px)" }}
+                      className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between"
+                    >
+                      <div>
+                        <div className="text-xl font-bold text-zinc-950 font-mono">
+                          {formatBDT(currentPillar.priceBDT)}
+                        </div>
+                        {currentPillar.originalPriceBDT && (
+                          <div className="text-xs text-zinc-400 line-through font-mono">
+                            {formatBDT(currentPillar.originalPriceBDT)}
+                          </div>
+                        )}
+                      </div>
+
+                      <div className="flex items-center gap-2">
+                        <button
+                          onClick={() => {
+                            playHapticGlass(0.06);
+                            setShowSpecs((prev) => !prev);
+                          }}
+                          className="px-3 py-1.5 rounded-md border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 text-xs font-mono font-medium transition-colors"
+                        >
+                          {showSpecs ? "Visual" : "Quick Specs"}
+                        </button>
+
+                        <button
+                          onClick={handleAddToCart}
+                          className="px-4 py-1.5 rounded-md bg-zinc-950 text-white text-xs font-medium hover:bg-zinc-800 active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
+                        >
+                          <Plus className="w-3.5 h-3.5 text-emerald-400" />
+                          <span>+ Add to Dispensary Cart</span>
+                        </button>
+                      </div>
+                    </div>
+
+                    {/* Interactive Clinical Telemetry Quick Specs Overlay (translateZ: 85px) */}
+                    <AnimatePresence>
+                      {showSpecs && (
+                        <motion.div
+                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
+                          animate={{ opacity: 1, scale: 1, y: 0 }}
+                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
+                          transition={{
+                            duration: 0.25,
+                            ease: [0.16, 1, 0.3, 1],
+                          }}
+                          style={{ transform: "translateZ(85px)" }}
+                          className="absolute inset-0 z-30 rounded-2xl bg-zinc-950/95 text-white p-5 sm:p-6 flex flex-col justify-between backdrop-blur-xl border border-zinc-800 shadow-2xl"
+                        >
+                          <div>
+                            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
+                              <div className="flex items-center gap-2">
+                                <span className="relative flex h-2 w-2">
+                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
+                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
+                                </span>
+                                <span className="font-mono text-[11px] font-semibold tracking-wider text-emerald-400 uppercase">
+                                  Clinical Telemetry Feed
+                                </span>
+                              </div>
+                              <button
+                                onClick={() => {
+                                  playHapticGlass(0.06);
+                                  setShowSpecs(false);
+                                }}
+                                className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-[10px] font-mono text-zinc-300 transition-colors"
+                              >
+                                ✕ Close
+                              </button>
+                            </div>
+
+                            <div className="mt-4 space-y-2.5 font-mono text-xs">
+                              <div className="flex justify-between items-center py-1.5 border-b border-zinc-800/60">
+                                <span className="text-zinc-400 text-[11px]">
+                                  BATCH CONTROL:
+                                </span>
+                                <span className="text-zinc-100 font-medium tracking-wide">
+                                  {currentPillar.specs.batch}
+                                </span>
+                              </div>
+                              <div className="flex justify-between items-center py-1.5 border-b border-zinc-800/60">
+                                <span className="text-zinc-400 text-[11px]">
+                                  COLD CHAIN SENSOR:
+                                </span>
+                                <span className="text-emerald-400 font-semibold tracking-wide">
+                                  {currentPillar.specs.temp}
+                                </span>
+                              </div>
+                              <div className="flex justify-between items-center py-1.5 border-b border-zinc-800/60">
+                                <span className="text-zinc-400 text-[11px]">
+                                  EXPIRATION:
+                                </span>
+                                <span className="text-zinc-100 font-medium tracking-wide">
+                                  {currentPillar.specs.expiry}
+                                </span>
+                              </div>
+                              <div className="flex justify-between items-center py-1.5 border-b border-zinc-800/60">
+                                <span className="text-zinc-400 text-[11px]">
+                                  ORIGIN CONTROL:
+                                </span>
+                                <span className="text-zinc-100 font-medium tracking-wide">
+                                  {currentPillar.specs.origin}
+                                </span>
+                              </div>
+                              <div className="flex justify-between items-center py-1.5">
+                                <span className="text-zinc-400 text-[11px]">
+                                  SEAL INTEGRITY:
+                                </span>
+                                <span className="text-emerald-400 font-semibold tracking-wide flex items-center gap-1">
+                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
+                                  100% Hermetic Seal Passed
+                                </span>
+                              </div>
+                            </div>
+                          </div>
+
+                          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
+                            <span className="text-[10px] text-zinc-400 font-mono">
+                              Verified Heathrow Node
+                            </span>
+                            <button
+                              onClick={() => {
+                                playHapticGlass(0.06);
+                                setShowSpecs(false);
+                              }}
+                              className="px-3 py-1.5 rounded-md bg-white text-zinc-950 font-sans font-medium text-xs hover:bg-zinc-200 transition-colors"
+                            >
+                              Back to 3D Visual
+                            </button>
+                          </div>
+                        </motion.div>
+                      )}
+                    </AnimatePresence>
+                  </motion.div>
+                </AnimatePresence>
+              </motion.div>
             </div>
           </div>
         </div>
       </div>
     </section>
   );
 }
diff --git a/src/lib/store.ts b/src/lib/store.ts
index bc76daa..0889c06 100644
--- a/src/lib/store.ts
+++ b/src/lib/store.ts
@@ -329,10 +329,12 @@ export const useStore = create<StoreState>()(
       name: "mitavin_store_persistence",
       storage: createJSONStorage(() => localStorage),
       partialize: (state) => ({
         items: state.items,
         soundEnabled: state.soundEnabled,
         promoCode: state.promoCode,
       }),
     }
   )
 );
+
+export const useCartStore = useStore;
