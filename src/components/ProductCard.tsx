"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Eye,
  Plus,
  Plane,
  ThermometerSnowflake,
  Star,
  Check,
  Sparkles,
} from "lucide-react";
import { Product } from "@/data/products";
import { useStore } from "@/lib/store";
import { playHapticPop, playHapticGlass } from "@/lib/sound";
import { formatBDT } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openQuickView } = useStore();
  const [justAdded, setJustAdded] = useState(false);

  const discountPercent = product.originalPriceBDT
    ? Math.round(
        ((product.originalPriceBDT - product.priceBDT) /
          product.originalPriceBDT) *
          100
      )
    : null;

  const isLowStock = product.stockCount > 0 && product.stockCount < 10;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    playHapticGlass(0.06);
    openQuickView(product);
  };

  return (
    <div
      onClick={handleQuickView}
      className="group relative flex flex-col rounded-2xl bg-card border border-ink-primary/10 hover:border-brand-emerald/40 shadow-whisper hover:shadow-elevation transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Product Visual Area */}
      <div className="relative aspect-[4/3] bg-canvas overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top-Left Pills: Import Origin & Temperature Status */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-ink-primary shadow-sm border border-whisper flex items-center gap-1">
            <Plane className="w-2.5 h-2.5 text-brand-emerald" />
            {product.importOrigin}
          </span>

          {product.coldChainMonitored && (
            <span className="px-2 py-0.5 rounded-full bg-blue-50/95 backdrop-blur-sm text-[9px] font-bold uppercase tracking-wider text-blue-900 shadow-sm border border-blue-200 flex items-center gap-1">
              <ThermometerSnowflake className="w-2.5 h-2.5 text-blue-600" />
              Cold Chain
            </span>
          )}
        </div>

        {/* Top-Right Badges: Discount or Verified */}
        <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1 z-10">
          {discountPercent && discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-scarcity-crimson text-white text-[10px] font-bold tracking-tight shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Stock Scarcity Overlay Pill (Bottom Left of Image) */}
        {isLowStock && (
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-semibold text-scarcity-crimson shadow-sm border border-scarcity-crimson/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-scarcity-crimson animate-pulse" />
              Only {product.stockCount} left in Dhaka
            </span>
          </div>
        )}

        {/* Quick View Hover Trigger (Desktop) */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <button
            onClick={handleQuickView}
            className="pointer-events-auto px-3.5 py-1.5 rounded-full bg-white/95 text-ink-primary text-xs font-semibold shadow-floating flex items-center gap-1.5 hover:bg-white hover:scale-105 active:scale-95 transition-all"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5 text-ink-muted" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Content & Pricing */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Category & Star Rating */}
          <div className="flex items-center justify-between text-[11px] text-ink-muted">
            <span className="font-bold uppercase tracking-wider text-ink-faint">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 font-semibold text-ink-primary">
              <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-ink-faint">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-medium text-ink-primary text-sm sm:text-base line-clamp-2 group-hover:text-brand-emerald transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Clinical summary */}
          <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed font-light">
            {product.summary}
          </p>
        </div>

        {/* Pricing & Add to Cart Footer */}
        <div className="pt-2 border-t border-whisper flex items-center justify-between">
          <div>
            <div className="text-base sm:text-lg font-bold text-ink-primary font-mono leading-none">
              {formatBDT(product.priceBDT)}
            </div>
            {product.originalPriceBDT && (
              <div className="text-[11px] text-ink-faint line-through mt-0.5 font-mono">
                {formatBDT(product.originalPriceBDT)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold active:scale-95 transition-all shadow-sm flex items-center gap-1.5 ${
              justAdded
                ? "bg-emerald-800 text-white"
                : "bg-brand-emerald text-white hover:bg-emerald-700"
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
