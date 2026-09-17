"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Plane,
  ThermometerSnowflake,
  Sparkles,
  ShoppingBag,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  X,
  Search,
  ArrowRight,
  ExternalLink,
  Package,
  Layers,
  Database,
  Radio,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useStore } from "@/lib/store";
import { PRODUCTS, Product, CATEGORIES } from "@/data/products";
import {
  playHapticClick,
  playHapticPop,
  playHapticGlass,
  playHapticSuccess,
  playHapticSwoosh,
} from "@/lib/sound";
import { EDITORIAL_COPY } from "@/lib/copy";
import { formatBDT } from "@/lib/utils";
import { submitOrder, getProducts } from "@/lib/api";

export default function Phase1FoundationalBedrockPage() {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isCartOpen,
    setCartOpen,
    toggleCart,
    isSearchOpen,
    setSearchOpen,
    isQuickViewOpen,
    activeQuickViewProduct,
    setQuickViewOpen,
    closeQuickView,
    soundEnabled,
    toggleSoundEnabled,
    getSubtotal,
    getTotalItems,
    getFreeDeliveryRemaining,
    getFreeDeliveryProgress,
    freeDeliveryThreshold,
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = mounted ? getSubtotal() : 0;
  const totalItems = mounted ? getTotalItems() : 0;
  const remainingForFreeDelivery = mounted ? getFreeDeliveryRemaining() : 2000;
  const deliveryProgress = mounted ? getFreeDeliveryProgress() : 0;

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCat =
      selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.importOrigin.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleTestOrder = async () => {
    if (items.length === 0) {
      playHapticClick();
      alert("Please add at least one product to the cart before checking out.");
      return;
    }

    setIsSubmittingOrder(true);
    playHapticClick();

    const response = await submitOrder({
      customer: {
        fullName: "Dr. Ayesha Siddiqua",
        phoneNumber: "+8801711002233",
        addressLine1: "House 42, Road 11, Block D",
        areaOrThana: "Banani",
        city: "Dhaka",
      },
      items: items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        unitPriceBDT: i.product.priceBDT,
        quantity: i.quantity,
      })),
      paymentMethod: "cash_on_delivery",
      subtotalBDT: subtotal,
      deliveryFeeBDT: remainingForFreeDelivery === 0 ? 0 : 80,
      totalBDT: subtotal + (remainingForFreeDelivery === 0 ? 0 : 80),
    });

    setIsSubmittingOrder(false);
    if (response.success) {
      playHapticSuccess(0.18);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#d97706", "#047857", "#f59e0b"],
      });
      setOrderConfirmation(response.orderId);
      clearCart();
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink-primary font-sans relative selection:bg-brand-emerald-light selection:text-ink-primary">
      {/* Top Protocol Announcement Bar */}
      <header className="sticky top-0 z-nav bg-canvas/90 backdrop-blur-md border-b border-whisper">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-brand-emerald animate-pulse" />
            <span className="font-semibold text-brand-emerald tracking-wide uppercase text-[11px]">
              Phase 1 Bedrock Active
            </span>
            <span className="hidden md:inline text-ink-muted">|</span>
            <span className="hidden md:inline text-ink-muted">
              {EDITORIAL_COPY.hero.eyebrow}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Haptic Sound Engine Mute Toggle */}
            <button
              onClick={toggleSoundEnabled}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-whisper hover:border-brand-emerald/40 transition-colors text-ink-muted hover:text-ink-primary text-xs"
              title={soundEnabled ? "Mute Haptic Audio" : "Enable Haptic Audio"}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-brand-emerald" />
                  <span className="hidden sm:inline">Sound: Active</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-scarcity-crimson" />
                  <span className="hidden sm:inline">Sound: Muted</span>
                </>
              )}
            </button>

            {/* Cart Trigger Button */}
            <button
              onClick={() => toggleCart()}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-ink-primary text-white text-xs sm:text-sm font-medium hover:bg-black transition-transform active:scale-95 shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Cart ({mounted ? totalItems : 0})</span>
              <span className="opacity-80 text-xs">
                {mounted ? formatBDT(subtotal) : "৳0"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-16">
        {/* Editorial Hero Header */}
        <section className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-brand-emerald" />
            <span>Mitavin Architectural Bedrock</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif tracking-tight text-ink-primary leading-[1.05]">
            {EDITORIAL_COPY.hero.headlinePart1}{" "}
            <span className="italic font-light text-brand-emerald underline decoration-brand-emerald/30 decoration-wavy underline-offset-8">
              {EDITORIAL_COPY.hero.headlinePart2}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-ink-muted leading-relaxed font-light">
            {EDITORIAL_COPY.hero.subheading}
          </p>

          {/* Quick Pillar Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {EDITORIAL_COPY.trustPillars.map((pillar) => (
              <div
                key={pillar.code}
                className="p-4 rounded-2xl bg-card border border-whisper shadow-whisper hover:border-brand-emerald/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-brand-champagne font-mono">
                    {pillar.code}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-canvas border border-whisper text-ink-muted">
                    {pillar.tag}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-ink-primary mb-1 group-hover:text-brand-emerald transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Foundational Diagnostics & Haptic Soundboard */}
        <section className="p-6 sm:p-8 rounded-3xl bg-card border border-whisper shadow-elevation space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-whisper pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Radio className="w-4 h-4 text-brand-emerald animate-pulse" />
                <h2 className="text-xl font-serif font-bold text-ink-primary">
                  Interactive Audio Micro-Haptics Testbed
                </h2>
              </div>
              <p className="text-sm text-ink-muted">
                Procedural Web Audio API sound synthesis with zero external files, 0ms network latency.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                0KB Payload
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Singleton AudioContext
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                Zustand State Synced
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <button
              onClick={() => playHapticClick(0.08)}
              className="p-4 rounded-2xl bg-canvas border border-whisper hover:border-brand-emerald hover:shadow-sm transition-all text-left group active:scale-95"
            >
              <div className="text-xs font-mono text-ink-faint mb-1">8ms Mechanical</div>
              <div className="font-semibold text-sm text-ink-primary group-hover:text-brand-emerald">
                playHapticClick()
              </div>
              <div className="text-[11px] text-ink-muted mt-1">1200Hz → 80Hz drop</div>
            </button>

            <button
              onClick={() => playHapticPop(0.12)}
              className="p-4 rounded-2xl bg-canvas border border-whisper hover:border-brand-emerald hover:shadow-sm transition-all text-left group active:scale-95"
            >
              <div className="text-xs font-mono text-ink-faint mb-1">18ms Upward Sweep</div>
              <div className="font-semibold text-sm text-ink-primary group-hover:text-brand-emerald">
                playHapticPop()
              </div>
              <div className="text-[11px] text-ink-muted mt-1">320Hz → 880Hz pitch</div>
            </button>

            <button
              onClick={() => playHapticGlass(0.06)}
              className="p-4 rounded-2xl bg-canvas border border-whisper hover:border-brand-emerald hover:shadow-sm transition-all text-left group active:scale-95"
            >
              <div className="text-xs font-mono text-ink-faint mb-1">25ms Pure Tone</div>
              <div className="font-semibold text-sm text-ink-primary group-hover:text-brand-emerald">
                playHapticGlass()
              </div>
              <div className="text-[11px] text-ink-muted mt-1">2400Hz resonant tap</div>
            </button>

            <button
              onClick={() => playHapticSwoosh(0.07)}
              className="p-4 rounded-2xl bg-canvas border border-whisper hover:border-brand-emerald hover:shadow-sm transition-all text-left group active:scale-95"
            >
              <div className="text-xs font-mono text-ink-faint mb-1">50ms Fluid Sweep</div>
              <div className="font-semibold text-sm text-ink-primary group-hover:text-brand-emerald">
                playHapticSwoosh()
              </div>
              <div className="text-[11px] text-ink-muted mt-1">180Hz → 540Hz filter</div>
            </button>

            <button
              onClick={() => {
                playHapticSuccess(0.15);
                confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
              }}
              className="p-4 rounded-2xl bg-canvas border border-whisper hover:border-brand-champagne hover:shadow-gold transition-all text-left group active:scale-95 col-span-2 sm:col-span-1"
            >
              <div className="text-xs font-mono text-brand-champagne mb-1">E6 + G#6 Chime</div>
              <div className="font-semibold text-sm text-ink-primary group-hover:text-brand-champagne">
                playHapticSuccess()
              </div>
              <div className="text-[11px] text-ink-muted mt-1">Harmonic checkout bell</div>
            </button>
          </div>
        </section>

        {/* Free Delivery Dynamic Threshold Bar */}
        <section className="p-6 rounded-3xl bg-card border border-whisper shadow-whisper space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-emerald" />
              <span className="font-semibold text-ink-primary">
                Dhaka Metro Free Delivery Threshold (৳2,000)
              </span>
            </div>
            <div className="text-xs font-medium">
              {remainingForFreeDelivery === 0 ? (
                <span className="text-brand-emerald font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Free Delivery Unlocked!
                </span>
              ) : (
                <span className="text-ink-muted">
                  Add <strong className="text-ink-primary">{formatBDT(remainingForFreeDelivery)}</strong> more
                </span>
              )}
            </div>
          </div>

          {/* Animated Progress Track */}
          <div className="w-full h-2.5 rounded-full bg-canvas overflow-hidden border border-whisper">
            <div
              className="h-full bg-gradient-to-r from-brand-emerald to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${deliveryProgress}%` }}
            />
          </div>
        </section>

        {/* Catalog Browser Section */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-brand-emerald mb-1">
                Phase 1 Catalog Verification
              </div>
              <h2 className="text-3xl font-serif font-bold text-ink-primary">
                Verified Authentic Inventory ({filteredProducts.length} Items)
              </h2>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                <input
                  type="text"
                  placeholder="Search brand, SKU, formula..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm rounded-full bg-card border border-whisper focus:outline-none focus:border-brand-emerald text-ink-primary placeholder:text-ink-faint w-60"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  playHapticClick(0.06);
                }}
                className="px-4 py-2 text-sm rounded-full bg-card border border-whisper focus:outline-none focus:border-brand-emerald text-ink-primary"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col rounded-3xl bg-card border border-whisper shadow-whisper hover:shadow-elevation hover:border-brand-emerald/30 transition-all duration-300 overflow-hidden"
              >
                {/* Product Image & Badges */}
                <div className="relative aspect-[4/3] bg-canvas overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Origin Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold tracking-wider uppercase text-ink-primary shadow-sm border border-whisper flex items-center gap-1">
                      <Plane className="w-2.5 h-2.5 text-brand-emerald" />
                      {product.importOrigin}
                    </span>

                    {product.coldChainMonitored && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-50/95 backdrop-blur-sm text-[10px] font-bold tracking-wider uppercase text-blue-800 shadow-sm border border-blue-200 flex items-center gap-1">
                        <ThermometerSnowflake className="w-2.5 h-2.5 text-blue-600" />
                        Cold Chain
                      </span>
                    )}
                  </div>

                  {/* Rating Pill */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-full bg-white/95 text-[11px] font-semibold text-ink-primary shadow-sm border border-whisper flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-brand-champagne fill-brand-champagne" />
                      {product.rating}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-ink-muted">
                      <span className="font-semibold uppercase tracking-wider text-ink-faint">
                        {product.brand}
                      </span>
                      <span>{product.stockCount} in stock</span>
                    </div>

                    <h3 className="font-medium text-ink-primary text-base line-clamp-2 group-hover:text-brand-emerald transition-colors leading-snug">
                      {product.name}
                    </h3>

                    <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed font-light">
                      {product.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-whisper flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-ink-primary">
                        {formatBDT(product.priceBDT)}
                      </div>
                      {product.originalPriceBDT && (
                        <div className="text-xs text-ink-faint line-through">
                          {formatBDT(product.originalPriceBDT)}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setQuickViewOpen(true, product);
                        }}
                        className="p-2 rounded-full border border-whisper text-ink-muted hover:text-ink-primary hover:border-ink-muted transition-colors"
                        title="View Details"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          addItem(product, 1);
                        }}
                        className="px-3.5 py-2 rounded-full bg-brand-emerald text-white text-xs font-semibold hover:bg-emerald-700 active:scale-95 transition-all shadow-sm flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dual-Backend Architecture Notice */}
        <section className="p-6 rounded-3xl bg-canvas border border-whisper flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-card border border-whisper text-brand-emerald">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-ink-primary">
                Decoupled Dual-Backend Data Architecture Ready
              </h4>
              <p className="text-xs text-ink-muted mt-0.5">
                Adapter active: Local high-fidelity simulated store. Ready to switch to Laravel REST API via <code>NEXT_PUBLIC_API_URL</code> without touching UI components.
              </p>
            </div>
          </div>

          <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-card border border-whisper text-ink-muted">
            STATUS: 200 OK (Offline / Hybrid Safe)
          </div>
        </section>
      </main>

      {/* Cart Slide-Over Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-modal overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setCartOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-canvas shadow-2xl flex flex-col border-l border-whisper">
              {/* Drawer Header */}
              <div className="p-6 border-b border-whisper flex items-center justify-between bg-card">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-emerald" />
                  <h3 className="font-serif text-xl font-bold text-ink-primary">
                    Authentic Dispensary Cart ({totalItems})
                  </h3>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-1.5 rounded-full hover:bg-canvas text-ink-muted hover:text-ink-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free delivery indicator inside cart */}
              <div className="px-6 py-3 bg-brand-emerald-subtle border-b border-brand-emerald/10 text-xs">
                {remainingForFreeDelivery === 0 ? (
                  <span className="text-emerald-900 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Eligible for Free Air-Conditioned Delivery in Dhaka!
                  </span>
                ) : (
                  <span className="text-ink-muted">
                    Add <strong>{formatBDT(remainingForFreeDelivery)}</strong> more for free Dhaka delivery
                  </span>
                )}
              </div>

              {/* Cart Item List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <Package className="w-12 h-12 text-ink-faint mx-auto stroke-1" />
                    <p className="text-ink-muted text-sm">Your cart is empty.</p>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="px-4 py-2 rounded-full bg-ink-primary text-white text-xs font-medium hover:bg-black"
                    >
                      Browse Authentic SKUs
                    </button>
                  </div>
                ) : (
                  items.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="p-4 rounded-2xl bg-card border border-whisper flex gap-4 shadow-whisper"
                    >
                      <div className="relative w-16 h-16 rounded-xl bg-canvas overflow-hidden flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] font-bold uppercase text-brand-emerald tracking-wider">
                            {product.importOrigin}
                          </div>
                          <h4 className="text-xs font-semibold text-ink-primary truncate">
                            {product.name}
                          </h4>
                          <div className="text-xs font-bold text-ink-primary mt-1">
                            {formatBDT(product.priceBDT * quantity)}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2 border border-whisper rounded-full px-2 py-0.5 bg-canvas">
                            <button
                              onClick={() => updateQuantity(product.id, -1)}
                              className="p-0.5 text-ink-muted hover:text-ink-primary"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono font-medium px-1">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, 1)}
                              className="p-0.5 text-ink-muted hover:text-ink-primary"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(product.id)}
                            className="text-ink-faint hover:text-scarcity-crimson transition-colors"
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

              {/* Drawer Footer */}
              {items.length > 0 && (
                <div className="p-6 bg-card border-t border-whisper space-y-4">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-ink-muted">
                      <span>Subtotal</span>
                      <span>{formatBDT(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-ink-muted">
                      <span>Dhaka Metro Delivery</span>
                      <span>
                        {remainingForFreeDelivery === 0 ? "FREE" : "৳80"}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-ink-primary pt-2 border-t border-whisper">
                      <span>Estimated Total</span>
                      <span>
                        {formatBDT(
                          subtotal + (remainingForFreeDelivery === 0 ? 0 : 80)
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleTestOrder}
                    disabled={isSubmittingOrder}
                    className="w-full py-3.5 rounded-full bg-brand-emerald text-white font-semibold text-sm hover:bg-emerald-700 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmittingOrder ? (
                      <span>Dispatching Order...</span>
                    ) : (
                      <>
                        <span>Verify & Place Order</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {isQuickViewOpen && activeQuickViewProduct && (
        <div className="fixed inset-0 z-modal overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeQuickView}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl rounded-3xl bg-card border border-whisper shadow-floating p-6 sm:p-8 space-y-6">
              <button
                onClick={closeQuickView}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-canvas text-ink-muted hover:text-ink-primary"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative aspect-square rounded-2xl bg-canvas overflow-hidden">
                  <Image
                    src={activeQuickViewProduct.image}
                    alt={activeQuickViewProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald">
                      {activeQuickViewProduct.importOrigin}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-ink-primary">
                      {activeQuickViewProduct.name}
                    </h3>
                    <div className="text-xl font-bold text-ink-primary">
                      {formatBDT(activeQuickViewProduct.priceBDT)}
                    </div>
                  </div>

                  <p className="text-xs text-ink-muted leading-relaxed font-light">
                    {activeQuickViewProduct.description}
                  </p>

                  <div className="p-3 rounded-xl bg-canvas border border-whisper text-xs space-y-1">
                    <div className="font-semibold text-ink-primary">Clinical Specs:</div>
                    {Object.entries(activeQuickViewProduct.specifications).slice(0, 3).map(([key, val]) => (
                      <div key={key} className="text-ink-muted">
                        <strong>{key}:</strong> {val}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      addItem(activeQuickViewProduct, 1);
                      closeQuickView();
                    }}
                    className="w-full py-3 rounded-full bg-brand-emerald text-white text-sm font-semibold hover:bg-emerald-700 active:scale-95 transition-all shadow-sm"
                  >
                    Add to Cart • {formatBDT(activeQuickViewProduct.priceBDT)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation Toast Notification */}
      {orderConfirmation && (
        <div className="fixed bottom-6 right-6 z-modal max-w-sm p-5 rounded-2xl bg-card border border-brand-emerald/40 shadow-floating space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-brand-emerald font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Order Dispatched!</span>
            </div>
            <button
              onClick={() => setOrderConfirmation(null)}
              className="text-ink-faint hover:text-ink-primary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-ink-muted">
            Tracking ID: <strong className="text-ink-primary font-mono">{orderConfirmation}</strong>. Climate-controlled dispatch queued for Dhaka Metro.
          </p>
        </div>
      )}
    </div>
  );
}
