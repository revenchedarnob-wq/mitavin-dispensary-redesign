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
  Heart,
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
  const [wishlistActive, setWishlistActive] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (lastAddedItemId) {
      setBadgePulse(true);
      const timer = setTimeout(() => setBadgePulse(false), 600);
      return () => clearTimeout(timer);
    }
  }, [lastAddedItemId]);

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

  const handleOpenCart = () => {
    playHapticGlass(0.07);
    setCartOpen(true);
  };

  const handleOpenSearch = () => {
    playHapticGlass(0.06);
    setSearchOpen(true);
    if (onSearchClick) onSearchClick();
  };

  const handleWishlistToggle = () => {
    playHapticClick(0.06);
    setWishlistActive(!wishlistActive);
  };

  return (
    <header className="sticky top-0 z-nav w-full bg-white">
      {/* 1. Top Crisp Trust Header */}
      <div className="bg-zinc-50 border-b border-zinc-200/80 text-[11px] sm:text-xs text-zinc-500 py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-0.5">
            <a
              href="tel:+8801978303867"
              className="flex items-center gap-1.5 hover:text-zinc-900 transition-colors whitespace-nowrap font-medium text-zinc-800"
              onClick={() => playHapticClick(0.05)}
            >
              <PhoneCall className="w-3 h-3 text-emerald-600" />
              <span className="font-mono font-medium">+880 1978 303867</span>
            </a>

            <span className="hidden sm:inline text-zinc-300">•</span>

            <div className="flex items-center gap-1.5 whitespace-nowrap text-zinc-600 font-medium">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Same-Day Delivery in Dhaka Metro</span>
            </div>

            <span className="hidden md:inline text-zinc-300">•</span>

            <div className="hidden md:flex items-center gap-1.5 whitespace-nowrap text-zinc-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-800" />
              <span>100% Genuine UK & USA Import</span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Audio Micro-Haptic State Toggle */}
            <button
              onClick={toggleSoundEnabled}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-zinc-200 hover:border-zinc-300 transition-colors text-zinc-500 hover:text-zinc-900 bg-white text-[11px]"
              title={soundEnabled ? "Mute Haptic Audio" : "Enable Haptic Audio"}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3 h-3 text-emerald-600" />
                  <span className="hidden sm:inline font-mono font-medium">Audio: On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3 h-3 text-red-500" />
                  <span className="hidden sm:inline font-mono font-medium">Muted</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Vercel-Style Main Sticky Glass Navigation */}
      <nav className="backdrop-blur-md bg-white/80 border-b border-zinc-200/80 px-4 sm:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-8">
          {/* Brand Logo */}
          <Link
            href="/"
            onClick={() => playHapticClick(0.05)}
            className="flex items-center gap-2 group flex-shrink-0"
          >
            <span className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 group-hover:opacity-80 transition-opacity">
              MITAVIN
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </Link>

          {/* Centered Sleek Search Input */}
          <div className="flex-1 max-w-xl hidden md:block">
            <button
              onClick={handleOpenSearch}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg bg-zinc-50 border border-zinc-200 hover:border-zinc-300 hover:bg-white transition-all text-left group shadow-sm"
            >
              <div className="flex items-center gap-2.5 text-zinc-500 text-xs">
                <Search className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
                <span className="truncate">Search baby formula, vitamins, skincare, diagnostics...</span>
              </div>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-zinc-200 bg-white text-[10px] font-mono text-zinc-400 shadow-2xs">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </div>
            </button>
          </div>

          {/* Right Action Icons: Search (mobile), Wishlist, Cart Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleOpenSearch}
              className="md:hidden p-2 rounded-lg border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded-lg border border-zinc-200 transition-colors ${
                wishlistActive
                  ? "bg-red-50 text-red-600 border-red-200"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
              }`}
              title="Saved items"
            >
              <Heart className={`w-4 h-4 ${wishlistActive ? "fill-red-600" : ""}`} />
            </button>

            {/* Cart Button with bold count and BDT total */}
            <button
              onClick={handleOpenCart}
              className={`relative flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-zinc-950 text-white text-xs sm:text-sm font-medium hover:bg-zinc-800 active:scale-95 transition-all shadow-sm ${
                badgePulse ? "ring-2 ring-emerald-500 ring-offset-2 scale-105" : ""
              }`}
              aria-label="Open shopping cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-zinc-200" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-emerald-500 text-white text-[9px] font-bold">
                    {totalItems}
                  </span>
                )}
              </div>

              <span>Cart</span>
              <span className="opacity-30">|</span>
              <span className="font-mono font-semibold text-xs text-zinc-200">
                {mounted ? formatBDT(subtotal) : "৳0"}
              </span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
