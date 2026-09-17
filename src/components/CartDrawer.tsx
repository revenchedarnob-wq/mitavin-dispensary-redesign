"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Package,
  ArrowRight,
  CheckCircle2,
  Tag,
  ShieldCheck,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { playHapticClick, playHapticGlass, playHapticPop } from "@/lib/sound";
import { triggerSpark } from "@/components/ClickSpark";
import { formatBDT } from "@/lib/utils";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setCartOpen,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTotalItems,
    getFreeDeliveryRemaining,
    getFreeDeliveryProgress,
    promoCode,
    discountBDT,
    applyPromoCode,
    removePromoCode,
    setCheckoutOpen,
  } = useStore();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState(false);

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();
  const remainingForFreeDelivery = getFreeDeliveryRemaining();
  const deliveryProgress = getFreeDeliveryProgress();

  const isFreeDelivery = subtotal >= 2000;
  const deliveryFee = isFreeDelivery ? 0 : 60;
  const grandTotal = Math.max(0, subtotal - discountBDT + deliveryFee);

  const hasCelebratedThreshold = useRef<boolean>(false);

  useEffect(() => {
    if (subtotal >= 2000) {
      if (!hasCelebratedThreshold.current && isCartOpen) {
        hasCelebratedThreshold.current = true;
        playHapticGlass(0.12);
        if (typeof window !== "undefined") {
          triggerSpark(window.innerWidth - 200, 160, "#10B981", 12, 32);
        }
      }
    } else {
      hasCelebratedThreshold.current = false;
    }
  }, [subtotal, isCartOpen]);

  const handleClose = () => {
    playHapticClick(0.06);
    setCartOpen(false);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = applyPromoCode(promoInput);
    if (!success) {
      setPromoError(true);
      setTimeout(() => setPromoError(false), 2000);
    } else {
      setPromoError(false);
      setPromoInput("");
    }
  };

  const handleProceedToCheckout = () => {
    playHapticGlass(0.08);
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-modal overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 380 }}
              className="w-screen max-w-md bg-white flex flex-col shadow-2xl border-l border-zinc-200"
            >
              {/* Header */}
              <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-zinc-100 text-zinc-900 border border-zinc-200">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-sans text-base font-semibold text-zinc-950 leading-none">
                      Your Dispensary Cart
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1 font-mono">
                      {totalItems} {totalItems === 1 ? "Item" : "Items"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors active:scale-95"
                  title="Close Cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Delivery Progress Bar */}
              <div
                className={`p-3.5 border-b space-y-1.5 transition-all duration-300 ${
                  isFreeDelivery
                    ? "bg-emerald-50/70 border-emerald-200 text-emerald-950 shadow-xs"
                    : "bg-zinc-50 border-zinc-200 text-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium flex items-center gap-1.5">
                    {isFreeDelivery ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 animate-pulse flex-shrink-0" />
                        <span className="font-semibold text-emerald-950">
                          🎉 Free Dhaka Express Delivery Unlocked!
                        </span>
                      </>
                    ) : (
                      <>
                        <Package className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                        <span>
                          Add <strong className="text-zinc-950 font-mono">{formatBDT(remainingForFreeDelivery)}</strong> for free delivery
                        </span>
                      </>
                    )}
                  </span>
                  <span
                    className={`font-mono text-[11px] font-medium ${
                      isFreeDelivery ? "text-emerald-700 font-semibold" : "text-zinc-500"
                    }`}
                  >
                    {deliveryProgress}%
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-zinc-200 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full transition-colors duration-300 ${
                      isFreeDelivery ? "bg-emerald-600" : "bg-zinc-950"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${deliveryProgress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-white">
                {items.length === 0 ? (
                  <div className="py-20 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-400">
                      <ShoppingBag className="w-6 h-6 stroke-1" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-sans text-sm font-semibold text-zinc-900">
                        Cart is empty
                      </h4>
                      <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                        Browse verified baby formulas, clinical skincare, and vitamins.
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 rounded-md bg-zinc-950 text-white text-xs font-medium hover:bg-zinc-800 transition-colors"
                    >
                      Explore Catalog
                    </button>
                  </div>
                ) : (
                  items.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="p-3 rounded-xl bg-white border border-zinc-200 flex gap-3 shadow-2xs"
                    >
                      <div className="relative w-16 h-16 rounded-lg bg-zinc-50 overflow-hidden flex-shrink-0 border border-zinc-100 flex items-center justify-center">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1 text-[10px] text-zinc-500 font-mono">
                            <span className="font-medium text-zinc-700">{product.importOrigin}</span>
                            <span className="text-zinc-950 font-bold">
                              {formatBDT(product.priceBDT * quantity)}
                            </span>
                          </div>

                          <h4 className="text-xs font-semibold text-zinc-950 truncate mt-0.5">
                            {product.name}
                          </h4>

                          <div className="text-[11px] text-zinc-400 font-mono">
                            {formatBDT(product.priceBDT)} each
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1.5">
                          <div className="flex items-center gap-2 border border-zinc-200 rounded-md px-1.5 py-0.5 bg-zinc-50">
                            <button
                              onClick={() => {
                                playHapticClick(0.06);
                                updateQuantity(product.id, -1);
                              }}
                              className="p-0.5 text-zinc-500 hover:text-zinc-900 active:scale-90 transition-transform"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono font-medium px-1 text-zinc-900">
                              {quantity}
                            </span>
                            <button
                              onClick={() => {
                                playHapticPop(0.08);
                                updateQuantity(product.id, 1);
                              }}
                              className="p-0.5 text-zinc-500 hover:text-zinc-900 active:scale-90 transition-transform"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              playHapticClick(0.08);
                              removeItem(product.id);
                            }}
                            className="p-1 rounded text-zinc-400 hover:text-red-600 hover:bg-zinc-100 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-5 bg-white border-t border-zinc-200 space-y-4 shadow-sm">
                  {/* Promo Input */}
                  <div>
                    {promoCode ? (
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs">
                        <div className="flex items-center gap-1.5 text-zinc-900 font-medium">
                          <Tag className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Code &quot;{promoCode}&quot; applied (-10%)</span>
                        </div>
                        <button
                          onClick={removePromoCode}
                          className="text-zinc-400 hover:text-zinc-700 text-xs underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyPromo} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Promo code (MITAVIN10)"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-900 text-zinc-900 font-mono uppercase"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 hover:border-zinc-300 text-xs font-medium text-zinc-800 transition-colors"
                        >
                          Apply
                        </button>
                      </form>
                    )}
                    {promoError && (
                      <p className="text-[11px] text-red-600 mt-1 font-mono">
                        Invalid code. Try &quot;MITAVIN10&quot;.
                      </p>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="space-y-1.5 text-xs text-zinc-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono text-zinc-900 font-medium">{formatBDT(subtotal)}</span>
                    </div>

                    {discountBDT > 0 && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>VIP Discount</span>
                        <span className="font-mono">-{formatBDT(discountBDT)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Dhaka Metro Delivery</span>
                      <span className="font-mono font-medium text-zinc-900">
                        {isFreeDelivery ? (
                          <span className="text-emerald-600 font-semibold">FREE</span>
                        ) : (
                          formatBDT(60)
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm font-semibold text-zinc-950 pt-2 border-t border-zinc-200">
                      <span>Total</span>
                      <span className="font-mono text-base">{formatBDT(grandTotal)}</span>
                    </div>
                  </div>

                  {/* Primary CTA */}
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full py-3 rounded-lg bg-zinc-950 text-white font-medium text-sm hover:bg-zinc-800 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 group"
                  >
                    <span>Proceed to Express Checkout</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 text-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sealed UK &amp; USA Import • 10x Authenticity Pledge</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
