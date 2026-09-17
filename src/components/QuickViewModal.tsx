"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  Plus,
  Minus,
  Check,
  ShieldCheck,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { playHapticClick, playHapticPop } from "@/lib/sound";
import { formatBDT } from "@/lib/utils";

export function QuickViewModal() {
  const {
    isQuickViewOpen,
    activeQuickViewProduct,
    closeQuickView,
    addItem,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!activeQuickViewProduct) return null;

  const product = activeQuickViewProduct;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      closeQuickView();
    }, 500);
  };

  const handleQtyChange = (delta: number) => {
    const next = quantity + delta;
    if (next >= 1 && next <= (product.stockCount || 99)) {
      if (delta > 0) playHapticPop(0.08);
      else playHapticClick(0.06);
      setQuantity(next);
    }
  };

  return (
    <AnimatePresence>
      {isQuickViewOpen && (
        <div className="fixed inset-0 z-modal overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 30, stiffness: 380 }}
              className="relative w-full max-w-2xl rounded-2xl bg-white border border-zinc-200 shadow-floating p-6 sm:p-7 space-y-5 overflow-hidden my-6"
            >
              {/* Close Button */}
              <button
                onClick={closeQuickView}
                className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors z-10"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                {/* Product Image */}
                <div className="sm:col-span-5 relative aspect-square rounded-xl bg-zinc-50 overflow-hidden border border-zinc-200 p-4 flex items-center justify-center">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 300px"
                    className="object-contain p-4"
                  />

                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-white text-[10px] font-mono font-medium text-zinc-800 shadow-2xs border border-zinc-200">
                      {product.importOrigin}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="sm:col-span-7 space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-zinc-500 font-mono mb-1">
                      <span className="font-semibold uppercase tracking-wider text-zinc-600">
                        {product.brand}
                      </span>
                      <div className="flex items-center gap-1 font-medium text-zinc-900">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-zinc-400">({product.reviewCount})</span>
                      </div>
                    </div>

                    <h3 className="font-sans text-xl font-bold tracking-tight text-zinc-950 leading-snug">
                      {product.name}
                    </h3>

                    <div className="flex items-baseline gap-2 mt-1.5">
                      <div className="text-xl font-bold text-zinc-950 font-mono">
                        {formatBDT(product.priceBDT)}
                      </div>
                      {product.originalPriceBDT && (
                        <div className="text-xs text-zinc-400 line-through font-mono">
                          {formatBDT(product.originalPriceBDT)}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Specifications */}
                  <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs space-y-1 font-mono">
                    <div className="font-bold text-zinc-800 uppercase tracking-wider text-[10px] pb-0.5">
                      Product Specifications
                    </div>
                    {Object.entries(product.specifications).slice(0, 3).map(([key, val]) => (
                      <div key={key} className="flex justify-between gap-2 text-[11px]">
                        <span className="text-zinc-500">{key}:</span>
                        <span className="text-zinc-800 text-right truncate">{val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-1 flex items-center gap-2.5">
                    <div className="flex items-center gap-2 border border-zinc-200 rounded-lg px-2.5 py-1.5 bg-zinc-50">
                      <button
                        onClick={() => handleQtyChange(-1)}
                        className="p-0.5 text-zinc-500 hover:text-zinc-900 active:scale-90 transition-transform"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-mono font-bold px-1.5 text-zinc-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQtyChange(1)}
                        className="p-0.5 text-zinc-500 hover:text-zinc-900 active:scale-90 transition-transform"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-2.5 rounded-lg bg-zinc-950 text-white text-xs font-medium hover:bg-zinc-800 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      {added ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <span>Add to Cart • {formatBDT(product.priceBDT * quantity)}</span>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Manufacturer sealed • Batch verifiable in Dhaka</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
