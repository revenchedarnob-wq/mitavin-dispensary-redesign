"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plane,
  ThermometerSnowflake,
  Star,
  Plus,
  Minus,
  Check,
  ShieldCheck,
  Sparkles,
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
    }, 600);
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
            className="fixed inset-0 bg-black/55 backdrop-blur-sm"
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ type: "spring", damping: 30, stiffness: 360 }}
              className="relative w-full max-w-3xl rounded-[2.5rem] bg-card border border-whisper shadow-floating p-6 sm:p-8 space-y-6 overflow-hidden my-8"
            >
              {/* Close Button */}
              <button
                onClick={closeQuickView}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-canvas text-ink-muted hover:text-ink-primary transition-colors active:scale-95 z-10"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center">
                {/* Left: Product Image */}
                <div className="sm:col-span-6 relative aspect-square rounded-3xl bg-canvas overflow-hidden border border-whisper">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="object-cover"
                  />

                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-ink-primary shadow-sm border border-whisper flex items-center gap-1">
                      <Plane className="w-2.5 h-2.5 text-brand-emerald" />
                      {product.importOrigin}
                    </span>

                    {product.coldChainMonitored && (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50/95 text-[9px] font-bold uppercase tracking-wider text-blue-900 shadow-sm border border-blue-200 flex items-center gap-1">
                        <ThermometerSnowflake className="w-2.5 h-2.5 text-blue-600" />
                        2°C–8°C Monitored
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Clinical Details */}
                <div className="sm:col-span-6 space-y-5">
                  <div>
                    <div className="flex items-center justify-between text-xs text-ink-muted mb-1">
                      <span className="font-bold uppercase tracking-wider text-brand-emerald">
                        {product.brand}
                      </span>
                      <div className="flex items-center gap-1 font-semibold text-ink-primary">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-ink-faint">({product.reviewCount} Reviews)</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary leading-tight">
                      {product.name}
                    </h3>

                    <div className="flex items-baseline gap-2 mt-2">
                      <div className="text-2xl font-bold text-ink-primary font-mono">
                        {formatBDT(product.priceBDT)}
                      </div>
                      {product.originalPriceBDT && (
                        <div className="text-sm text-ink-faint line-through font-mono">
                          {formatBDT(product.originalPriceBDT)}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-light">
                    {product.description}
                  </p>

                  {/* Clinical Specifications */}
                  <div className="p-3.5 rounded-2xl bg-canvas border border-whisper text-xs space-y-1.5">
                    <div className="font-bold text-ink-primary uppercase tracking-wider text-[10px]">
                      Authentication Profile & Specifications
                    </div>
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <div key={key} className="flex justify-between gap-2 text-[11px]">
                        <span className="text-ink-muted font-medium">{key}:</span>
                        <span className="text-ink-primary font-mono text-right">{val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stepper & Add to Cart */}
                  <div className="pt-2 flex items-center gap-3">
                    <div className="flex items-center gap-2 border border-whisper rounded-full px-3 py-2 bg-canvas">
                      <button
                        onClick={() => handleQtyChange(-1)}
                        className="p-1 text-ink-muted hover:text-ink-primary active:scale-90 transition-transform"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-mono font-bold px-2 text-ink-primary">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQtyChange(1)}
                        className="p-1 text-ink-muted hover:text-ink-primary active:scale-90 transition-transform"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-3.5 rounded-full bg-brand-emerald text-white text-sm font-bold hover:bg-emerald-700 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      {added ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <span>Add to Cart • {formatBDT(product.priceBDT * quantity)}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-ink-faint">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" />
                    <span>Manufacturer hologram, sealed outer seal, and 10x authenticity pledge.</span>
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
