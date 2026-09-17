"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  PhoneCall,
  Mail,
  MapPin,
  Lock,
} from "lucide-react";
import { Header } from "@/components/Header";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryFilterBar, CategoryOption } from "@/components/CategoryFilterBar";
import { ProductCard } from "@/components/ProductCard";
import { ProvenanceBento } from "@/components/ProvenanceBento";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { QuickViewModal } from "@/components/QuickViewModal";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { PRODUCTS } from "@/data/products";

const CATEGORY_OPTIONS: CategoryOption[] = [
  { id: "all", label: "All Products" },
  { id: "mother-baby", label: "Pediatric Care" },
  { id: "vitamins-supplements", label: "Longevity & Vitamins" },
  { id: "dermatological-skincare", label: "Clinical Dermatology" },
  { id: "senior-care-incontinence", label: "Senior Care" },
  { id: "medical-devices-diagnostic", label: "OTC & Diagnostics" },
];

export default function MitavinStorefrontPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCat =
        selectedCategory === "all" || product.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.importOrigin.toLowerCase().includes(q) ||
        product.summary.toLowerCase().includes(q) ||
        product.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const categoriesWithCounts = useMemo(() => {
    return CATEGORY_OPTIONS.map((cat) => {
      if (cat.id === "all") {
        return { ...cat, count: PRODUCTS.length };
      }
      const count = PRODUCTS.filter((p) => p.category === cat.id).length;
      return { ...cat, count };
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white relative pb-20 md:pb-0 font-sans">
      {/* 1. Vercel-Style Header */}
      <Header
        onCategorySelect={(slug) => setSelectedCategory(slug)}
        onSearchClick={() => {
          const searchInput = document.querySelector(
            "#catalog-section input"
          ) as HTMLInputElement;
          if (searchInput) searchInput.focus();
        }}
      />

      {/* 2. High-Tech E-Commerce Hero */}
      <HeroBanner />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-16 flex-1 w-full">
        {/* 3. Category Filter & Live Search */}
        <section className="space-y-6">
          <CategoryFilterBar
            categories={categoriesWithCounts}
            activeCategoryId={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalFilteredCount={filteredProducts.length}
          />

          {/* 4. High-Density Razor-Sharp 4-Column Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-zinc-50 rounded-xl border border-zinc-200 p-8">
              <Sparkles className="w-6 h-6 text-zinc-400 mx-auto" />
              <h3 className="font-sans text-base font-semibold text-zinc-900">
                No matching verified products found
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Try searching for &quot;Aptamil&quot;, &quot;Vitabiotics&quot;, &quot;Minoxidil&quot;, or reset filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="px-4 py-2 rounded-md bg-zinc-950 text-white text-xs font-medium hover:bg-zinc-800 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* 5. Interactive 3D Gyro Provenance Bento Grid with 1-Click Batch Verifier */}
        <ProvenanceBento />
      </main>

      {/* 6. Minimalist Vercel-Style Footer */}
      <footer className="bg-zinc-50 border-t border-zinc-200 pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs">
            {/* Brand & Statement */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-sans text-xl font-bold tracking-tight text-zinc-950">
                  MITAVIN
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
              <p className="text-zinc-500 leading-relaxed max-w-sm">
                The authentic longevity &amp; pediatric dispensary in Dhaka. 100% genuine UK &amp; USA health formulations, direct air-freighted with continuous thermal telemetry.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-600">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>256-Bit SSL Encrypted Healthcare Fulfillment</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-2.5">
              <div className="font-semibold text-zinc-900 uppercase tracking-wider text-[11px] font-mono">
                Categories
              </div>
              <ul className="space-y-2 text-zinc-600">
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory("mother-baby");
                      document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="hover:text-zinc-900 transition-colors"
                  >
                    Pediatric Nutrition &amp; Care
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory("vitamins-supplements");
                      document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="hover:text-zinc-900 transition-colors"
                  >
                    Longevity &amp; Multivitamins
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory("dermatological-skincare");
                      document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="hover:text-zinc-900 transition-colors"
                  >
                    Clinical Dermatology
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory("senior-care-incontinence");
                      document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="hover:text-zinc-900 transition-colors"
                  >
                    Senior Incontinence Care
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact & Pharmacist */}
            <div className="space-y-2.5">
              <div className="font-semibold text-zinc-900 uppercase tracking-wider text-[11px] font-mono">
                Dispensary Hub
              </div>
              <ul className="space-y-2 text-zinc-600">
                <li className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-zinc-500" />
                  <a href="tel:+8801978303867" className="hover:text-zinc-900 font-mono">
                    +880 1978 303867
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <a href="mailto:care@mitavin.com" className="hover:text-zinc-900">
                    care@mitavin.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0 mt-0.5" />
                  <span>Gulshan-1, Dhaka 1212, Bangladesh</span>
                </li>
              </ul>
            </div>

            {/* Payment Badges */}
            <div className="space-y-2.5">
              <div className="font-semibold text-zinc-900 uppercase tracking-wider text-[11px] font-mono">
                Payment Channels
              </div>
              <p className="text-zinc-500">
                Same-day insulated cold delivery inside Dhaka Metro. Cash on delivery or encrypted mobile payment.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded border border-zinc-200 bg-white font-mono font-medium text-[10px] text-pink-700">
                  bKash
                </span>
                <span className="px-2 py-0.5 rounded border border-zinc-200 bg-white font-mono font-medium text-[10px] text-orange-600">
                  Nagad
                </span>
                <span className="px-2 py-0.5 rounded border border-zinc-200 bg-white font-mono font-medium text-[10px] text-blue-700">
                  VISA
                </span>
                <span className="px-2 py-0.5 rounded border border-zinc-200 bg-white font-mono font-medium text-[10px] text-red-600">
                  Mastercard
                </span>
                <span className="px-2 py-0.5 rounded border border-zinc-200 bg-white font-mono font-medium text-[10px] text-zinc-800">
                  COD
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-400">
            <div>
              &copy; {new Date().getFullYear()} Mitavin Healthcare Laboratories Ltd. All rights reserved.
            </div>
            <div className="font-mono text-zinc-500">
              Vercel Design Language • Stark Luxury Standard
            </div>
          </div>
        </div>
      </footer>

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <QuickViewModal />

      {/* Mobile Bottom Dock */}
      <MobileBottomNav
        onCategoryClick={() => {
          document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
        }}
        onSearchClick={() => {
          document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
          const input = document.querySelector("#catalog-section input") as HTMLInputElement;
          if (input) input.focus();
        }}
      />
    </div>
  );
}
