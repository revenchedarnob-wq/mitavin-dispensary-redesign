"use client";

import React from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Zap,
  Stethoscope,
  RotateCcw,
  ArrowDownRight,
  MessageCircle,
  Sparkles,
  Plane,
  ThermometerSnowflake,
  Plus,
} from "lucide-react";
import { playHapticClick, playHapticPop } from "@/lib/sound";
import { useStore } from "@/lib/store";
import { PRODUCTS } from "@/data/products";
import { formatBDT } from "@/lib/utils";

export function HeroBanner() {
  const { addItem, openQuickView } = useStore();

  // Highlighted luxury hero SKU: Aptamil Gold+ Stage 1 or CeraVe Mineral Sunscreen
  const featuredHeroProduct =
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

  const trustBadges = [
    {
      icon: ShieldCheck,
      title: "100% UK & USA Authenticity",
      subtitle: "10x Money-Back Lab Pledge",
      color: "text-brand-champagne",
    },
    {
      icon: Zap,
      title: "Same-Day Dhaka Delivery",
      subtitle: "Under 4 Hours for Cold-Chain",
      color: "text-brand-emerald",
    },
    {
      icon: Stethoscope,
      title: "Licensed Pharmacist Vetted",
      subtitle: "Every Batch Lab-Inspected",
      color: "text-blue-600",
    },
    {
      icon: RotateCcw,
      title: "7-Day Hassle-Free Returns",
      subtitle: "Sealed Dermal Exchange",
      color: "text-emerald-700",
    },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:py-20 border-b border-whisper bg-gradient-to-b from-canvas via-canvas to-card/60">
      {/* Subtle organic radial illumination */}
      <div
        className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-emerald/[0.035] rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-brand-champagne/[0.04] rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Editorial Narrative Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Clinical Provenance Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-brand-emerald-subtle border border-brand-emerald/20 text-ink-primary text-xs font-semibold tracking-wide shadow-whisper">
              <span className="flex h-2 w-2 rounded-full bg-brand-emerald animate-pulse" />
              <span className="text-brand-emerald uppercase tracking-wider text-[10px] font-bold">
                Anti-Counterfeit Protocol
              </span>
              <span className="text-ink-faint">|</span>
              <span className="text-ink-muted text-xs">Direct Temperature-Logged Air Imports</span>
            </div>

            {/* Editorial Serif Display Headline */}
            <div className="space-y-3 max-w-2xl">
              <h1 className="text-4xl sm:text-6xl lg:text-[4.25rem] font-serif tracking-tight text-ink-primary leading-[1.04]">
                Pure Formulations.{" "}
                <span className="italic font-light text-brand-emerald underline decoration-brand-emerald/30 decoration-wavy underline-offset-8">
                  Verified Provenance.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-ink-muted leading-relaxed font-light pt-2">
                Bangladesh’s clinical dispensary for authenticated infant formulas, dermatological barrier repairs, and pharmaceutical longevity vitamins. Directly air-freighted from British and American laboratories to your doorstep.
              </p>
            </div>

            {/* CTAs: Catalog Exploration & Pharmacist Direct Line */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleScrollToCatalog}
                className="px-7 py-3.5 rounded-full bg-ink-primary text-white text-sm font-semibold hover:bg-black active:scale-95 transition-all shadow-elevation flex items-center gap-2 group"
              >
                <span>Explore Clinical Catalog</span>
                <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={handleWhatsApp}
                className="px-6 py-3.5 rounded-full bg-card border border-whisper hover:border-brand-emerald/50 text-ink-primary text-sm font-semibold hover:bg-brand-emerald-subtle active:scale-95 transition-all shadow-whisper flex items-center gap-2.5 text-emerald-800"
              >
                <MessageCircle className="w-4 h-4 text-brand-emerald fill-brand-emerald/20" />
                <span>WhatsApp Pharmacist</span>
              </button>
            </div>

            {/* 4 Trust Value Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-6 border-t border-whisper">
              {trustBadges.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-card/80 border border-whisper shadow-whisper hover:border-brand-emerald/30 transition-colors"
                  >
                    <div className="p-2 rounded-xl bg-canvas border border-whisper flex-shrink-0">
                      <Icon className={`w-4 h-4 ${badge.color}`} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-ink-primary leading-tight">
                        {badge.title}
                      </h4>
                      <p className="text-[11px] text-ink-muted mt-0.5 leading-tight">
                        {badge.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Luxury Featured Showcase Card (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md rounded-[2.5rem] bg-card border border-whisper shadow-floating p-6 sm:p-7 space-y-6 group hover:border-brand-emerald/40 transition-all duration-500">
              {/* Floating Holographic Authenticity Seal */}
              <div className="absolute -top-3.5 right-6 z-20">
                <div className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-brand-champagne text-white text-[10px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5 border border-amber-300/40">
                  <Sparkles className="w-3 h-3 fill-white" />
                  <span>BATCH VERIFIED • UK / USA</span>
                </div>
              </div>

              {/* Product Visual Container */}
              <div className="relative aspect-[4/3] rounded-3xl bg-canvas overflow-hidden border border-whisper">
                <Image
                  src={featuredHeroProduct.image}
                  alt={featuredHeroProduct.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-ink-primary shadow-sm border border-whisper flex items-center gap-1">
                    <Plane className="w-2.5 h-2.5 text-brand-emerald" />
                    {featuredHeroProduct.importOrigin}
                  </span>
                  {featuredHeroProduct.coldChainMonitored && (
                    <span className="px-2.5 py-1 rounded-full bg-blue-50/95 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-blue-900 shadow-sm border border-blue-200 flex items-center gap-1">
                      <ThermometerSnowflake className="w-2.5 h-2.5 text-blue-600" />
                      2°C–8°C Monitored
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3">
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-xs font-bold text-ink-primary shadow-sm border border-whisper">
                    ★ {featuredHeroProduct.rating} ({featuredHeroProduct.reviewCount} Reviews)
                  </span>
                </div>
              </div>

              {/* Showcase Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-ink-muted">
                  <span className="font-bold uppercase tracking-wider text-brand-emerald">
                    {featuredHeroProduct.brand}
                  </span>
                  <span className="text-emerald-700 font-medium">In Stock: Dhaka Central Hub</span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-primary leading-snug group-hover:text-brand-emerald transition-colors">
                  {featuredHeroProduct.name}
                </h3>

                <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed font-light">
                  {featuredHeroProduct.summary}
                </p>
              </div>

              {/* Price & Action Row */}
              <div className="pt-4 border-t border-whisper flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-ink-primary font-mono">
                    {formatBDT(featuredHeroProduct.priceBDT)}
                  </div>
                  {featuredHeroProduct.originalPriceBDT && (
                    <div className="text-xs text-ink-faint line-through">
                      {formatBDT(featuredHeroProduct.originalPriceBDT)}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openQuickView(featuredHeroProduct)}
                    className="px-3 py-2 rounded-full border border-whisper text-ink-muted hover:text-ink-primary hover:border-ink-primary text-xs font-semibold transition-colors"
                  >
                    Quick Specs
                  </button>

                  <button
                    onClick={() => {
                      addItem(featuredHeroProduct, 1);
                    }}
                    className="px-4 py-2.5 rounded-full bg-brand-emerald text-white text-xs font-bold hover:bg-emerald-700 active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
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
