"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Eye,
  Plus,
  Star,
  Check,
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
    setTimeout(() => setJustAdded(false), 1000);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    playHapticGlass(0.06);
    openQuickView(product);
  };

  const originFlag = product.importOrigin.includes("UK")
    ? "🇬🇧 UK Import"
    : product.importOrigin.includes("USA")
    ? "🇺🇸 USA Sourced"
    : product.importOrigin.includes("Australia")
    ? "🇦🇺 Australia"
    : product.importOrigin.includes("Germany")
    ? "🇩🇪 Germany"
    : product.importOrigin;

  return (
    <div
      onClick={handleQuickView}
      className="group relative flex flex-col rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 hover:-translate-y-1 hover:shadow-elevation transition-all duration-200 overflow-hidden cursor-pointer"
    >
      {/* Product Image Area with Clean Padding & Object Contain */}
      <div className="relative aspect-square bg-zinc-50/70 p-6 overflow-hidden border-b border-zinc-100 flex items-center justify-center">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300 ease-out"
        />

        {/* Top Badges: Origin Pill & Discount */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          <span className="px-2 py-0.5 rounded-md bg-white text-[10px] font-mono font-medium text-zinc-800 shadow-2xs border border-zinc-200">
            {originFlag}
          </span>
        </div>

        <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1 z-10">
          {discountPercent && discountPercent > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-zinc-950 text-white text-[10px] font-mono font-bold tracking-tight">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Scarcity Pill (Bottom Left) */}
        {isLowStock && (
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span className="px-2 py-0.5 rounded-md bg-white text-[10px] font-medium text-red-600 border border-red-200 shadow-2xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Only {product.stockCount} left in Dhaka
            </span>
          </div>
        )}

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <button
            onClick={handleQuickView}
            className="pointer-events-auto px-3 py-1.5 rounded-md bg-white text-zinc-900 text-xs font-medium shadow-sm border border-zinc-200 flex items-center gap-1.5 hover:bg-zinc-50 active:scale-95 transition-all"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-500" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Content & Pricing */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3 bg-white">
        <div className="space-y-1.5">
          {/* Category Brand & Star Rating */}
          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span className="font-semibold uppercase tracking-wider text-zinc-600">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 font-medium text-zinc-800">
              <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-zinc-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title (Sans-serif) */}
          <h3 className="font-sans font-semibold text-zinc-950 text-sm line-clamp-2 leading-snug group-hover:text-zinc-700 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
            {product.summary}
          </p>
        </div>

        {/* Pricing & Add to Cart Footer */}
        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
          <div>
            <div className="text-base font-bold text-zinc-950 font-mono leading-none">
              {formatBDT(product.priceBDT)}
            </div>
            {product.originalPriceBDT && (
              <div className="text-[11px] text-zinc-400 line-through mt-0.5 font-mono">
                {formatBDT(product.originalPriceBDT)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleAddToCart}
              className={`px-3 py-1.5 rounded-md text-xs font-medium active:scale-95 transition-all shadow-2xs flex items-center gap-1.5 ${
                justAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-950 text-white hover:bg-zinc-800"
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
    </div>
  );
}
