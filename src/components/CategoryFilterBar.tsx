"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { playHapticClick } from "@/lib/sound";

export interface CategoryOption {
  id: string;
  label: string;
  count?: number;
}

interface CategoryFilterBarProps {
  categories: CategoryOption[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalFilteredCount: number;
}

export function CategoryFilterBar({
  categories,
  activeCategoryId,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  totalFilteredCount,
}: CategoryFilterBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handlePillClick = (id: string) => {
    playHapticClick(0.07);
    onSelectCategory(id);
  };

  const handleClearSearch = () => {
    playHapticClick(0.06);
    onSearchChange("");
  };

  return (
    <div className="space-y-4 py-2" id="catalog-section">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="w-4 h-4 text-zinc-700" />
          <h2 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
            Authentic Formulations
          </h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-mono font-medium border border-zinc-200">
            {totalFilteredCount} SKUs
          </span>
        </div>

        {/* Real-time search filter input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search SKU, active, brand..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-lg bg-white border border-zinc-200 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-900 text-zinc-900 placeholder:text-zinc-400 shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Category Pill Bar with Smooth Scroll */}
      <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 scroll-smooth"
        >
          {categories.map((cat) => {
            const isActive = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handlePillClick(cat.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 flex-shrink-0 active:scale-95 border ${
                  isActive
                    ? "border-zinc-950 text-white"
                    : "border-zinc-200 text-zinc-600 bg-white hover:border-zinc-300 hover:text-zinc-900"
                }`}
              >
                {/* Active Indicator with Framer Motion layoutId */}
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-zinc-950 rounded-full shadow-sm"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {cat.label}
                  {cat.count !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? "bg-zinc-800 text-zinc-200"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {cat.count}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
