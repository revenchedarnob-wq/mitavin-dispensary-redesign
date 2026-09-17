"use client";

import React, { useState, useEffect } from "react";
import {
  Home,
  LayoutGrid,
  Search,
  ShoppingBag,
  MessageCircle,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { playHapticClick, playHapticGlass } from "@/lib/sound";

interface MobileBottomNavProps {
  onCategoryClick?: () => void;
  onSearchClick?: () => void;
}

export function MobileBottomNav({
  onCategoryClick,
  onSearchClick,
}: MobileBottomNavProps) {
  const { setCartOpen, getTotalItems } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;

  const handleHome = () => {
    playHapticClick(0.06);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategories = () => {
    playHapticClick(0.06);
    if (onCategoryClick) {
      onCategoryClick();
    } else {
      const section = document.getElementById("catalog-section");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearch = () => {
    playHapticGlass(0.06);
    if (onSearchClick) onSearchClick();
  };

  const handleCart = () => {
    playHapticGlass(0.07);
    setCartOpen(true);
  };

  const handleWhatsApp = () => {
    playHapticClick(0.08);
    window.open(
      "https://wa.me/8801978303867?text=Hello%20Mitavin%20Pharmacist,%20I%20need%20authentic%20product%20advice.",
      "_blank"
    );
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-nav bg-white/90 backdrop-blur-md border-t border-zinc-200 px-2 py-1.5 safe-area-bottom shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={handleHome}
          className="flex flex-col items-center justify-center min-w-[56px] h-12 text-zinc-500 hover:text-zinc-950 active:scale-95 transition-all"
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] font-medium mt-0.5">Home</span>
        </button>

        {/* Catalog */}
        <button
          onClick={handleCategories}
          className="flex flex-col items-center justify-center min-w-[56px] h-12 text-zinc-500 hover:text-zinc-950 active:scale-95 transition-all"
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="text-[10px] font-medium mt-0.5">Catalog</span>
        </button>

        {/* Search */}
        <button
          onClick={handleSearch}
          className="flex flex-col items-center justify-center min-w-[56px] h-12 text-zinc-500 hover:text-zinc-950 active:scale-95 transition-all"
        >
          <Search className="w-4 h-4" />
          <span className="text-[10px] font-medium mt-0.5">Search</span>
        </button>

        {/* Cart */}
        <button
          onClick={handleCart}
          className="relative flex flex-col items-center justify-center min-w-[56px] h-12 text-zinc-500 hover:text-zinc-950 active:scale-95 transition-all"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-[15px] h-[15px] px-1 rounded-full bg-zinc-950 text-white text-[9px] font-bold">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-0.5">Cart</span>
        </button>

        {/* WhatsApp */}
        <button
          onClick={handleWhatsApp}
          className="flex flex-col items-center justify-center min-w-[56px] h-12 text-emerald-600 active:scale-95 transition-all"
        >
          <MessageCircle className="w-4 h-4 fill-emerald-600/10" />
          <span className="text-[10px] font-bold mt-0.5">Help</span>
        </button>
      </div>
    </div>
  );
}
