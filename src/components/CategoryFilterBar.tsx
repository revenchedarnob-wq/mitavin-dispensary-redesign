"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Search, X, SlidersHorizontal, Sparkles } from "lucide-react";
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
      {/* Top Row: Search Input & Results Counter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-emerald" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary">
            Curated Authentic Formulations
          </h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-emerald-subtle border border-brand-emerald/20 text-brand-emerald font-semibold font-mono">
            {totalFilteredCount} SKUs
          </span>
        </div>

        {/* Real-time search filter input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none" />
          <input
            type="text"
            placeholder="Search SKU, active, brand..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 text-sm rounded-full bg-card border border-whisper focus:outline-none focus:border-brand-emerald focus:ring-2 focus:ring-brand-emerald/10 text-ink-primary placeholder:text-ink-faint shadow-whisper transition-all"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-ink-faint hover:text-ink-primary hover:bg-canvas transition-colors"
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
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 scroll-smooth"
        >
          {categories.map((cat) => {
            const isActive = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handlePillClick(cat.id)}
                className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 flex-shrink-0 active:scale-95 ${
                  isActive
                    ? "text-white"
                    : "text-ink-muted bg-card hover:text-ink-primary hover:bg-canvas border border-whisper"
                }`}
              >
                {/* Active Indicator with Framer Motion layoutId */}
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-ink-primary rounded-full shadow-sm"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {cat.label}
                  {cat.count !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-canvas text-ink-faint border border-whisper"
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
