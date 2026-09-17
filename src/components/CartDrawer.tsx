"use client";

import React, { useState } from "react";
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
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="w-screen max-w-md bg-canvas flex flex-col shadow-2xl border-l border-whisper"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-whisper flex items-center justify-between bg-card">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-brand-emerald-subtle text-brand-emerald">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-ink-primary leading-none">
                      Dispensary Cart
                    </h3>
                    <p className="text-xs text-ink-muted mt-1 font-mono">
                      {totalItems} {totalItems === 1 ? "Item" : "Items"} Selected
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-canvas text-ink-muted hover:text-ink-primary transition-colors active:scale-95"
                  title="Close Cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Delivery Progress Meter */}
              <div className="p-4 bg-brand-emerald-subtle/80 border-b border-brand-emerald/15 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-950 flex items-center gap-1.5">
                    {isFreeDelivery ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>🎉 You unlocked FREE Delivery in Dhaka Metro!</span>
                      </>
                    ) : (
                      <>
                        <Package className="w-4 h-4 text-brand-emerald" />
                        <span>
                          Add <strong>{formatBDT(remainingForFreeDelivery)}</strong> more for FREE Dhaka Delivery!
                        </span>
                      </>
                    )}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-emerald-900">
                    {deliveryProgress}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-emerald-100 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand-emerald to-emerald-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${deliveryProgress}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Cart Items Scroll Area */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-card border border-whisper flex items-center justify-center mx-auto text-ink-faint shadow-whisper">
                      <ShoppingBag className="w-8 h-8 stroke-1" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif text-lg font-bold text-ink-primary">
                        Your Cart is Empty
                      </h4>
                      <p className="text-xs text-ink-muted max-w-xs mx-auto">
                        Explore verified air-freighted baby formulas, vitamins, and clinical dermatology products.
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="px-5 py-2.5 rounded-full bg-ink-primary text-white text-xs font-semibold hover:bg-black active:scale-95 transition-all shadow-sm"
                    >
                      Browse Catalog
                    </button>
                  </div>
                ) : (
                  items.map(({ product, quantity }) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="p-3.5 rounded-2xl bg-card border border-whisper flex gap-3.5 shadow-whisper"
                    >
                      {/* Product Thumbnail */}
                      <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-canvas overflow-hidden flex-shrink-0 border border-whisper">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Content & Micro-Steppers */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1 text-[10px] text-ink-muted font-bold uppercase tracking-wider">
                            <span className="text-brand-emerald">{product.importOrigin}</span>
                            <span className="text-ink-primary font-mono font-bold text-xs">
                              {formatBDT(product.priceBDT * quantity)}
                            </span>
                          </div>

                          <h4 className="text-xs font-semibold text-ink-primary line-clamp-1 mt-0.5">
                            {product.name}
                          </h4>

                          <div className="text-[11px] text-ink-faint font-mono">
                            {formatBDT(product.priceBDT)} each
                          </div>
                        </div>

                        {/* Quantity Stepper & Delete Trash */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2 border border-whisper rounded-full px-2 py-0.5 bg-canvas">
                            <button
                              onClick={() => {
                                playHapticClick(0.06);
                                updateQuantity(product.id, -1);
                              }}
                              className="p-0.5 text-ink-muted hover:text-ink-primary active:scale-90 transition-transform"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono font-bold px-1 text-ink-primary">
                              {quantity}
                            </span>
                            <button
                              onClick={() => {
                                playHapticPop(0.08);
                                updateQuantity(product.id, 1);
                              }}
                              className="p-0.5 text-ink-muted hover:text-ink-primary active:scale-90 transition-transform"
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
                            className="p-1 rounded-full text-ink-faint hover:text-scarcity-crimson hover:bg-canvas transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Drawer Footer with Calculations, Promo & Checkout CTA */}
              {items.length > 0 && (
                <div className="p-5 sm:p-6 bg-card border-t border-whisper space-y-4 shadow-elevation">
                  {/* Promo Code Input */}
                  <div>
                    {promoCode ? (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-brand-emerald-subtle border border-brand-emerald/20 text-xs">
                        <div className="flex items-center gap-1.5 text-brand-emerald font-semibold">
                          <Tag className="w-3.5 h-3.5" />
                          <span>Code &quot;{promoCode}&quot; Applied (-10%)</span>
                        </div>
                        <button
                          onClick={removePromoCode}
                          className="text-ink-faint hover:text-ink-primary text-[11px] underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyPromo} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Promo code (e.g. MITAVIN10)"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-canvas border border-whisper focus:outline-none focus:border-brand-emerald text-ink-primary placeholder:text-ink-faint uppercase font-mono"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-canvas border border-whisper hover:border-brand-emerald text-xs font-semibold text-ink-primary hover:bg-card active:scale-95 transition-all"
                        >
                          Apply
                        </button>
                      </form>
                    )}
                    {promoError && (
                      <p className="text-[11px] text-scarcity-crimson mt-1">
                        Invalid promo code. Try &quot;MITAVIN10&quot;.
                      </p>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 text-xs text-ink-muted">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono text-ink-primary font-medium">
                        {formatBDT(subtotal)}
                      </span>
                    </div>

                    {discountBDT > 0 && (
                      <div className="flex justify-between text-brand-emerald font-medium">
                        <span>Special VIP Discount (10%)</span>
                        <span className="font-mono">-{formatBDT(discountBDT)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Estimated Dhaka Delivery</span>
                      <span className="font-mono font-medium">
                        {isFreeDelivery ? (
                          <span className="text-brand-emerald font-bold">FREE</span>
                        ) : (
                          formatBDT(60)
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm font-bold text-ink-primary pt-2 border-t border-whisper">
                      <span>Total</span>
                      <span className="font-mono text-base text-ink-primary">
                        {formatBDT(grandTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Primary Checkout CTA */}
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full py-3.5 rounded-full bg-brand-emerald text-white font-semibold text-sm hover:bg-emerald-700 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 group"
                  >
                    <span>Proceed to Express Checkout</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-ink-faint text-center">
                    <ShieldCheck className="w-3 h-3 text-brand-emerald" />
                    <span>Sealed Packaging • 100% Genuine Direct Import Guarantee</span>
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
