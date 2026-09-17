"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  PhoneCall,
  Truck,
  ShieldCheck,
  Volume2,
  VolumeX,
  Search,
  ShoppingBag,
  Sparkles,
  Command,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { playHapticClick, playHapticGlass } from "@/lib/sound";
import { formatBDT } from "@/lib/utils";

interface HeaderProps {
  onCategorySelect?: (categorySlug: string) => void;
  onSearchClick?: () => void;
}

export function Header({ onCategorySelect, onSearchClick }: HeaderProps) {
  const {
    items,
    soundEnabled,
    toggleSoundEnabled,
    setCartOpen,
    setSearchOpen,
    getSubtotal,
    getTotalItems,
    lastAddedItemId,
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [badgePulse, setBadgePulse] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animate cart badge whenever a new item is added
  useEffect(() => {
    if (lastAddedItemId) {
      setBadgePulse(true);
      const timer = setTimeout(() => setBadgePulse(false), 800);
      return () => clearTimeout(timer);
    }
  }, [lastAddedItemId]);

  // Global Keyboard listener for Cmd+K / Ctrl+K search trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        playHapticGlass(0.06);
        setSearchOpen(true);
        if (onSearchClick) onSearchClick();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSearchOpen, onSearchClick]);

  const totalItems = mounted ? getTotalItems() : 0;
  const subtotal = mounted ? getSubtotal() : 0;

  const quickNavCategories = [
    { label: "Pediatric Care", slug: "mother-baby" },
    { label: "Longevity & Vitamins", slug: "vitamins-supplements" },
    { label: "Dermatology", slug: "dermatological-skincare" },
    { label: "Senior Care", slug: "senior-care-incontinence" },
    { label: "OTC & Diagnostics", slug: "medical-devices-diagnostic" },
  ];

  const handleCategoryClick = (slug: string) => {
    playHapticClick(0.06);
    if (onCategorySelect) {
      onCategorySelect(slug);
    }
    const section = document.getElementById("catalog-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenCart = () => {
    playHapticGlass(0.07);
    setCartOpen(true);
  };

  const handleOpenSearch = () => {
    playHapticGlass(0.06);
    setSearchOpen(true);
    if (onSearchClick) onSearchClick();
  };

  return (
    <header className="sticky top-0 z-nav w-full">
      {/* Top Clinical Trust Bar */}
      <div className="bg-canvas border-b border-whisper text-[11px] sm:text-xs text-ink-muted py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left Trust Items */}
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-0.5">
            <a
              href="tel:+8801978303867"
              className="flex items-center gap-1.5 hover:text-brand-emerald transition-colors whitespace-nowrap font-medium text-ink-primary"
              onClick={() => playHapticClick(0.05)}
            >
              <PhoneCall className="w-3 h-3 text-brand-emerald" />
              <span>+880 1978 303867</span>
            </a>

            <div className="hidden md:flex items-center gap-1.5 text-ink-muted whitespace-nowrap">
              <Truck className="w-3.5 h-3.5 text-brand-emerald" />
              <span>Same-Day Cold Delivery in Dhaka Metro</span>
            </div>

            <div className="flex items-center gap-1.5 text-ink-muted whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-champagne" />
              <span>100% Genuine UK & USA Import Seal</span>
            </div>
          </div>

          {/* Right Controls: Sound Engine Toggle & Emergency Pharmacist */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={toggleSoundEnabled}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-whisper hover:border-brand-emerald/40 transition-colors text-ink-muted hover:text-ink-primary"
              title={soundEnabled ? "Mute Haptic Audio" : "Enable Haptic Audio"}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3 h-3 text-brand-emerald" />
                  <span className="hidden sm:inline text-[10px] uppercase font-semibold">Audio On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3 h-3 text-scarcity-crimson" />
                  <span className="hidden sm:inline text-[10px] uppercase font-semibold">Muted</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Glass Navigation Bar */}
      <nav className="glass-travertine border-b border-whisper px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-8">
          {/* Brand Wordmark & Identity */}
          <Link
            href="/"
            onClick={() => playHapticClick(0.05)}
            className="flex flex-col group flex-shrink-0"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-ink-primary group-hover:text-brand-emerald transition-colors">
                MITAVIN
              </span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-brand-emerald" />
            </div>
            <span className="text-[9px] tracking-[0.22em] uppercase font-medium text-ink-muted -mt-1 group-hover:text-ink-primary transition-colors">
              Clinical Longevity & Wellness
            </span>
          </Link>

          {/* Live Search Trigger Pill */}
          <div className="flex-1 max-w-xl hidden md:block">
            <button
              onClick={handleOpenSearch}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-full bg-card border border-whisper hover:border-brand-emerald/40 hover:shadow-whisper transition-all text-left group"
            >
              <div className="flex items-center gap-2.5 text-ink-muted text-xs">
                <Search className="w-4 h-4 text-ink-faint group-hover:text-brand-emerald transition-colors" />
                <span className="truncate">Search genuine baby formula, vitamins, skincare, diagnostics...</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-canvas border border-whisper text-[10px] font-mono text-ink-faint">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </div>
            </button>
          </div>

          {/* Category Quick Links (Desktop) */}
          <div className="hidden xl:flex items-center gap-5 text-xs font-medium text-ink-muted">
            {quickNavCategories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryClick(cat.slug)}
                className="hover:text-ink-primary transition-colors hover:underline underline-offset-4 decoration-brand-emerald/40"
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Actions: Mobile Search + Cart Button */}
          <div className="flex items-center gap-2.5">
            {/* Mobile Search Button */}
            <button
              onClick={handleOpenSearch}
              className="md:hidden p-2.5 rounded-full border border-whisper hover:border-brand-emerald/40 text-ink-muted hover:text-ink-primary transition-colors"
              title="Search Dispensary"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Cart Trigger Action */}
            <button
              onClick={handleOpenCart}
              className={`relative flex items-center gap-2.5 px-4 py-2 rounded-full bg-ink-primary text-white text-xs sm:text-sm font-semibold hover:bg-black active:scale-95 transition-all shadow-sm ${
                badgePulse ? "ring-2 ring-brand-emerald ring-offset-2 scale-105" : ""
              }`}
              aria-label="Open shopping cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-white" />
                {totalItems > 0 && (
                  <span
                    className={`absolute -top-2 -right-2.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-brand-emerald text-white text-[10px] font-bold shadow-sm ${
                      badgePulse ? "animate-ping" : ""
                    }`}
                  >
                    {totalItems}
                  </span>
                )}
              </div>

              <span className="hidden sm:inline">Cart</span>
              <span className="hidden sm:inline opacity-40">|</span>
              <span className="font-mono text-xs text-brand-champagne">
                {mounted ? formatBDT(subtotal) : "৳0"}
              </span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
