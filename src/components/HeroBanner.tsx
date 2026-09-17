"use client";

import React from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Zap,
  RotateCcw,
  ArrowRight,
  MessageCircle,
  ThermometerSnowflake,
  Check,
  Plus,
} from "lucide-react";
import { playHapticClick, playHapticPop } from "@/lib/sound";
import { useStore } from "@/lib/store";
import { PRODUCTS } from "@/data/products";
import { formatBDT } from "@/lib/utils";

export function HeroBanner() {
  const { addItem, openQuickView } = useStore();

  const featuredProduct =
    PRODUCTS.find((p) => p.id === "mitavin-aptamil-gold-stage-1") || PRODUCTS[0];

  const handleScrollToCatalog = () => {
    playHapticClick(0.08);
    const catalog = document.getElementById("catalog-section");
    if (catalog) {
      catalog.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleWhatsApp = () => {
    playHapticClick(0.08);
    window.open(
      "https://wa.me/8801978303867?text=Hello%20Mitavin%20Pharmacist,%20I%20would%20like%20to%20verify%20a%20product%20batch%20and%20consult%20on%20an%20order.",
      "_blank"
    );
  };

  const trustChips = [
    {
      icon: ShieldCheck,
      title: "10x Money-Back Pledge",
      subtitle: "Authenticity Guaranteed",
    },
    {
      icon: ThermometerSnowflake,
      title: "Cold-Chain Logged",
      subtitle: "2°C – 8°C Monitored",
    },
    {
      icon: Zap,
      title: "Same-Day Dhaka Express",
      subtitle: "Delivered under 4 hours",
    },
    {
      icon: RotateCcw,
      title: "7-Day Hassle-Free Exchange",
      subtitle: "Sealed Dermal Guarantee",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white border-b border-zinc-200 py-12 sm:py-16 lg:py-20">
      {/* Vercel-Style Subtle Atmospheric Glow */}
      <div
        className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-zinc-100/70 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Narrative Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Vercel Beacon Chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs font-mono font-medium shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="tracking-wide uppercase text-[11px] text-zinc-700">
                DIRECT AIR-FREIGHTED • COLD-CHAIN MONITORED
              </span>
            </div>

            {/* Display Title - 100% Sans */}
            <div className="space-y-3 max-w-2xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-bold tracking-tight text-zinc-950 leading-[1.08]">
                The Authentic Longevity &amp; Pediatric Dispensary.
              </h1>
              <p className="text-base sm:text-lg text-zinc-600 leading-relaxed font-normal pt-1">
                100% verified UK &amp; USA imported baby nutrition, clinical dermatology, and micronutrients delivered in Dhaka within 4 hours.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleScrollToCatalog}
                className="px-6 py-3 rounded-lg bg-zinc-950 text-white text-sm font-medium hover:bg-zinc-800 active:scale-95 transition-all shadow-sm flex items-center gap-2 group"
              >
                <span>Shop Authentic Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={handleWhatsApp}
                className="px-5 py-3 rounded-lg bg-white border border-zinc-200 text-zinc-900 text-sm font-medium hover:bg-zinc-50 active:scale-95 transition-all shadow-2xs flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Consult on WhatsApp</span>
              </button>
            </div>

            {/* 4 High-Tech Trust Chips (Grid of 4) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-zinc-200">
              {trustChips.map((chip, idx) => {
                const Icon = chip.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-zinc-50/80 border border-zinc-200/80 space-y-1 hover:border-zinc-300 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-zinc-700 mb-1.5" />
                    <div className="text-xs font-semibold text-zinc-900 leading-tight">
                      {chip.title}
                    </div>
                    <div className="text-[11px] text-zinc-500 leading-tight">
                      {chip.subtitle}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Product Showcase (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md rounded-2xl bg-white border border-zinc-200 p-5 sm:p-6 shadow-elevation group hover:border-zinc-300 transition-all duration-300">
              {/* Floating Vercel Batch Verified Card */}
              <div className="absolute -top-3.5 right-6 z-20">
                <div className="px-3 py-1 rounded-full bg-zinc-950 text-white text-[10px] font-mono font-medium tracking-wider uppercase shadow-md flex items-center gap-1.5 border border-zinc-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>BATCH VERIFIED • UK AIR IMPORT</span>
                </div>
              </div>

              {/* Product Visual */}
              <div className="relative aspect-square sm:aspect-[4/3] rounded-xl bg-zinc-50 p-4 overflow-hidden border border-zinc-200/60 flex items-center justify-center">
                <Image
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                  <span className="px-2 py-0.5 rounded-md bg-white text-[10px] font-mono font-medium text-zinc-700 border border-zinc-200 shadow-2xs">
                    {featuredProduct.importOrigin}
                  </span>
                  {featuredProduct.coldChainMonitored && (
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[10px] font-mono font-medium text-blue-700 border border-blue-200 shadow-2xs">
                      2°C–8°C Monitored
                    </span>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <span className="font-semibold uppercase tracking-wider text-zinc-700">
                    {featuredProduct.brand}
                  </span>
                  <span className="text-emerald-700 font-medium">Ready for Dispatch</span>
                </div>

                <h3 className="font-sans text-lg font-semibold text-zinc-950 leading-snug">
                  {featuredProduct.name}
                </h3>

                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                  {featuredProduct.summary}
                </p>
              </div>

              {/* Pricing & CTA */}
              <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold text-zinc-950 font-mono">
                    {formatBDT(featuredProduct.priceBDT)}
                  </div>
                  {featuredProduct.originalPriceBDT && (
                    <div className="text-xs text-zinc-400 line-through font-mono">
                      {formatBDT(featuredProduct.originalPriceBDT)}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openQuickView(featuredProduct)}
                    className="px-3 py-1.5 rounded-md border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 text-xs font-medium transition-colors"
                  >
                    Quick Specs
                  </button>

                  <button
                    onClick={() => addItem(featuredProduct, 1)}
                    className="px-4 py-1.5 rounded-md bg-zinc-950 text-white text-xs font-medium hover:bg-zinc-800 active:scale-95 transition-all shadow-sm flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
